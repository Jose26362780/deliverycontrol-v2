import { FinancialCalculationResult, SplitRuleConfig } from '../../types';

export class FinanceService {
  /**
   * Centralized financial calculation logic
   * Regra financeira do DeliveryControl:
   * Receita Bruta - Gasolina = Receita Líquida
   * Receita Líquida -> Carro %, Funcionário A %, Funcionário B %
   */
  public static calculateFinancialSplit(
    grossRevenue: number,
    gasolineExpense: number,
    splitConfig?: Partial<SplitRuleConfig> | null
  ): FinancialCalculationResult {
    const gross = Math.max(0, Number(grossRevenue) || 0);
    const gas = Math.max(0, Number(gasolineExpense) || 0);
    
    // Net Revenue
    const netRevenue = Math.max(0, gross - gas);

    // Custom or default split rules
    const carPercentage = splitConfig?.carPercentage ?? 50;
    const employeeAPercentage = splitConfig?.employeeAPercentage ?? 25;
    const employeeBPercentage = splitConfig?.employeeBPercentage ?? 25;

    // Normalizing percentages to ensure sum is 100%
    const totalPercentage = carPercentage + employeeAPercentage + employeeBPercentage;
    const normalizedCar = totalPercentage > 0 ? (carPercentage / totalPercentage) : 0.5;
    const normalizedA = totalPercentage > 0 ? (employeeAPercentage / totalPercentage) : 0.25;
    const normalizedB = totalPercentage > 0 ? (employeeBPercentage / totalPercentage) : 0.25;

    const carAmount = Number((netRevenue * normalizedCar).toFixed(2));
    const employeeAAmount = Number((netRevenue * normalizedA).toFixed(2));
    const employeeBAmount = Number((netRevenue * normalizedB).toFixed(2));

    return {
      grossRevenue: Number(gross.toFixed(2)),
      gasolineExpense: Number(gas.toFixed(2)),
      netRevenue: Number(netRevenue.toFixed(2)),
      carAmount,
      employeeAAmount,
      employeeBAmount,
      carPercentage,
      employeeAPercentage,
      employeeBPercentage
    };
  }

  /**
   * Calculates individual delivery net share for assigned employees
   */
  public static calculateDeliveryShare(
    revenue: number,
    hasEmployeeB: boolean,
    splitConfig?: Partial<SplitRuleConfig> | null
  ): { carShare: number; employeeAShare: number; employeeBShare: number } {
    const carPerc = splitConfig?.carPercentage ?? 50;
    const aPerc = splitConfig?.employeeAPercentage ?? 25;
    const bPerc = splitConfig?.employeeBPercentage ?? 25;

    const carFraction = carPerc / 100;
    const carShare = Number((revenue * carFraction).toFixed(2));
    const remainingForEmployees = revenue - carShare;

    if (hasEmployeeB) {
      const sumEmp = (aPerc + bPerc) || 50;
      const employeeAShare = Number((remainingForEmployees * (aPerc / sumEmp)).toFixed(2));
      const employeeBShare = Number((remainingForEmployees * (bPerc / sumEmp)).toFixed(2));
      return { carShare, employeeAShare, employeeBShare };
    } else {
      // Single employee gets the full worker share for the shift
      return {
        carShare,
        employeeAShare: Number(remainingForEmployees.toFixed(2)),
        employeeBShare: 0
      };
    }
  }
}
