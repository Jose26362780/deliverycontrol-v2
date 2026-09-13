import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { config } from './server/config';
import { authRoutes } from './server/modules/auth/auth.routes';
import { employeeRoutes } from './server/modules/employees/employee.routes';
import { deliveryRoutes } from './server/modules/deliveries/delivery.routes';
import { gasolineRoutes } from './server/modules/gasoline/gasoline.routes';
import { dashboardRoutes } from './server/modules/dashboard/dashboard.routes';
import { analyticsRoutes } from './server/modules/analytics/analytics.routes';
import { reportRoutes } from './server/modules/reports/reports.routes';
import { settingsRoutes } from './server/modules/settings/settings.routes';

async function startServer() {
  const app = express();
  const PORT = config.port;
  const betterAuthHandler = config.betterAuth.enabled
    ? (await import('better-auth/node')).toNodeHandler((await import('./server/auth/better-auth')).auth)
    : null;

  // Middlewares
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Origem não permitida pelo CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }));
  app.use('/api/auth', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas tentativas. Tente novamente mais tarde.' },
  }));
  if (betterAuthHandler) {
    app.all('/api/auth/*', betterAuthHandler);
  }
  app.use(express.json({ limit: config.jsonBodyLimit }));

  // API Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'DeliveryControl', timestamp: new Date().toISOString() });
  });

  // API Routes (mounted with and without /api/ for maximum compatibility)
  const apiRouter = express.Router();

  if (!betterAuthHandler) {
    apiRouter.use('/auth', authRoutes);
  }
  apiRouter.use('/employees', employeeRoutes);
  apiRouter.use('/deliveries', deliveryRoutes);
  apiRouter.use('/gasoline', gasolineRoutes);
  apiRouter.use('/dashboard', dashboardRoutes);
  apiRouter.use('/analytics', analyticsRoutes);
  apiRouter.use('/reports', reportRoutes);
  apiRouter.use('/settings', settingsRoutes);

  // Mount at /api and top-level paths matching spec
  app.use('/api', apiRouter);
  if (!betterAuthHandler) {
    app.use('/auth', authRoutes);
  }
  app.use('/employees', employeeRoutes);
  app.use('/deliveries', deliveryRoutes);
  app.use('/gasoline', gasolineRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/analytics', analyticsRoutes);
  app.use('/reports', reportRoutes);
  app.use('/settings', settingsRoutes);

  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
  });

  // In development, the frontend runs as a separate Vite process.
  // Production serves the compiled frontend from this same server.
  if (process.env.NODE_ENV !== 'production' && process.env.VITE_MIDDLEWARE === 'true') {
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
    console.log(`[DeliveryControl] Servidor rodando na porta ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Falha crítica ao iniciar servidor:', err);
});
