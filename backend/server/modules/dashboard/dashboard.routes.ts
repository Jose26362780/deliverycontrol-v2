import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const dashboardRoutes = Router();

dashboardRoutes.use(authMiddleware as any);

dashboardRoutes.get('/', DashboardController.getOverview as any);
dashboardRoutes.get('/weekly', DashboardController.getWeekly as any);
dashboardRoutes.get('/monthly', DashboardController.getMonthly as any);
