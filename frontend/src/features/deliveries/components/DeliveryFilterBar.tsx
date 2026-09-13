import React from 'react';
import { DeliveryFilters } from '../services/delivery.service';
import { Employee } from '../../../types';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Filter, RotateCcw } from 'lucide-react';

interface DeliveryFilterBarProps {
  filters: DeliveryFilters;
  onFilterChange: (filters: Partial<DeliveryFilters>) => void;
  onClearFilters: () => void;
  employees: Employee[];
}

export const DeliveryFilterBar: React.FC<DeliveryFilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  employees,
}) => {
  const employeeOptions = [
    { value: '', label: 'Todos los Repartidores' },
    ...employees.map(e => ({ value: e.id, label: e.name })),
  ];

  const hasActiveFilters = Boolean(filters.startDate || filters.endDate || filters.employeeId);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-lime-400" />
          <span>Filtrar Entregas</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          type="date"
          label="Fecha Inicial"
          value={filters.startDate || ''}
          onChange={e => onFilterChange({ startDate: e.target.value || undefined })}
          className="bg-slate-950 border-slate-800"
        />

        <Input
          type="date"
          label="Fecha Final"
          value={filters.endDate || ''}
          onChange={e => onFilterChange({ endDate: e.target.value || undefined })}
          className="bg-slate-950 border-slate-800"
        />

        <Select
          label="Filtrar por Repartidor"
          options={employeeOptions}
          value={filters.employeeId || ''}
          onChange={e => onFilterChange({ employeeId: e.target.value || undefined })}
          className="bg-slate-950 border-slate-800"
        />
      </div>
    </div>
  );
};
