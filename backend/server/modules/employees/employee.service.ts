import { EmployeeRepository } from '../../repositories/employee.repository';
import { Employee } from '../../types';
import { CreateEmployeeInput, UpdateEmployeeInput } from './employee.schemas';

export class EmployeeService {
  public static async list(userId: string): Promise<Employee[]> {
    return EmployeeRepository.list(userId);
  }

  public static async getById(id: string, userId: string): Promise<Employee> {
    const employee = await EmployeeRepository.getById(id, userId);
    if (!employee) {
      throw new Error('Funcionário não encontrado');
    }
    return employee;
  }

  public static async create(data: CreateEmployeeInput, userId: string): Promise<Employee> {
    return EmployeeRepository.create(data, userId);
  }

  public static async update(id: string, data: UpdateEmployeeInput, userId: string): Promise<Employee> {
    const updated = await EmployeeRepository.update(id, userId, data);
    if (!updated) {
      throw new Error('Funcionário não encontrado para atualização');
    }
    return updated;
  }

  public static async delete(id: string, userId: string): Promise<{ success: boolean; message: string; softDeleted?: boolean }> {
    return EmployeeRepository.delete(id, userId);
  }
}
