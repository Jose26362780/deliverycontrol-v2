import React from 'react';
import { Employee } from '../../../types';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Filter, RotateCcw, Printer } from 'lucide-react';

interface ReportFiltersProps {
  filters: {
    startDate?: string;
    endDate?: string;
    employeeId?: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  onExportPdf: () => void;
  employees: Employee[];
  isExporting: boolean;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExportPdf,
  employees,
  isExporting,
}) => {
  const employeeOptions = [
    { value: '', label: 'Todos los Repartidores' },
    ...employees.map(e => ({ value: e.id, label: e.name })),
  ];

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 print:hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-lime-400" />
          <span>Filtros de Cierre Financiero</span>
        </div>

        <div className="flex items-center gap-2">
          {(filters.startDate || filters.endDate || filters.employeeId) && (
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mr-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}

          <Button
            variant="lime"
            size="sm"
            onClick={onExportPdf}
            isLoading={isExporting}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir / Guardar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <DatePicker
          label="Fecha Inicial"
          value={filters.startDate || ''}
          onChange={value => onFilterChange({ startDate: value || undefined })}
        />

        <DatePicker
          label="Fecha Final"
          value={filters.endDate || ''}
          onChange={value => onFilterChange({ endDate: value || undefined })}
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
