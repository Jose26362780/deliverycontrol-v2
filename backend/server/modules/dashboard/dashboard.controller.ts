import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { DashboardService } from './dashboard.service';

export class DashboardController {
  public static async getOverview(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await DashboardService.getSummary(userId, 'all');
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar dados do dashboard' });
    }
  }

  public static async getWeekly(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await DashboardService.getSummary(userId, 'weekly');
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar dados semanais' });
    }
  }

  public static async getMonthly(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await DashboardService.getSummary(userId, 'monthly');
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao carregar dados mensais' });
    }
  }
}
