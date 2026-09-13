import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { ReportsService } from './reports.service';

export class ReportsController {
  public static getFinancialReport(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { period, startDate, endDate, employeeId } = req.query as {
        period?: string;
        startDate?: string;
        endDate?: string;
        employeeId?: string;
      };
      const report = ReportsService.generateFinancialReport(userId, {
        period,
        startDate,
        endDate,
        employeeId,
      });
      res.status(200).json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao gerar relatório' });
    }
  }

  public static getWeeklyReport(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const report = ReportsService.generateFinancialReport(userId, { period: 'weekly' });
      res.status(200).json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao gerar relatório semanal' });
    }
  }

  public static getMonthlyReport(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const report = ReportsService.generateFinancialReport(userId, { period: 'monthly' });
      res.status(200).json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao gerar relatório mensal' });
    }
  }

  public static getPdfReport(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { period, startDate, endDate, employeeId } = req.query as any;
      const report = ReportsService.generateFinancialReport(userId, {
        period,
        startDate,
        endDate,
        employeeId,
      });

      const filename = `relatorio-deliverycontrol-${new Date().toISOString().split('T')[0]}.pdf`;

      res.status(200).json({
        success: true,
        filename,
        report,
        message: 'Relatório formatado para impressão e PDF',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao preparar exportação de PDF' });
    }
  }
}
