import dadosTransacaoMock from '../mock/transacao.json';
import { servicoConta } from './conta.servico';
import { servicoExtrato } from './extrato.servico';

export interface Transacao {
  id: string;
  data: string;
  tipo: 'deposito' | 'saque' | 'transferencia';
  titulo: string;
  descricao?: string;
  valor: number;
  contaDestino?: string;
  status: 'concluido' | 'pendente' | 'falha';
}

export class ServicoTransacao {
  private transacoes: Transacao[] = [...dadosTransacaoMock] as Transacao[];

  async obterTransacoes(): Promise<Transacao[]> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return [...this.transacoes];
  }

  async depositar(valor: number, descricao?: string): Promise<Transacao> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (valor <= 0) throw new Error('O valor do depósito deve ser maior que zero.');

    const novaTx: Transacao = {
      id: `tx-${Date.now()}`,
      data: new Date().toISOString(),
      tipo: 'deposito',
      titulo: 'Depósito em Conta',
      descricao: descricao || 'Depósito via Pix / Boleto',
      valor,
      status: 'concluido',
    };

    const contaAtualizada = await servicoConta.atualizarSaldo(valor);
    await servicoExtrato.adicionarLancamento({
      descricao: novaTx.descricao || novaTx.titulo,
      tipo: 'credito',
      categoria: 'Depósito',
      valor,
      saldoPosterior: contaAtualizada.saldo,
    });

    this.transacoes.unshift(novaTx);
    return novaTx;
  }

  async sacar(valor: number, descricao?: string): Promise<Transacao> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (valor <= 0) throw new Error('O valor do saque deve ser maior que zero.');

    const conta = await servicoConta.obterConta();
    if (conta.saldo < valor) {
      throw new Error('Saldo insuficiente para realizar esta operação de saque.');
    }

    const novaTx: Transacao = {
      id: `tx-${Date.now()}`,
      data: new Date().toISOString(),
      tipo: 'saque',
      titulo: 'Saque de Valores',
      descricao: descricao || 'Saque realizado em terminal / caixa',
      valor,
      status: 'concluido',
    };

    const contaAtualizada = await servicoConta.atualizarSaldo(-valor);
    await servicoExtrato.adicionarLancamento({
      descricao: novaTx.descricao || novaTx.titulo,
      tipo: 'debito',
      categoria: 'Saque',
      valor,
      saldoPosterior: contaAtualizada.saldo,
    });

    this.transacoes.unshift(novaTx);
    return novaTx;
  }

  async transferir(valor: number, contaDestino: string, descricao?: string): Promise<Transacao> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (valor <= 0) throw new Error('O valor da transferência deve ser maior que zero.');
    if (!contaDestino) throw new Error('Informe a conta ou chave PIX de destino.');

    const conta = await servicoConta.obterConta();
    if (conta.saldo < valor) {
      throw new Error('Saldo insuficiente para transferir este valor.');
    }

    const novaTx: Transacao = {
      id: `tx-${Date.now()}`,
      data: new Date().toISOString(),
      tipo: 'transferencia',
      titulo: 'Transferência Bancária / PIX',
      descricao: descricao || `Transferência para ${contaDestino}`,
      valor,
      contaDestino,
      status: 'concluido',
    };

    const contaAtualizada = await servicoConta.atualizarSaldo(-valor);
    await servicoExtrato.adicionarLancamento({
      descricao: novaTx.descricao || novaTx.titulo,
      tipo: 'debito',
      categoria: 'Transferência',
      valor,
      saldoPosterior: contaAtualizada.saldo,
      destinatario: contaDestino,
    });

    this.transacoes.unshift(novaTx);
    return novaTx;
  }
}

export const servicoTransacao = new ServicoTransacao();

// Compatibilidade
export type Transaction = Transacao;
export const transactionService = {
  getTransactions: async () => {
    const list = await servicoTransacao.obterTransacoes();
    return list.map((tx) => ({
      id: tx.id,
      date: tx.data,
      type: tx.tipo === 'deposito' ? 'deposit' : tx.tipo === 'saque' ? 'withdraw' : 'transfer',
      title: tx.titulo,
      description: tx.descricao,
      amount: tx.valor,
      targetAccount: tx.contaDestino,
      status: tx.status === 'concluido' ? 'completed' : 'failed',
    }));
  },
  deposit: (amount: number, desc?: string) => servicoTransacao.depositar(amount, desc),
  withdraw: (amount: number, desc?: string) => servicoTransacao.sacar(amount, desc),
  transfer: (amount: number, target: string, desc?: string) => servicoTransacao.transferir(amount, target, desc),
};
