import statementMock from '../mock/statement.json';

export interface StatementItem {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  balanceAfter: number;
  sender?: string;
  recipient?: string;
}

class StatementService {
  private statements: StatementItem[] = [...statementMock] as StatementItem[];

  async getStatement(filters?: {
    type?: 'credit' | 'debit' | 'all';
    startDate?: string;
    endDate?: string;
    query?: string;
  }): Promise<StatementItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let result = [...this.statements];

    if (filters?.type && filters.type !== 'all') {
      result = result.filter((item) => item.type === filters.type);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (item) =>
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    if (filters?.startDate) {
      result = result.filter(
        (item) => new Date(item.date) >= new Date(filters.startDate!)
      );
    }

    if (filters?.endDate) {
      result = result.filter(
        (item) => new Date(item.date) <= new Date(filters.endDate!)
      );
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addStatementEntry(entry: Omit<StatementItem, 'id' | 'date'>): Promise<StatementItem> {
    const newItem: StatementItem = {
      ...entry,
      id: `st-${Date.now()}`,
      date: new Date().toISOString(),
    };
    this.statements.unshift(newItem);
    return newItem;
  }
}

export const statementService = new StatementService();
