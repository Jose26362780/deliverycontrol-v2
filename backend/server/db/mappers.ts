import { Employee, GasolineExpense, SplitRuleConfig } from '../types';

export const toDateOnly = (d: Date): string => d.toISOString().split('T')[0];
export const toIso = (d: Date): string => d.toISOString();
export const num = (v: unknown): number => Number(v);

export function toEmployee(r: any): Employee {
  return {
    id: r.id,
    name: r.name,
    role: r.role || undefined,
    phone: r.phone || undefined,
    active: r.active,
    userId: r.userId,
    createdAt: toIso(r.createdAt),
    updatedAt: toIso(r.updatedAt),
  };
}

export function toGasoline(r: any): GasolineExpense {
  return {
    id: r.id,
    date: toDateOnly(r.date),
    amount: num(r.amount),
    liters: r.liters != null ? num(r.liters) : undefined,
    description: r.description || undefined,
    userId: r.userId,
    createdAt: toIso(r.createdAt),
    updatedAt: toIso(r.updatedAt),
  };
}

export function toSplit(r: any): SplitRuleConfig {
  return {
    id: r.id,
    userId: r.userId,
    carPercentage: num(r.carPercentage),
    employeeAPercentage: num(r.employeeAPercentage),
    employeeBPercentage: num(r.employeeBPercentage),
    updatedAt: toIso(r.updatedAt),
  };
}
