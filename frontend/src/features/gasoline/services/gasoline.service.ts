import { apiClient } from '../../../services/api/api-client';
import { GasolineExpense } from '../../../types';
import { GasolineFormValues } from '../schemas/gasoline.schema';

export interface GasolineFilters {
  startDate?: string;
  endDate?: string;
}

export class GasolineService {
  public static async list(filters?: GasolineFilters): Promise<GasolineExpense[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    const endpoint = query ? `/gasoline?${query}` : '/gasoline';
    return apiClient.get(endpoint);
  }

  public static async getById(id: string): Promise<GasolineExpense> {
    return apiClient.get(`/gasoline/${id}`);
  }

  public static async create(data: GasolineFormValues): Promise<GasolineExpense> {
    return apiClient.post('/gasoline', data);
  }

  public static async update(id: string, data: GasolineFormValues): Promise<GasolineExpense> {
    return apiClient.put(`/gasoline/${id}`, data);
  }

  public static async delete(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/gasoline/${id}`);
  }
}
