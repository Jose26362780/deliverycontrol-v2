import { DashboardSummary, EmployeeFinancialSummary } from '../../types';
import { FinanceService } from '../finance/finance.service';
import { DeliveryRepository } from '../../repositories/delivery.repository';
import { GasolineRepository } from '../../repositories/gasoline.repository';
import { EmployeeRepository } from '../../repositories/employee.repository';
import { SplitConfigRepository } from '../../repositories/split-config.repository';

export class DashboardService {
  public static async getSummary(userId: string, period: 'all' | 'weekly' | 'monthly' = 'all'): Promise<DashboardSummary> {
    const now = new Date();
    let startDate: string | undefined;

    if (period === 'weekly') {
      const past7Days = new Date(now.getTime() - 7 * 86400000);
      startDate = past7Days.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      const past30Days = new Date(now.getTime() - 30 * 86400000);
      startDate = past30Days.toISOString().split('T')[0];
    }

    const [deliveriesWithDetails, userGasoline, userEmployees, splitConfig] = await Promise.all([
      DeliveryRepository.list(userId, startDate ? { startDate } : {}),
      GasolineRepository.list(userId, startDate),
      EmployeeRepository.list(userId),
      SplitConfigRepository.get(userId),
    ]);

    const totalDeliveries = deliveriesWithDetails.reduce((sum, d) => sum + d.deliveryCount, 0);
    const uniqueDays = new Set(deliveriesWithDetails.map(d => d.date));
    const totalDaysWorked = uniqueDays.size;

    const grossRevenue = Number(deliveriesWithDetails.reduce((sum, d) => sum + d.revenue, 0).toFixed(2));
    const gasolineExpense = Number(userGasoline.reduce((sum, g) => sum + g.amount, 0).toFixed(2));

    const splitResult = FinanceService.calculateFinancialSplit(grossRevenue, gasolineExpense, splitConfig);

    // Calculate individual employee summaries
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
