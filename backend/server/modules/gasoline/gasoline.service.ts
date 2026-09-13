import { db } from '../../db/database';
import { GasolineExpense } from '../../types';
import { CreateGasolineInput, UpdateGasolineInput, GasolineQueryParams } from './gasoline.schemas';

export class GasolineService {
  public static list(userId: string, query: GasolineQueryParams = {}): GasolineExpense[] {
    let items = db.gasolineExpenses.filter(g => g.userId === userId);

    if (query.startDate) {
      items = items.filter(g => g.date >= query.startDate!);
    }
    if (query.endDate) {
      items = items.filter(g => g.date <= query.endDate!);
    }

    // Sort descending by date
    items.sort((a, b) => b.date.localeCompare(a.date));
    return items;
  }

  public static getById(id: string, userId: string): GasolineExpense {
    const expense = db.gasolineExpenses.find(g => g.id === id && g.userId === userId);
    if (!expense) {
      throw new Error('Gasto com gasolina não encontrado');
    }
    return expense;
  }

  public static create(data: CreateGasolineInput, userId: string): GasolineExpense {
    const now = new Date().toISOString();
    const newExpense: GasolineExpense = {
      id: `gas-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: data.date,
      amount: Number(data.amount),
      liters: data.liters !== undefined ? Number(data.liters) : undefined,
      userId,
      description: data.description?.trim() || 'Abastecimento',
      createdAt: now,
      updatedAt: now,
    };

    db.gasolineExpenses.push(newExpense);
    db.saveToDisk();
    return newExpense;
  }

  public static update(id: string, data: UpdateGasolineInput, userId: string): GasolineExpense {
    const index = db.gasolineExpenses.findIndex(g => g.id === id && g.userId === userId);
    if (index === -1) {
      throw new Error('Gasto com gasolina não encontrado para atualização');
    }

    const current = db.gasolineExpenses[index];
    const updated: GasolineExpense = {
      ...current,
      date: data.date ?? current.date,
      amount: data.amount !== undefined ? Number(data.amount) : current.amount,
      liters: data.liters !== undefined ? Number(data.liters) : current.liters,
      description: data.description !== undefined ? data.description.trim() : current.description,
      updatedAt: new Date().toISOString(),
    };

    db.gasolineExpenses[index] = updated;
    db.saveToDisk();
    return updated;
  }

  public static delete(id: string, userId: string): { success: boolean; message: string } {
    const index = db.gasolineExpenses.findIndex(g => g.id === id && g.userId === userId);
    if (index === -1) {
      throw new Error('Gasto com gasolina não encontrado para exclusão');
    }

    db.gasolineExpenses.splice(index, 1);
    db.saveToDisk();
    return { success: true, message: 'Despesa com combustível excluída com sucesso.' };
  }
}
