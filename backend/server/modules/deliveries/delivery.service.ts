import { db } from '../../db/database';
import { Delivery, DeliveryWithEmployees } from '../../types';
import { CreateDeliveryInput, UpdateDeliveryInput, DeliveryQueryParams } from './delivery.schemas';
import { FinanceService } from '../finance/finance.service';

export class DeliveryService {
  public static list(userId: string, query: DeliveryQueryParams = {}): DeliveryWithEmployees[] {
    let items = db.deliveries.filter(d => d.userId === userId);

    if (query.startDate) {
      items = items.filter(d => d.date >= query.startDate!);
    }
    if (query.endDate) {
      items = items.filter(d => d.date <= query.endDate!);
    }
    if (query.employeeId) {
      items = items.filter(d => d.employeeAId === query.employeeId || d.employeeBId === query.employeeId);
    }

    // Sort descending by date
    items.sort((a, b) => b.date.localeCompare(a.date));

    const splitConfig = db.getSplitConfig(userId);

    // Map with employee names and shares
    return items.map(d => {
      const empA = db.employees.find(e => e.id === d.employeeAId && e.userId === userId);
      const empB = d.employeeBId ? db.employees.find(e => e.id === d.employeeBId && e.userId === userId) : null;
      
      const share = FinanceService.calculateDeliveryShare(
        d.revenue,
        Boolean(d.employeeBId),
        splitConfig
      );

      return {
        ...d,
        employeeAName: empA ? empA.name : 'Funcionário Desconhecido',
        employeeBName: empB ? empB.name : null,
        netRevenueShareA: share.employeeAShare,
        netRevenueShareB: share.employeeBShare,
        carShare: share.carShare,
      };
    });
  }

  public static getById(id: string, userId: string): DeliveryWithEmployees {
    const d = db.deliveries.find(item => item.id === id && item.userId === userId);
    if (!d) {
      throw new Error('Registro de entrega não encontrado');
    }

    const empA = db.employees.find(e => e.id === d.employeeAId && e.userId === userId);
    const empB = d.employeeBId ? db.employees.find(e => e.id === d.employeeBId && e.userId === userId) : null;
    const splitConfig = db.getSplitConfig(userId);

    const share = FinanceService.calculateDeliveryShare(
      d.revenue,
      Boolean(d.employeeBId),
      splitConfig
    );

    return {
      ...d,
      employeeAName: empA ? empA.name : 'Funcionário Desconhecido',
      employeeBName: empB ? empB.name : null,
      netRevenueShareA: share.employeeAShare,
      netRevenueShareB: share.employeeBShare,
      carShare: share.carShare,
    };
  }

  public static create(data: CreateDeliveryInput, userId: string): DeliveryWithEmployees {
    // Validate employees exist
    const empA = db.employees.find(e => e.id === data.employeeAId && e.userId === userId);
    if (!empA) {
      throw new Error('Funcionário A selecionado é inválido');
    }

    if (data.employeeBId) {
      const empB = db.employees.find(e => e.id === data.employeeBId && e.userId === userId);
      if (!empB) {
        throw new Error('Funcionário B selecionado é inválido');
      }
      if (data.employeeAId === data.employeeBId) {
        throw new Error('Funcionário A e Funcionário B não podem ser a mesma pessoa no mesmo turno');
      }
    }

    const now = new Date().toISOString();
    const newDelivery: Delivery = {
      id: `del-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: data.date,
      employeeAId: data.employeeAId,
      employeeBId: data.employeeBId || null,
      deliveryCount: data.deliveryCount,
      revenue: Number(data.revenue),
      userId,
      notes: data.notes?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    db.deliveries.push(newDelivery);
    db.saveToDisk();

    return this.getById(newDelivery.id, userId);
  }

  public static update(id: string, data: UpdateDeliveryInput, userId: string): DeliveryWithEmployees {
    const index = db.deliveries.findIndex(d => d.id === id && d.userId === userId);
    if (index === -1) {
      throw new Error('Entrega não encontrada');
    }

    const current = db.deliveries[index];

    const empAId = data.employeeAId ?? current.employeeAId;
    const empBId = data.employeeBId !== undefined ? data.employeeBId : current.employeeBId;

    if (empAId === empBId && empAId) {
      throw new Error('Funcionário A e Funcionário B não podem ser a mesma pessoa');
    }

    const updated: Delivery = {
      ...current,
      date: data.date ?? current.date,
      employeeAId: empAId,
      employeeBId: empBId,
      deliveryCount: data.deliveryCount !== undefined ? data.deliveryCount : current.deliveryCount,
      revenue: data.revenue !== undefined ? Number(data.revenue) : current.revenue,
      notes: data.notes !== undefined ? data.notes : current.notes,
      updatedAt: new Date().toISOString(),
    };

    db.deliveries[index] = updated;
    db.saveToDisk();

    return this.getById(id, userId);
  }

  public static delete(id: string, userId: string): { success: boolean; message: string } {
    const index = db.deliveries.findIndex(d => d.id === id && d.userId === userId);
    if (index === -1) {
      throw new Error('Entrega não encontrada');
    }

    db.deliveries.splice(index, 1);
    db.saveToDisk();
    return { success: true, message: 'Turno de entrega excluído com sucesso.' };
  }
}
