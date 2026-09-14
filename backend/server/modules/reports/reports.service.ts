import { FinanceService } from '../finance/finance.service';
import { DeliveryRepository } from '../../repositories/delivery.repository';
import { GasolineRepository } from '../../repositories/gasoline.repository';
import { SplitConfigRepository } from '../../repositories/split-config.repository';
import { UserRepository } from '../../repositories/user.repository';

export interface FinancialReport {
  period: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  companyName: string;
  managerName: string;
  grossRevenue: number;
  gasolineExpense: number;
  netRevenue: number;
  carShare: number;
  employeesShare: number;
  totalDeliveries: number;
  daysWorked: number;
  deliveries: Array<{
    id: string;
    date: string;
    employeeAName: string;
    employeeBName?: string | null;
    deliveryCount: number;
    revenue: number;
    netRevenueShareA: number;
    netRevenueShareB?: number;
    carShare: number;
  }>;
  gasolineExpenses: Array<{
    id: string;
    date: string;
    amount: number;
    liters?: number;
    description?: string;
  }>;
  employeesSummary: Array<{
    employeeId: string;
    employeeName: string;
    shiftsCount: number;
    deliveriesCount: number;
    totalEarned: number;
  }>;
}

export class ReportsService {
  public static async generateFinancialReport(
    userId: string,
    options?: { period?: string; startDate?: string; endDate?: string; employeeId?: string }
  ): Promise<FinancialReport> {
    const now = new Date();
    
    let startDateStr = options?.startDate;
    let endDateStr = options?.endDate;

    if (!startDateStr || !endDateStr) {
      const days = options?.period === 'weekly' ? 7 : 30;
      const start = new Date(now.getTime() - days * 86400000);
      startDateStr = startDateStr || start.toISOString().split('T')[0];
      endDateStr = endDateStr || now.toISOString().split('T')[0];
    }

    const [user, deliveries, gasoline, splitConfig] = await Promise.all([
      UserRepository.findById(userId),
      DeliveryRepository.list(userId, {
        startDate: startDateStr,
        endDate: endDateStr,
        employeeId: options?.employeeId,
      }),
      GasolineRepository.list(userId, startDateStr),
      SplitConfigRepository.get(userId),
    ]);

    const filteredGasoline = gasoline.filter(g => g.date <= endDateStr!);

    const gross = Number(deliveries.reduce((sum, d) => sum + d.revenue, 0).toFixed(2));
    const gasTotal = Number(filteredGasoline.reduce((sum, g) => sum + g.amount, 0).toFixed(2));
    const totalDeliveries = deliveries.reduce((sum, d) => sum + d.deliveryCount, 0);
    const uniqueDays = new Set(deliveries.map(d => d.date)).size;

    const finance = FinanceService.calculateFinancialSplit(gross, gasTotal, splitConfig);

    // Aggregate by employee
    const empMap = new Map<string, { employeeId: string; employeeName: string; shiftsCount: number; deliveriesCount: number; totalEarned: number }>();

    deliveries.forEach(d => {
      // Emp A
      const curA = empMap.get(d.employeeAId) || { employeeId: d.employeeAId, employeeName: d.employeeAName || 'Entregador A', shiftsCount: 0, deliveriesCount: 0, totalEarned: 0 };
      curA.shiftsCount += 1;
      curA.deliveriesCount += d.employeeBId ? Math.ceil(d.deliveryCount / 2) : d.deliveryCount;
      curA.totalEarned = Number((curA.totalEarned + d.netRevenueShareA).toFixed(2));
      empMap.set(d.employeeAId, curA);

      // Emp B
      if (d.employeeBId && d.employeeBName) {
        const curB = empMap.get(d.employeeBId) || { employeeId: d.employeeBId, employeeName: d.employeeBName, shiftsCount: 0, deliveriesCount: 0, totalEarned: 0 };
        curB.shiftsCount += 1;
        curB.deliveriesCount += Math.floor(d.deliveryCount / 2);
        curB.totalEarned = Number((curB.totalEarned + (d.netRevenueShareB || 0)).toFixed(2));
        empMap.set(d.employeeBId, curB);
      }
    });

    return {
      period: `${startDateStr} até ${endDateStr}`,
      startDate: startDateStr,
      endDate: endDateStr,
      generatedAt: now.toISOString(),
      companyName: 'DeliveryControl',
      managerName: user ? user.name : 'Gestor Responsável',
      grossRevenue: finance.grossRevenue,
      gasolineExpense: finance.gasolineExpense,
      netRevenue: finance.netRevenue,
      carShare: finance.carAmount,
      employeesShare: Number((finance.employeeAAmount + finance.employeeBAmount).toFixed(2)),
      carPercentage: finance.carPercentage,
      employeeAPercentage: finance.employeeAPercentage,
      employeeBPercentage: finance.employeeBPercentage,
      totalDeliveries,
      daysWorked: uniqueDays,
      deliveries: deliveries.map(d => ({
        id: d.id,
        date: d.date,
        employeeAName: d.employeeAName || '',
        employeeBName: d.employeeBName,
        deliveryCount: d.deliveryCount,
        revenue: d.revenue,
        netRevenueShareA: d.netRevenueShareA,
        netRevenueShareB: d.netRevenueShareB,
        carShare: d.carShare,
      })),
      deliveriesList: deliveries.map(d => ({
        id: d.id,
        date: d.date,
        employeeAName: d.employeeAName || '',
        employeeBName: d.employeeBName,
        deliveryCount: d.deliveryCount,
        revenue: d.revenue,
        netRevenueShareA: d.netRevenueShareA,
        netRevenueShareB: d.netRevenueShareB,
        carShare: d.carShare,
      })),
      gasolineExpenses: filteredGasoline.map(g => ({
        id: g.id,
        date: g.date,
        amount: g.amount,
        liters: g.liters,
        description: g.description,
      })),
      gasolineList: filteredGasoline.map(g => ({
        id: g.id,
        date: g.date,
        amount: g.amount,
        liters: g.liters,
        description: g.description,
      })),
      employeesSummary: Array.from(empMap.values()).sort((a, b) => b.totalEarned - a.totalEarned),
    } as any;
  }

  // Backward compatibility
  public static async generateReport(userId: string, period: 'weekly' | 'monthly') {
    return this.generateFinancialReport(userId, { period });
  }
}
