import { config } from '../config';
import { getPrismaClient } from '../db/prisma';
import { db } from '../db/database';
import { toEmployee } from '../db/mappers';
import { Employee } from '../types';

const usePg = () => Boolean(config.databaseUrl);
const prisma = () => getPrismaClient();

type EmployeeInput = { name: string; role?: string; phone?: string; active?: boolean };

export class EmployeeRepository {
  public static async list(userId: string): Promise<Employee[]> {
    if (usePg()) {
      const rows = await prisma().employee.findMany({ where: { userId }, orderBy: { name: 'asc' } });
      return rows.map(toEmployee);
    }
    return db.employees.filter(e => e.userId === userId).sort((a, b) => a.name.localeCompare(b.name));
  }

  public static async getById(id: string, userId: string): Promise<Employee | null> {
    if (usePg()) {
      const r = await prisma().employee.findFirst({ where: { id, userId } });
      return r ? toEmployee(r) : null;
    }
    return db.employees.find(e => e.id === id && e.userId === userId) || null;
  }

  public static async create(data: EmployeeInput, userId: string): Promise<Employee> {
    if (usePg()) {
      const r = await prisma().employee.create({
        data: {
          name: data.name.trim(),
          role: data.role?.trim() || null,
          phone: data.phone?.trim() || null,
          active: data.active ?? true,
          userId,
        },
      });
      return toEmployee(r);
    }
    const now = new Date().toISOString();
    const row: Employee = {
      id: `emp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      role: data.role?.trim() || 'Entregador',
      phone: data.phone?.trim() || undefined,
      active: data.active ?? true,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    db.employees.push(row);
    db.saveToDisk();
    return row;
  }

  public static async update(id: string, userId: string, data: Partial<EmployeeInput>): Promise<Employee | null> {
    if (usePg()) {
      const existing = await prisma().employee.findFirst({ where: { id, userId } });
      if (!existing) return null;
      const r = await prisma().employee.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name.trim() } : {}),
          ...(data.role !== undefined ? { role: data.role.trim() || null } : {}),
          ...(data.phone !== undefined ? { phone: data.phone.trim() || null } : {}),
          ...(data.active !== undefined ? { active: data.active } : {}),
        },
      });
      return toEmployee(r);
    }
    const i = db.employees.findIndex(e => e.id === id && e.userId === userId);
    if (i === -1) return null;
    const updated = {
      ...db.employees[i],
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.role !== undefined ? { role: data.role.trim() } : {}),
      ...(data.phone !== undefined ? { phone: data.phone.trim() } : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
      updatedAt: new Date().toISOString(),
    };
    db.employees[i] = updated;
    db.saveToDisk();
    return updated;
  }

  public static async delete(id: string, userId: string) {
    if (usePg()) {
      const existing = await prisma().employee.findFirst({ where: { id, userId } });
      if (!existing) throw new Error('Funcionário não encontrado para exclusão');
      const linked = await prisma().delivery.count({
        where: { userId, OR: [{ employeeAId: id }, { employeeBId: id }] },
      });
      if (linked > 0) {
        await prisma().employee.update({ where: { id }, data: { active: false } });
        return { success: true, softDeleted: true, message: 'Funcionário possui histórico e foi desativado.' };
      }
      await prisma().employee.delete({ where: { id } });
      return { success: true, message: 'Funcionário excluído com sucesso.' };
    }
    const i = db.employees.findIndex(e => e.id === id && e.userId === userId);
    if (i === -1) throw new Error('Funcionário não encontrado para exclusão');
    if (db.isEmployeeReferencedInDeliveries(id, userId)) {
      db.employees[i] = { ...db.employees[i], active: false, updatedAt: new Date().toISOString() };
      db.saveToDisk();
      return { success: true, softDeleted: true, message: 'Funcionário possui histórico e foi desativado.' };
    }
    db.employees.splice(i, 1);
    db.saveToDisk();
    return { success: true, message: 'Funcionário excluído com sucesso.' };
  }
}
