import { db } from '../../db/database';
import { DashboardSummary, EmployeeFinancialSummary, DeliveryWithEmployees } from '../../types';
import { FinanceService } from '../finance/finance.service';
import { DeliveryService } from '../deliveries/delivery.service';

export class DashboardService {
  public static getSummary(userId: string, period: 'all' | 'weekly' | 'monthly' = 'all'): DashboardSummary {
    const now = new Date();
    let startDate: string | undefined;

    if (period === 'weekly') {
      const past7Days = new Date(now.getTime() - 7 * 86400000);
      startDate = past7Days.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      const past30Days = new Date(now.getTime() - 30 * 86400000);
      startDate = past30Days.toISOString().split('T')[0];
    }

    // Filter deliveries & gasoline
    let userDeliveries = db.deliveries.filter(d => d.userId === userId);
    let userGasoline = db.gasolineExpenses.filter(g => g.userId === userId);

    if (startDate) {
      userDeliveries = userDeliveries.filter(d => d.date >= startDate!);
      userGasoline = userGasoline.filter(g => g.date >= startDate!);
    }

    const splitConfig = db.getSplitConfig(userId);

    const totalDeliveries = userDeliveries.reduce((sum, d) => sum + d.deliveryCount, 0);
    const uniqueDays = new Set(userDeliveries.map(d => d.date));
    const totalDaysWorked = uniqueDays.size;

    const grossRevenue = Number(userDeliveries.reduce((sum, d) => sum + d.revenue, 0).toFixed(2));
    const gasolineExpense = Number(userGasoline.reduce((sum, g) => sum + g.amount, 0).toFixed(2));

    const splitResult = FinanceService.calculateFinancialSplit(grossRevenue, gasolineExpense, splitConfig);

    // Calculate individual employee summaries
    const userEmployees = db.employees.filter(e => e.userId === userId);
    const employeeMap = new Map<string, EmployeeFinancialSummary>();

    userEmployees.forEach(emp => {
      employeeMap.set(emp.id, {
        employeeId: emp.id,
        employeeName: emp.name,
        deliveriesCount: 0,
        shiftsCount: 0,
        totalEarned: 0,
      });
    });

    const deliveriesWithDetails = DeliveryService.list(userId, startDate ? { startDate } : {});

    deliveriesWithDetails.forEach(d => {
      if (employeeMap.has(d.employeeAId)) {
        const item = employeeMap.get(d.employeeAId)!;
        item.deliveriesCount += d.employeeBId ? Math.ceil(d.deliveryCount / 2) : d.deliveryCount;
        item.shiftsCount += 1;
        item.totalEarned = Number((item.totalEarned + d.netRevenueShareA).toFixed(2));
      }

      if (d.employeeBId && employeeMap.has(d.employeeBId)) {
        const item = employeeMap.get(d.employeeBId)!;
        item.deliveriesCount += Math.floor(d.deliveryCount / 2);
        item.shiftsCount += 1;
        item.totalEarned = Number((item.totalEarned + d.netRevenueShareB).toFixed(2));
      }
    });

    return {
      period,
      totalDeliveries,
      totalDaysWorked,
      grossRevenue: splitResult.grossRevenue,
      gasolineExpense: splitResult.gasolineExpense,
      netRevenue: splitResult.netRevenue,
      carShare: splitResult.carAmount,
      employeesShare: Number((splitResult.employeeAAmount + splitResult.employeeBAmount).toFixed(2)),
      carPercentage: splitResult.carPercentage,
      employeeAPercentage: splitResult.employeeAPercentage,
      employeeBPercentage: splitResult.employeeBPercentage,
      recentDeliveries: deliveriesWithDetails.slice(0, 10),
      employeesSummary: Array.from(employeeMap.values()).sort((a, b) => b.totalEarned - a.totalEarned),
    };
  }
}
