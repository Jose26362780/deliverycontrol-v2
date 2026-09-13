import { db } from '../../db/database';
import { FinanceService } from '../finance/finance.service';

export class AnalyticsService {
  public static getRevenueAnalytics(userId: string) {
    const deliveries = db.deliveries.filter(d => d.userId === userId);
    const gasoline = db.gasolineExpenses.filter(g => g.userId === userId);

    // Group by date
    const dateMap = new Map<string, { date: string; gross: number; gasoline: number; net: number }>();

    deliveries.forEach(d => {
      const current = dateMap.get(d.date) || { date: d.date, gross: 0, gasoline: 0, net: 0 };
      current.gross += d.revenue;
      dateMap.set(d.date, current);
    });

    gasoline.forEach(g => {
      const current = dateMap.get(g.date) || { date: g.date, gross: 0, gasoline: 0, net: 0 };
      current.gasoline += g.amount;
      dateMap.set(g.date, current);
    });

    const series = Array.from(dateMap.values())
      .map(item => ({
        date: item.date,
        grossRevenue: Number(item.gross.toFixed(2)),
        gasolineExpense: Number(item.gasoline.toFixed(2)),
        netRevenue: Number(Math.max(0, item.gross - item.gasoline).toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalGross = series.reduce((acc, s) => acc + s.grossRevenue, 0);
    const totalGas = series.reduce((acc, s) => acc + s.gasolineExpense, 0);
    const totalNet = series.reduce((acc, s) => acc + s.netRevenue, 0);

    return {
      series,
      totals: {
        totalGross: Number(totalGross.toFixed(2)),
        totalGas: Number(totalGas.toFixed(2)),
        totalNet: Number(totalNet.toFixed(2)),
        netMarginPercentage: totalGross > 0 ? Number(((totalNet / totalGross) * 100).toFixed(1)) : 0,
      }
    };
  }

  public static getDeliveryAnalytics(userId: string) {
    const deliveries = db.deliveries.filter(d => d.userId === userId);
    
    // Group by date
    const map = new Map<string, { date: string; count: number; revenue: number; shifts: number }>();

    deliveries.forEach(d => {
      const current = map.get(d.date) || { date: d.date, count: 0, revenue: 0, shifts: 0 };
      current.count += d.deliveryCount;
      current.revenue += d.revenue;
      current.shifts += 1;
      map.set(d.date, current);
    });

    const series = Array.from(map.values())
      .map(item => ({
        date: item.date,
        deliveriesCount: item.count,
        revenue: Number(item.revenue.toFixed(2)),
        averageTicket: item.count > 0 ? Number((item.revenue / item.count).toFixed(2)) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalDeliveries = series.reduce((acc, s) => acc + s.deliveriesCount, 0);
    const averagePerDay = series.length > 0 ? Number((totalDeliveries / series.length).toFixed(1)) : 0;

    return {
      series,
      totalDeliveries,
      averagePerDay,
      daysTracked: series.length
    };
  }

  public static getGasolineAnalytics(userId: string) {
    const expenses = db.gasolineExpenses.filter(g => g.userId === userId);
    const deliveries = db.deliveries.filter(d => d.userId === userId);

    const totalSpent = expenses.reduce((sum, g) => sum + g.amount, 0);
    const totalLiters = expenses.reduce((sum, g) => sum + (g.liters || 0), 0);
    const totalDeliveries = deliveries.reduce((sum, d) => sum + d.deliveryCount, 0);

    const series = expenses
      .map(g => ({
        id: g.id,
        date: g.date,
        amount: g.amount,
        liters: g.liters || 0,
        description: g.description,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const costPerDelivery = totalDeliveries > 0 ? Number((totalSpent / totalDeliveries).toFixed(2)) : 0;

    return {
      series,
      totalSpent: Number(totalSpent.toFixed(2)),
      totalLiters: Number(totalLiters.toFixed(2)),
      costPerDelivery,
      totalRefuels: expenses.length,
    };
  }

  public static getDistributionAnalytics(userId: string) {
    const deliveries = db.deliveries.filter(d => d.userId === userId);
    const gasoline = db.gasolineExpenses.filter(g => g.userId === userId);
    const splitConfig = db.getSplitConfig(userId);

    const totalGross = deliveries.reduce((sum, d) => sum + d.revenue, 0);
    const totalGas = gasoline.reduce((sum, g) => sum + g.amount, 0);
    const calculation = FinanceService.calculateFinancialSplit(totalGross, totalGas, splitConfig);

    const slices = [
      {
        name: 'Carro / Manutenção',
        value: calculation.carAmount,
        percentage: calculation.carPercentage,
        color: '#a3e635', // lime-400
      },
      {
        name: 'Funcionário A',
        value: calculation.employeeAAmount,
        percentage: calculation.employeeAPercentage,
        color: '#8b5cf6', // violet-500
      },
      {
        name: 'Funcionário B',
        value: calculation.employeeBAmount,
        percentage: calculation.employeeBPercentage,
        color: '#38bdf8', // sky-400
      },
      {
        name: 'Combustível (Despesa)',
        value: calculation.gasolineExpense,
        percentage: totalGross > 0 ? Number(((calculation.gasolineExpense / totalGross) * 100).toFixed(1)) : 0,
        color: '#f59e0b', // amber-500
      }
    ];

    return {
      financialSplit: calculation,
      distributionSlices: slices,
      splitConfig,
    };
  }
}
