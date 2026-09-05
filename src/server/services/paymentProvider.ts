import { serverDb, DbWebhookEvent } from '../db';
import { WalletService } from './walletService';

export interface DepositIntentParams {
  userId: string;
  network: 'TRC20' | 'BEP20';
  amount: string;
}

export interface DepositIntentResult {
  intentId: string;
  network: 'TRC20' | 'BEP20';
  receivingAddress: string;
  expectedAmount: string;
  expiresAt: string;
  qrCodeUrl: string;
}

export interface WithdrawalDispatchParams {
  withdrawalId: string;
  network: 'TRC20' | 'BEP20';
  destinationAddress: string;
  amount: string;
}

export interface WithdrawalDispatchResult {
  dispatchId: string;
  txHash?: string;
  status: 'QUEUED' | 'CONFIRMED' | 'FAILED';
  rawResponse?: Record<string, any>;
}

/**
 * Base abstract class for payment network providers.
 * Allows seamless plugging of automated gateways (e.g., TronGrid node, BSC RPC, NowPayments, BinancePay)
 * alongside manual workflows without altering the core wallet/ledger foundation.
 */
export abstract class PaymentProvider {
  abstract readonly providerName: string;

  abstract createDepositIntent(params: DepositIntentParams): Promise<DepositIntentResult>;

  abstract verifyDeposit(network: 'TRC20' | 'BEP20', txHash: string): Promise<{
    verified: boolean;
    blockConfirmations: number;
    amount?: string;
    fromAddress?: string;
    toAddress?: string;
    error?: string;
  }>;

  abstract dispatchWithdrawal(params: WithdrawalDispatchParams): Promise<WithdrawalDispatchResult>;
}

/**
 * Manual / Administrative Payment Provider
 * Operates on configured cold/hot wallet receiving addresses and admin approvals.
 */
export class ManualPaymentProvider extends PaymentProvider {
  readonly providerName = 'MANUAL_MINEPRO_VAULT';

  async createDepositIntent(params: DepositIntentParams): Promise<DepositIntentResult> {
    const pm = await serverDb.paymentMethod.findFirst({ where: { network: params.network, isEnabled: true } });
    if (!pm) {
      throw new Error(`No active payment method configured for network ${params.network}`);
    }

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    return {
      intentId: `intent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      network: params.network,
      receivingAddress: pm.address,
      expectedAmount: params.amount,
      expiresAt,
      qrCodeUrl: pm.qrCodeUrl || '',
    };
  }

  async verifyDeposit(network: 'TRC20' | 'BEP20', txHash: string) {
    const validation = WalletService.validateTxHash(network, txHash);
    if (!validation.isValid) {
      return { verified: false, blockConfirmations: 0, error: validation.error };
    }
    // In manual mode, verification is marked valid format and awaits manual review
    return { verified: true, blockConfirmations: 12 };
  }

  async dispatchWithdrawal(params: WithdrawalDispatchParams): Promise<WithdrawalDispatchResult> {
    return {
      dispatchId: `disp_${Date.now()}_${params.withdrawalId}`,
      status: 'QUEUED',
    };
  }
}

/**
 * Mock Automated Payment Gateway Provider
 * Blueprint demonstrating future API / RPC node integration with automatic confirmation callbacks.
 */
export class AutomatedGatewayProvider extends PaymentProvider {
  readonly providerName = 'MINEPRO_NODE_GATEWAY';

  async createDepositIntent(params: DepositIntentParams): Promise<DepositIntentResult> {
    const pm = await serverDb.paymentMethod.findFirst({ where: { network: params.network, isEnabled: true } });
    if (!pm) {
      throw new Error(`Payment method for network ${params.network} is not configured.`);
    }

    return {
      intentId: `api_intent_${Date.now()}`,
      network: params.network,
      receivingAddress: pm.address,
      expectedAmount: params.amount,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      qrCodeUrl: pm.qrCodeUrl || '',
    };
  }

  async verifyDeposit(network: 'TRC20' | 'BEP20', txHash: string) {
    const validation = WalletService.validateTxHash(network, txHash);
    if (!validation.isValid) {
      return { verified: false, blockConfirmations: 0, error: validation.error };
    }
    return {
      verified: true,
      blockConfirmations: 20,
      toAddress: network === 'TRC20' ? 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW6' : '0x71C8705e4A35B324c90b65B3E84F75E4D1D09A01',
    };
  }

  async dispatchWithdrawal(params: WithdrawalDispatchParams): Promise<WithdrawalDispatchResult> {
    const simulatedTxHash =
      params.network === 'TRC20'
        ? `${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`
        : `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;

    return {
      dispatchId: `disp_auto_${Date.now()}`,
      txHash: simulatedTxHash,
      status: 'CONFIRMED',
    };
  }
}

/**
 * Webhook Idempotency Service
 * Guarantees that external webhook events (e.g. deposit confirmations, payment status updates)
 * are NEVER executed multiple times, preventing duplicate crediting or race conditions.
 */
export class WebhookService {
  /**
   * Process an incoming webhook with atomic deduplication.
   */
  static async processWebhookEvent<T>(params: {
    eventId: string;
    provider: string;
    eventType: string;
    payload: Record<string, any>;
    handler: () => Promise<T>;
  }): Promise<{ isDuplicate: boolean; result?: T; event: DbWebhookEvent }> {
    const { eventId, provider, eventType, payload, handler } = params;

    // Check if event already registered
    const existing = await serverDb.webhookEvent.findUnique({ where: { eventId } });
    if (existing) {
      return {
        isDuplicate: true,
        event: existing,
      };
    }

    // Register event and execute handler in transaction
    return serverDb.$transaction(async (tx) => {
      const event = await tx.webhookEvent.create({
        data: {
          eventId,
          provider,
          eventType,
          payload,
          status: 'PROCESSED',
          processedAt: new Date().toISOString(),
        },
      });

      const result = await handler();

      return {
        isDuplicate: false,
        result,
        event,
      };
    });
  }
}
