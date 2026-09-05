import { Router, Request, Response } from 'express';
import { getUserIdFromRequest } from './authRoutes';
import { serverDb } from '../db';
import { RewardCycleEngine } from '../services/rewardCycleEngine';
import { ReferralEngine } from '../services/referralEngine';
import Decimal from 'decimal.js';

export const investmentRouter = Router();

investmentRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const investments = await serverDb.investment.findMany({ where: { userId } });

    return res.json({
      success: true,
      data: investments,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/investments/create
 * Activates an investment tier for the user:
 * 1. Validates plan
 * 2. Creates active investment
 * 3. Initializes Cycle #1
 * 4. Triggers multi-level referral rewards for uplines
 */
investmentRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const { planId, amount } = req.body;

    if (!planId || !amount) {
      return res.status(400).json({ success: false, error: 'Plan ID and amount are required.' });
    }

    const plan = await serverDb.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found.' });
    }

    const amountNum = parseFloat(amount);
    const minDep = parseFloat(plan.minDeposit);
    const maxDep = parseFloat(plan.maxDeposit);

    if (amountNum < minDep || amountNum > maxDep) {
      return res.status(400).json({
        success: false,
        error: `Amount must be between $${minDep.toFixed(2)} and $${maxDep.toFixed(2)} for ${plan.name} tier.`,
      });
    }

    const amountDec = new Decimal(amount).toFixed(8);
    const calculatedDailyReward = RewardCycleEngine.calculateReward(amountDec, plan.dailyRatePct).toFixed(8);

    const now = new Date();
    const nextClaimAt = new Date(now.getTime() + plan.cycleDurationHours * 3600 * 1000);

    // Create investment
    const newInv = await serverDb.investment.create({
      data: {
        userId,
        planId: plan.id,
        amount: amountDec,
        dailyReward: calculatedDailyReward,
        totalEarned: '0.00000000',
        claimsCount: 0,
        status: 'ACTIVE',
        activatedAt: now.toISOString(),
        lastClaimAt: null,
        nextClaimAt: nextClaimAt.toISOString(),
      },
    });

    // Update wallet totalInvested
    const wallet = await serverDb.wallet.findUnique({ where: { userId } });
    if (wallet) {
      const currentInv = new Decimal(wallet.totalInvested);
      await serverDb.wallet.update({
        where: { userId },
        data: {
          totalInvested: currentInv.plus(new Decimal(amountDec)).toFixed(8),
        },
      });
    }

    // 1. Initialize Authoritative Cycle #1
    const cycle1 = await RewardCycleEngine.createInitialCycle(newInv.id, userId);

    // 2. Trigger Multi-Level Referral Rewards for uplines
    const refResult = await ReferralEngine.processQualifyingRewards(userId, amountDec, newInv.id);

    return res.status(201).json({
      success: true,
      message: `Successfully activated ${plan.name} Node! Mining cycle #1 initiated.`,
      data: {
        investment: newInv,
        cycle: cycle1,
        referralRewardsTriggered: refResult.rewardsCreated.length,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
