export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '--/--/----';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '--/--/---- --:--';
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('es-ES')} a las ${d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return dateStr;
  }
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${Number(value).toFixed(1).replace('.0', '')}%`;
}
