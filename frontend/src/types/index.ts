export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role?: string;
  active: boolean;
  userId: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  date: string;
  employeeAId: string;
  employeeBId?: string | null;
  employeeAName?: string;
  employeeBName?: string | null;
  deliveryCount: number;
  revenue: number;
  userId: string;
  notes?: string;
  netRevenueShareA?: number;
  netRevenueShareB?: number;
  carShare?: number;
  createdAt: string;
}

export interface GasolineExpense {
  id: string;
  date: string;
  amount: number;
  liters?: number;
  description?: string;
  userId: string;
  createdAt: string;
}

export interface SplitRuleConfig {
  userId: string;
  carPercentage: number;
  employeeAPercentage: number;
  employeeBPercentage: number;
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
  recentDeliveries: Delivery[];
  employeesSummary: EmployeeFinancialSummary[];
}

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

export interface ReportData {
  title: string;
  period: 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate: string;
  generatedAt: string;
  companyName: string;
  managerName: string;
  financialSummary: FinancialCalculationResult;
  operationalMetrics: {
    totalDeliveries: number;
    daysWorked: number;
    averageDeliveriesPerDay: number;
    averageRevenuePerDelivery: number;
    totalFuelLiters: number;
  };
  deliveries: Array<{
    id: string;
    date: string;
    employeeAName: string;
    employeeBName?: string | null;
    count: number;
    revenue: number;
    netA: number;
    netB: number;
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
    name: string;
    shiftsCount: number;
    deliveriesCount: number;
    totalEarned: number;
  }>;
}
