import { apiClient } from '../../../services/api/api-client';
import { Delivery } from '../../../types';
import { DeliveryFormValues } from '../schemas/delivery.schema';

export interface DeliveryFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

export class DeliveryService {
  public static async list(filters?: DeliveryFilters): Promise<Delivery[]> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);

    const query = params.toString();
    const endpoint = query ? `/deliveries?${query}` : '/deliveries';
    return apiClient.get(endpoint);
  }

  public static async getById(id: string): Promise<Delivery> {
    return apiClient.get(`/deliveries/${id}`);
  }

  public static async create(data: DeliveryFormValues): Promise<Delivery> {
    return apiClient.post('/deliveries', data);
  }

  public static async update(id: string, data: DeliveryFormValues): Promise<Delivery> {
    return apiClient.put(`/deliveries/${id}`, data);
  }

  public static async delete(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/deliveries/${id}`);
  }
}
