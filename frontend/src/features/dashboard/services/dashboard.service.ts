import { apiClient } from '../../../services/api/api-client';
import { DashboardSummary, SplitRuleConfig } from '../../../types';

export class DashboardService {
  public static async getOverview(): Promise<DashboardSummary> {
    return apiClient.get('/dashboard');
  }

  public static async getWeekly(): Promise<DashboardSummary> {
    return apiClient.get('/dashboard/weekly');
  }

  public static async getMonthly(): Promise<DashboardSummary> {
    return apiClient.get('/dashboard/monthly');
  }

  public static async getSplitConfig(): Promise<SplitRuleConfig> {
    return apiClient.get('/settings/split');
  }

  public static async updateSplitConfig(data: {
    carPercentage: number;
    employeeAPercentage: number;
    employeeBPercentage: number;
  }): Promise<SplitRuleConfig> {
    return apiClient.put('/settings/split', data);
  }
}
