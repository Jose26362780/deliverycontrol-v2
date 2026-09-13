import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Employee, Delivery, GasolineExpense, SplitRuleConfig } from '../types';

interface DatabaseSchema {
  users: User[];
  employees: Employee[];
  deliveries: Delivery[];
  gasolineExpenses: GasolineExpense[];
  splitConfigs: SplitRuleConfig[];
}

export class Database {
  private static instance: Database;
  private readonly storageFilePath: string;
  
  public users: User[] = [];
  public employees: Employee[] = [];
  public deliveries: Delivery[] = [];
  public gasolineExpenses: GasolineExpense[] = [];
  public splitConfigs: SplitRuleConfig[] = [];

  private constructor() {
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.warn('[Database] Não foi possível criar pasta .data, usando diretório atual:', err);
      }
    }
    this.storageFilePath = path.join(dataDir, 'deliverycontrol.db.json');
    this.loadFromDiskOrSeed();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public saveToDisk(): void {
    try {
      const data: DatabaseSchema = {
        users: this.users,
        employees: this.employees,
        deliveries: this.deliveries,
        gasolineExpenses: this.gasolineExpenses,
        splitConfigs: this.splitConfigs,
      };
      fs.writeFileSync(this.storageFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('[Database] Erro ao persistir dados em disco:', error);
    }
  }

  private loadFromDiskOrSeed(): void {
    if (fs.existsSync(this.storageFilePath)) {
      try {
        const fileContent = fs.readFileSync(this.storageFilePath, 'utf-8');
        const parsed: DatabaseSchema = JSON.parse(fileContent);
        if (parsed.users && parsed.deliveries && parsed.employees) {
          this.users = parsed.users;
          this.employees = parsed.employees;
          this.deliveries = parsed.deliveries;
          this.gasolineExpenses = parsed.gasolineExpenses || [];
          this.splitConfigs = parsed.splitConfigs || [];
          return;
        }
      } catch (error) {
        console.warn('[Database] Arquivo de dados corrompido, recriando com semente inicial:', error);
      }
    }

    this.seedInitialData();
    this.saveToDisk();
  }

  private seedInitialData() {
    const demoUserId = 'user-demo-1';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('senha123', salt);

    // 1. User
    this.users.push({
      id: demoUserId,
      name: 'Gestor Demo',
      email: 'demo@deliverycontrol.com',
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Employees
    const emp1: Employee = {
      id: 'emp-1',
      name: 'Carlos Oliveira',
      role: 'Entregador A',
      phone: '(11) 98765-4321',
      active: true,
      userId: demoUserId,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };
    const emp2: Employee = {
      id: 'emp-2',
      name: 'Mateus Santos',
      role: 'Entregador B',
      phone: '(11) 97654-3210',
      active: true,
      userId: demoUserId,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    };
    const emp3: Employee = {
      id: 'emp-3',
      name: 'Juliana Ferreira',
      role: 'Entregadora Reserva',
      phone: '(11) 96543-2109',
      active: true,
      userId: demoUserId,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    };
    this.employees.push(emp1, emp2, emp3);

    // 3. Split Config
    this.splitConfigs.push({
      id: 'split-demo-1',
      userId: demoUserId,
      carPercentage: 50,
      employeeAPercentage: 25,
      employeeBPercentage: 25,
      updatedAt: new Date().toISOString(),
    });

    // 4. Sample Deliveries (last 14 days)
    const now = new Date();
    const formatDate = (daysAgo: number) => {
      const d = new Date(now.getTime() - daysAgo * 86400000);
      return d.toISOString().split('T')[0];
    };

    const deliverySeeds = [
      { daysAgo: 0, count: 28, revenue: 980, empA: emp1.id, empB: emp2.id, note: 'Turno noite - Chuva leve' },
      { daysAgo: 1, count: 24, revenue: 840, empA: emp1.id, empB: emp2.id, note: 'Turno padrão' },
      { daysAgo: 2, count: 32, revenue: 1120, empA: emp1.id, empB: emp3.id, note: 'Sexta-feira pico de pedidos' },
      { daysAgo: 3, count: 30, revenue: 1050, empA: emp2.id, empB: emp3.id, note: 'Sábado movimento alto' },
      { daysAgo: 4, count: 22, revenue: 770, empA: emp1.id, empB: null, note: 'Turno reduzido' },
      { daysAgo: 6, count: 26, revenue: 910, empA: emp1.id, empB: emp2.id, note: 'Turno regular' },
      { daysAgo: 7, count: 29, revenue: 1015, empA: emp1.id, empB: emp2.id, note: 'Semana anterior' },
      { daysAgo: 8, count: 25, revenue: 875, empA: emp2.id, empB: emp3.id, note: 'Semana anterior' },
      { daysAgo: 9, count: 27, revenue: 945, empA: emp1.id, empB: emp3.id, note: 'Semana anterior' },
      { daysAgo: 11, count: 31, revenue: 1085, empA: emp1.id, empB: emp2.id, note: 'Alta demanda' },
      { daysAgo: 12, count: 20, revenue: 700, empA: emp2.id, empB: null, note: 'Dia tranquilo' },
    ];

    deliverySeeds.forEach((s, idx) => {
      this.deliveries.push({
        id: `del-${idx + 1}`,
        date: formatDate(s.daysAgo),
        employeeAId: s.empA,
        employeeBId: s.empB,
        deliveryCount: s.count,
        revenue: s.revenue,
        userId: demoUserId,
        notes: s.note,
        createdAt: new Date(now.getTime() - s.daysAgo * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - s.daysAgo * 86400000).toISOString(),
      });
    });

    // 5. Gasoline Expenses
    const gasSeeds = [
      { daysAgo: 0, amount: 95, liters: 16.5, desc: 'Abastecimento Posto Ipiranga' },
      { daysAgo: 2, amount: 110, liters: 19.2, desc: 'Abastecimento Posto Shell' },
      { daysAgo: 4, amount: 80, liters: 14.0, desc: 'Gasolina aditivada' },
      { daysAgo: 7, amount: 105, liters: 18.5, desc: 'Abastecimento semanal' },
      { daysAgo: 9, amount: 90, liters: 15.8, desc: 'Abastecimento regular' },
      { daysAgo: 12, amount: 75, liters: 13.2, desc: 'Posto Petrobras' },
    ];

    gasSeeds.forEach((g, idx) => {
      this.gasolineExpenses.push({
        id: `gas-${idx + 1}`,
        date: formatDate(g.daysAgo),
        amount: g.amount,
        liters: g.liters,
        userId: demoUserId,
        description: g.desc,
        createdAt: new Date(now.getTime() - g.daysAgo * 86400000).toISOString(),
        updatedAt: new Date(now.getTime() - g.daysAgo * 86400000).toISOString(),
      });
    });
  }

  // Helper find methods
  public findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public getSplitConfig(userId: string): SplitRuleConfig {
    const found = this.splitConfigs.find(c => c.userId === userId);
    if (found) return found;
    const defaultCfg: SplitRuleConfig = {
      id: `split-${userId}`,
      userId,
      carPercentage: 50,
      employeeAPercentage: 25,
      employeeBPercentage: 25,
      updatedAt: new Date().toISOString(),
    };
    this.splitConfigs.push(defaultCfg);
    this.saveToDisk();
    return defaultCfg;
  }

  public isEmployeeReferencedInDeliveries(employeeId: string, userId: string): boolean {
    return this.deliveries.some(
      d => d.userId === userId && (d.employeeAId === employeeId || d.employeeBId === employeeId)
    );
  }
}

export const db = Database.getInstance();

