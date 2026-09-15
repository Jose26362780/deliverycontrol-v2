import { useState, useEffect, useCallback } from 'react';
import { FinancialReport } from '../../../types';
import { ReportService } from '../services/report.service';
import { useToast } from '../../../components/ui/Toast';
import { downloadPdfReport, openPdfInNewTab } from '../utils/pdfGenerator';

export type PeriodoPredefinido = 'todos' | 'hoje' | 'semana' | 'mes';

export function useReports() {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [periodo, setPeriodo] = useState<PeriodoPredefinido>('todos');
  const [filters, setFilters] = useState<{
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchReport = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ReportService.generateReport(filters);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Error al generar el informe');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const aplicarPeriodoPredefinido = (opcao: PeriodoPredefinido) => {
    setPeriodo(opcao);
    const hoje = new Date();
    const formatarData = (d: Date) => d.toISOString().split('T')[0];

    if (opcao === 'hoje') {
      const dataStr = formatarData(hoje);
      setFilters(prev => ({ ...prev, startDate: dataStr, endDate: dataStr }));
    } else if (opcao === 'semana') {
      const primeiroDiaSemana = new Date(hoje);
      const diaDaSemana = hoje.getDay();
      const diff = diaDaSemana === 0 ? 6 : diaDaSemana - 1; // Segunda-feira
      primeiroDiaSemana.setDate(hoje.getDate() - diff);

      setFilters(prev => ({
        ...prev,
        startDate: formatarData(primeiroDiaSemana),
        endDate: formatarData(hoje),
      }));
    } else if (opcao === 'mes') {
      const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      setFilters(prev => ({
        ...prev,
        startDate: formatarData(primeiroDiaMes),
        endDate: formatarData(hoje),
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }
  };

  const downloadPdf = () => {
    if (!report) {
      showError('Aviso', 'No hay informe disponible para descargar.');
      return;
    }
    try {
      setIsExporting(true);
      downloadPdfReport(report);
      success('Descarga completada', 'El informe en PDF se descargó con éxito.');
    } catch (err: any) {
      showError('Error al generar el PDF', err.message || 'Error al descargar el archivo');
    } finally {
      setIsExporting(false);
    }
  };

  const printOrViewPdf = () => {
    if (!report) {
      showError('Aviso', 'No hay informe disponible para visualizar.');
      return;
    }
    try {
      openPdfInNewTab(report);
    } catch {
      window.print();
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setPeriodo('todos');
    setFilters({});
  };

  return {
    report,
    filters,
    periodo,
    isLoading,
    isExporting,
    error,
    refresh: fetchReport,
    aplicarPeriodoPredefinido,
    updateFilters,
    clearFilters,
    downloadPdf,
    printOrViewPdf,
  };
}
