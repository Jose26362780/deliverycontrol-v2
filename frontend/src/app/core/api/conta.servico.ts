import dadosContaMock from '../mock/conta.json';

export interface ContaBancaria {
  id: string;
  numeroConta: string;
  agencia: string;
  nomeBanco: string;
  tipoConta: string;
  nomeTitular: string;
  saldo: number;
  saldoPoupanca: number;
  limiteCredito: number;
  limiteCreditoUsado: number;
  chavePix: string;
  atualizadoEm: string;
}

export class ServicoConta {
  private contaAtual: ContaBancaria = { ...dadosContaMock };
  private ouvintes: Array<(conta: ContaBancaria) => void> = [];

  async obterConta(): Promise<ContaBancaria> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return { ...this.contaAtual };
  }

  async atualizarSaldo(variacao: number): Promise<ContaBancaria> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.contaAtual.saldo += variacao;
    this.contaAtual.atualizadoEm = new Date().toISOString();
    this.notificar();
    return { ...this.contaAtual };
  }

  inscrever(ouvinte: (conta: ContaBancaria) => void) {
    this.ouvintes.push(ouvinte);
    return () => {
      this.ouvintes = this.ouvintes.filter((o) => o !== ouvinte);
    };
  }

  private notificar() {
    this.ouvintes.forEach((o) => o({ ...this.contaAtual }));
  }
}

export const servicoConta = new ServicoConta();

// Exportações legadas para compatibilidade
export type BankAccount = ContaBancaria;
export const accountService = {
  getAccount: () => servicoConta.obterConta(),
  updateBalance: (delta: number) => servicoConta.atualizarSaldo(delta),
  subscribe: (listener: (acc: ContaBancaria) => void) => servicoConta.inscrever(listener),
};
