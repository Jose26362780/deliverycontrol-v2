import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface DashboardHeaderProps {
  userName: string;
  period: 'all' | 'weekly' | 'monthly';
  onPeriodChange: (p: 'all' | 'weekly' | 'monthly') => void;
  onOpenSplitModal: () => void;
  onRefresh: () => void;
  onNewDelivery?: () => void;
  isLoading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  period,
  onPeriodChange,
  onRefresh,
  onNewDelivery,
  isLoading,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Bienvenido, {userName}. Resumen de operaciones y finanzas.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Period Filter Pills */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onPeriodChange('weekly')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              period === 'weekly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Últimos 7 días
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange('monthly')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              period === 'monthly'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Últimos 30 días
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange('all')}
            className={cn(
              'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              period === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Total General
          </button>
        </div>

        {/* Action Button */}
        {onNewDelivery && (
          <button
            type="button"
            onClick={onNewDelivery}
            className="px-4 py-2 bg-lime-400 text-slate-950 rounded-xl text-sm font-bold shadow-lg shadow-lime-400/10 hover:bg-lime-300 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-3" />
            <span>Nueva Entrega</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Actualizar datos"
        >
          <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
        </button>
      </div>
    </header>
  );
};
