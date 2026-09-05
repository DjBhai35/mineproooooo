import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './src/server/routes/authRoutes';
import { cycleRouter } from './src/server/routes/cycleRoutes';
import { referralRouter } from './src/server/routes/referralRoutes';
import { investmentRouter } from './src/server/routes/investmentRoutes';
import { settingsRouter } from './src/server/routes/settingsRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger for auditability
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
      console.log(`[API] ${req.method} ${req.path} - ${new Date().toISOString()}`);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'MinePro Node Engine',
      serverTime: new Date().toISOString(),
    });
  });

  // API Routes (Mounted FIRST before Vite middleware)
  app.use('/api/auth', authRouter);
  app.use('/api/cycles', cycleRouter);
  app.use('/api/rewards', cycleRouter); // Supports POST /api/rewards/claim
  app.use('/api/referrals', referralRouter);
  app.use('/api/investments', investmentRouter);
  app.use('/api/settings', settingsRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MinePro Server running on http://localhost:${PORT}`);
  });
}

startServer();
