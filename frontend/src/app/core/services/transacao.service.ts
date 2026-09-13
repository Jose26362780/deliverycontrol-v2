export * from '../api/transacao.servico';
import { servicoTransacao, ServicoTransacao, Transacao } from '../api/transacao.servico';
export const transacaoService = servicoTransacao;
export const TransactionService = ServicoTransacao;
export default servicoTransacao;
