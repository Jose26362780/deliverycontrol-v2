import { apiClient } from '../../../services/api/api-client';
import { FinancialReport } from '../../../types';

export class ReportService {
  public static async generateReport(params?: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  }): Promise<FinancialReport> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);

    const query = searchParams.toString();
    const endpoint = query ? `/reports/financial?${query}` : '/reports/financial';
    return apiClient.get(endpoint);
  }

  public static async exportPdf(params?: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  }): Promise<{ message: string; filename: string }> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);

    const query = searchParams.toString();
    const endpoint = query ? `/reports/pdf?${query}` : '/reports/pdf';
    return apiClient.get(endpoint);
  }
}
