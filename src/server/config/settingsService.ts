import { serverDb } from '../db';

export interface ReferralTierSetting {
  level: number;
  percentage: number;
  active: boolean;
}

export class SettingsService {
  /**
   * Authoritative cycle duration in hours from server settings (never hardcoded)
   */
  static async getCycleDurationHours(): Promise<number> {
    const setting = await serverDb.systemSetting.findUnique({ where: { key: 'CYCLE_DURATION_HOURS' } });
    if (!setting) return 24;
    const val = parseFloat(setting.value);
    return isNaN(val) || val <= 0 ? 24 : val;
  }

  /**
   * Configurable Missed Claim Policy: CLAIM_REQUIRED | AUTO_CLAIM | EXPIRE_UNCLAIMED
   */
  static async getMissedClaimPolicy(): Promise<'CLAIM_REQUIRED' | 'AUTO_CLAIM' | 'EXPIRE_UNCLAIMED'> {
    const setting = await serverDb.systemSetting.findUnique({ where: { key: 'MISSED_CLAIM_POLICY' } });
    if (!setting) return 'CLAIM_REQUIRED';
    if (setting.value === 'AUTO_CLAIM' || setting.value === 'EXPIRE_UNCLAIMED') {
      return setting.value;
    }
    return 'CLAIM_REQUIRED';
  }

  /**
   * Configurable Active Referral Levels (1 to 5, default 3)
   */
  static async getActiveReferralLevels(): Promise<number> {
    const setting = await serverDb.systemSetting.findUnique({ where: { key: 'REFERRAL_ACTIVE_LEVELS' } });
    if (!setting) return 3;
    const val = parseInt(setting.value, 10);
    return Math.max(1, Math.min(5, isNaN(val) ? 3 : val));
  }

  /**
   * Configurable Referral Percentages per level
   */
  static async getReferralPercentages(): Promise<ReferralTierSetting[]> {
    const setting = await serverDb.systemSetting.findUnique({ where: { key: 'REFERRAL_PERCENTAGES' } });
    const defaultTiers: ReferralTierSetting[] = [
      { level: 1, percentage: 7.0, active: true },
      { level: 2, percentage: 3.0, active: true },
      { level: 3, percentage: 1.5, active: true },
      { level: 4, percentage: 0.5, active: false },
      { level: 5, percentage: 0.25, active: false },
    ];
    if (!setting) return defaultTiers;
    try {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Fallback
    }
    return defaultTiers;
  }

  /**
   * Configurable Referral Qualifying Trigger
   */
  static async getReferralQualifyingTrigger(): Promise<string> {
    const setting = await serverDb.systemSetting.findUnique({ where: { key: 'REFERRAL_QUALIFYING_TRIGGER' } });
    return setting?.value || 'ELIGIBLE_INVESTMENT';
  }

  /**
   * Deposit Configuration
   */
  static async getDepositSettings() {
    const [minSetting, maxSetting, feeSetting] = await Promise.all([
      serverDb.systemSetting.findUnique({ where: { key: 'DEPOSIT_MIN' } }),
      serverDb.systemSetting.findUnique({ where: { key: 'DEPOSIT_MAX' } }),
      serverDb.systemSetting.findUnique({ where: { key: 'DEPOSIT_FEE_PCT' } }),
    ]);

    return {
      minDeposit: minSetting?.value || '10.00',
      maxDeposit: maxSetting?.value || '100000.00',
      feePct: feeSetting?.value || '0.00',
    };
  }

  /**
   * Withdrawal Configuration
   */
  static async getWithdrawalSettings() {
    const [minSetting, maxSetting, fixedFeeSetting, pctFeeSetting, enabledSetting] = await Promise.all([
      serverDb.systemSetting.findUnique({ where: { key: 'WITHDRAWAL_MIN' } }),
      serverDb.systemSetting.findUnique({ where: { key: 'WITHDRAWAL_MAX' } }),
      serverDb.systemSetting.findUnique({ where: { key: 'WITHDRAWAL_FEE_FIXED' } }),
      serverDb.systemSetting.findUnique({ where: { key: 'WITHDRAWAL_FEE_PCT' } }),
      serverDb.systemSetting.findUnique({ where: { key: 'WITHDRAWAL_ENABLED' } }),
    ]);

    return {
      minWithdrawal: minSetting?.value || '20.00',
      maxWithdrawal: maxSetting?.value || '50000.00',
      fixedFee: fixedFeeSetting?.value || '1.00',
      pctFee: pctFeeSetting?.value || '1.00',
      enabled: enabledSetting?.value !== 'false',
    };
  }

  /**
   * Network Status Check
   */
  static async isNetworkEnabled(network: 'TRC20' | 'BEP20'): Promise<boolean> {
    const key = network.toUpperCase() === 'TRC20' ? 'NETWORK_TRC20_ENABLED' : 'NETWORK_BEP20_ENABLED';
    const setting = await serverDb.systemSetting.findUnique({ where: { key } });
    return setting?.value !== 'false';
  }

  /**
   * Public settings bundle for frontend hydration
   */
  static async getPublicSettings() {
    const [
      durationHours,
      missedPolicy,
      activeLevels,
      tiers,
      trigger,
      depositSettings,
      withdrawalSettings,
      trc20Enabled,
      bep20Enabled,
    ] = await Promise.all([
      this.getCycleDurationHours(),
      this.getMissedClaimPolicy(),
      this.getActiveReferralLevels(),
      this.getReferralPercentages(),
      this.getReferralQualifyingTrigger(),
      this.getDepositSettings(),
      this.getWithdrawalSettings(),
      this.isNetworkEnabled('TRC20'),
      this.isNetworkEnabled('BEP20'),
    ]);

    return {
      cycleDurationHours: durationHours,
      missedClaimPolicy: missedPolicy,
      activeReferralLevels: activeLevels,
      referralTiers: tiers,
      referralTrigger: trigger,
      deposit: depositSettings,
      withdrawal: withdrawalSettings,
      networks: {
        TRC20: trc20Enabled,
        BEP20: bep20Enabled,
      },
      serverTime: new Date().toISOString(),
    };
  }
}
