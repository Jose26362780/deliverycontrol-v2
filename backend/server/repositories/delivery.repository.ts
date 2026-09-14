import { config } from '../config';
import { getPrismaClient } from '../db/prisma';
import { db } from '../db/database';
import { toDateOnly, toIso, num } from '../db/mappers';
import { DeliveryWithEmployees } from '../types';
import { CreateDeliveryInput, UpdateDeliveryInput, DeliveryQueryParams } from '../modules/deliveries/delivery.schemas';
import { FinanceService } from '../modules/finance/finance.service';
import { SplitConfigRepository } from './split-config.repository';
import { EmployeeRepository } from './employee.repository';

const usePg = () => Boolean(config.databaseUrl);
const prisma = () => getPrismaClient();

function assertDistinct(a?: string | null, b?: string | null) {
  if (b && a === b) throw new Error('O Funcionário A e o Funcionário B não podem ser a mesma pessoa');
}

function toDelivery(r: any, names: { a: string; b: string | null }, split: any): DeliveryWithEmployees {
  const revenue = num(r.revenue);
  const share = FinanceService.calculateDeliveryShare(revenue, Boolean(r.employeeBId), split);
  return {
    id: r.id,
    date: typeof r.date === 'string' ? r.date : toDateOnly(r.date),
    employeeAId: r.employeeAId,
    employeeAName: names.a,
    employeeBId: r.employeeBId ?? null,
    employeeBName: names.b,
    deliveryCount: r.deliveryCount,
    revenue,
    notes: r.notes || undefined,
    userId: r.userId,
    carShare: share.carShare,
    netRevenueShareA: share.employeeAShare,
    netRevenueShareB: share.employeeBShare,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : toIso(r.createdAt),
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : toIso(r.updatedAt),
  };
}

function namesOf(userId: string, aId: string, bId?: string | null) {
  const a = db.employees.find(e => e.id === aId && e.userId === userId);
  const b = bId ? db.employees.find(e => e.id === bId && e.userId === userId) : null;
  return { a: a?.name || 'Funcionário Desconhecido', b: b?.name || null };
}

export class DeliveryRepository {
  public static async list(userId: string, query: DeliveryQueryParams = {}): Promise<DeliveryWithEmployees[]> {
    const split = await SplitConfigRepository.get(userId);
    if (usePg()) {
      const where: any = { userId };
      if (query.startDate || query.endDate) {
        where.date = {
          ...(query.startDate ? { gte: new Date(query.startDate) } : {}),
          ...(query.endDate ? { lte: new Date(query.endDate) } : {}),
        };
      }
      if (query.employeeId) where.OR = [{ employeeAId: query.employeeId }, { employeeBId: query.employeeId }];
      const rows = await prisma().delivery.findMany({
        where,
        include: { employeeA: true, employeeB: true },
        orderBy: { date: 'desc' },
      });
      return rows.map(d =>
        toDelivery(d, { a: d.employeeA?.name || 'Funcionário Desconhecido', b: d.employeeB?.name || null }, split),
      );
    }
    return db.deliveries
      .filter(d => d.userId === userId
        && (!query.startDate || d.date >= query.startDate)
        && (!query.endDate || d.date <= query.endDate)
        && (!query.employeeId || d.employeeAId === query.employeeId || d.employeeBId === query.employeeId))
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(d => toDelivery(d, namesOf(userId, d.employeeAId, d.employeeBId), split));
  }

  public static async getById(id: string, userId: string): Promise<DeliveryWithEmployees | null> {
    const split = await SplitConfigRepository.get(userId);
    if (usePg()) {
      const d = await prisma().delivery.findFirst({ where: { id, userId }, include: { employeeA: true, employeeB: true } });
      if (!d) return null;
      return toDelivery(d, { a: d.employeeA?.name || 'Funcionário Desconhecido', b: d.employeeB?.name || null }, split);
    }
    const d = db.deliveries.find(x => x.id === id && x.userId === userId);
    return d ? toDelivery(d, namesOf(userId, d.employeeAId, d.employeeBId), split) : null;
  }

  public static async create(data: CreateDeliveryInput, userId: string): Promise<DeliveryWithEmployees> {
    assertDistinct(data.employeeAId, data.employeeBId);
    const empA = await EmployeeRepository.getById(data.employeeAId, userId);
    if (!empA) throw new Error('Funcionário A não encontrado ou não pertence a este usuário');
    let empBName: string | null = null;
    if (data.employeeBId) {
      const empB = await EmployeeRepository.getById(data.employeeBId, userId);
      if (!empB) throw new Error('Funcionário B não encontrado ou não pertence a este usuário');
      empBName = empB.name;
    }
    const split = await SplitConfigRepository.get(userId);
    if (usePg()) {
      const d = await prisma().delivery.create({
        data: {
          date: new Date(data.date),
          employeeAId: data.employeeAId,
          employeeBId: data.employeeBId || null,
          deliveryCount: data.deliveryCount,
          revenue: data.revenue,
          notes: data.notes?.trim() || null,
          userId,
        },
      });
      return toDelivery(d, { a: empA.name, b: empBName }, split);
    }
    const now = new Date().toISOString();
    const row = {
      id: `del-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date: data.date,
      employeeAId: data.employeeAId,
      employeeBId: data.employeeBId || null,
      deliveryCount: data.deliveryCount,
      revenue: Number(data.revenue),
      notes: data.notes?.trim() || undefined,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    db.deliveries.push(row);
    db.saveToDisk();
    return toDelivery(row, { a: empA.name, b: empBName }, split);
  }

  public static async update(id: string, data: UpdateDeliveryInput, userId: string): Promise<DeliveryWithEmployees> {
    const current = usePg()
      ? await prisma().delivery.findFirst({ where: { id, userId } })
      : db.deliveries.find(d => d.id === id && d.userId === userId);
    if (!current) throw new Error('Entrega não encontrada para atualização');

    const nextA = data.employeeAId ?? (current as any).employeeAId;
    const nextB = data.employeeBId !== undefined ? data.employeeBId : (current as any).employeeBId;
    assertDistinct(nextA, nextB);
    // IDOR: novos funcionários precisam pertencer ao usuário autenticado.
    if (data.employeeAId && !(await EmployeeRepository.getById(data.employeeAId, userId))) {
      throw new Error('Funcionário A não encontrado ou não pertence a este usuário');
    }
    if (data.employeeBId && !(await EmployeeRepository.getById(data.employeeBId, userId))) {
      throw new Error('Funcionário B não encontrado ou não pertence a este usuário');
    }

    const split = await SplitConfigRepository.get(userId);
    if (usePg()) {
      const d = await prisma().delivery.update({
        where: { id },
        data: {
          ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
          ...(data.employeeAId !== undefined ? { employeeAId: data.employeeAId } : {}),
          ...(data.employeeBId !== undefined ? { employeeBId: data.employeeBId || null } : {}),
          ...(data.deliveryCount !== undefined ? { deliveryCount: data.deliveryCount } : {}),
          ...(data.revenue !== undefined ? { revenue: data.revenue } : {}),
          ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {}),
        },
        include: { employeeA: true, employeeB: true },
      });
      return toDelivery(d, { a: d.employeeA?.name || 'Funcionário Desconhecido', b: d.employeeB?.name || null }, split);
    }
    const updated = {
      ...(current as any),
      ...(data.date !== undefined ? { date: data.date } : {}),
      employeeAId: nextA,
      employeeBId: nextB,
      ...(data.deliveryCount !== undefined ? { deliveryCount: data.deliveryCount } : {}),
      ...(data.revenue !== undefined ? { revenue: Number(data.revenue) } : {}),
      ...(data.notes !== undefined ? { notes: data.notes?.trim() } : {}),
      updatedAt: new Date().toISOString(),
    };
    const i = db.deliveries.findIndex(d => d.id === id && d.userId === userId);
    db.deliveries[i] = updated;
    db.saveToDisk();
    return toDelivery(updated, namesOf(userId, updated.employeeAId, updated.employeeBId), split);
  }

  public static async delete(id: string, userId: string) {
    if (usePg()) {
      const existing = await prisma().delivery.findFirst({ where: { id, userId } });
      if (!existing) throw new Error('Registro de entrega não encontrado');
      await prisma().delivery.delete({ where: { id } });
      return { success: true, message: 'Turno de entrega excluído com sucesso.' };
    }
    const i = db.deliveries.findIndex(d => d.id === id && d.userId === userId);
    if (i === -1) throw new Error('Registro de entrega não encontrado');
    db.deliveries.splice(i, 1);
    db.saveToDisk();
    return { success: true, message: 'Turno de entrega excluído com sucesso.' };
  }
}
