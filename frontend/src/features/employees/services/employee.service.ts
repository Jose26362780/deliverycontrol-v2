import { apiClient } from '../../../services/api/api-client';
import { Employee } from '../../../types';
import { EmployeeFormValues } from '../schemas/employee.schema';

export class EmployeeService {
  public static async list(): Promise<Employee[]> {
    return apiClient.get('/employees');
  }

  public static async getById(id: string): Promise<Employee> {
    return apiClient.get(`/employees/${id}`);
  }

  public static async create(data: EmployeeFormValues): Promise<Employee> {
    return apiClient.post('/employees', data);
  }

  public static async update(id: string, data: EmployeeFormValues | { active: boolean }): Promise<Employee> {
    return apiClient.put(`/employees/${id}`, data);
  }

  public static async delete(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/employees/${id}`);
  }
}
