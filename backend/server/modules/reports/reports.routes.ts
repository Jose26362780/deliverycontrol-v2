import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const reportRoutes = Router();

reportRoutes.use(authMiddleware as any);

reportRoutes.get('/financial', ReportsController.getFinancialReport as any);
reportRoutes.get('/weekly', ReportsController.getWeeklyReport as any);
reportRoutes.get('/monthly', ReportsController.getMonthlyReport as any);
reportRoutes.get('/pdf', ReportsController.getPdfReport as any);
reportRoutes.get('/monthly/pdf', ReportsController.getPdfReport as any);
