import Decimal from 'decimal.js';
import { serverDb, DbWallet, DbDeposit, DbWithdrawal, DbTransaction, DbPaymentMethod } from '../db';
import { SettingsService } from '../config/settingsService';
import { RewardCycleEngine } from './rewardCycleEngine';
import { ReferralEngine } from './referralEngine';

// Ensure standard financial precision
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export class WalletService {
  /**
   * Fetch a user's wallet with guaranteed defaults and Decimal precision formatting.
   */
  static async getWallet(userId: string): Promise<DbWallet> {
    let wallet = await serverDb.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await serverDb.wallet.create({
        data: {
          userId,
          balance: '0.00000000',
          totalDeposited: '0.00000000',
          totalWithdrawn: '0.00000000',
          totalInvested: '0.00000000',
          totalEarned: '0.00000000',
          totalReferral: '0.00000000',
          lockedBalance: '0.00000000',
        },
      });
    }
    return wallet;
  }

  /**
   * Complete financial breakdown for the authenticated user.
   */
  static async getFinancialSummary(userId: string) {
    const wallet = await this.getWallet(userId);
    const [deposits, withdrawals, transactions] = await Promise.all([
      serverDb.deposit.findMany({ where: { userId } }),
      serverDb.withdrawal.findMany({ where: { userId } }),
      serverDb.transaction.findMany({ where: { userId } }),
    ]);

    const pendingDeposits = deposits.filter((d) => d.status === 'PENDING');
    const pendingWithdrawals = withdrawals.filter((w) => w.status === 'PENDING' || w.status === 'PROCESSING');

    const availableBal = new Decimal(wallet.balance);
    const lockedBal = new Decimal(wallet.lockedBalance || '0.00000000');
    const totalBalance = availableBal.plus(lockedBal);

    return {
      availableBalance: availableBal.toFixed(8),
      lockedBalance: lockedBal.toFixed(8),
      totalBalance: totalBalance.toFixed(8),
      totalDeposited: new Decimal(wallet.totalDeposited).toFixed(8),
      totalWithdrawn: new Decimal(wallet.totalWithdrawn).toFixed(8),
      totalInvested: new Decimal(wallet.totalInvested).toFixed(8),
      totalEarned: new Decimal(wallet.totalEarned).toFixed(8),
      totalReferral: new Decimal(wallet.totalReferral).toFixed(8),
      pendingDepositsCount: pendingDeposits.length,
      pendingWithdrawalsCount: pendingWithdrawals.length,
      recentTransactions: transactions.slice(0, 5),
    };
  }

  /**
   * Fetch active, public payment methods for deposits (TRC20 / BEP20)
   */
  static async getActivePaymentMethods(): Promise<DbPaymentMethod[]> {
    return serverDb.paymentMethod.findMany({ where: { isEnabled: true } });
  }

  /**
   * Validate cryptocurrency address format based on network standard
   */
  static validateAddress(network: 'TRC20' | 'BEP20', address: string): { isValid: boolean; error?: string } {
    if (!address || typeof address !== 'string') {
      return { isValid: false, error: 'Destination address is required.' };
    }
    const cleanAddr = address.trim();

    if (network === 'TRC20') {
      // Tron addresses start with 'T' and are exactly 34 base58 characters
      const trc20Regex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
      if (!trc20Regex.test(cleanAddr)) {
        return {
          isValid: false,
          error: 'Invalid TRC20 address. TRC20 addresses must start with "T" and contain exactly 34 Base58 characters.',
        };
      }
      return { isValid: true };
    }

    if (network === 'BEP20') {
      // Binance Smart Chain addresses are 0x followed by 40 hex characters
      const bep20Regex = /^0x[a-fA-F0-9]{40}$/;
      if (!bep20Regex.test(cleanAddr)) {
        return {
          isValid: false,
          error: 'Invalid BEP20 address. BEP20 addresses must start with "0x" and contain exactly 40 hexadecimal characters.',
        };
      }
      return { isValid: true };
    }

    return { isValid: false, error: `Unsupported network: ${network}` };
  }

  /**
   * Validate blockchain transaction hash format
   */
  static validateTxHash(network: 'TRC20' | 'BEP20', txHash: string): { isValid: boolean; error?: string } {
    if (!txHash || typeof txHash !== 'string') {
      return { isValid: false, error: 'Transaction hash is required.' };
    }
    const cleanHash = txHash.trim();

    // Standard 64-hex char hash (with optional 0x prefix)
    const hashRegex = /^(0x)?[a-fA-F0-9]{64}$/;
    if (!hashRegex.test(cleanHash)) {
      return {
        isValid: false,
        error: 'Invalid transaction hash. Must be a valid 64-character hexadecimal transaction identifier.',
      };
    }
    return { isValid: true };
  }

  /**
   * Calculate withdrawal fee with Decimal precision based on server settings
   */
  static async calculateWithdrawalFee(amount: string | Decimal): Promise<{
    fee: string;
    netAmount: string;
    feeBreakdown: { fixedFee: string; pctFee: string; pctRate: string };
  }> {
    const amountDec = new Decimal(amount);
    if (amountDec.isNaN() || amountDec.lessThanOrEqualTo(0)) {
      throw new Error('Withdrawal amount must be a positive number.');
    }

    const settings = await SettingsService.getWithdrawalSettings();
    const fixedFeeDec = new Decimal(settings.fixedFee);
    const pctRateDec = new Decimal(settings.pctFee);
    const pctFeeDec = amountDec.times(pctRateDec).dividedBy(100);

    const totalFeeDec = fixedFeeDec.plus(pctFeeDec).toDecimalPlaces(8, Decimal.ROUND_HALF_UP);
    const netAmountDec = amountDec.minus(totalFeeDec).toDecimalPlaces(8, Decimal.ROUND_HALF_UP);

    return {
      fee: totalFeeDec.toFixed(8),
      netAmount: netAmountDec.toFixed(8),
      feeBreakdown: {
        fixedFee: fixedFeeDec.toFixed(8),
        pctFee: pctFeeDec.toFixed(8),
        pctRate: pctRateDec.toFixed(2),
      },
    };
  }

  /**
   * Manual Deposit Submission
   * Status: PENDING. Does NOT credit balance until approved by admin.
   * Prevents duplicate txHash submissions.
   */
  static async submitManualDeposit(params: {
    userId: string;
    paymentMethodId: string;
    network: 'TRC20' | 'BEP20';
    amount: string;
    txHash: string;
    ipAddress?: string;
  }): Promise<DbDeposit> {
    const { userId, paymentMethodId, network, amount, txHash, ipAddress } = params;

    // 1. Verify user
    const user = await serverDb.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== 'ACTIVE') {
      throw new Error('USER_NOT_ELIGIBLE: Account is inactive or does not exist.');
    }

    // 2. Verify network is operational
    const networkActive = await SettingsService.isNetworkEnabled(network);
    if (!networkActive) {
      throw new Error(`NETWORK_DISABLED: The ${network} network is currently undergoing scheduled maintenance.`);
    }

    // 3. Verify payment method
    const pm = await serverDb.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!pm || !pm.isEnabled || pm.network.toUpperCase() !== network.toUpperCase()) {
      throw new Error('INVALID_PAYMENT_METHOD: Selected payment method is unavailable.');
    }

    // 4. Validate amount with Decimal
    let amountDec: Decimal;
    try {
      amountDec = new Decimal(amount);
    } catch {
      throw new Error('INVALID_AMOUNT: Deposit amount format is invalid.');
    }

    if (amountDec.isNaN() || amountDec.lessThanOrEqualTo(0)) {
      throw new Error('INVALID_AMOUNT: Deposit amount must be greater than zero.');
    }

    const minDepositDec = new Decimal(pm.minDeposit);
    if (amountDec.lessThan(minDepositDec)) {
      throw new Error(`AMOUNT_BELOW_MINIMUM: Minimum deposit for ${network} is ${minDepositDec.toFixed(2)} USDT.`);
    }

    if (pm.maxDeposit) {
      const maxDepositDec = new Decimal(pm.maxDeposit);
      if (amountDec.greaterThan(maxDepositDec)) {
        throw new Error(`AMOUNT_EXCEEDS_MAXIMUM: Maximum deposit per transaction is ${maxDepositDec.toFixed(2)} USDT.`);
      }
    }

    // 5. Validate txHash format
    const txValidation = this.validateTxHash(network, txHash);
    if (!txValidation.isValid) {
      throw new Error(`INVALID_TX_HASH: ${txValidation.error}`);
    }

    // 6. Check duplicate txHash
    const cleanHash = txHash.trim();
    const existingDeposit = await serverDb.deposit.findFirst({ where: { txHash: cleanHash } });
    if (existingDeposit) {
      throw new Error(`DUPLICATE_TX_HASH: Transaction hash ${cleanHash} has already been submitted.`);
    }

    // 7. Create Deposit in PENDING status
    const now = new Date().toISOString();
    const deposit = await serverDb.deposit.create({
      data: {
        userId,
        paymentMethodId: pm.id,
        network,
        amount: amountDec.toFixed(8),
        txHash: cleanHash,
        status: 'PENDING',
        submittedAt: now,
      },
    });

    // 8. Create audit log
    await serverDb.auditLog.create({
      data: {
        actorId: userId,
        actorRole: user.role,
        action: 'SUBMIT_MANUAL_DEPOSIT',
        entity: 'Deposit',
        entityId: deposit.id,
        newState: { ...deposit },
        reference: deposit.txHash,
        ipAddress: ipAddress || null,
      },
    });

    return deposit;
  }

  /**
   * Admin Deposit Approval Workflow
   * Atomically credits balance and updates transaction history.
   */
  static async approveDeposit(params: {
    depositId: string;
    adminId: string;
    ipAddress?: string;
  }): Promise<{ deposit: DbDeposit; wallet: DbWallet; transaction: DbTransaction }> {
    const { depositId, adminId, ipAddress } = params;

    return serverDb.$transaction(async (tx) => {
      // 1. Verify admin role
      const admin = await tx.user.findUnique({ where: { id: adminId } });
      if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
        throw new Error('UNAUTHORIZED: Administrative credentials required.');
      }

      // 2. Fetch deposit
      const deposit = await tx.deposit.findUnique({ where: { id: depositId } });
      if (!deposit) {
        throw new Error('DEPOSIT_NOT_FOUND: Deposit request does not exist.');
      }
      if (deposit.status !== 'PENDING') {
        throw new Error(`DEPOSIT_ALREADY_PROCESSED: Deposit is already ${deposit.status}.`);
      }

      // 3. Fetch user wallet
      const wallet = await tx.wallet.findUnique({ where: { userId: deposit.userId } });
      if (!wallet) {
        throw new Error(`WALLET_NOT_FOUND: Wallet for user ${deposit.userId} not found.`);
      }

      const depositAmountDec = new Decimal(deposit.amount);
      const currentBalanceDec = new Decimal(wallet.balance);
      const currentDepositedDec = new Decimal(wallet.totalDeposited);

      const newBalance = currentBalanceDec.plus(depositAmountDec).toFixed(8);
      const newTotalDeposited = currentDepositedDec.plus(depositAmountDec).toFixed(8);

      // 4. Create completed transaction in ledger
      const transactionRef = `DEP-${deposit.id.toUpperCase()}`;
      const transaction = await tx.transaction.create({
        data: {
          reference: transactionRef,
          userId: deposit.userId,
          type: 'DEPOSIT',
          amount: depositAmountDec.toFixed(8),
          fee: '0.00000000',
          netAmount: depositAmountDec.toFixed(8),
          status: 'COMPLETED',
          description: `Deposit Approved (${deposit.network} USDT)`,
          metadata: {
            depositId: deposit.id,
            txHash: deposit.txHash,
            network: deposit.network,
            approvedBy: admin.username,
          },
        },
      });

      // 5. Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId: deposit.userId },
        data: {
          balance: newBalance,
          totalDeposited: newTotalDeposited,
        },
      });

      // 6. Update deposit record
      const now = new Date().toISOString();
      const updatedDeposit = await tx.deposit.update({
        where: { id: deposit.id },
        data: {
          status: 'COMPLETED',
          reviewedAt: now,
          reviewedBy: admin.id,
          transactionId: transaction.id,
        },
      });

      // 7. Audit log
      await tx.auditLog.create({
        data: {
          actorId: admin.id,
          actorRole: admin.role,
          action: 'APPROVE_DEPOSIT',
          entity: 'Deposit',
          entityId: deposit.id,
          previousState: { status: 'PENDING', balance: wallet.balance },
          newState: { status: 'COMPLETED', balance: newBalance, txHash: deposit.txHash },
          reference: transaction.reference,
          ipAddress: ipAddress || null,
        },
      });

      return { deposit: updatedDeposit, wallet: updatedWallet, transaction };
    });
  }

  /**
   * Admin Deposit Rejection Workflow
   * Sets status to REJECTED with reason; does not credit funds.
   */
  static async rejectDeposit(params: {
    depositId: string;
    adminId: string;
    rejectionReason: string;
    ipAddress?: string;
  }): Promise<DbDeposit> {
    const { depositId, adminId, rejectionReason, ipAddress } = params;

    const admin = await serverDb.user.findUnique({ where: { id: adminId } });
    if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
      throw new Error('UNAUTHORIZED: Administrative credentials required.');
    }

    const deposit = await serverDb.deposit.findUnique({ where: { id: depositId } });
    if (!deposit) {
      throw new Error('DEPOSIT_NOT_FOUND: Deposit request does not exist.');
    }
    if (deposit.status !== 'PENDING') {
      throw new Error(`DEPOSIT_ALREADY_PROCESSED: Deposit is already ${deposit.status}.`);
    }

    const now = new Date().toISOString();
    const updated = await serverDb.deposit.update({
      where: { id: depositId },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim() || 'Unverified blockchain transaction hash.',
        reviewedAt: now,
        reviewedBy: admin.id,
      },
    });

    await serverDb.auditLog.create({
      data: {
        actorId: admin.id,
        actorRole: admin.role,
        action: 'REJECT_DEPOSIT',
        entity: 'Deposit',
        entityId: deposit.id,
        previousState: { status: 'PENDING' },
        newState: { status: 'REJECTED', reason: updated.rejectionReason },
        reference: deposit.txHash,
        ipAddress: ipAddress || null,
      },
    });

    return updated;
  }

  /**
   * Withdrawal Request Flow
   * Locks funds immediately from available balance to prevent over-spending.
   */
  static async requestWithdrawal(params: {
    userId: string;
    network: 'TRC20' | 'BEP20';
    address: string;
    amount: string;
    ipAddress?: string;
  }): Promise<{ withdrawal: DbWithdrawal; transaction: DbTransaction; wallet: DbWallet }> {
    const { userId, network, address, amount, ipAddress } = params;

    return serverDb.$transaction(async (tx) => {
      // 1. Verify user status
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.status !== 'ACTIVE') {
        throw new Error('USER_NOT_ELIGIBLE: Account is inactive or does not exist.');
      }

      // 2. Verify global withdrawal toggle
      const settings = await SettingsService.getWithdrawalSettings();
      if (!settings.enabled) {
        throw new Error('WITHDRAWALS_DISABLED: Withdrawals are temporarily disabled for maintenance.');
      }

      // 3. Verify network status
      const networkActive = await SettingsService.isNetworkEnabled(network);
      if (!networkActive) {
        throw new Error(`NETWORK_DISABLED: The ${network} network is temporarily unavailable for withdrawals.`);
      }

      // 4. Validate destination address
      const addrValidation = this.validateAddress(network, address);
      if (!addrValidation.isValid) {
        throw new Error(`INVALID_ADDRESS: ${addrValidation.error}`);
      }

      // 5. Validate amount with Decimal
      let amountDec: Decimal;
      try {
        amountDec = new Decimal(amount);
      } catch {
        throw new Error('INVALID_AMOUNT: Withdrawal amount format is invalid.');
      }

      if (amountDec.isNaN() || amountDec.lessThanOrEqualTo(0)) {
        throw new Error('INVALID_AMOUNT: Withdrawal amount must be greater than zero.');
      }

      const minWithdrawalDec = new Decimal(settings.minWithdrawal);
      if (amountDec.lessThan(minWithdrawalDec)) {
        throw new Error(`AMOUNT_BELOW_MINIMUM: Minimum withdrawal is ${minWithdrawalDec.toFixed(2)} USDT.`);
      }

      const maxWithdrawalDec = new Decimal(settings.maxWithdrawal);
      if (amountDec.greaterThan(maxWithdrawalDec)) {
        throw new Error(`AMOUNT_EXCEEDS_MAXIMUM: Maximum withdrawal is ${maxWithdrawalDec.toFixed(2)} USDT per request.`);
      }

      // 6. Calculate fee & net amount
      const feeResult = await this.calculateWithdrawalFee(amountDec);
      const feeDec = new Decimal(feeResult.fee);
      const netAmountDec = new Decimal(feeResult.netAmount);

      if (netAmountDec.lessThanOrEqualTo(0)) {
        throw new Error('INVALID_NET_AMOUNT: Amount must be greater than the network fee.');
      }

      // 7. Check user wallet available balance
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        throw new Error('WALLET_NOT_FOUND: User wallet not found.');
      }

      const availableBalDec = new Decimal(wallet.balance);
      if (availableBalDec.lessThan(amountDec)) {
        throw new Error(
          `INSUFFICIENT_FUNDS: Available balance (${availableBalDec.toFixed(2)} USDT) is insufficient for this withdrawal (${amountDec.toFixed(2)} USDT).`
        );
      }

      // 8. Lock funds atomically: Deduct from available balance, add to lockedBalance
      const newAvailableBal = availableBalDec.minus(amountDec).toFixed(8);
      const currentLockedDec = new Decimal(wallet.lockedBalance || '0.00000000');
      const newLockedBal = currentLockedDec.plus(amountDec).toFixed(8);

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: {
          balance: newAvailableBal,
          lockedBalance: newLockedBal,
        },
      });

      // 9. Create pending withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          userId,
          network,
          address: address.trim(),
          amount: amountDec.toFixed(8),
          fee: feeDec.toFixed(8),
          netAmount: netAmountDec.toFixed(8),
          status: 'PENDING',
        },
      });

      // 10. Create pending transaction in ledger
      const transaction = await tx.transaction.create({
        data: {
          reference: `WTH-${withdrawal.id.toUpperCase()}`,
          userId,
          type: 'WITHDRAWAL',
          amount: amountDec.toFixed(8),
          fee: feeDec.toFixed(8),
          netAmount: netAmountDec.toFixed(8),
          status: 'PENDING',
          description: `Withdrawal to ${address.substring(0, 8)}... (${network})`,
          metadata: {
            withdrawalId: withdrawal.id,
            destinationAddress: address.trim(),
            network,
          },
        },
      });

      // Link transaction ID
      const finalWithdrawal = await tx.withdrawal.update({
        where: { id: withdrawal.id },
        data: { transactionId: transaction.id },
      });

      // 11. Audit log
      await tx.auditLog.create({
        data: {
          actorId: userId,
          actorRole: user.role,
          action: 'REQUEST_WITHDRAWAL',
          entity: 'Withdrawal',
          entityId: withdrawal.id,
          previousState: { balance: wallet.balance, lockedBalance: wallet.lockedBalance },
          newState: { balance: newAvailableBal, lockedBalance: newLockedBal, withdrawal: finalWithdrawal },
          reference: transaction.reference,
          ipAddress: ipAddress || null,
        },
      });

      return { withdrawal: finalWithdrawal, transaction, wallet: updatedWallet };
    });
  }

  /**
   * Admin Withdrawal Status Management
   * Supports: PROCESSING, COMPLETED (deducts locked funds & records blockchain txHash),
   * REJECTED/FAILED (unlocks funds back to available balance and records refund ledger transaction).
   */
  static async processWithdrawal(params: {
    withdrawalId: string;
    adminId: string;
    status: 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';
    txHash?: string;
    rejectionReason?: string;
    ipAddress?: string;
  }): Promise<{ withdrawal: DbWithdrawal; wallet: DbWallet; refundTransaction?: DbTransaction }> {
    const { withdrawalId, adminId, status, txHash, rejectionReason, ipAddress } = params;

    return serverDb.$transaction(async (tx) => {
      // 1. Verify admin
      const admin = await tx.user.findUnique({ where: { id: adminId } });
      if (!admin || (admin.role !== 'ADMIN' && admin.role !== 'SUPER_ADMIN')) {
        throw new Error('UNAUTHORIZED: Administrative credentials required.');
      }

      // 2. Fetch withdrawal
      const withdrawal = await tx.withdrawal.findUnique({ where: { id: withdrawalId } });
      if (!withdrawal) {
        throw new Error('WITHDRAWAL_NOT_FOUND: Withdrawal request not found.');
      }
      if (withdrawal.status === 'COMPLETED' || withdrawal.status === 'REJECTED' || withdrawal.status === 'FAILED') {
        throw new Error(`WITHDRAWAL_ALREADY_FINALIZED: Request is already marked as ${withdrawal.status}.`);
      }

      const wallet = await tx.wallet.findUnique({ where: { userId: withdrawal.userId } });
      if (!wallet) {
        throw new Error('WALLET_NOT_FOUND: User wallet not found.');
      }

      const now = new Date().toISOString();
      const amountDec = new Decimal(withdrawal.amount);
      const lockedBalDec = new Decimal(wallet.lockedBalance);
      const availableBalDec = new Decimal(wallet.balance);
      const totalWithdrawnDec = new Decimal(wallet.totalWithdrawn);

      let updatedWallet = wallet;
      let refundTransaction: DbTransaction | undefined;

      if (status === 'PROCESSING') {
        // Just advance status
        const updated = await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: { status: 'PROCESSING' },
        });

        if (withdrawal.transactionId) {
          await tx.transaction.update({
            where: { id: withdrawal.transactionId },
            data: { status: 'PROCESSING' },
          });
        }

        await tx.auditLog.create({
          data: {
            actorId: admin.id,
            actorRole: admin.role,
            action: 'MARK_WITHDRAWAL_PROCESSING',
            entity: 'Withdrawal',
            entityId: withdrawal.id,
            previousState: { status: withdrawal.status },
            newState: { status: 'PROCESSING' },
            ipAddress: ipAddress || null,
          },
        });

        return { withdrawal: updated, wallet: updatedWallet };
      }

      if (status === 'COMPLETED') {
        // Require or generate blockchain txHash
        const finalTxHash = txHash?.trim() || `0x${Math.random().toString(16).substring(2)}${Date.now().toString(16)}`;

        // Release locked funds and increment totalWithdrawn
        const newLockedBal = lockedBalDec.minus(amountDec).toFixed(8);
        const newTotalWithdrawn = totalWithdrawnDec.plus(amountDec).toFixed(8);

        updatedWallet = await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            lockedBalance: newLockedBal,
            totalWithdrawn: newTotalWithdrawn,
          },
        });

        const updated = await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status: 'COMPLETED',
            txHash: finalTxHash,
            processedAt: now,
            processedBy: admin.id,
          },
        });

        if (withdrawal.transactionId) {
          await tx.transaction.update({
            where: { id: withdrawal.transactionId },
            data: {
              status: 'COMPLETED',
              metadata: {
                ...withdrawal,
                txHash: finalTxHash,
                completedAt: now,
              },
            },
          });
        }

        await tx.auditLog.create({
          data: {
            actorId: admin.id,
            actorRole: admin.role,
            action: 'COMPLETE_WITHDRAWAL',
            entity: 'Withdrawal',
            entityId: withdrawal.id,
            previousState: { status: withdrawal.status, lockedBalance: wallet.lockedBalance },
            newState: { status: 'COMPLETED', txHash: finalTxHash, lockedBalance: newLockedBal },
            reference: finalTxHash,
            ipAddress: ipAddress || null,
          },
        });

        return { withdrawal: updated, wallet: updatedWallet };
      }

      if (status === 'REJECTED' || status === 'FAILED') {
        // Safe refund: release locked funds back to Available balance
        const reason = rejectionReason?.trim() || 'Administrative rejection or invalid address.';
        const newLockedBal = lockedBalDec.minus(amountDec).toFixed(8);
        const newAvailableBal = availableBalDec.plus(amountDec).toFixed(8);

        updatedWallet = await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            lockedBalance: newLockedBal,
            balance: newAvailableBal,
          },
        });

        const updated = await tx.withdrawal.update({
          where: { id: withdrawalId },
          data: {
            status,
            rejectionReason: reason,
            processedAt: now,
            processedBy: admin.id,
          },
        });

        // Update original transaction to REJECTED/FAILED
        if (withdrawal.transactionId) {
          await tx.transaction.update({
            where: { id: withdrawal.transactionId },
            data: {
              status: status === 'REJECTED' ? 'REJECTED' : 'FAILED',
              metadata: {
                ...withdrawal,
                rejectionReason: reason,
                processedAt: now,
              },
            },
          });
        }

        // Create explicit REFUND transaction in ledger for auditability
        refundTransaction = await tx.transaction.create({
          data: {
            reference: `REFUND-WTH-${withdrawal.id.toUpperCase()}`,
            userId: withdrawal.userId,
            type: 'REFUND',
            amount: amountDec.toFixed(8),
            fee: '0.00000000',
            netAmount: amountDec.toFixed(8),
            status: 'COMPLETED',
            description: `Refund: Withdrawal #${withdrawal.id} rejected (${reason})`,
            metadata: {
              originalWithdrawalId: withdrawal.id,
              rejectionReason: reason,
              refundedBy: admin.id,
            },
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: admin.id,
            actorRole: admin.role,
            action: status === 'REJECTED' ? 'REJECT_WITHDRAWAL' : 'FAIL_WITHDRAWAL',
            entity: 'Withdrawal',
            entityId: withdrawal.id,
            previousState: { status: withdrawal.status, balance: wallet.balance, lockedBalance: wallet.lockedBalance },
            newState: { status, balance: newAvailableBal, lockedBalance: newLockedBal, reason },
            reference: refundTransaction.reference,
            ipAddress: ipAddress || null,
          },
        });

        return { withdrawal: updated, wallet: updatedWallet, refundTransaction };
      }

      throw new Error(`UNSUPPORTED_STATUS: Status ${status} is not supported.`);
    });
  }

  /**
   * Plan Investment Activated from Available Wallet Balance
   * Seamlessly bridges wallet ledger with investment and referral engines.
   */
  static async investFromWallet(params: {
    userId: string;
    planId: string;
    amount: string;
    ipAddress?: string;
  }) {
    const { userId, planId, amount, ipAddress } = params;

    return serverDb.$transaction(async (tx) => {
      // 1. Verify user
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user || user.status !== 'ACTIVE') {
        throw new Error('USER_NOT_ELIGIBLE: Account is inactive or does not exist.');
      }

      // 2. Fetch Plan
      const plan = await tx.plan.findUnique({ where: { id: planId } });
      if (!plan || plan.status !== 'ACTIVE') {
        throw new Error('PLAN_UNAVAILABLE: The selected investment plan is inactive.');
      }

      const amountDec = new Decimal(amount);
      const minDepositDec = new Decimal(plan.minDeposit);
      const maxDepositDec = new Decimal(plan.maxDeposit);

      if (amountDec.lessThan(minDepositDec)) {
        throw new Error(`INVESTMENT_TOO_LOW: Minimum amount for ${plan.name} is ${minDepositDec.toFixed(2)} USDT.`);
      }
      if (amountDec.greaterThan(maxDepositDec)) {
        throw new Error(`INVESTMENT_TOO_HIGH: Maximum amount for ${plan.name} is ${maxDepositDec.toFixed(2)} USDT.`);
      }

      // 3. Check and deduct wallet balance
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet) {
        throw new Error('WALLET_NOT_FOUND: User wallet not found.');
      }

      const currentBalanceDec = new Decimal(wallet.balance);
      if (currentBalanceDec.lessThan(amountDec)) {
        throw new Error(
          `INSUFFICIENT_FUNDS: Available balance (${currentBalanceDec.toFixed(2)} USDT) is insufficient for this investment (${amountDec.toFixed(2)} USDT).`
        );
      }

      const newBalance = currentBalanceDec.minus(amountDec).toFixed(8);
      const newTotalInvested = new Decimal(wallet.totalInvested).plus(amountDec).toFixed(8);

      await tx.wallet.update({
        where: { userId },
        data: {
          balance: newBalance,
          totalInvested: newTotalInvested,
        },
      });

      // 4. Calculate daily reward with Decimal
      const dailyReward = RewardCycleEngine.calculateReward(amountDec.toFixed(8), plan.dailyRatePct);

      // 5. Create investment record
      const now = new Date();
      const cycleHours = await SettingsService.getCycleDurationHours();
      const nextClaimDate = new Date(now.getTime() + cycleHours * 3600000);

      const investment = await tx.investment.create({
        data: {
          userId,
          planId: plan.id,
          amount: amountDec.toFixed(8),
          dailyReward: dailyReward.toFixed(8),
          totalEarned: '0.00000000',
          claimsCount: 0,
          status: 'ACTIVE',
          activatedAt: now.toISOString(),
          nextClaimAt: nextClaimDate.toISOString(),
          lastClaimAt: null,
        },
      });

      // 6. Create initial running cycle
      const cycle = await tx.rewardCycle.create({
        data: {
          userId,
          investmentId: investment.id,
          cycleNumber: 1,
          rewardAmount: dailyReward.toFixed(8),
          cycleStartedAt: now.toISOString(),
          cycleEndsAt: nextClaimDate.toISOString(),
          status: 'RUNNING',
          claimReference: null,
          claimedAt: null,
          claimedIp: null,
        },
      });

      // 7. Ledger transaction
      const transaction = await tx.transaction.create({
        data: {
          reference: `INV-${investment.id.toUpperCase()}`,
          userId,
          type: 'PLAN_INVESTMENT',
          amount: amountDec.toFixed(8),
          fee: '0.00000000',
          netAmount: amountDec.toFixed(8),
          status: 'COMPLETED',
          description: `Activated ${plan.name} Node (${amountDec.toFixed(2)} USDT)`,
          metadata: {
            planId: plan.id,
            investmentId: investment.id,
            dailyRatePct: plan.dailyRatePct,
          },
        },
      });

      // 8. Process Referral Rewards for Uplines
      const referralResults = await ReferralEngine.processQualifyingRewards(
        userId,
        amountDec.toFixed(8),
        investment.id
      );

      // 9. Audit Log
      await tx.auditLog.create({
        data: {
          actorId: userId,
          actorRole: user.role,
          action: 'PLAN_INVESTMENT',
          entity: 'Investment',
          entityId: investment.id,
          previousState: { balance: wallet.balance },
          newState: { balance: newBalance, investmentId: investment.id },
          reference: transaction.reference,
          ipAddress: ipAddress || null,
        },
      });

      return {
        investment,
        cycle,
        transaction,
        referralResults,
        newBalance,
      };
    });
  }
}
