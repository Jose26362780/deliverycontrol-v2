/**
 * Pipe / Função utilitária para formatação de valores em Real Brasileiro (BRL)
 */
export function formatarMoedaBR(
  valor: number | string | undefined | null,
  opcoes?: {
    exibirPrefixo?: boolean;
    fracaoMinima?: number;
    fracaoMaxima?: number;
  }
): string {
  if (valor === undefined || valor === null || isNaN(Number(valor))) {
    return opcoes?.exibirPrefixo !== false ? 'R$ 0,00' : '0,00';
  }

  const num = typeof valor === 'string' ? parseFloat(valor) : valor;

  return new Intl.NumberFormat('pt-BR', {
    style: opcoes?.exibirPrefixo !== false ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: opcoes?.fracaoMinima ?? 2,
    maximumFractionDigits: opcoes?.fracaoMaxima ?? 2,
  }).format(num);
}

export const currencyBrPipe = (val: any, opt?: any) =>
  formatarMoedaBR(val, {
    exibirPrefixo: opt?.showPrefix,
    fracaoMinima: opt?.minimumFractionDigits,
    fracaoMaxima: opt?.maximumFractionDigits,
  });

export default formatarMoedaBR;
