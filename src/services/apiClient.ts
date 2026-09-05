/**
 * Client-Side API Service for MinePro Server Endpoints
 */

export interface ActiveCycleResponse {
  success: boolean;
  data: {
    id: string;
    investmentId: string;
    cycleNumber: number;
    rewardAmount: string;
    cycleStartedAt: string;
    cycleEndsAt: string;
    status: 'RUNNING' | 'ELIGIBLE_FOR_CLAIM' | 'CLAIMED' | 'MISSED' | 'EXPIRED';
    remainingSeconds: number;
    percentComplete: number;
    isEligibleForClaim: boolean;
    claimReference?: string | null;
    serverTime: string;
    planName: string;
    planBadge: string;
    investedAmount: string;
    dailyRatePct: string;
  } | null;
  wallet: {
    balance: number;
    totalEarned: number;
    totalInvested: number;
  };
  serverTime: string;
}

export interface ClaimRewardResponse {
  success: boolean;
  data: {
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
      status: string;
    } | null;
  };
  error?: string;
}

export interface ReferralSummaryResponse {
  success: boolean;
  data: {
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
  };
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

export const apiClient = {
  /**
   * Fetch active cycle telemetry
   */
  async getActiveCycle(): Promise<ActiveCycleResponse> {
    const res = await fetch('/api/cycles/active', {
      headers: {
        'x-user-id': 'usr_ahmad',
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch active cycle');
    }
    return res.json();
  },

  /**
   * Execute atomic reward claim
   */
  async claimReward(cycleId: string): Promise<ClaimRewardResponse> {
    const res = await fetch('/api/rewards/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'usr_ahmad',
      },
      body: JSON.stringify({ cycleId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to claim reward');
    }
    return data;
  },

  /**
   * Developer fast-forward test helper
   */
  async fastForwardCycle(): Promise<ActiveCycleResponse> {
    const res = await fetch('/api/cycles/fast-forward-test', {
      method: 'POST',
      headers: {
        'x-user-id': 'usr_ahmad',
      },
    });
    return res.json();
  },

  /**
   * Developer reset demo cycle helper
   */
  async resetDemoCycle(): Promise<ActiveCycleResponse> {
    const res = await fetch('/api/cycles/reset-demo', {
      method: 'POST',
      headers: {
        'x-user-id': 'usr_ahmad',
      },
    });
    return res.json();
  },

  /**
   * Fetch referral summary & history
   */
  async getReferralSummary(): Promise<ReferralSummaryResponse> {
    const res = await fetch('/api/referrals/summary', {
      headers: {
        'x-user-id': 'usr_ahmad',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch referral summary');
    }
    return res.json();
  },

  /**
   * Fetch referral hierarchy tree
   */
  async getReferralTree(): Promise<{ success: boolean; data: ReferralTreeNode }> {
    const res = await fetch('/api/referrals/tree', {
      headers: {
        'x-user-id': 'usr_ahmad',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch referral tree');
    }
    return res.json();
  },
};
