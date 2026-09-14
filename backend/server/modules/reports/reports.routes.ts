import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateQuery } from '../../middlewares/validate.middleware';
import { rangeQuerySchema } from '../../utils/validation';

export const reportRoutes = Router();

reportRoutes.use(authMiddleware as any);

reportRoutes.get('/financial', validateQuery(rangeQuerySchema), ReportsController.getFinancialReport as any);
reportRoutes.get('/weekly', ReportsController.getWeeklyReport as any);
reportRoutes.get('/monthly', ReportsController.getMonthlyReport as any);
reportRoutes.get('/pdf', validateQuery(rangeQuerySchema), ReportsController.getPdfReport as any);
reportRoutes.get('/monthly/pdf', ReportsController.getPdfReport as any);
