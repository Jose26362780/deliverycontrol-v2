import { db } from '../../db/database';
import { Employee } from '../../types';
import { CreateEmployeeInput, UpdateEmployeeInput } from './employee.schemas';

export class EmployeeService {
  public static list(userId: string): Employee[] {
    return db.employees
      .filter(e => e.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public static getById(id: string, userId: string): Employee {
    const employee = db.employees.find(e => e.id === id && e.userId === userId);
    if (!employee) {
      throw new Error('Funcionário não encontrado');
    }
    return employee;
  }

  public static create(data: CreateEmployeeInput, userId: string): Employee {
    const now = new Date().toISOString();
    const newEmployee: Employee = {
      id: `emp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      role: data.role?.trim() || 'Entregador',
      phone: data.phone?.trim() || undefined,
      active: data.active !== undefined ? data.active : true,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    db.employees.push(newEmployee);
    db.saveToDisk();
    return newEmployee;
  }

  public static update(id: string, data: UpdateEmployeeInput, userId: string): Employee {
    const index = db.employees.findIndex(e => e.id === id && e.userId === userId);
    if (index === -1) {
      throw new Error('Funcionário não encontrado para atualização');
    }

    const current = db.employees[index];
    const updated: Employee = {
      ...current,
      name: data.name !== undefined ? data.name.trim() : current.name,
      role: data.role !== undefined ? data.role.trim() : current.role,
      phone: data.phone !== undefined ? data.phone.trim() : current.phone,
      active: data.active !== undefined ? data.active : current.active,
      updatedAt: new Date().toISOString(),
    };

    db.employees[index] = updated;
    db.saveToDisk();
    return updated;
  }

  public static delete(id: string, userId: string): { success: boolean; message: string; softDeleted?: boolean } {
    const index = db.employees.findIndex(e => e.id === id && e.userId === userId);
    if (index === -1) {
      throw new Error('Funcionário não encontrado para exclusão');
    }

    // Check referential integrity: if referenced in deliveries, apply soft-delete
    const hasDeliveries = db.isEmployeeReferencedInDeliveries(id, userId);
    if (hasDeliveries) {
      db.employees[index].active = false;
      db.employees[index].updatedAt = new Date().toISOString();
      db.saveToDisk();
      return {
        success: true,
        message: 'Funcionário possui histórico de turnos e foi desativado para preservar integridade dos dados.',
        softDeleted: true,
      };
    }

    db.employees.splice(index, 1);
    db.saveToDisk();
    return {
      success: true,
      message: 'Funcionário excluído com sucesso.',
    };
  }
}

