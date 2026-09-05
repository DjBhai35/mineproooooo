import { Router, Request, Response } from 'express';
import { serverDb } from '../db';
import { ReferralEngine } from '../services/referralEngine';

export const authRouter = Router();

// Demo session store for preview container
export const SESSIONS = new Map<string, string>(); // token -> userId

// Pre-seed Ahmad's active session
const DEFAULT_DEMO_TOKEN = 'session_token_ahmad_sikander';
SESSIONS.set(DEFAULT_DEMO_TOKEN, 'usr_ahmad');
SESSIONS.set('session_token_admin', 'usr_admin');

export function getUserIdFromRequest(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const userId = SESSIONS.get(token);
    if (userId) return userId;
  }
  const customHeader = req.headers['x-user-id'] as string;
  if (customHeader) {
    return customHeader;
  }
  // Default to demo user Ahmad Sikander
  return 'usr_ahmad';
}

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Identifier is required' });
    }

    // Lookup user by username or email
    let user = await serverDb.user.findUnique({ where: { email: identifier } });
    if (!user) {
      user = await serverDb.user.findUnique({ where: { username: identifier } });
    }

    if (!user) {
      return res.status(401).json({ success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' });
    }

    // Generate token
    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    SESSIONS.set(token, user.id);

    const wallet = await serverDb.wallet.findUnique({ where: { userId: user.id } });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        referralCode: user.referralCode,
        walletBalance: wallet?.balance || '0.00000000',
        totalEarned: wallet?.totalEarned || '0.00000000',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName, referralCode } = req.body;

    if (!username || !email) {
      return res.status(400).json({ success: false, error: 'Username and email are required.' });
    }

    // Check unique email / username
    const existingEmail = await serverDb.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, error: 'EMAIL_IN_USE', message: 'Email already registered.' });
    }
    const existingUser = await serverDb.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'USERNAME_TAKEN', message: 'Username is already taken.' });
    }

    // Generate unique referral code for new user
    const userRefCode = `MINE-${username.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newUser = await serverDb.user.create({
      data: {
        email,
        username,
        fullName: fullName || username,
        passwordHash: 'hashed_password',
        role: 'USER',
        status: 'ACTIVE',
        referralCode: userRefCode,
        referredById: null,
      },
    });

    // Initialize wallet
    await serverDb.wallet.create({
      data: {
        userId: newUser.id,
        balance: '0.00000000',
        totalDeposited: '0.00000000',
        totalWithdrawn: '0.00000000',
        totalInvested: '0.00000000',
        totalEarned: '0.00000000',
        totalReferral: '0.00000000',
        lockedBalance: '0.00000000',
      },
    });

    // Register referral relationship if code provided
    if (referralCode) {
      try {
        await ReferralEngine.registerReferralRelationship(newUser.id, referralCode);
      } catch (refErr: any) {
        // Log referral error without failing user registration
        console.warn('Referral association warning:', refErr.message);
      }
    }

    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    SESSIONS.set(token, newUser.id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        referralCode: newUser.referralCode,
        walletBalance: '0.00000000',
        totalEarned: '0.00000000',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const user = await serverDb.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const wallet = await serverDb.wallet.findUnique({ where: { userId } });
    const investments = await serverDb.investment.findMany({ where: { userId, status: 'ACTIVE' } });

    let totalInvestedDec = 0;
    investments.forEach((inv) => {
      totalInvestedDec += parseFloat(inv.amount);
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        referralCode: user.referralCode,
        walletBalance: parseFloat(wallet?.balance || '0'),
        totalInvested: parseFloat(wallet?.totalInvested || String(totalInvestedDec)),
        totalEarned: parseFloat(wallet?.totalEarned || '0'),
        totalReferral: parseFloat(wallet?.totalReferral || '0'),
        createdAt: user.createdAt,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
