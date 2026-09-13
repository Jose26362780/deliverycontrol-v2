import { ReportService } from '../../reports/services/report.service';
import { FinancialReport } from '../../../types';

export class ServicoRelatorio {
  public static async gerarRelatorio(parametros?: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  }): Promise<FinancialReport> {
    return ReportService.generateReport(parametros);
  }

  public static async exportarPdf(parametros?: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  }): Promise<{ message: string; filename: string }> {
    return ReportService.exportPdf(parametros);
  }
}

export const servicoRelatorio = ServicoRelatorio;
export const reportService = ServicoRelatorio;
export default ServicoRelatorio;
