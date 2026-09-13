import { useState, useEffect, useCallback } from 'react';
import { Delivery } from '../../../types';
import { DeliveryService, DeliveryFilters } from '../services/delivery.service';
import { DeliveryFormValues } from '../schemas/delivery.schema';
import { useToast } from '../../../components/ui/Toast';

export function useDeliveries(initialFilters?: DeliveryFilters) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filters, setFilters] = useState<DeliveryFilters>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchDeliveries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await DeliveryService.list(filters);
      setDeliveries(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar entregas');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const createDelivery = async (data: DeliveryFormValues) => {
    try {
      setIsSubmitting(true);
      const created = await DeliveryService.create(data);
      setDeliveries(prev => [created, ...prev]);
      success('Entrega registrada', `${data.deliveryCount} entregas adicionadas com sucesso.`);
      return created;
    } catch (err: any) {
      showError('Erro ao registrar entrega', err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDelivery = async (id: string, data: DeliveryFormValues) => {
    try {
      setIsSubmitting(true);
      const updated = await DeliveryService.update(id, data);
      setDeliveries(prev => prev.map(d => (d.id === id ? updated : d)));
      success('Entrega atualizada', 'Os dados do turno foram atualizados.');
      return updated;
    } catch (err: any) {
      showError('Erro ao atualizar entrega', err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDelivery = async (id: string) => {
    try {
      await DeliveryService.delete(id);
      setDeliveries(prev => prev.filter(d => d.id !== id));
      success('Entrega excluída', 'O registro foi removido com sucesso.');
    } catch (err: any) {
      showError('Erro ao excluir entrega', err.message);
      throw err;
    }
  };

  const updateFilters = (newFilters: Partial<DeliveryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    deliveries,
    filters,
    isLoading,
    isSubmitting,
    error,
    refresh: fetchDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    updateFilters,
    clearFilters,
  };
}
