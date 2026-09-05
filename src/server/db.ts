import Decimal from 'decimal.js';

// Configure Decimal precision for currency calculations (18 digits, ROUND_HALF_UP)
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export interface DbUser {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  fullName: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'BANNED';
  referralCode: string;
  referredById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbWallet {
  id: string;
  userId: string;
  balance: string; // Stored as high-precision string
  totalDeposited: string;
  totalWithdrawn: string;
  totalInvested: string;
  totalEarned: string;
  totalReferral: string;
  lockedBalance: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbPlan {
  id: string;
  slug: string;
  name: string;
  tierBadge: string;
  colorVariant: 'green' | 'orange';
  minDeposit: string;
  maxDeposit: string;
  dailyRatePct: string; // e.g. "3.00"
  cycleDurationHours: number;
  isLifetime: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  features: string[];
}

export interface DbInvestment {
  id: string;
  userId: string;
  planId: string;
  amount: string; // e.g. "500.00"
  dailyReward: string; // e.g. "15.00"
  totalEarned: string;
  claimsCount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  activatedAt: string;
  lastClaimAt?: string | null;
  nextClaimAt: string;
  createdAt: string;
  updatedAt: string;
}

export type CycleStatus = 'RUNNING' | 'ELIGIBLE_FOR_CLAIM' | 'CLAIMED' | 'MISSED' | 'EXPIRED';

export interface DbRewardCycle {
  id: string;
  userId: string;
  investmentId: string;
  cycleNumber: number;
  rewardAmount: string; // Decimal string
  cycleStartedAt: string;
  cycleEndsAt: string; // Authoritative server timestamp
  status: CycleStatus;
  claimReference?: string | null;
  claimedAt?: string | null;
  claimedIp?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbTransaction {
  id: string;
  reference: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PLAN_INVESTMENT' | 'INVESTMENT' | 'CYCLE_REWARD' | 'REWARD' | 'REFERRAL_REWARD' | 'ADMIN_ADJUSTMENT' | 'REFUND';
  amount: string;
  fee: string;
  netAmount: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED' | 'CANCELLED';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface DbPaymentMethod {
  id: string;
  network: 'TRC20' | 'BEP20';
  asset: string;
  address: string;
  qrCodeUrl?: string;
  isEnabled: boolean;
  displayOrder: number;
  minDeposit: string;
  maxDeposit?: string | null;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DbDeposit {
  id: string;
  userId: string;
  paymentMethodId: string;
  network: 'TRC20' | 'BEP20';
  amount: string; // Decimal string
  txHash: string; // Unique transaction hash
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbWithdrawal {
  id: string;
  userId: string;
  network: 'TRC20' | 'BEP20';
  address: string;
  amount: string; // Gross requested Decimal string
  fee: string; // Server calculated fee
  netAmount: string; // Net received amount
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
  txHash?: string | null;
  processedAt?: string | null;
  processedBy?: string | null;
  rejectionReason?: string | null;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DbWebhookEvent {
  id: string;
  eventId: string; // Unique external event ID
  provider: string;
  eventType: string;
  payload: Record<string, any>;
  status: 'PROCESSED' | 'FAILED' | 'IGNORED';
  processedAt: string;
  createdAt: string;
}

export interface DbAuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  previousState?: Record<string, any> | null;
  newState?: Record<string, any> | null;
  reference?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface DbReferralRelationship {
  id: string;
  uplineUserId: string;
  downlineUserId: string;
  level: number; // 1 to 5
  createdAt: string;
}

export interface DbReferralReward {
  id: string;
  beneficiaryId: string;
  triggerUserId: string;
  level: number;
  rewardRatePct: string;
  qualifyingAmount: string;
  rewardAmount: string;
  status: 'COMPLETED' | 'PENDING';
  reference: string;
  transactionId?: string | null;
  qualifyingEventId: string;
  createdAt: string;
}

export interface DbSystemSetting {
  id: string;
  key: string;
  value: string; // string or JSON string
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  label: string;
  description?: string;
  isPublic: boolean;
  updatedAt: string;
}

/**
 * Thread-safe, transaction-capable server database store matching the Prisma Schema.
 */
class ServerDatabase {
  private users: Map<string, DbUser> = new Map();
  private wallets: Map<string, DbWallet> = new Map();
  private plans: Map<string, DbPlan> = new Map();
  private investments: Map<string, DbInvestment> = new Map();
  private rewardCycles: Map<string, DbRewardCycle> = new Map();
  private transactions: Map<string, DbTransaction> = new Map();
  private referralRelationships: Map<string, DbReferralRelationship> = new Map();
  private referralRewards: Map<string, DbReferralReward> = new Map();
  private systemSettings: Map<string, DbSystemSetting> = new Map();
  private paymentMethods: Map<string, DbPaymentMethod> = new Map();
  private deposits: Map<string, DbDeposit> = new Map();
  private withdrawals: Map<string, DbWithdrawal> = new Map();
  private webhookEvents: Map<string, DbWebhookEvent> = new Map();
  private auditLogs: Map<string, DbAuditLog> = new Map();

  // Active claim locks to prevent concurrent double claims across async executions
  private claimLocks: Set<string> = new Set();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    // 1. System Settings
    const settings: Omit<DbSystemSetting, 'id' | 'updatedAt'>[] = [
      {
        key: 'CYCLE_DURATION_HOURS',
        value: '24',
        type: 'number',
        category: 'cycle',
        label: 'Cycle Duration (Hours)',
        description: 'Configurable duration of each mining cycle (default: 24 hours)',
        isPublic: true,
      },
      {
        key: 'MISSED_CLAIM_POLICY',
        value: 'CLAIM_REQUIRED',
        type: 'string',
        category: 'cycle',
        label: 'Missed Claim Policy',
        description: 'Policy when a cycle finishes: CLAIM_REQUIRED, AUTO_CLAIM, or EXPIRE_UNCLAIMED',
        isPublic: true,
      },
      {
        key: 'REFERRAL_ACTIVE_LEVELS',
        value: '3',
        type: 'number',
        category: 'referral',
        label: 'Active Referral Levels',
        description: 'Number of active referral hierarchy tiers (1 to 5)',
        isPublic: true,
      },
      {
        key: 'REFERRAL_PERCENTAGES',
        value: JSON.stringify([
          { level: 1, percentage: 7.0, active: true },
          { level: 2, percentage: 3.0, active: true },
          { level: 3, percentage: 1.5, active: true },
          { level: 4, percentage: 0.5, active: false },
          { level: 5, percentage: 0.25, active: false },
        ]),
        type: 'json',
        category: 'referral',
        label: 'Referral Tier Percentages',
        description: 'Configurable reward percentages per referral tier',
        isPublic: true,
      },
      {
        key: 'REFERRAL_QUALIFYING_TRIGGER',
        value: 'ELIGIBLE_INVESTMENT',
        type: 'string',
        category: 'referral',
        label: 'Referral Qualifying Trigger',
        description: 'Event that triggers referral rewards (e.g. ELIGIBLE_INVESTMENT)',
        isPublic: true,
      },
      {
        key: 'DEPOSIT_MIN',
        value: '10.00',
        type: 'number',
        category: 'deposit',
        label: 'Minimum Deposit (USDT)',
        description: 'Minimum deposit allowed per transaction',
        isPublic: true,
      },
      {
        key: 'DEPOSIT_MAX',
        value: '100000.00',
        type: 'number',
        category: 'deposit',
        label: 'Maximum Deposit (USDT)',
        description: 'Maximum deposit allowed per transaction',
        isPublic: true,
      },
      {
        key: 'DEPOSIT_FEE_PCT',
        value: '0.00',
        type: 'number',
        category: 'deposit',
        label: 'Deposit Fee (%)',
        description: 'Fee percentage charged on deposits',
        isPublic: true,
      },
      {
        key: 'WITHDRAWAL_MIN',
        value: '20.00',
        type: 'number',
        category: 'withdrawal',
        label: 'Minimum Withdrawal (USDT)',
        description: 'Minimum withdrawal allowed per transaction',
        isPublic: true,
      },
      {
        key: 'WITHDRAWAL_MAX',
        value: '50000.00',
        type: 'number',
        category: 'withdrawal',
        label: 'Maximum Withdrawal (USDT)',
        description: 'Maximum withdrawal allowed per transaction',
        isPublic: true,
      },
      {
        key: 'WITHDRAWAL_FEE_FIXED',
        value: '1.00',
        type: 'number',
        category: 'withdrawal',
        label: 'Fixed Withdrawal Fee (USDT)',
        description: 'Fixed network/gas fee per withdrawal transaction',
        isPublic: true,
      },
      {
        key: 'WITHDRAWAL_FEE_PCT',
        value: '1.00',
        type: 'number',
        category: 'withdrawal',
        label: 'Percentage Withdrawal Fee (%)',
        description: 'Percentage fee per withdrawal transaction',
        isPublic: true,
      },
      {
        key: 'WITHDRAWAL_ENABLED',
        value: 'true',
        type: 'boolean',
        category: 'withdrawal',
        label: 'Withdrawal Engine Enabled',
        description: 'Global master toggle for processing withdrawals',
        isPublic: true,
      },
      {
        key: 'NETWORK_TRC20_ENABLED',
        value: 'true',
        type: 'boolean',
        category: 'network',
        label: 'TRC20 Network Enabled',
        description: 'Master toggle for Tron TRC20 deposits & withdrawals',
        isPublic: true,
      },
      {
        key: 'NETWORK_BEP20_ENABLED',
        value: 'true',
        type: 'boolean',
        category: 'network',
        label: 'BEP20 Network Enabled',
        description: 'Master toggle for BSC BEP20 deposits & withdrawals',
        isPublic: true,
      },
    ];

    settings.forEach((s) => {
      const id = `setting_${s.key.toLowerCase()}`;
      this.systemSettings.set(s.key, {
        ...s,
        id,
        updatedAt: new Date().toISOString(),
      });
    });

    // 2. Plans
    const plansData: DbPlan[] = [
      {
        id: 'plan_starter',
        slug: 'starter',
        name: 'Starter',
        tierBadge: 'Starter',
        colorVariant: 'green',
        minDeposit: '10.00',
        maxDeposit: '99.00',
        dailyRatePct: '2.00',
        cycleDurationHours: 24,
        isLifetime: true,
        status: 'ACTIVE',
        features: ['Daily 2.00% Rewards', '24-Hour Claim Cycle', 'TRC20 / BEP20 Support'],
      },
      {
        id: 'plan_basic',
        slug: 'basic',
        name: 'Basic',
        tierBadge: 'Basic',
        colorVariant: 'orange',
        minDeposit: '100.00',
        maxDeposit: '499.00',
        dailyRatePct: '2.00',
        cycleDurationHours: 24,
        isLifetime: true,
        status: 'ACTIVE',
        features: ['Daily 2.00% Rewards', '24-Hour Claim Cycle', 'Priority Node Allocation'],
      },
      {
        id: 'plan_standard',
        slug: 'standard',
        name: 'Standard',
        tierBadge: 'Standard',
        colorVariant: 'green',
        minDeposit: '500.00',
        maxDeposit: '1499.00',
        dailyRatePct: '3.00',
        cycleDurationHours: 24,
        isLifetime: true,
        status: 'ACTIVE',
        features: ['Daily 3.00% Rewards', '24-Hour Claim Cycle', 'High-Speed Cluster'],
      },
      {
        id: 'plan_advanced',
        slug: 'advanced',
        name: 'Advanced',
        tierBadge: 'Advanced',
        colorVariant: 'orange',
        minDeposit: '1500.00',
        maxDeposit: '4999.00',
        dailyRatePct: '3.50',
        cycleDurationHours: 24,
        isLifetime: true,
        status: 'ACTIVE',
        features: ['Daily 3.50% Rewards', '24-Hour Claim Cycle', 'Enterprise Cluster'],
      },
      {
        id: 'plan_premium',
        slug: 'premium',
        name: 'Premium',
        tierBadge: 'Premium',
        colorVariant: 'green',
        minDeposit: '5000.00',
        maxDeposit: '9999.00',
        dailyRatePct: '4.00',
        cycleDurationHours: 24,
        isLifetime: true,
        status: 'ACTIVE',
        features: ['Daily 4.00% Rewards', '24-Hour Claim Cycle', 'VIP Concierge'],
      },
    ];

    plansData.forEach((p) => this.plans.set(p.id, p));

    // 3. Upline Users (for referral network demonstration)
    const upline3: DbUser = {
      id: 'usr_upline3',
      email: 'elena.hash@minepro.network',
      username: 'elena_hash',
      passwordHash: 'hash_elena',
      fullName: 'Elena Hash',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'MINE-L3-ELENA',
      referredById: null,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(upline3.id, upline3);
    this.wallets.set(upline3.id, {
      id: 'w_upline3',
      userId: upline3.id,
      balance: '1420.00000000',
      totalDeposited: '1000.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '1000.00000000',
      totalEarned: '420.00000000',
      totalReferral: '120.00000000',
      lockedBalance: '0.00000000',
      createdAt: upline3.createdAt,
      updatedAt: new Date().toISOString(),
    });

    const upline2: DbUser = {
      id: 'usr_upline2',
      email: 'marcus.nordic@minepro.network',
      username: 'marcus_nordic',
      passwordHash: 'hash_marcus',
      fullName: 'Marcus Nordic',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'MINE-L2-MARCUS',
      referredById: upline3.id,
      createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(upline2.id, upline2);
    this.wallets.set(upline2.id, {
      id: 'w_upline2',
      userId: upline2.id,
      balance: '890.00000000',
      totalDeposited: '500.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '500.00000000',
      totalEarned: '390.00000000',
      totalReferral: '75.00000000',
      lockedBalance: '0.00000000',
      createdAt: upline2.createdAt,
      updatedAt: new Date().toISOString(),
    });

    const upline1: DbUser = {
      id: 'usr_upline1',
      email: 'sarah.crypto@minepro.network',
      username: 'sarah_crypto',
      passwordHash: 'hash_sarah',
      fullName: 'Sarah Vance',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'MINE-L1-SARAH',
      referredById: upline2.id,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(upline1.id, upline1);
    this.wallets.set(upline1.id, {
      id: 'w_upline1',
      userId: upline1.id,
      balance: '650.00000000',
      totalDeposited: '500.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '500.00000000',
      totalEarned: '150.00000000',
      totalReferral: '85.00000000',
      lockedBalance: '0.00000000',
      createdAt: upline1.createdAt,
      updatedAt: new Date().toISOString(),
    });

    // 4. Primary Authenticated User: Ahmad Sikander
    const primaryUser: DbUser = {
      id: 'usr_ahmad',
      email: 'ahmad@minepro.network',
      username: 'ahmad_sikander',
      passwordHash: 'hashed_password_123',
      fullName: 'Ahmad Sikander',
      role: 'USER',
      status: 'ACTIVE',
      referralCode: 'MINE-PRO-77',
      referredById: upline1.id,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(primaryUser.id, primaryUser);

    this.wallets.set(primaryUser.id, {
      id: 'w_ahmad',
      userId: primaryUser.id,
      balance: '2450.00000000',
      totalDeposited: '2000.00000000',
      totalWithdrawn: '0.00000000',
      totalInvested: '1200.00000000',
      totalEarned: '350.00000000',
      totalReferral: '100.00000000',
      lockedBalance: '0.00000000',
      createdAt: primaryUser.createdAt,
      updatedAt: new Date().toISOString(),
    });

    // Link uplines for Ahmad in referralRelationships
    this.referralRelationships.set('rel_ahmad_upline1', {
      id: 'rel_ahmad_upline1',
      uplineUserId: upline1.id,
      downlineUserId: primaryUser.id,
      level: 1,
      createdAt: primaryUser.createdAt,
    });
    this.referralRelationships.set('rel_ahmad_upline2', {
      id: 'rel_ahmad_upline2',
      uplineUserId: upline2.id,
      downlineUserId: primaryUser.id,
      level: 2,
      createdAt: primaryUser.createdAt,
    });
    this.referralRelationships.set('rel_ahmad_upline3', {
      id: 'rel_ahmad_upline3',
      uplineUserId: upline3.id,
      downlineUserId: primaryUser.id,
      level: 3,
      createdAt: primaryUser.createdAt,
    });

    // 5. Downline Referrals under Ahmad (Direct & Multi-level)
    const downlines: DbUser[] = [
      {
        id: 'usr_downline1',
        email: 'david.miner@gmail.com',
        username: 'david_miner',
        passwordHash: 'hash',
        fullName: 'David Miner',
        role: 'USER',
        status: 'ACTIVE',
        referralCode: 'MINE-D1-DAVID',
        referredById: primaryUser.id,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_downline2',
        email: 'rachel.btc@gmail.com',
        username: 'rachel_btc',
        passwordHash: 'hash',
        fullName: 'Rachel BTC',
        role: 'USER',
        status: 'ACTIVE',
        referralCode: 'MINE-D2-RACHEL',
        referredById: primaryUser.id,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_downline3_lvl2',
        email: 'ken.hash@gmail.com',
        username: 'ken_hashrate',
        passwordHash: 'hash',
        fullName: 'Ken Hashrate',
        role: 'USER',
        status: 'ACTIVE',
        referralCode: 'MINE-D3-KEN',
        referredById: 'usr_downline1', // Level 2 for Ahmad!
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    downlines.forEach((d) => {
      this.users.set(d.id, d);
      this.wallets.set(d.id, {
        id: `w_${d.id}`,
        userId: d.id,
        balance: '500.00000000',
        totalDeposited: '500.00000000',
        totalWithdrawn: '0.00000000',
        totalInvested: '500.00000000',
        totalEarned: '50.00000000',
        totalReferral: '0.00000000',
        lockedBalance: '0.00000000',
        createdAt: d.createdAt,
        updatedAt: new Date().toISOString(),
      });
    });

    // Referral Edges for Downlines
    this.referralRelationships.set('rel_d1', {
      id: 'rel_d1',
      uplineUserId: primaryUser.id,
      downlineUserId: 'usr_downline1',
      level: 1,
      createdAt: downlines[0].createdAt,
    });
    this.referralRelationships.set('rel_d2', {
      id: 'rel_d2',
      uplineUserId: primaryUser.id,
      downlineUserId: 'usr_downline2',
      level: 1,
      createdAt: downlines[1].createdAt,
    });
    this.referralRelationships.set('rel_d3_direct', {
      id: 'rel_d3_direct',
      uplineUserId: 'usr_downline1',
      downlineUserId: 'usr_downline3_lvl2',
      level: 1,
      createdAt: downlines[2].createdAt,
    });
    this.referralRelationships.set('rel_d3_ahmad_lvl2', {
      id: 'rel_d3_ahmad_lvl2',
      uplineUserId: primaryUser.id,
      downlineUserId: 'usr_downline3_lvl2',
      level: 2,
      createdAt: downlines[2].createdAt,
    });

    // Seed historical referral rewards credited to Ahmad
    const refReward1: DbReferralReward = {
      id: 'rfr_1',
      beneficiaryId: primaryUser.id,
      triggerUserId: 'usr_downline1',
      level: 1,
      rewardRatePct: '7.00',
      qualifyingAmount: '1000.00000000',
      rewardAmount: '70.00000000',
      status: 'COMPLETED',
      reference: 'REF-AHMAD-70-1',
      transactionId: 'trx_ref_1',
      qualifyingEventId: 'inv_d1_1',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    };
    this.referralRewards.set(refReward1.id, refReward1);

    const refReward2: DbReferralReward = {
      id: 'rfr_2',
      beneficiaryId: primaryUser.id,
      triggerUserId: 'usr_downline3_lvl2',
      level: 2,
      rewardRatePct: '3.00',
      qualifyingAmount: '1000.00000000',
      rewardAmount: '30.00000000',
      status: 'COMPLETED',
      reference: 'REF-AHMAD-30-2',
      transactionId: 'trx_ref_2',
      qualifyingEventId: 'inv_d3_1',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    };
    this.referralRewards.set(refReward2.id, refReward2);

    // 6. Active Standard Plan Investment for Ahmad
    const activeInvestment: DbInvestment = {
      id: 'inv_ahmad_standard',
      userId: primaryUser.id,
      planId: 'plan_standard',
      amount: '500.00000000',
      dailyReward: '15.00000000', // 3% of $500 = $15
      totalEarned: '45.00000000',
      claimsCount: 3,
      status: 'ACTIVE',
      activatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      lastClaimAt: new Date(Date.now() - 25 * 3600000).toISOString(),
      nextClaimAt: new Date(Date.now() - 1 * 3600000).toISOString(), // Cycle ended 1 hour ago -> ELIGIBLE FOR CLAIM!
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.investments.set(activeInvestment.id, activeInvestment);

    // 7. Authoritative Active Reward Cycle for Ahmad (Cycle #4, ready to claim)
    const activeCycle: DbRewardCycle = {
      id: 'cyc_ahmad_4',
      userId: primaryUser.id,
      investmentId: activeInvestment.id,
      cycleNumber: 4,
      rewardAmount: '15.00000000',
      cycleStartedAt: new Date(Date.now() - 25 * 3600000).toISOString(),
      cycleEndsAt: new Date(Date.now() - 1 * 3600000).toISOString(), // Ended 1 hour ago! Authoritative server time confirms completion!
      status: 'RUNNING', // Will be determined as ELIGIBLE_FOR_CLAIM by server time
      claimReference: null,
      claimedAt: null,
      claimedIp: null,
      createdAt: new Date(Date.now() - 25 * 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.rewardCycles.set(activeCycle.id, activeCycle);

    // Initial Historical Transactions
    this.transactions.set('trx_init_dep', {
      id: 'trx_init_dep',
      reference: 'MP-TX-1001',
      userId: primaryUser.id,
      type: 'DEPOSIT',
      amount: '2000.00000000',
      fee: '0.00000000',
      netAmount: '2000.00000000',
      status: 'COMPLETED',
      description: 'Deposit USDT (TRC20)',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    });
    this.transactions.set('trx_init_inv', {
      id: 'trx_init_inv',
      reference: 'MP-TX-1002',
      userId: primaryUser.id,
      type: 'PLAN_INVESTMENT',
      amount: '500.00000000',
      fee: '0.00000000',
      netAmount: '500.00000000',
      status: 'COMPLETED',
      description: 'Activated Standard Node ($500.00)',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    });
    this.transactions.set('trx_ref_1', {
      id: 'trx_ref_1',
      reference: 'REF-AHMAD-70-1',
      userId: primaryUser.id,
      type: 'REFERRAL_REWARD',
      amount: '70.00000000',
      fee: '0.00000000',
      netAmount: '70.00000000',
      status: 'COMPLETED',
      description: 'Level 1 Referral Bonus from david_miner (7%)',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    });
    this.transactions.set('trx_ref_2', {
      id: 'trx_ref_2',
      reference: 'REF-AHMAD-30-2',
      userId: primaryUser.id,
      type: 'REFERRAL_REWARD',
      amount: '30.00000000',
      fee: '0.00000000',
      netAmount: '30.00000000',
      status: 'COMPLETED',
      description: 'Level 2 Referral Bonus from ken_hashrate (3%)',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    });

    // 8. Administrative User for Verification and Approval Workflows
    const adminUser: DbUser = {
      id: 'usr_admin',
      email: 'admin@minepro.network',
      username: 'admin_minepro',
      passwordHash: 'admin_secure_hash_89',
      fullName: 'MinePro Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
      referralCode: 'MINE-ADMIN',
      referredById: null,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // 9. Payment Methods (TRC20 & BEP20)
    const pmTRC20: DbPaymentMethod = {
      id: 'pm_trc20',
      network: 'TRC20',
      asset: 'USDT (TRC20)',
      address: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6',
      isEnabled: true,
      displayOrder: 1,
      minDeposit: '10.00',
      maxDeposit: '100000.00',
      metadata: {
        networkName: 'Tron Network',
        contractAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        confirmationsRequired: 12,
        estimatedArrivalTime: '2-5 minutes',
      },
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.paymentMethods.set(pmTRC20.id, pmTRC20);

    const pmBEP20: DbPaymentMethod = {
      id: 'pm_bep20',
      network: 'BEP20',
      asset: 'USDT (BEP20)',
      address: '0x71C8705e4A35B324c90b65B3E84F75E4D1D09A01',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x71C8705e4A35B324c90b65B3E84F75E4D1D09A01',
      isEnabled: true,
      displayOrder: 2,
      minDeposit: '10.00',
      maxDeposit: '100000.00',
      metadata: {
        networkName: 'BNB Smart Chain',
        contractAddress: '0x55d398326f99059ff775485246999027b3197955',
        confirmationsRequired: 15,
        estimatedArrivalTime: '1-3 minutes',
      },
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.paymentMethods.set(pmBEP20.id, pmBEP20);

    // 10. Initial Completed Deposit for Ahmad
    const initDeposit: DbDeposit = {
      id: 'dep_init_1',
      userId: primaryUser.id,
      paymentMethodId: pmTRC20.id,
      network: 'TRC20',
      amount: '2000.00000000',
      txHash: '7a9c8f2b1d3e4a5c6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
      status: 'COMPLETED',
      submittedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      reviewedAt: new Date(Date.now() - 15 * 86400000 + 300000).toISOString(),
      reviewedBy: adminUser.id,
      transactionId: 'trx_init_dep',
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 86400000 + 300000).toISOString(),
    };
    this.deposits.set(initDeposit.id, initDeposit);
  }

  // Model accessor interfaces
  public user = {
    findUnique: async ({ where }: { where: { id?: string; email?: string; username?: string; referralCode?: string } }): Promise<DbUser | null> => {
      for (const u of this.users.values()) {
        if (where.id && u.id === where.id) return { ...u };
        if (where.email && u.email.toLowerCase() === where.email.toLowerCase()) return { ...u };
        if (where.username && u.username.toLowerCase() === where.username.toLowerCase()) return { ...u };
        if (where.referralCode && u.referralCode.toUpperCase() === where.referralCode.toUpperCase()) return { ...u };
      }
      return null;
    },
    create: async ({ data }: { data: Omit<DbUser, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbUser> => {
      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const newUser: DbUser = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.users.set(id, newUser);
      return { ...newUser };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbUser> }): Promise<DbUser> => {
      const u = this.users.get(where.id);
      if (!u) throw new Error(`User with ID ${where.id} not found`);
      const updated: DbUser = { ...u, ...data, updatedAt: new Date().toISOString() };
      this.users.set(where.id, updated);
      return { ...updated };
    },
    count: async (): Promise<number> => this.users.size,
  };

  public wallet = {
    findUnique: async ({ where }: { where: { userId: string } }): Promise<DbWallet | null> => {
      for (const w of this.wallets.values()) {
        if (w.userId === where.userId) return { ...w };
      }
      return null;
    },
    create: async ({ data }: { data: Omit<DbWallet, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbWallet> => {
      const id = `w_${data.userId}`;
      const now = new Date().toISOString();
      const newWallet: DbWallet = { ...data, id, createdAt: now, updatedAt: now };
      this.wallets.set(id, newWallet);
      return { ...newWallet };
    },
    update: async ({ where, data }: { where: { userId: string }; data: Partial<DbWallet> }): Promise<DbWallet> => {
      let target: DbWallet | null = null;
      let targetKey: string | null = null;
      for (const [k, w] of this.wallets.entries()) {
        if (w.userId === where.userId) {
          target = w;
          targetKey = k;
          break;
        }
      }
      if (!target || !targetKey) throw new Error(`Wallet for userId ${where.userId} not found`);
      const updated: DbWallet = { ...target, ...data, updatedAt: new Date().toISOString() };
      this.wallets.set(targetKey, updated);
      return { ...updated };
    },
  };

  public plan = {
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }): Promise<DbPlan | null> => {
      for (const p of this.plans.values()) {
        if (where.id && p.id === where.id) return { ...p };
        if (where.slug && p.slug === where.slug) return { ...p };
      }
      return null;
    },
    findMany: async (): Promise<DbPlan[]> => Array.from(this.plans.values()),
  };

  public investment = {
    findUnique: async ({ where }: { where: { id: string } }): Promise<DbInvestment | null> => {
      const inv = this.investments.get(where.id);
      return inv ? { ...inv } : null;
    },
    findFirst: async ({ where }: { where: { userId?: string; status?: string } }): Promise<DbInvestment | null> => {
      for (const inv of this.investments.values()) {
        if (where.userId && inv.userId !== where.userId) continue;
        if (where.status && inv.status !== where.status) continue;
        return { ...inv };
      }
      return null;
    },
    findMany: async ({ where }: { where: { userId?: string; status?: string } }): Promise<DbInvestment[]> => {
      const res: DbInvestment[] = [];
      for (const inv of this.investments.values()) {
        if (where.userId && inv.userId !== where.userId) continue;
        if (where.status && inv.status !== where.status) continue;
        res.push({ ...inv });
      }
      return res;
    },
    create: async ({ data }: { data: Omit<DbInvestment, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbInvestment> => {
      const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newInv: DbInvestment = { ...data, id, createdAt: now, updatedAt: now };
      this.investments.set(id, newInv);
      return { ...newInv };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbInvestment> }): Promise<DbInvestment> => {
      const inv = this.investments.get(where.id);
      if (!inv) throw new Error(`Investment with ID ${where.id} not found`);
      const updated: DbInvestment = { ...inv, ...data, updatedAt: new Date().toISOString() };
      this.investments.set(where.id, updated);
      return { ...updated };
    },
  };

  public rewardCycle = {
    findUnique: async ({ where }: { where: { id?: string; claimReference?: string } }): Promise<DbRewardCycle | null> => {
      for (const c of this.rewardCycles.values()) {
        if (where.id && c.id === where.id) return { ...c };
        if (where.claimReference && c.claimReference === where.claimReference) return { ...c };
      }
      return null;
    },
    findFirst: async ({ where }: { where: { investmentId?: string; userId?: string; status?: CycleStatus; cycleNumber?: number } }): Promise<DbRewardCycle | null> => {
      for (const c of this.rewardCycles.values()) {
        if (where.investmentId && c.investmentId !== where.investmentId) continue;
        if (where.userId && c.userId !== where.userId) continue;
        if (where.status && c.status !== where.status) continue;
        if (where.cycleNumber !== undefined && c.cycleNumber !== where.cycleNumber) continue;
        return { ...c };
      }
      return null;
    },
    findMany: async ({ where }: { where: { userId?: string; investmentId?: string } }): Promise<DbRewardCycle[]> => {
      const res: DbRewardCycle[] = [];
      for (const c of this.rewardCycles.values()) {
        if (where.userId && c.userId !== where.userId) continue;
        if (where.investmentId && c.investmentId !== where.investmentId) continue;
        res.push({ ...c });
      }
      // Sort newest cycle first
      return res.sort((a, b) => b.cycleNumber - a.cycleNumber);
    },
    create: async ({ data }: { data: Omit<DbRewardCycle, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbRewardCycle> => {
      // Check unique [investmentId, cycleNumber]
      for (const c of this.rewardCycles.values()) {
        if (c.investmentId === data.investmentId && c.cycleNumber === data.cycleNumber) {
          throw new Error(`Cycle #${data.cycleNumber} already exists for investment ${data.investmentId}`);
        }
      }
      const id = `cyc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newCycle: DbRewardCycle = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.rewardCycles.set(id, newCycle);
      return { ...newCycle };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbRewardCycle> }): Promise<DbRewardCycle> => {
      const c = this.rewardCycles.get(where.id);
      if (!c) throw new Error(`Cycle ${where.id} not found`);
      const updated: DbRewardCycle = { ...c, ...data, updatedAt: new Date().toISOString() };
      this.rewardCycles.set(where.id, updated);
      return { ...updated };
    },
    /**
     * Atomic claim operation with lock and status verification.
     * Prevents race conditions and double-claims across concurrent requests.
     */
    atomicClaim: async (
      cycleId: string,
      userId: string,
      claimReference: string,
      claimedIp: string | null
    ): Promise<DbRewardCycle> => {
      // 1. Thread lock on cycleId
      if (serverDb.claimLocks.has(cycleId)) {
        throw new Error('CONCURRENT_CLAIM_REJECTED: Another claim request for this cycle is currently processing.');
      }
      serverDb.claimLocks.add(cycleId);

      try {
        const cycle = serverDb.rewardCycles.get(cycleId);
        if (!cycle) {
          throw new Error('CYCLE_NOT_FOUND: The requested reward cycle was not found.');
        }
        if (cycle.userId !== userId) {
          throw new Error('FORBIDDEN_OWNERSHIP: You do not have permission to claim this cycle.');
        }
        if (cycle.status === 'CLAIMED') {
          throw new Error('ALREADY_CLAIMED: This cycle has already been claimed.');
        }

        // Check if claimReference already used
        for (const existing of serverDb.rewardCycles.values()) {
          if (existing.claimReference === claimReference) {
            throw new Error('DUPLICATE_CLAIM_REFERENCE: Claim reference already exists.');
          }
        }

        // Verify authoritative server time
        const now = new Date();
        const cycleEnd = new Date(cycle.cycleEndsAt);
        if (now.getTime() < cycleEnd.getTime()) {
          const remainingSec = Math.ceil((cycleEnd.getTime() - now.getTime()) / 1000);
          throw new Error(`CYCLE_STILL_RUNNING: Authoritative cycle is not complete. ${remainingSec} seconds remaining.`);
        }

        const nowIso = now.toISOString();
        const updated: DbRewardCycle = {
          ...cycle,
          status: 'CLAIMED',
          claimReference,
          claimedAt: nowIso,
          claimedIp,
          updatedAt: nowIso,
        };
        serverDb.rewardCycles.set(cycleId, updated);
        return { ...updated };
      } finally {
        serverDb.claimLocks.delete(cycleId);
      }
    },
  };

  public transaction = {
    findUnique: async ({ where }: { where: { reference?: string; id?: string } }): Promise<DbTransaction | null> => {
      for (const t of this.transactions.values()) {
        if (where.id && t.id === where.id) return { ...t };
        if (where.reference && t.reference === where.reference) return { ...t };
      }
      return null;
    },
    findMany: async ({ where }: { where?: { userId?: string; type?: string; status?: string } } = {}): Promise<DbTransaction[]> => {
      const res: DbTransaction[] = [];
      for (const t of this.transactions.values()) {
        if (where?.userId && t.userId !== where.userId) continue;
        if (where?.type && t.type !== where.type) continue;
        if (where?.status && t.status !== where.status) continue;
        res.push({ ...t });
      }
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async ({ data }: { data: Omit<DbTransaction, 'id' | 'createdAt'> }): Promise<DbTransaction> => {
      for (const t of this.transactions.values()) {
        if (t.reference === data.reference) {
          throw new Error(`Transaction reference ${data.reference} already exists.`);
        }
      }
      const id = `trx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newTrx: DbTransaction = { ...data, id, createdAt: now, updatedAt: now };
      this.transactions.set(id, newTrx);
      return { ...newTrx };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbTransaction> }): Promise<DbTransaction> => {
      const t = this.transactions.get(where.id);
      if (!t) throw new Error(`Transaction ${where.id} not found`);
      const updated: DbTransaction = { ...t, ...data, updatedAt: new Date().toISOString() };
      this.transactions.set(where.id, updated);
      return { ...updated };
    },
  };

  public paymentMethod = {
    findUnique: async ({ where }: { where: { id?: string; network?: string } }): Promise<DbPaymentMethod | null> => {
      for (const pm of this.paymentMethods.values()) {
        if (where.id && pm.id === where.id) return { ...pm };
        if (where.network && pm.network.toUpperCase() === where.network.toUpperCase()) return { ...pm };
      }
      return null;
    },
    findFirst: async ({ where }: { where: { network?: string; isEnabled?: boolean } }): Promise<DbPaymentMethod | null> => {
      for (const pm of this.paymentMethods.values()) {
        if (where.network && pm.network.toUpperCase() !== where.network.toUpperCase()) continue;
        if (where.isEnabled !== undefined && pm.isEnabled !== where.isEnabled) continue;
        return { ...pm };
      }
      return null;
    },
    findMany: async ({ where }: { where?: { isEnabled?: boolean } } = {}): Promise<DbPaymentMethod[]> => {
      const res: DbPaymentMethod[] = [];
      for (const pm of this.paymentMethods.values()) {
        if (where?.isEnabled !== undefined && pm.isEnabled !== where.isEnabled) continue;
        res.push({ ...pm });
      }
      return res.sort((a, b) => a.displayOrder - b.displayOrder);
    },
    create: async ({ data }: { data: Omit<DbPaymentMethod, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbPaymentMethod> => {
      const id = `pm_${data.network.toLowerCase()}_${Date.now().toString(36)}`;
      const now = new Date().toISOString();
      const newPm: DbPaymentMethod = { ...data, id, createdAt: now, updatedAt: now };
      this.paymentMethods.set(id, newPm);
      return { ...newPm };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbPaymentMethod> }): Promise<DbPaymentMethod> => {
      const pm = this.paymentMethods.get(where.id);
      if (!pm) throw new Error(`Payment method ${where.id} not found`);
      const updated: DbPaymentMethod = { ...pm, ...data, updatedAt: new Date().toISOString() };
      this.paymentMethods.set(where.id, updated);
      return { ...updated };
    },
  };

  public deposit = {
    findUnique: async ({ where }: { where: { id?: string; txHash?: string } }): Promise<DbDeposit | null> => {
      for (const d of this.deposits.values()) {
        if (where.id && d.id === where.id) return { ...d };
        if (where.txHash && d.txHash.toLowerCase() === where.txHash.toLowerCase()) return { ...d };
      }
      return null;
    },
    findFirst: async ({ where }: { where: { txHash?: string } }): Promise<DbDeposit | null> => {
      for (const d of this.deposits.values()) {
        if (where.txHash && d.txHash.toLowerCase() === where.txHash.toLowerCase()) return { ...d };
      }
      return null;
    },
    findMany: async ({ where }: { where?: { userId?: string; status?: string; network?: string } } = {}): Promise<DbDeposit[]> => {
      const res: DbDeposit[] = [];
      for (const d of this.deposits.values()) {
        if (where?.userId && d.userId !== where.userId) continue;
        if (where?.status && d.status !== where.status) continue;
        if (where?.network && d.network !== where.network) continue;
        res.push({ ...d });
      }
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async ({ data }: { data: Omit<DbDeposit, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbDeposit> => {
      // Uniqueness check for txHash
      for (const d of this.deposits.values()) {
        if (d.txHash.toLowerCase() === data.txHash.toLowerCase()) {
          throw new Error(`DUPLICATE_TRANSACTION_HASH: Transaction hash ${data.txHash} has already been submitted.`);
        }
      }
      const id = `dep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newDep: DbDeposit = { ...data, id, createdAt: now, updatedAt: now };
      this.deposits.set(id, newDep);
      return { ...newDep };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbDeposit> }): Promise<DbDeposit> => {
      const d = this.deposits.get(where.id);
      if (!d) throw new Error(`Deposit ${where.id} not found`);
      const updated: DbDeposit = { ...d, ...data, updatedAt: new Date().toISOString() };
      this.deposits.set(where.id, updated);
      return { ...updated };
    },
  };

  public withdrawal = {
    findUnique: async ({ where }: { where: { id?: string; txHash?: string } }): Promise<DbWithdrawal | null> => {
      for (const w of this.withdrawals.values()) {
        if (where.id && w.id === where.id) return { ...w };
        if (where.txHash && w.txHash && w.txHash.toLowerCase() === where.txHash.toLowerCase()) return { ...w };
      }
      return null;
    },
    findFirst: async ({ where }: { where: { txHash?: string } }): Promise<DbWithdrawal | null> => {
      for (const w of this.withdrawals.values()) {
        if (where.txHash && w.txHash && w.txHash.toLowerCase() === where.txHash.toLowerCase()) return { ...w };
      }
      return null;
    },
    findMany: async ({ where }: { where?: { userId?: string; status?: string; network?: string } } = {}): Promise<DbWithdrawal[]> => {
      const res: DbWithdrawal[] = [];
      for (const w of this.withdrawals.values()) {
        if (where?.userId && w.userId !== where.userId) continue;
        if (where?.status && w.status !== where.status) continue;
        if (where?.network && w.network !== where.network) continue;
        res.push({ ...w });
      }
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async ({ data }: { data: Omit<DbWithdrawal, 'id' | 'createdAt' | 'updatedAt'> }): Promise<DbWithdrawal> => {
      const id = `wth_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newWth: DbWithdrawal = { ...data, id, createdAt: now, updatedAt: now };
      this.withdrawals.set(id, newWth);
      return { ...newWth };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbWithdrawal> }): Promise<DbWithdrawal> => {
      const w = this.withdrawals.get(where.id);
      if (!w) throw new Error(`Withdrawal ${where.id} not found`);
      const updated: DbWithdrawal = { ...w, ...data, updatedAt: new Date().toISOString() };
      this.withdrawals.set(where.id, updated);
      return { ...updated };
    },
  };

  public webhookEvent = {
    findUnique: async ({ where }: { where: { eventId?: string; id?: string } }): Promise<DbWebhookEvent | null> => {
      for (const we of this.webhookEvents.values()) {
        if (where.id && we.id === where.id) return { ...we };
        if (where.eventId && we.eventId === where.eventId) return { ...we };
      }
      return null;
    },
    findFirst: async ({ where }: { where: { eventId?: string } }): Promise<DbWebhookEvent | null> => {
      for (const we of this.webhookEvents.values()) {
        if (where.eventId && we.eventId === where.eventId) return { ...we };
      }
      return null;
    },
    findMany: async ({ where }: { where?: { provider?: string; status?: string } } = {}): Promise<DbWebhookEvent[]> => {
      const res: DbWebhookEvent[] = [];
      for (const we of this.webhookEvents.values()) {
        if (where?.provider && we.provider !== where.provider) continue;
        if (where?.status && we.status !== where.status) continue;
        res.push({ ...we });
      }
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async ({ data }: { data: Omit<DbWebhookEvent, 'id' | 'createdAt'> }): Promise<DbWebhookEvent> => {
      for (const we of this.webhookEvents.values()) {
        if (we.eventId === data.eventId) {
          throw new Error(`DUPLICATE_WEBHOOK_EVENT: Webhook event ${data.eventId} has already been registered.`);
        }
      }
      const id = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newWe: DbWebhookEvent = { ...data, id, createdAt: now };
      this.webhookEvents.set(id, newWe);
      return { ...newWe };
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<DbWebhookEvent> }): Promise<DbWebhookEvent> => {
      const we = this.webhookEvents.get(where.id);
      if (!we) throw new Error(`Webhook event ${where.id} not found`);
      const updated: DbWebhookEvent = { ...we, ...data };
      this.webhookEvents.set(where.id, updated);
      return { ...updated };
    },
  };

  public auditLog = {
    findMany: async ({ where }: { where?: { entity?: string; entityId?: string; actorId?: string } } = {}): Promise<DbAuditLog[]> => {
      const res: DbAuditLog[] = [];
      for (const al of this.auditLogs.values()) {
        if (where?.entity && al.entity !== where.entity) continue;
        if (where?.entityId && al.entityId !== where.entityId) continue;
        if (where?.actorId && al.actorId !== where.actorId) continue;
        res.push({ ...al });
      }
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async ({ data }: { data: Omit<DbAuditLog, 'id' | 'createdAt'> }): Promise<DbAuditLog> => {
      const id = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newLog: DbAuditLog = { ...data, id, createdAt: now };
      this.auditLogs.set(id, newLog);
      return { ...newLog };
    },
  };

  public referralRelationship = {
    findMany: async ({ where }: { where: { uplineUserId?: string; downlineUserId?: string; level?: number } }): Promise<DbReferralRelationship[]> => {
      const res: DbReferralRelationship[] = [];
      for (const r of this.referralRelationships.values()) {
        if (where.uplineUserId && r.uplineUserId !== where.uplineUserId) continue;
        if (where.downlineUserId && r.downlineUserId !== where.downlineUserId) continue;
        if (where.level && r.level !== where.level) continue;
        res.push({ ...r });
      }
      return res;
    },
    create: async ({ data }: { data: Omit<DbReferralRelationship, 'id' | 'createdAt'> }): Promise<DbReferralRelationship> => {
      // Check duplicate
      for (const r of this.referralRelationships.values()) {
        if (r.uplineUserId === data.uplineUserId && r.downlineUserId === data.downlineUserId) {
          return { ...r };
        }
      }
      const id = `rel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newRel: DbReferralRelationship = { ...data, id, createdAt: now };
      this.referralRelationships.set(id, newRel);
      return { ...newRel };
    },
  };

  public referralReward = {
    findUnique: async ({ where }: { where: { beneficiaryId_qualifyingEventId_level?: { beneficiaryId: string; qualifyingEventId: string; level: number } } }): Promise<DbReferralReward | null> => {
      if (where.beneficiaryId_qualifyingEventId_level) {
        const { beneficiaryId, qualifyingEventId, level } = where.beneficiaryId_qualifyingEventId_level;
        for (const r of this.referralRewards.values()) {
          if (r.beneficiaryId === beneficiaryId && r.qualifyingEventId === qualifyingEventId && r.level === level) {
            return { ...r };
          }
        }
      }
      return null;
    },
    findMany: async ({ where }: { where: { beneficiaryId?: string; triggerUserId?: string } }): Promise<DbReferralReward[]> => {
      const res: DbReferralReward[] = [];
      for (const r of this.referralRewards.values()) {
        if (where.beneficiaryId && r.beneficiaryId !== where.beneficiaryId) continue;
        if (where.triggerUserId && r.triggerUserId !== where.triggerUserId) continue;
        res.push({ ...r });
      }
      return res.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    create: async ({ data }: { data: Omit<DbReferralReward, 'id' | 'createdAt'> }): Promise<DbReferralReward> => {
      // Enforce unique (beneficiaryId, qualifyingEventId, level)
      for (const r of this.referralRewards.values()) {
        if (
          r.beneficiaryId === data.beneficiaryId &&
          r.qualifyingEventId === data.qualifyingEventId &&
          r.level === data.level
        ) {
          throw new Error(`DUPLICATE_REFERRAL_REWARD: Referral reward already granted for event ${data.qualifyingEventId} at level ${data.level}`);
        }
      }
      const id = `rfr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const now = new Date().toISOString();
      const newReward: DbReferralReward = { ...data, id, createdAt: now };
      this.referralRewards.set(id, newReward);
      return { ...newReward };
    },
  };

  public systemSetting = {
    findUnique: async ({ where }: { where: { key: string } }): Promise<DbSystemSetting | null> => {
      const s = this.systemSettings.get(where.key);
      return s ? { ...s } : null;
    },
    findMany: async (): Promise<DbSystemSetting[]> => Array.from(this.systemSettings.values()),
    update: async ({ where, data }: { where: { key: string }; data: { value: string } }): Promise<DbSystemSetting> => {
      const s = this.systemSettings.get(where.key);
      if (!s) throw new Error(`Setting ${where.key} not found`);
      const updated: DbSystemSetting = { ...s, value: data.value, updatedAt: new Date().toISOString() };
      this.systemSettings.set(where.key, updated);
      return { ...updated };
    },
  };

  /**
   * Atomic Transaction Implementation.
   * If any step inside the callback throws, state changes made in this transaction are reverted.
   */
  public async $transaction<T>(action: (tx: ServerDatabase) => Promise<T>): Promise<T> {
    // Create state snapshot
    const usersBackup = new Map(this.users);
    const walletsBackup = new Map(this.wallets);
    const investmentsBackup = new Map(this.investments);
    const rewardCyclesBackup = new Map(this.rewardCycles);
    const transactionsBackup = new Map(this.transactions);
    const referralRewardsBackup = new Map(this.referralRewards);
    const referralRelationshipsBackup = new Map(this.referralRelationships);
    const paymentMethodsBackup = new Map(this.paymentMethods);
    const depositsBackup = new Map(this.deposits);
    const withdrawalsBackup = new Map(this.withdrawals);
    const webhookEventsBackup = new Map(this.webhookEvents);
    const auditLogsBackup = new Map(this.auditLogs);

    try {
      return await action(this);
    } catch (err) {
      // Rollback all changes
      this.users = usersBackup;
      this.wallets = walletsBackup;
      this.investments = investmentsBackup;
      this.rewardCycles = rewardCyclesBackup;
      this.transactions = transactionsBackup;
      this.referralRewards = referralRewardsBackup;
      this.referralRelationships = referralRelationshipsBackup;
      this.paymentMethods = paymentMethodsBackup;
      this.deposits = depositsBackup;
      this.withdrawals = withdrawalsBackup;
      this.webhookEvents = webhookEventsBackup;
      this.auditLogs = auditLogsBackup;
      throw err;
    }
  }

  /**
   * Test/Demo helper: Fast-forward the active cycle to completion.
   */
  public fastForwardActiveCycle(userId: string): DbRewardCycle | null {
    for (const cycle of this.rewardCycles.values()) {
      if (cycle.userId === userId && cycle.status === 'RUNNING') {
        const now = new Date();
        const updated: DbRewardCycle = {
          ...cycle,
          cycleStartedAt: new Date(now.getTime() - 25 * 3600000).toISOString(),
          cycleEndsAt: new Date(now.getTime() - 1000).toISOString(), // 1 second ago -> complete!
          status: 'RUNNING',
          updatedAt: now.toISOString(),
        };
        this.rewardCycles.set(cycle.id, updated);
        return { ...updated };
      }
    }
    return null;
  }
}

export const serverDb = new ServerDatabase();
