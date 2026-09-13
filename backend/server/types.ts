export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  googleId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Employee {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  active?: boolean;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Delivery {
  id: string;
  date: string; // YYYY-MM-DD
  employeeAId: string;
  employeeBId?: string | null;
  deliveryCount: number;
  revenue: number; // Valor gerado bruto (R$)
  userId: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GasolineExpense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number; // Valor gasto (R$)
  liters?: number;
  userId: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SplitRuleConfig {
  id?: string;
  userId: string;
  carPercentage: number; // Padrão: 50%
  employeeAPercentage: number; // Padrão: 25%
  employeeBPercentage: number; // Padrão: 25%
  updatedAt?: string;
}

export interface FinancialCalculationResult {
  grossRevenue: number;
  gasolineExpense: number;
  netRevenue: number;
  carAmount: number;
  employeeAAmount: number;
  employeeBAmount: number;
  carPercentage: number;
  employeeAPercentage: number;
  employeeBPercentage: number;
}

export interface EmployeeFinancialSummary {
  employeeId: string;
  employeeName: string;
  deliveriesCount: number;
  shiftsCount: number;
  totalEarned: number;
}

export interface DashboardSummary {
  period: 'all' | 'weekly' | 'monthly';
  totalDeliveries: number;
  totalDaysWorked: number;
  grossRevenue: number;
  gasolineExpense: number;
  netRevenue: number;
  carShare: number;
  employeesShare: number;
  carPercentage: number;
  employeeAPercentage: number;
  employeeBPercentage: number;
  recentDeliveries: DeliveryWithEmployees[];
  employeesSummary: EmployeeFinancialSummary[];
}

export interface DeliveryWithEmployees extends Delivery {
  employeeAName: string;
  employeeBName?: string | null;
  netRevenueShareA: number;
  netRevenueShareB: number;
  carShare: number;
}
