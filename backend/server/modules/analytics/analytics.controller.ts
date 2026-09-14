import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { AnalyticsService } from './analytics.service';

export class AnalyticsController {
  public static async getRevenue(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await AnalyticsService.getRevenueAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar métricas de receita' });
    }
  }

  public static async getDeliveries(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await AnalyticsService.getDeliveryAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar métricas de entregas' });
    }
  }

  public static async getGasoline(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await AnalyticsService.getGasolineAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar métricas de combustível' });
    }
  }

  public static async getDistribution(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await AnalyticsService.getDistributionAnalytics(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar divisão financeira' });
    }
  }
}
