import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const analyticsRoutes = Router();

analyticsRoutes.use(authMiddleware as any);

analyticsRoutes.get('/revenue', AnalyticsController.getRevenue as any);
analyticsRoutes.get('/deliveries', AnalyticsController.getDeliveries as any);
analyticsRoutes.get('/gasoline', AnalyticsController.getGasoline as any);
analyticsRoutes.get('/distribution', AnalyticsController.getDistribution as any);
