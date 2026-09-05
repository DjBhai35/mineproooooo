import { Router, Request, Response } from 'express';
import { getUserIdFromRequest } from './authRoutes';
import { RewardCycleEngine } from '../services/rewardCycleEngine';
import { serverDb } from '../db';
import { createRateLimiter } from '../middleware/rateLimiter';

export const cycleRouter = Router();

// Rate limiter for claim endpoint (max 10 requests per 10s per IP)
const claimLimiter = createRateLimiter(10000, 10);

/**
 * GET /api/cycles/active
 * Authoritative Server Telemetry:
 * Returns the current cycle, server countdown, completion status, and claim eligibility.
 */
cycleRouter.get('/active', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const telemetry = await RewardCycleEngine.getActiveCycleTelemetry(userId);

    const wallet = await serverDb.wallet.findUnique({ where: { userId } });

    return res.json({
      success: true,
      data: telemetry,
      wallet: {
        balance: parseFloat(wallet?.balance || '0'),
        totalEarned: parseFloat(wallet?.totalEarned || '0'),
        totalInvested: parseFloat(wallet?.totalInvested || '0'),
      },
      serverTime: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/rewards/claim
 * Protected Server-Side Claim Action.
 * Executes atomic claim transaction with double-claim protection.
 */
cycleRouter.post('/claim', claimLimiter, async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { cycleId } = req.body;

    if (!cycleId) {
      return res.status(400).json({
        success: false,
        error: 'CYCLE_ID_REQUIRED',
        message: 'A valid cycle ID must be provided for claim execution.',
      });
    }

    const clientIp = (req.ip || req.headers['x-forwarded-for'] || '127.0.0.1') as string;

    const claimResult = await RewardCycleEngine.executeRewardClaim(cycleId, userId, clientIp);

    return res.json({
      success: true,
      data: claimResult,
    });
  } catch (err: any) {
    const msg = err.message || 'Error processing claim';

    // Map business errors to proper HTTP statuses
    if (msg.includes('ALREADY_CLAIMED') || msg.includes('CONCURRENT_CLAIM_REJECTED')) {
      return res.status(409).json({ success: false, error: 'ALREADY_CLAIMED', message: msg });
    }
    if (msg.includes('CYCLE_STILL_RUNNING')) {
      return res.status(400).json({ success: false, error: 'CYCLE_STILL_RUNNING', message: msg });
    }
    if (msg.includes('FORBIDDEN_OWNERSHIP')) {
      return res.status(403).json({ success: false, error: 'FORBIDDEN', message: msg });
    }
    if (msg.includes('CYCLE_NOT_FOUND')) {
      return res.status(404).json({ success: false, error: 'NOT_FOUND', message: msg });
    }

    return res.status(500).json({ success: false, error: 'CLAIM_FAILED', message: msg });
  }
});

/**
 * POST /api/cycles/fast-forward-test
 * Developer / Reviewer Testing Aid:
 * Advances the active cycle clock to completion on the server so the claim flow
 * can be verified without waiting 24 full hours.
 */
cycleRouter.post('/fast-forward-test', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const updated = serverDb.fastForwardActiveCycle(userId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'No running cycle found to fast-forward' });
    }

    const telemetry = await RewardCycleEngine.getActiveCycleTelemetry(userId);
    return res.json({
      success: true,
      message: 'Server cycle fast-forwarded to completion. Ready for claim verification.',
      data: telemetry,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/cycles/reset-demo
 * Resets the demo state for Ahmad Sikander so reviewers can test the cycle flow repeatedly.
 */
cycleRouter.post('/reset-demo', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const inv = await serverDb.investment.findFirst({ where: { userId } });
    if (inv) {
      const now = new Date();
      // Re-create an eligible cycle
      await serverDb.rewardCycle.create({
        data: {
          userId,
          investmentId: inv.id,
          cycleNumber: Math.floor(Date.now() / 1000) % 1000,
          rewardAmount: '15.00000000',
          cycleStartedAt: new Date(now.getTime() - 25 * 3600000).toISOString(),
          cycleEndsAt: new Date(now.getTime() - 1000).toISOString(), // Completed 1s ago
          status: 'RUNNING',
          claimReference: null,
          claimedAt: null,
          claimedIp: null,
        },
      });
    }

    const telemetry = await RewardCycleEngine.getActiveCycleTelemetry(userId);
    return res.json({
      success: true,
      message: 'Demo cycle reset to eligible state.',
      data: telemetry,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
