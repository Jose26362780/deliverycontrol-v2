/**
 * Pipe responsável pela formatação de valores monetários no padrão Brasileiro (BRL)
 * Exemplo: 1250.5 -> R$ 1.250,50
 */
export function currencyBrPipe(
  value: number | string | undefined | null,
  options?: {
    showPrefix?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return options?.showPrefix !== false ? 'R$ 0,00' : '0,00';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: options?.showPrefix !== false ? 'currency' : 'decimal',
    currency: 'BRL',
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(num);

  return formatted;
}

/**
 * Helper hook / wrapper para uso em componentes
 */
export const useCurrencyBr = () => {
  return {
    transform: currencyBrPipe,
  };
};

export default currencyBrPipe;
