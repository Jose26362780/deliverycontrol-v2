import React, { useState } from 'react';
import { useGasoline } from '../hooks/useGasoline';
import { GasolineExpense } from '../../../types';
import { GasolineSummaryCard } from './GasolineSummaryCard';
import { GasolineFormModal } from './GasolineFormModal';
import { Button } from '../../../components/ui/Button';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatCurrency } from '../../../utils/formatters';
import { Plus, Fuel, RefreshCw, Filter, RotateCcw } from 'lucide-react';

export const GasolineList: React.FC = () => {
  const {
    expenses,
    filters,
    isLoading,
    isSubmitting,
    createExpense,
    updateExpense,
    deleteExpense,
    updateFilters,
    clearFilters,
    refresh,
  } = useGasoline();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<GasolineExpense | null>(null);

  const handleOpenCreate = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: GasolineExpense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (selectedExpense) {
      await updateExpense(selectedExpense.id, data);
    } else {
      await createExpense(data);
    }
  };

  const totalFuelCost = expenses.reduce((sum, g) => sum + g.amount, 0);
  const totalLiters = expenses.reduce((sum, g) => sum + (g.liters || 0), 0);
  const hasActiveFilters = Boolean(filters.startDate || filters.endDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Fuel className="w-6 h-6 text-amber-400" />
            <span>Control de Combustible</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Registre los gastos de gasolina para descontarlos de los ingresos brutos antes de repartir ganancias.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            title="Actualizar"
          >
            Actualizar
          </Button>
          <Button
            variant="lime"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Registrar Combustible
          </Button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Gasto en Combustible</span>
          <p className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(totalFuelCost)}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Litros Cargados</span>
          <p className="text-2xl font-black text-white mt-1">{totalLiters > 0 ? `${totalLiters.toFixed(1)} L` : '--'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Cargas Registradas</span>
          <p className="text-2xl font-black text-lime-400 mt-1">{expenses.length}</p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Filtrar por Período</span>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DatePicker
            label="Fecha Inicial"
            value={filters.startDate || ''}
            onChange={value => updateFilters({ startDate: value || undefined })}
          />
          <DatePicker
            label="Fecha Final"
            value={filters.endDate || ''}
            onChange={value => updateFilters({ endDate: value || undefined })}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <Fuel className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No hay gastos de combustible</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            {hasActiveFilters
              ? 'No hay registros de combustible para el período seleccionado.'
              : 'Registre los comprobantes de carga de combustible.'}
          </p>
          <Button variant="lime" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Registrar Primer Gasto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map(expense => (
            <GasolineSummaryCard
              key={expense.id}
              expense={expense}
              onEdit={handleOpenEdit}
              onDelete={deleteExpense}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <GasolineFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        expenseToEdit={selectedExpense}
        isLoading={isSubmitting}
      />
    </div>
  );
};
