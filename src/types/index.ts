/**
 * MinePro - Core Application Types & Architecture Interfaces
 * STEP 1: Foundation & Blueprint
 */

export type PlatformRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'BANNED';

export type PlanColorVariant = 'green' | 'orange';

export interface PlanConfig {
  id: string;
  slug: string;
  name: string;
  tierBadge: string;
  colorVariant: PlanColorVariant;
  minDeposit: number;
  maxDeposit: number;
  dailyRatePct: number;
  cycleDurationHours: number;
  isLifetime: boolean;
  durationDays?: number;
  features: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: PlatformRole;
  status: UserStatus;
  referralCode: string;
  referredByCode?: string;
  avatarUrl?: string;
  walletBalance: number;
  totalInvested: number;
  totalEarnings: number;
  todayEarnings: number;
  createdAt: string;
}

export interface ActiveMiningCycle {
  id: string;
  planName: string;
  planBadge: string;
  investedAmount: number;
  dailyProfitRate: number; // in %
  dailyProfitAmount: number;
  cycleDurationSeconds: number; // 86400 (24 hrs)
  remainingSeconds: number;
  status: 'RUNNING' | 'ELIGIBLE_FOR_CLAIM' | 'CLAIMED' | 'MISSED';
  serverCycleEndsAt: string; // ISO timestamp
}

export interface ReferralTierConfig {
  level: number;
  percentage: number;
  active: boolean;
  description: string;
}

export interface PlatformConfigState {
  platformName: string;
  tagline: string;
  supportEmail: string;
  maintenanceMode: boolean;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFeePct: number;
  cycleDurationHours: number;
  claimWindowHours: number;
  referralEnabled: boolean;
  activeReferralLevels: number;
  referralLevels: ReferralTierConfig[];
  networks: {
    trc20Enabled: boolean;
    bep20Enabled: boolean;
  };
}

export type LayoutMode = 'public' | 'auth' | 'user' | 'admin' | 'design-system' | 'blueprint';
