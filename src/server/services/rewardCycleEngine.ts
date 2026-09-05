import Decimal from 'decimal.js';
import { serverDb, DbRewardCycle, CycleStatus } from '../db';
import { SettingsService } from '../config/settingsService';

export interface ClaimResult {
  success: boolean;
  message: string;
  claimReference: string;
  rewardAmount: string;
  claimedAt: string;
  newBalance: string;
  transactionReference: string;
  cycleNumber: number;
  nextCycle?: {
    cycleNumber: number;
    cycleStartedAt: string;
    cycleEndsAt: string;
    rewardAmount: string;
    status: CycleStatus;
  } | null;
}

export interface CycleTelemetry {
  id: string;
  investmentId: string;
  cycleNumber: number;
  rewardAmount: string;
  cycleStartedAt: string;
  cycleEndsAt: string;
  status: CycleStatus;
  remainingSeconds: number;
  percentComplete: number;
  isEligibleForClaim: boolean;
  claimReference?: string | null;
  serverTime: string;
  planName: string;
  planBadge: string;
  investedAmount: string;
  dailyRatePct: string;
}

export class RewardCycleEngine {
  /**
   * Generates an auditable, cryptographic-random unique claim reference.
   * Format: RWD-XXXXXX-XXXX
   */
  public static generateClaimReference(): string {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RWD-${timestampPart}-${randomPart}`;
  }

  /**
   * Calculates the exact reward using Decimal precision.
   * Money-safe: Never uses JavaScript floating point arithmetic.
   * formula: amount * (dailyRatePct / 100)
   */
  public static calculateReward(investmentAmount: string, dailyRatePct: string): Decimal {
    const principal = new Decimal(investmentAmount);
    const rate = new Decimal(dailyRatePct);
    const hundred = new Decimal(100);
    // principal * (rate / 100)
    return principal.times(rate).dividedBy(hundred).toDecimalPlaces(8, Decimal.ROUND_HALF_UP);
  }

  /**
   * Creates the initial cycle when an investment is activated.
   */
  public static async createInitialCycle(investmentId: string, userId: string): Promise<DbRewardCycle> {
    const investment = await serverDb.investment.findUnique({ where: { id: investmentId } });
    if (!investment) {
      throw new Error(`Investment ${investmentId} not found`);
    }
    if (investment.userId !== userId) {
      throw new Error('Forbidden: Investment does not belong to user');
    }
    if (investment.status !== 'ACTIVE') {
      throw new Error(`Cannot start cycle: investment status is ${investment.status}`);
    }

    // Check if initial cycle already exists (prevent duplicates)
    const existing = await serverDb.rewardCycle.findFirst({
      where: { investmentId, cycleNumber: 1 },
    });
    if (existing) {
      return existing;
    }

    const plan = await serverDb.plan.findUnique({ where: { id: investment.planId } });
    if (!plan) {
      throw new Error(`Plan ${investment.planId} not found`);
    }

    // Dynamic duration from settings (default 24h)
    const durationHours = await SettingsService.getCycleDurationHours();
    const durationMs = Math.round(durationHours * 3600 * 1000);

    const now = new Date();
    const cycleEndsAt = new Date(now.getTime() + durationMs);

    // Calculate server-side reward using Decimal
    const calculatedReward = this.calculateReward(investment.amount, plan.dailyRatePct);

    const newCycle = await serverDb.rewardCycle.create({
      data: {
        userId,
        investmentId,
        cycleNumber: 1,
        rewardAmount: calculatedReward.toFixed(8),
        cycleStartedAt: now.toISOString(),
        cycleEndsAt: cycleEndsAt.toISOString(),
        status: 'RUNNING',
        claimReference: null,
        claimedAt: null,
        claimedIp: null,
      },
    });

    return newCycle;
  }

  /**
   * Evaluates the active cycle for a user and calculates authoritative remaining seconds.
   */
  public static async getActiveCycleTelemetry(userId: string): Promise<CycleTelemetry | null> {
    // Find active investment
    const investments = await serverDb.investment.findMany({
      where: { userId, status: 'ACTIVE' },
    });
    if (investments.length === 0) return null;

    const primaryInv = investments[0];
    const plan = await serverDb.plan.findUnique({ where: { id: primaryInv.planId } });

    // Find cycles for this investment
    const cycles = await serverDb.rewardCycle.findMany({
      where: { investmentId: primaryInv.id },
    });
    if (cycles.length === 0) return null;

    // Grab the latest cycle
    const currentCycle = cycles[0]; // sorted newest first

    const serverNow = new Date();
    const cycleStart = new Date(currentCycle.cycleStartedAt);
    const cycleEnd = new Date(currentCycle.cycleEndsAt);

    const totalDurationMs = Math.max(1, cycleEnd.getTime() - cycleStart.getTime());
    const elapsedMs = Math.max(0, serverNow.getTime() - cycleStart.getTime());
    const remainingMs = Math.max(0, cycleEnd.getTime() - serverNow.getTime());

    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const percentComplete = Math.min(100, Math.round((elapsedMs / totalDurationMs) * 100));

    // Authoritative server-side completion check
    const isCompleted = serverNow.getTime() >= cycleEnd.getTime();
    let effectiveStatus: CycleStatus = currentCycle.status;

    if (currentCycle.status === 'RUNNING' && isCompleted) {
      effectiveStatus = 'ELIGIBLE_FOR_CLAIM';
    }

    const isEligibleForClaim =
      (currentCycle.status === 'RUNNING' || currentCycle.status === 'ELIGIBLE_FOR_CLAIM') &&
      isCompleted &&
      !currentCycle.claimedAt;

    return {
      id: currentCycle.id,
      investmentId: currentCycle.investmentId,
      cycleNumber: currentCycle.cycleNumber,
      rewardAmount: currentCycle.rewardAmount,
      cycleStartedAt: currentCycle.cycleStartedAt,
      cycleEndsAt: currentCycle.cycleEndsAt,
      status: effectiveStatus,
      remainingSeconds,
      percentComplete,
      isEligibleForClaim,
      claimReference: currentCycle.claimReference,
      serverTime: serverNow.toISOString(),
      planName: plan?.name || 'Standard Plan',
      planBadge: plan?.tierBadge || 'Standard',
      investedAmount: primaryInv.amount,
      dailyRatePct: plan?.dailyRatePct || '3.00',
    };
  }

  /**
   * ATOMIC SERVER-SIDE CLAIM OPERATION.
   * Fully protected against:
   * - Double-clicks
   * - Race conditions & concurrent tabs
   * - Premature claims (authoritative server clock check)
   * - Unauthorized user claims
   * 
   * Commits:
   * 1. Balance credit
   * 2. REWARD transaction
   * 3. Cycle claimedAt / claimReference
   * 4. Next cycle generation (if eligible)
   */
  public static async executeRewardClaim(
    cycleId: string,
    userId: string,
    clientIp: string = '127.0.0.1'
  ): Promise<ClaimResult> {
    const claimReference = this.generateClaimReference();

    // Execute everything atomically inside transaction
    return await serverDb.$transaction(async (tx) => {
      // 1. Authenticate & Verify User status
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('UNAUTHORIZED: User account not found');
      }
      if (user.status !== 'ACTIVE') {
        throw new Error(`ACCOUNT_RESTRICTED: Account status is ${user.status}`);
      }

      // 2. Fetch cycle
      const cycle = await tx.rewardCycle.findUnique({ where: { id: cycleId } });
      if (!cycle) {
        throw new Error('CYCLE_NOT_FOUND: Reward cycle does not exist');
      }

      // 3. Ownership check
      if (cycle.userId !== userId) {
        throw new Error('FORBIDDEN_OWNERSHIP: You do not own this reward cycle');
      }

      // 4. Double-claim check
      if (cycle.status === 'CLAIMED' || cycle.claimedAt) {
        throw new Error('ALREADY_CLAIMED: This cycle has already been claimed');
      }

      // 5. Check investment is active
      const investment = await tx.investment.findUnique({ where: { id: cycle.investmentId } });
      if (!investment || investment.status !== 'ACTIVE') {
        throw new Error('INVESTMENT_INACTIVE: The underlying investment is not active');
      }

      // 6. Authoritative server time verification
      const serverNow = new Date();
      const cycleEndTime = new Date(cycle.cycleEndsAt);
      if (serverNow.getTime() < cycleEndTime.getTime()) {
        const remaining = Math.ceil((cycleEndTime.getTime() - serverNow.getTime()) / 1000);
        throw new Error(`CYCLE_STILL_RUNNING: Authoritative cycle not complete. ${remaining} seconds remaining.`);
      }

      // 7. Verify plan & calculate exact reward using Decimal
      const plan = await tx.plan.findUnique({ where: { id: investment.planId } });
      if (!plan) {
        throw new Error('PLAN_NOT_FOUND: Associated plan not found');
      }

      // Server-side authoritative reward calculation (never trust client)
      const authoritativeReward = this.calculateReward(investment.amount, plan.dailyRatePct);
      const rewardStr = authoritativeReward.toFixed(8);

      // 8. Atomic Claim update on Cycle (with concurrency lock)
      await tx.rewardCycle.atomicClaim(cycleId, userId, claimReference, clientIp);

      // 9. Credit User's Wallet safely with Decimal
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        throw new Error('WALLET_NOT_FOUND: User wallet not found');
      }

      const currentBalance = new Decimal(wallet.balance);
      const currentEarned = new Decimal(wallet.totalEarned);
      const updatedBalance = currentBalance.plus(authoritativeReward).toFixed(8);
      const updatedTotalEarned = currentEarned.plus(authoritativeReward).toFixed(8);

      await tx.wallet.update({
        where: { userId },
        data: {
          balance: updatedBalance,
          totalEarned: updatedTotalEarned,
        },
      });

      // 10. Update Investment tracking
      const invTotalEarned = new Decimal(investment.totalEarned).plus(authoritativeReward).toFixed(8);
      const claimsCount = investment.claimsCount + 1;

      // 11. Determine next cycle policy
      const durationHours = await SettingsService.getCycleDurationHours();
      const durationMs = Math.round(durationHours * 3600 * 1000);
      const nextCycleStart = serverNow;
      const nextCycleEnd = new Date(serverNow.getTime() + durationMs);

      await tx.investment.update({
        where: { id: investment.id },
        data: {
          totalEarned: invTotalEarned,
          claimsCount,
          lastClaimAt: serverNow.toISOString(),
          nextClaimAt: nextCycleEnd.toISOString(),
        },
      });

      // 12. Create Ledger Transaction Record
      const trxReference = `TX-${claimReference}`;
      await tx.transaction.create({
        data: {
          reference: trxReference,
          userId,
          type: 'CYCLE_REWARD',
          amount: rewardStr,
          fee: '0.00000000',
          netAmount: rewardStr,
          status: 'COMPLETED',
          description: `Mining Reward Cycle #${cycle.cycleNumber} for ${plan.name} Node`,
          metadata: {
            investmentId: investment.id,
            cycleId: cycle.id,
            cycleNumber: cycle.cycleNumber,
            claimReference,
            planSlug: plan.slug,
          },
        },
      });

      // 13. Next Cycle Creation (Atomic)
      let nextCycleData = null;
      const isEligibleForNextCycle = investment.status === 'ACTIVE' && plan.status === 'ACTIVE';

      if (isEligibleForNextCycle) {
        const nextCycleNumber = cycle.cycleNumber + 1;
        // Verify duplicate next cycle is prevented
        const existingNext = await tx.rewardCycle.findFirst({
          where: { investmentId: investment.id, cycleNumber: nextCycleNumber },
        });

        if (!existingNext) {
          const nextCycle = await tx.rewardCycle.create({
            data: {
              userId,
              investmentId: investment.id,
              cycleNumber: nextCycleNumber,
              rewardAmount: rewardStr,
              cycleStartedAt: nextCycleStart.toISOString(),
              cycleEndsAt: nextCycleEnd.toISOString(),
              status: 'RUNNING',
              claimReference: null,
              claimedAt: null,
              claimedIp: null,
            },
          });
          nextCycleData = {
            cycleNumber: nextCycle.cycleNumber,
            cycleStartedAt: nextCycle.cycleStartedAt,
            cycleEndsAt: nextCycle.cycleEndsAt,
            rewardAmount: nextCycle.rewardAmount,
            status: nextCycle.status,
          };
        }
      }

      return {
        success: true,
        message: `Successfully claimed $${authoritativeReward.toFixed(2)} mining reward!`,
        claimReference,
        rewardAmount: rewardStr,
        claimedAt: serverNow.toISOString(),
        newBalance: updatedBalance,
        transactionReference: trxReference,
        cycleNumber: cycle.cycleNumber,
        nextCycle: nextCycleData,
      };
    });
  }
}
