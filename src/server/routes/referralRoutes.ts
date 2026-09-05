import { Router, Request, Response } from 'express';
import { getUserIdFromRequest } from './authRoutes';
import { ReferralEngine } from '../services/referralEngine';

export const referralRouter = Router();

/**
 * GET /api/referrals/summary
 * Retrieves live referral metrics, level counts (1 to 5), percentages,
 * and the complete auditable referral reward ledger.
 */
referralRouter.get('/summary', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const host = req.get('host') || 'minepro.network';
    const protocol = req.protocol || 'https';
    const baseUrl = `${protocol}://${host}`;

    const summary = await ReferralEngine.getDashboardSummary(userId, baseUrl);

    return res.json({
      success: true,
      data: summary,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/referrals/tree
 * Returns the hierarchical multi-level referral network tree.
 */
referralRouter.get('/tree', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const tree = await ReferralEngine.getReferralTree(userId);

    return res.json({
      success: true,
      data: tree,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
