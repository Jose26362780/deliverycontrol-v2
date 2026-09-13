import accountMock from '../mock/account.json';

export interface BankAccount {
  id: string;
  accountNumber: string;
  agency: string;
  bankName: string;
  accountType: string;
  holderName: string;
  balance: number;
  savingsBalance: number;
  creditLimit: number;
  usedCreditLimit: number;
  pixKey: string;
  updatedAt: string;
}

class AccountService {
  private currentAccount: BankAccount = { ...accountMock };
  private listeners: Array<(account: BankAccount) => void> = [];

  async getAccount(): Promise<BankAccount> {
    // Simula delay de requisição HTTP assíncrona
    await new Promise((resolve) => setTimeout(resolve, 80));
    return { ...this.currentAccount };
  }

  async updateBalance(delta: number): Promise<BankAccount> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.currentAccount.balance += delta;
    this.currentAccount.updatedAt = new Date().toISOString();
    this.notify();
    return { ...this.currentAccount };
  }

  subscribe(listener: (account: BankAccount) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.currentAccount }));
  }
}

export const accountService = new AccountService();
