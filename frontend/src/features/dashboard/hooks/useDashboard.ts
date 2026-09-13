import { useState, useEffect, useCallback } from 'react';
import { DashboardSummary, SplitRuleConfig } from '../../../types';
import { DashboardService } from '../services/dashboard.service';
import { useToast } from '../../../components/ui/Toast';

export function useDashboard() {
  const [period, setPeriod] = useState<'all' | 'weekly' | 'monthly'>('all');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [splitConfig, setSplitConfig] = useState<SplitRuleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingSplit, setIsUpdatingSplit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let dataPromise: Promise<DashboardSummary>;
      if (period === 'weekly') {
        dataPromise = DashboardService.getWeekly();
      } else if (period === 'monthly') {
        dataPromise = DashboardService.getMonthly();
      } else {
        dataPromise = DashboardService.getOverview();
      }

      const [summaryData, configData] = await Promise.all([
        dataPromise,
        DashboardService.getSplitConfig().catch(() => null),
      ]);

      setSummary(summaryData);
      if (configData) {
        setSplitConfig(configData);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateSplit = async (newConfig: {
    carPercentage: number;
    employeeAPercentage: number;
    employeeBPercentage: number;
  }) => {
    try {
      setIsUpdatingSplit(true);
      const updated = await DashboardService.updateSplitConfig(newConfig);
      setSplitConfig(updated);
      success('Regra de divisão atualizada', `Carro: ${updated.carPercentage}% | Func A: ${updated.employeeAPercentage}% | Func B: ${updated.employeeBPercentage}%`);
      await fetchDashboardData();
      return updated;
    } catch (err: any) {
      showError('Erro ao atualizar divisão', err.message);
      throw err;
    } finally {
      setIsUpdatingSplit(false);
    }
  };

  return {
    period,
    setPeriod,
    summary,
    splitConfig,
    isLoading,
    isUpdatingSplit,
    error,
    refresh: fetchDashboardData,
    updateSplit,
  };
}
