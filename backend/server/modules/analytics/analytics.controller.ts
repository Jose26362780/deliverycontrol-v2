import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  public static getRevenue(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const data = AnalyticsService.getRevenueAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar métricas de receita' });
    }
  }

  public static getDeliveries(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const data = AnalyticsService.getDeliveryAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar métricas de entregas' });
    }
  }

  public static getGasoline(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const data = AnalyticsService.getGasolineAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar métricas de combustível' });
    }
  }

  public static getDistribution(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const data = AnalyticsService.getDistributionAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar divisão financeira' });
    }
  }
}
