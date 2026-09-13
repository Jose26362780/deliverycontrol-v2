import { DashboardService } from '../../dashboard/services/dashboard.service';
import { DashboardSummary, SplitRuleConfig } from '../../../types';

export class ServicoPainel {
  public static async obterVisaoGeral(): Promise<DashboardSummary> {
    return DashboardService.getOverview();
  }

  public static async obterSemanal(): Promise<DashboardSummary> {
    return DashboardService.getWeekly();
  }

  public static async obterMensal(): Promise<DashboardSummary> {
    return DashboardService.getMonthly();
  }

  public static async obterConfiguracaoDivisao(): Promise<SplitRuleConfig> {
    return DashboardService.getSplitConfig();
  }

  public static async atualizarConfiguracaoDivisao(dados: {
    carPercentage: number;
    employeeAPercentage: number;
    employeeBPercentage: number;
  }): Promise<SplitRuleConfig> {
    return DashboardService.updateSplitConfig(dados);
  }
}

export const servicoPainel = ServicoPainel;
export const dashboardService = ServicoPainel;
export default ServicoPainel;
