import { useState, useEffect, useCallback } from 'react';
import { Employee } from '../../../types';
import { EmployeeService } from '../services/employee.service';
import { EmployeeFormValues } from '../schemas/employee.schema';
import { useToast } from '../../../components/ui/Toast';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await EmployeeService.list();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar funcionários');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      const created = await EmployeeService.create(data);
      setEmployees(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
      success('Funcionário cadastrado', `${created.name} foi adicionado à equipe.`);
      return created;
    } catch (err: any) {
      showError('Erro ao cadastrar funcionário', err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEmployee = async (id: string, data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      const updated = await EmployeeService.update(id, data);
      setEmployees(prev => prev.map(e => (e.id === id ? updated : e)));
      success('Funcionário atualizado', `${updated.name} foi modificado.`);
      return updated;
    } catch (err: any) {
      showError('Erro ao atualizar funcionário', err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const updated = await EmployeeService.update(id, { active });
      setEmployees(prev => prev.map(e => (e.id === id ? updated : e)));
      success(
        active ? 'Funcionário reativado' : 'Funcionário arquivado',
        `${updated.name} foi ${active ? 'reativado' : 'movido para arquivados'}.`
      );
      return updated;
    } catch (err: any) {
      showError('Erro ao atualizar status', err.message);
      throw err;
    }
  };

  const deleteEmployee = async (id: string, name: string) => {
    try {
      await EmployeeService.delete(id);
      // O backend faz soft-delete (active=false): move para arquivados em vez de sumir.
      setEmployees(prev => prev.map(e => (e.id === id ? { ...e, active: false } : e)));
      success('Funcionário arquivado', `${name} foi movido para arquivados.`);
    } catch (err: any) {
      showError('Erro ao arquivar funcionário', err.message);
      throw err;
    }
  };

  return {
    employees,
    isLoading,
    isSubmitting,
    error,
    refresh: fetchEmployees,
    createEmployee,
    updateEmployee,
    toggleActive,
    deleteEmployee,
  };
}
