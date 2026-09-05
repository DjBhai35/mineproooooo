import { Router, Request, Response } from 'express';
import { SettingsService } from '../config/settingsService';
import { serverDb } from '../db';

export const settingsRouter = Router();

settingsRouter.get('/public', async (req: Request, res: Response) => {
  try {
    const settings = await SettingsService.getPublicSettings();
    return res.json({
      success: true,
      data: settings,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

settingsRouter.post('/update', async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, error: 'Key and value are required.' });
    }

    const updated = await serverDb.systemSetting.update({
      where: { key },
      data: { value: typeof value === 'string' ? value : JSON.stringify(value) },
    });

    return res.json({
      success: true,
      message: `Setting ${key} updated.`,
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
