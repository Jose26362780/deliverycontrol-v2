import transactionMock from '../mock/transaction.json';
import { accountService } from './account.service';
import { statementService } from './statement.service';

export interface Transaction {
  id: string;
  date: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  title: string;
  description?: string;
  amount: number;
  targetAccount?: string;
  status: 'completed' | 'pending' | 'failed';
}

class TransactionService {
  private transactions: Transaction[] = [...transactionMock] as Transaction[];

  async getTransactions(): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return [...this.transactions];
  }

  async deposit(amount: number, description?: string): Promise<Transaction> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (amount <= 0) throw new Error('O valor do depósito deve ser maior que zero.');

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'deposit',
      title: 'Depósito em Conta',
      description: description || 'Depósito via Pix / Boleto',
      amount,
      status: 'completed',
    };

    const updatedAccount = await accountService.updateBalance(amount);
    await statementService.addStatementEntry({
      description: newTx.description || newTx.title,
      type: 'credit',
      category: 'Depósito',
      amount,
      balanceAfter: updatedAccount.balance,
    });

    this.transactions.unshift(newTx);
    return newTx;
  }

  async withdraw(amount: number, description?: string): Promise<Transaction> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (amount <= 0) throw new Error('O valor do saque deve ser maior que zero.');

    const account = await accountService.getAccount();
    if (account.balance < amount) {
      throw new Error('Saldo insuficiente para realizar esta operação de saque.');
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'withdraw',
      title: 'Saque de Valores',
      description: description || 'Saque realizado em terminal / caixa',
      amount,
      status: 'completed',
    };

    const updatedAccount = await accountService.updateBalance(-amount);
    await statementService.addStatementEntry({
      description: newTx.description || newTx.title,
      type: 'debit',
      category: 'Saque',
      amount,
      balanceAfter: updatedAccount.balance,
    });

    this.transactions.unshift(newTx);
    return newTx;
  }

  async transfer(amount: number, targetAccount: string, description?: string): Promise<Transaction> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (amount <= 0) throw new Error('O valor da transferência deve ser maior que zero.');
    if (!targetAccount) throw new Error('Informe a conta ou chave PIX de destino.');

    const account = await accountService.getAccount();
    if (account.balance < amount) {
      throw new Error('Saldo insuficiente para transferir este valor.');
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'transfer',
      title: 'Transferência Bancária / PIX',
      description: description || `Transferência para ${targetAccount}`,
      amount,
      targetAccount,
      status: 'completed',
    };

    const updatedAccount = await accountService.updateBalance(-amount);
    await statementService.addStatementEntry({
      description: newTx.description || newTx.title,
      type: 'debit',
      category: 'Transferência',
      amount,
      balanceAfter: updatedAccount.balance,
      recipient: targetAccount,
    });

    this.transactions.unshift(newTx);
    return newTx;
  }
}

export const transactionService = new TransactionService();
