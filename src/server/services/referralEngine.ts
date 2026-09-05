import Decimal from 'decimal.js';
import { serverDb, DbReferralRelationship, DbReferralReward } from '../db';
import { SettingsService } from '../config/settingsService';

export interface ReferralRewardProcessingResult {
  qualifyingUserId: string;
  qualifyingEventId: string;
  qualifyingAmount: string;
  rewardsCreated: Array<{
    beneficiaryId: string;
    beneficiaryUsername: string;
    level: number;
    percentage: string;
    rewardAmount: string;
    reference: string;
    transactionReference: string;
  }>;
}

export interface ReferralDashboardSummary {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  activeReferrals: number;
  levelCounts: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  levelPercentages: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  totalReferralEarnings: string;
  activeLevels: number;
  history: Array<{
    id: string;
    createdAt: string;
    level: number;
    sourceUsername: string;
    baseAmount: string;
    percentage: string;
    rewardAmount: string;
    status: string;
    reference: string;
  }>;
}

export interface ReferralTreeNode {
  id: string;
  username: string;
  level: number;
  joinedAt: string;
  status: string;
  hasActivePlan: boolean;
  totalInvested: string;
  children: ReferralTreeNode[];
}

export class ReferralEngine {
  /**
   * Generates a unique referral reference for auditing.
   * Format: REF-XXXXXX-XXXX
   */
  public static generateReferralReference(): string {
    const timestampPart = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `REF-${timestampPart}-${randomPart}`;
  }

  /**
   * Validates and establishes a referral relationship when a new user signs up with a referral code.
   * Enforces:
   * - No self-referral
   * - Valid referrer exists
   * - No circular relationships
   * - Multi-level upline linkage (Level 1 up to Level 5)
   */
  public static async registerReferralRelationship(
    downlineUserId: string,
    referralCode?: string | null
  ): Promise<boolean> {
    if (!referralCode || !referralCode.trim()) {
      return false;
    }

    const code = referralCode.trim().toUpperCase();

    // 1. Find referrer by code
    const referrer = await serverDb.user.findUnique({ where: { referralCode: code } });
    if (!referrer) {
      throw new Error(`INVALID_REFERRAL_CODE: Referral code '${referralCode}' was not found.`);
    }

    // 2. Prevent self-referral
    if (referrer.id === downlineUserId) {
      throw new Error('SELF_REFERRAL_FORBIDDEN: You cannot refer yourself.');
    }

    // 3. Update downline user's referredById
    await serverDb.user.update({
      where: { id: downlineUserId },
      data: { referredById: referrer.id },
    });

    // 4. Create Level 1 edge
    await serverDb.referralRelationship.create({
      data: {
        uplineUserId: referrer.id,
        downlineUserId,
        level: 1,
      },
    });

    // 5. Traverse upline of the referrer up to Level 5 to create multi-level edges
    let currentUplineId = referrer.referredById;
    let currentLevel = 2;
    const visitedUsers = new Set<string>([downlineUserId, referrer.id]);

    while (currentUplineId && currentLevel <= 5) {
      // Prevent circular loops
      if (visitedUsers.has(currentUplineId)) {
        break;
      }
      visitedUsers.add(currentUplineId);

      const uplineUser = await serverDb.user.findUnique({ where: { id: currentUplineId } });
      if (!uplineUser) break;

      await serverDb.referralRelationship.create({
        data: {
          uplineUserId: uplineUser.id,
          downlineUserId,
          level: currentLevel,
        },
      });

      currentUplineId = uplineUser.referredById;
      currentLevel++;
    }

    return true;
  }

  /**
   * Processes multi-level referral rewards for a qualifying activity (e.g. ELIGIBLE_INVESTMENT).
   * Executes atomically in a database transaction with duplicate reward prevention.
   */
  public static async processQualifyingRewards(
    qualifyingUserId: string,
    qualifyingAmount: string,
    qualifyingEventId: string
  ): Promise<ReferralRewardProcessingResult> {
    const activeLevels = await SettingsService.getActiveReferralLevels();
    const tierSettings = await SettingsService.getReferralPercentages();
    const tierMap = new Map<number, number>();
    tierSettings.forEach((t) => {
      if (t.active) tierMap.set(t.level, t.percentage);
    });

    const qualifyingUser = await serverDb.user.findUnique({ where: { id: qualifyingUserId } });
    if (!qualifyingUser) {
      throw new Error(`Qualifying user ${qualifyingUserId} not found`);
    }

    // Fetch all uplines for the qualifying user
    const uplineEdges = await serverDb.referralRelationship.findMany({
      where: { downlineUserId: qualifyingUserId },
    });

    const results: ReferralRewardProcessingResult['rewardsCreated'] = [];

    // Process atomically inside transaction
    await serverDb.$transaction(async (tx) => {
      for (const edge of uplineEdges) {
        // Only process levels up to configured active level
        if (edge.level > activeLevels) continue;

        const percentageNum = tierMap.get(edge.level);
        if (!percentageNum || percentageNum <= 0) continue;

        const beneficiaryId = edge.uplineUserId;

        // Verify duplicate prevention (beneficiaryId, qualifyingEventId, level)
        const existingReward = await tx.referralReward.findUnique({
          where: {
            beneficiaryId_qualifyingEventId_level: {
              beneficiaryId,
              qualifyingEventId,
              level: edge.level,
            },
          },
        });

        if (existingReward) {
          // Already awarded - do not duplicate
          continue;
        }

        // Calculate reward with Decimal
        const baseDecimal = new Decimal(qualifyingAmount);
        const pctDecimal = new Decimal(percentageNum);
        const rewardDecimal = baseDecimal
          .times(pctDecimal)
          .dividedBy(new Decimal(100))
          .toDecimalPlaces(8, Decimal.ROUND_HALF_UP);

        if (rewardDecimal.isZero() || rewardDecimal.isNegative()) continue;

        const rewardAmountStr = rewardDecimal.toFixed(8);
        const refReference = this.generateReferralReference();
        const trxReference = `TX-${refReference}`;

        // 1. Create ReferralReward record
        const refReward = await tx.referralReward.create({
          data: {
            beneficiaryId,
            triggerUserId: qualifyingUserId,
            level: edge.level,
            rewardRatePct: pctDecimal.toFixed(2),
            qualifyingAmount,
            rewardAmount: rewardAmountStr,
            status: 'COMPLETED',
            reference: refReference,
            transactionId: trxReference,
            qualifyingEventId,
          },
        });

        // 2. Credit Beneficiary Wallet safely
        const beneficiaryWallet = await tx.wallet.findUnique({ where: { userId: beneficiaryId } });
        if (beneficiaryWallet) {
          const currentBal = new Decimal(beneficiaryWallet.balance);
          const currentRef = new Decimal(beneficiaryWallet.totalReferral);
          const currentEarn = new Decimal(beneficiaryWallet.totalEarned);

          await tx.wallet.update({
            where: { userId: beneficiaryId },
            data: {
              balance: currentBal.plus(rewardDecimal).toFixed(8),
              totalReferral: currentRef.plus(rewardDecimal).toFixed(8),
              totalEarned: currentEarn.plus(rewardDecimal).toFixed(8),
            },
          });
        }

        // 3. Create REFERRAL_REWARD transaction
        await tx.transaction.create({
          data: {
            reference: trxReference,
            userId: beneficiaryId,
            type: 'REFERRAL_REWARD',
            amount: rewardAmountStr,
            fee: '0.00000000',
            netAmount: rewardAmountStr,
            status: 'COMPLETED',
            description: `Level ${edge.level} Referral Bonus from ${qualifyingUser.username} (${pctDecimal.toFixed(2)}%)`,
            metadata: {
              referralRewardId: refReward.id,
              level: edge.level,
              triggerUserId: qualifyingUserId,
              qualifyingEventId,
              qualifyingAmount,
            },
          },
        });

        const beneficiaryUser = await tx.user.findUnique({ where: { id: beneficiaryId } });

        results.push({
          beneficiaryId,
          beneficiaryUsername: beneficiaryUser?.username || 'user',
          level: edge.level,
          percentage: pctDecimal.toFixed(2),
          rewardAmount: rewardAmountStr,
          reference: refReference,
          transactionReference: trxReference,
        });
      }
    });

    return {
      qualifyingUserId,
      qualifyingEventId,
      qualifyingAmount,
      rewardsCreated: results,
    };
  }

  /**
   * Retrieves comprehensive referral summary data for the User Dashboard.
   */
  public static async getDashboardSummary(
    userId: string,
    appBaseUrl: string = 'https://minepro.network'
  ): Promise<ReferralDashboardSummary> {
    const user = await serverDb.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const activeLevels = await SettingsService.getActiveReferralLevels();
    const tierSettings = await SettingsService.getReferralPercentages();

    // Collect percentages
    const pctMap: Record<string, number> = {
      level1: 7.0,
      level2: 3.0,
      level3: 1.5,
      level4: 0.5,
      level5: 0.25,
    };
    tierSettings.forEach((t) => {
      pctMap[`level${t.level}`] = t.percentage;
    });

    // Count referrals by level
    const relationships = await serverDb.referralRelationship.findMany({
      where: { uplineUserId: userId },
    });

    const levelCounts = {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
    };

    const downlineUserIds: string[] = [];
    relationships.forEach((rel) => {
      if (rel.level >= 1 && rel.level <= 5) {
        const key = `level${rel.level}` as keyof typeof levelCounts;
        levelCounts[key]++;
        downlineUserIds.push(rel.downlineUserId);
      }
    });

    // Check how many have active investments
    let activeReferralsCount = 0;
    for (const dId of downlineUserIds) {
      const activeInvs = await serverDb.investment.findMany({
        where: { userId: dId, status: 'ACTIVE' },
      });
      if (activeInvs.length > 0) activeReferralsCount++;
    }

    // Referral rewards received by this user
    const rewards = await serverDb.referralReward.findMany({
      where: { beneficiaryId: userId },
    });

    let totalEarningsDecimal = new Decimal(0);
    const historyList = [];

    for (const r of rewards) {
      totalEarningsDecimal = totalEarningsDecimal.plus(new Decimal(r.rewardAmount));

      const triggerUser = await serverDb.user.findUnique({ where: { id: r.triggerUserId } });
      const sanitizedUsername = triggerUser?.username || 'member_node';

      historyList.push({
        id: r.id,
        createdAt: r.createdAt,
        level: r.level,
        sourceUsername: sanitizedUsername,
        baseAmount: r.qualifyingAmount,
        percentage: r.rewardRatePct,
        rewardAmount: r.rewardAmount,
        status: r.status,
        reference: r.reference,
      });
    }

    return {
      referralCode: user.referralCode,
      referralLink: `${appBaseUrl}/register?ref=${user.referralCode}`,
      totalReferrals: relationships.length,
      activeReferrals: activeReferralsCount,
      levelCounts,
      levelPercentages: {
        level1: pctMap.level1,
        level2: pctMap.level2,
        level3: pctMap.level3,
        level4: pctMap.level4,
        level5: pctMap.level5,
      },
      totalReferralEarnings: totalEarningsDecimal.toFixed(2),
      activeLevels,
      history: historyList,
    };
  }

  /**
   * Builds the hierarchical referral network tree for visualization.
   * Strictly limits traversal depth and protects sensitive fields.
   */
  public static async getReferralTree(userId: string): Promise<ReferralTreeNode> {
    const user = await serverDb.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const maxLevels = await SettingsService.getActiveReferralLevels();

    async function buildNode(currentUserId: string, currentLevel: number): Promise<ReferralTreeNode> {
      const u = await serverDb.user.findUnique({ where: { id: currentUserId } });
      const investments = await serverDb.investment.findMany({
        where: { userId: currentUserId, status: 'ACTIVE' },
      });

      let totalInv = new Decimal(0);
      investments.forEach((inv) => {
        totalInv = totalInv.plus(new Decimal(inv.amount));
      });

      const node: ReferralTreeNode = {
        id: currentUserId,
        username: u ? u.username : 'User',
        level: currentLevel,
        joinedAt: u ? u.createdAt : new Date().toISOString(),
        status: u?.status || 'ACTIVE',
        hasActivePlan: investments.length > 0,
        totalInvested: totalInv.toFixed(2),
        children: [],
      };

      if (currentLevel < maxLevels) {
        // Direct downlines of this user (Level 1 relative to current user)
        const edges = await serverDb.referralRelationship.findMany({
          where: { uplineUserId: currentUserId, level: 1 },
        });

        for (const edge of edges) {
          const childNode = await buildNode(edge.downlineUserId, currentLevel + 1);
          node.children.push(childNode);
        }
      }

      return node;
    }

    return await buildNode(userId, 0);
  }
}
