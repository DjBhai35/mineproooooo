import Decimal from 'decimal.js';
import { serverDb, DbTransaction } from '../db';
import { WalletService } from './walletService';

export interface LedgerFilterOptions {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class LedgerService {
  /**
   * Fetch paginated and filtered transactions for a user.
   */
  static async getUserTransactions(
    userId: string,
    options: LedgerFilterOptions = {}
  ): Promise<{
    transactions: DbTransaction[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { type, status, page = 1, limit = 20 } = options;

    const allTrx = await serverDb.transaction.findMany({ where: { userId } });

    // Filter by type if specified and not 'ALL'
    let filtered = allTrx;
    if (type && type.toUpperCase() !== 'ALL') {
      filtered = filtered.filter((t) => {
        if (type.toUpperCase() === 'INVESTMENT') {
          return t.type === 'PLAN_INVESTMENT' || t.type === 'INVESTMENT';
        }
        if (type.toUpperCase() === 'REWARD') {
          return t.type === 'CYCLE_REWARD' || t.type === 'REWARD';
        }
        return t.type === type.toUpperCase();
      });
    }

    // Filter by status if specified and not 'ALL'
    if (status && status.toUpperCase() !== 'ALL') {
      filtered = filtered.filter((t) => t.status === status.toUpperCase());
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      transactions: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Verify balance integrity mathematically.
   * Compares the stored wallet balance against the sum of all completed ledger transactions.
   * Total = Deposits - Withdrawals - Investments + Rewards + Referral Rewards + Refunds + Adjustments.
   */
  static async verifyBalanceIntegrity(userId: string): Promise<{
    isConsistent: boolean;
    storedAvailableBalance: string;
    storedLockedBalance: string;
    calculatedAvailableBalance: string;
    discrepancy: string;
    breakdown: {
      totalDeposited: string;
      totalWithdrawn: string;
      totalInvested: string;
      totalRewards: string;
      totalReferral: string;
      totalRefunds: string;
    };
  }> {
    const wallet = await WalletService.getWallet(userId);
    const transactions = await serverDb.transaction.findMany({ where: { userId } });

    let sumDeposits = new Decimal(0);
    let sumWithdrawalsCompleted = new Decimal(0);
    let sumInvestments = new Decimal(0);
    let sumRewards = new Decimal(0);
    let sumReferrals = new Decimal(0);
    let sumRefunds = new Decimal(0);
    let sumAdjustments = new Decimal(0);

    for (const tx of transactions) {
      if (tx.status !== 'COMPLETED') continue;

      const amt = new Decimal(tx.amount);

      switch (tx.type) {
        case 'DEPOSIT':
          sumDeposits = sumDeposits.plus(amt);
          break;
        case 'WITHDRAWAL':
          sumWithdrawalsCompleted = sumWithdrawalsCompleted.plus(amt);
          break;
        case 'PLAN_INVESTMENT':
        case 'INVESTMENT':
          sumInvestments = sumInvestments.plus(amt);
          break;
        case 'CYCLE_REWARD':
        case 'REWARD':
          sumRewards = sumRewards.plus(amt);
          break;
        case 'REFERRAL_REWARD':
          sumReferrals = sumReferrals.plus(amt);
          break;
        case 'REFUND':
          sumRefunds = sumRefunds.plus(amt);
          break;
        case 'ADMIN_ADJUSTMENT':
          sumAdjustments = sumAdjustments.plus(amt);
          break;
      }
    }

    // Available balance = Deposits + Rewards + Referrals + Refunds + Adjustments - Investments - WithdrawalsCompleted - LockedBalance
    const storedAvailable = new Decimal(wallet.balance);
    const storedLocked = new Decimal(wallet.lockedBalance || '0');

    const totalCredits = sumDeposits.plus(sumRewards).plus(sumReferrals).plus(sumRefunds).plus(sumAdjustments);
    const totalDebits = sumInvestments.plus(sumWithdrawalsCompleted).plus(storedLocked);
    const calculatedAvailable = totalCredits.minus(totalDebits);

    const discrepancy = storedAvailable.minus(calculatedAvailable).abs();
    const isConsistent = discrepancy.lessThan(new Decimal('0.00000001'));

    return {
      isConsistent,
      storedAvailableBalance: storedAvailable.toFixed(8),
      storedLockedBalance: storedLocked.toFixed(8),
      calculatedAvailableBalance: calculatedAvailable.toFixed(8),
      discrepancy: discrepancy.toFixed(8),
      breakdown: {
        totalDeposited: sumDeposits.toFixed(8),
        totalWithdrawn: sumWithdrawalsCompleted.toFixed(8),
        totalInvested: sumInvestments.toFixed(8),
        totalRewards: sumRewards.toFixed(8),
        totalReferral: sumReferrals.toFixed(8),
        totalRefunds: sumRefunds.toFixed(8),
      },
    };
  }
}
