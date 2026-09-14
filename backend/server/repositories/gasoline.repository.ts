import { config } from '../config';
import { getPrismaClient } from '../db/prisma';
import { db } from '../db/database';
import { toGasoline } from '../db/mappers';
import { GasolineExpense } from '../types';

const usePg = () => Boolean(config.databaseUrl);
const prisma = () => getPrismaClient();

type GasolineInput = { date: string; amount: number; liters?: number; description?: string };

export class GasolineRepository {
  public static async list(userId: string, startDate?: string): Promise<GasolineExpense[]> {
    if (usePg()) {
      const rows = await prisma().gasolineExpense.findMany({
        where: { userId, ...(startDate ? { date: { gte: new Date(startDate) } } : {}) },
        orderBy: { date: 'desc' },
      });
      return rows.map(toGasoline);
    }
    return db.gasolineExpenses
      .filter(g => g.userId === userId && (!startDate || g.date >= startDate))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  public static async getById(id: string, userId: string): Promise<GasolineExpense | null> {
    if (usePg()) {
      const r = await prisma().gasolineExpense.findFirst({ where: { id, userId } });
      return r ? toGasoline(r) : null;
    }
    return db.gasolineExpenses.find(g => g.id === id && g.userId === userId) || null;
  }

  public static async create(data: GasolineInput, userId: string): Promise<GasolineExpense> {
    if (usePg()) {
      const r = await prisma().gasolineExpense.create({
        data: {
          date: new Date(data.date),
          amount: data.amount,
          liters: data.liters ?? null,
          description: data.description?.trim() || null,
          userId,
        },
      });
      return toGasoline(r);
    }
    const now = new Date().toISOString();
    const row: GasolineExpense = {
      id: `gas-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: data.date,
      amount: Number(data.amount),
      liters: data.liters !== undefined ? Number(data.liters) : undefined,
      description: data.description?.trim() || undefined,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    db.gasolineExpenses.push(row);
    db.saveToDisk();
    return row;
  }

  public static async update(id: string, userId: string, data: Partial<GasolineInput>): Promise<GasolineExpense> {
    if (usePg()) {
      const existing = await prisma().gasolineExpense.findFirst({ where: { id, userId } });
      if (!existing) throw new Error('Gasto com gasolina não encontrado para atualização');
      const r = await prisma().gasolineExpense.update({
        where: { id },
        data: {
          ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
          ...(data.amount !== undefined ? { amount: data.amount } : {}),
          ...(data.liters !== undefined ? { liters: data.liters } : {}),
          ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
        },
      });
      return toGasoline(r);
    }
    const i = db.gasolineExpenses.findIndex(g => g.id === id && g.userId === userId);
    if (i === -1) throw new Error('Gasto com gasolina não encontrado para atualização');
    const updated = {
      ...db.gasolineExpenses[i],
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.amount !== undefined ? { amount: Number(data.amount) } : {}),
      ...(data.liters !== undefined ? { liters: Number(data.liters) } : {}),
      ...(data.description !== undefined ? { description: data.description.trim() } : {}),
      updatedAt: new Date().toISOString(),
    };
    db.gasolineExpenses[i] = updated;
    db.saveToDisk();
    return updated;
  }

  public static async delete(id: string, userId: string) {
    if (usePg()) {
      const existing = await prisma().gasolineExpense.findFirst({ where: { id, userId } });
      if (!existing) throw new Error('Registro de combustível não encontrado');
      await prisma().gasolineExpense.delete({ where: { id } });
      return { success: true, message: 'Despesa com combustível excluída com sucesso.' };
    }
    const i = db.gasolineExpenses.findIndex(g => g.id === id && g.userId === userId);
    if (i === -1) throw new Error('Registro de combustível não encontrado');
    db.gasolineExpenses.splice(i, 1);
    db.saveToDisk();
    return { success: true, message: 'Despesa com combustível excluída com sucesso.' };
  }
}
