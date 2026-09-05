/**
 * MinePro - Centralized Platform & Financial Settings Architecture
 * 
 * IMPORTANT ARCHITECTURAL REQUIREMENT:
 * No financial or operational settings are hardcoded into business logic.
 * In production, these are loaded dynamically from the PostgreSQL SystemSetting table.
 * This file provides default configurations, validation schemas, and hydration helpers.
 */

import { PlatformConfigState } from '../types';

export const DEFAULT_PLATFORM_CONFIG: PlatformConfigState = {
  platformName: 'MinePro',
  tagline: 'Mine Today, Earn Tomorrow',
  supportEmail: 'support@minepro.network',
  maintenanceMode: false,
  
  // Configurable Financial Limits (never hardcoded in logic)
  minDeposit: 10.0,
  maxDeposit: 50000.0,
  minWithdrawal: 50.0,
  maxWithdrawal: 25000.0,
  withdrawalFeePct: 2.0, // 2% dynamic withdrawal fee
  
  // Authoritative Reward Cycle Configuration
  cycleDurationHours: 24,
  claimWindowHours: 48,
  
  // Dynamic Multi-Level Referral Architecture (Levels 1 to 5)
  referralEnabled: true,
  activeReferralLevels: 3,
  referralLevels: [
    { level: 1, percentage: 7.0, active: true, description: 'Direct referrals reward percentage' },
    { level: 2, percentage: 3.0, active: true, description: 'Secondary network referrals reward percentage' },
    { level: 3, percentage: 1.5, active: true, description: 'Tier 3 network referrals reward percentage' },
    { level: 4, percentage: 0.5, active: false, description: 'Tier 4 extended affiliate network' },
    { level: 5, percentage: 0.25, active: false, description: 'Tier 5 top tier affiliate network' },
  ],

  // Supported Blockchain Networks
  networks: {
    trc20Enabled: true,
    bep20Enabled: true,
  },
};

/**
 * Standard plan tiers from the MinePro blueprint design
 * Configurable via admin panel in future steps
 */
export const DEFAULT_PLANS = [
  {
    id: 'plan_starter',
    slug: 'starter',
    name: 'Starter',
    tierBadge: 'Starter',
    colorVariant: 'green' as const,
    minDeposit: 10,
    maxDeposit: 99,
    dailyRatePct: 2.0,
    cycleDurationHours: 24,
    isLifetime: true,
    features: [
      'Daily 2.00% Rewards',
      '24-Hour Claim Cycle',
      'Standard TRC20 / BEP20 Support',
      '24/7 Platform Status Monitor',
      'Transparent Blockchain Verification',
    ],
  },
  {
    id: 'plan_basic',
    slug: 'basic',
    name: 'Basic',
    tierBadge: 'Basic',
    colorVariant: 'orange' as const,
    minDeposit: 100,
    maxDeposit: 499,
    dailyRatePct: 2.0,
    cycleDurationHours: 24,
    isLifetime: true,
    features: [
      'Daily 2.00% Rewards',
      '24-Hour Claim Cycle',
      'Priority Mining Node Allocation',
      'Multi-Level Referral Qualification',
      'Automated Performance Tracker',
    ],
  },
  {
    id: 'plan_standard',
    slug: 'standard',
    name: 'Standard',
    tierBadge: 'Standard',
    colorVariant: 'green' as const,
    minDeposit: 500,
    maxDeposit: 1499,
    dailyRatePct: 3.0,
    cycleDurationHours: 24,
    isLifetime: true,
    features: [
      'Daily 3.00% Rewards',
      '24-Hour Claim Cycle',
      'High-Speed Rig Cluster Hashrate',
      'Affiliate Multiplier Access',
      'Dedicated Customer Care',
    ],
  },
  {
    id: 'plan_advanced',
    slug: 'advanced',
    name: 'Advanced',
    tierBadge: 'Advanced',
    colorVariant: 'orange' as const,
    minDeposit: 1500,
    maxDeposit: 4999,
    dailyRatePct: 3.5,
    cycleDurationHours: 24,
    isLifetime: true,
    features: [
      'Daily 3.50% Rewards',
      '24-Hour Claim Cycle',
      'Enterprise Mining Node Cluster',
      'Full 5-Level Referral Access',
      'Direct Account Manager',
    ],
  },
  {
    id: 'plan_premium',
    slug: 'premium',
    name: 'Premium',
    tierBadge: 'Premium',
    colorVariant: 'green' as const,
    minDeposit: 5000,
    maxDeposit: 9999,
    dailyRatePct: 4.0,
    cycleDurationHours: 24,
    isLifetime: true,
    features: [
      'Daily 4.00% Rewards',
      '24-Hour Claim Cycle',
      'Maximum Institutional Hashrate',
      'VIP Priority Payout Queue',
      'Dedicated 24/7 Senior Concierge',
    ],
  },
];
