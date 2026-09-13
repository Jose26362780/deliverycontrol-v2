import { useState, useEffect, useCallback } from 'react';
import { GasolineExpense } from '../../../types';
import { GasolineService, GasolineFilters } from '../services/gasoline.service';
import { GasolineFormValues } from '../schemas/gasoline.schema';
import { useToast } from '../../../components/ui/Toast';

export function useGasoline(initialFilters?: GasolineFilters) {
  const [expenses, setExpenses] = useState<GasolineExpense[]>([]);
  const [filters, setFilters] = useState<GasolineFilters>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await GasolineService.list(filters);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar despesas de gasolina');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (data: GasolineFormValues) => {
    try {
      setIsSubmitting(true);
      const created = await GasolineService.create(data);
      setExpenses(prev => [created, ...prev]);
      success('Abastecimento registrado', `Despesa de ${created.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} salva.`);
      return created;
    } catch (err: any) {
      showError('Erro ao registrar gasolina', err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExpense = async (id: string, data: GasolineFormValues) => {
    try {
      setIsSubmitting(true);
      const updated = await GasolineService.update(id, data);
      setExpenses(prev => prev.map(e => (e.id === id ? updated : e)));
      success('Abastecimento atualizado', 'Registro de combustível atualizado com sucesso.');
      return updated;
    } catch (err: any) {
      showError('Erro ao atualizar combustível', err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await GasolineService.delete(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      success('Despesa excluída', 'Registro de combustível removido.');
    } catch (err: any) {
      showError('Erro ao remover despesa', err.message);
      throw err;
    }
  };

  const updateFilters = (newFilters: Partial<GasolineFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    expenses,
    filters,
    isLoading,
    isSubmitting,
    error,
    refresh: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    updateFilters,
    clearFilters,
  };
}
