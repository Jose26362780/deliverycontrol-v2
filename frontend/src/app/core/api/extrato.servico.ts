import dadosExtratoMock from '../mock/extrato.json';

export interface ItemExtrato {
  id: string;
  data: string;
  descricao: string;
  tipo: 'credito' | 'debito';
  categoria: string;
  valor: number;
  saldoPosterior: number;
  remetente?: string;
  destinatario?: string;
}

export interface FiltrosExtrato {
  tipo?: 'credito' | 'debito' | 'todos';
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

export class ServicoExtrato {
  private extratos: ItemExtrato[] = [...dadosExtratoMock] as ItemExtrato[];

  async obterExtrato(filtros?: FiltrosExtrato): Promise<ItemExtrato[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let resultado = [...this.extratos];

    if (filtros?.tipo && filtros.tipo !== 'todos') {
      resultado = resultado.filter((item) => item.tipo === filtros.tipo);
    }

    if (filtros?.busca) {
      const termo = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (item) =>
          item.descricao.toLowerCase().includes(termo) ||
          item.categoria.toLowerCase().includes(termo)
      );
    }

    if (filtros?.dataInicio) {
      resultado = resultado.filter(
        (item) => new Date(item.data) >= new Date(filtros.dataInicio!)
      );
    }

    if (filtros?.dataFim) {
      resultado = resultado.filter(
        (item) => new Date(item.data) <= new Date(filtros.dataFim!)
      );
    }

    return resultado.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  async adicionarLancamento(lancamento: Omit<ItemExtrato, 'id' | 'data'>): Promise<ItemExtrato> {
    const novoItem: ItemExtrato = {
      ...lancamento,
      id: `ext-${Date.now()}`,
      data: new Date().toISOString(),
    };
    this.extratos.unshift(novoItem);
    return novoItem;
  }
}

export const servicoExtrato = new ServicoExtrato();

// Compatibilidade
export type StatementItem = ItemExtrato;
export const statementService = {
  getStatement: (filters?: any) =>
    servicoExtrato.obterExtrato({
      tipo: filters?.type === 'all' ? 'todos' : filters?.type === 'credit' ? 'credito' : filters?.type === 'debit' ? 'debito' : undefined,
      busca: filters?.query,
      dataInicio: filters?.startDate,
      dataFim: filters?.endDate,
    }),
  addStatementEntry: (entry: any) =>
    servicoExtrato.adicionarLancamento({
      descricao: entry.description || entry.descricao,
      tipo: entry.type === 'credit' ? 'credito' : 'debito',
      categoria: entry.category || entry.categoria,
      valor: entry.amount || entry.valor,
      saldoPosterior: entry.balanceAfter || entry.saldoPosterior,
      remetente: entry.sender || entry.remetente,
      destinatario: entry.recipient || entry.destinatario,
    }),
};
