import React, { useState, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useAuth } from '../../auth/hooks/useAuth';
import { DashboardHeader } from './DashboardHeader';
import { FinancialSplitCard } from './FinancialSplitCard';
import { CustomSplitModal } from './CustomSplitModal';
import { DeliveryFormModal } from '../../deliveries/components/DeliveryFormModal';
import { useDeliveries } from '../../deliveries/hooks/useDeliveries';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatCurrency } from '../../../utils/formatters';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface DashboardViewProps {
  onNavigateTo: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTo }) => {
  const { user } = useAuth();
  const {
    period,
    setPeriod,
    summary,
    splitConfig,
    isLoading,
    isUpdatingSplit,
    refresh,
    updateSplit,
  } = useDashboard();

  const { createDelivery, isSubmitting } = useDeliveries();
  const { employees } = useEmployees();

  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const handleCreateDelivery = async (data: any) => {
    await createDelivery(data);
    refresh();
  };

  const s = summary || {
    period: 'all',
    totalDeliveries: 0,
    totalDaysWorked: 0,
    grossRevenue: 0,
    gasolineExpense: 0,
    netRevenue: 0,
    carShare: 0,
    employeesShare: 0,
    carPercentage: 50,
    employeeAPercentage: 25,
    employeeBPercentage: 25,
    recentDeliveries: [],
    employeesSummary: [],
  };

  // Weekly bar visualization calculations (Lun a Dom) — somente dados reais da API
  const weeklyData = useMemo(() => {
    const days = [
      { label: 'Lun', dayIdx: 1, gross: 0, net: 0 },
      { label: 'Mar', dayIdx: 2, gross: 0, net: 0 },
      { label: 'Mié', dayIdx: 3, gross: 0, net: 0 },
      { label: 'Jue', dayIdx: 4, gross: 0, net: 0 },
      { label: 'Vie', dayIdx: 5, gross: 0, net: 0 },
      { label: 'Sáb', dayIdx: 6, gross: 0, net: 0 },
      { label: 'Dom', dayIdx: 0, gross: 0, net: 0 },
    ];

    if (s.recentDeliveries && s.recentDeliveries.length > 0) {
      s.recentDeliveries.forEach(del => {
        const d = new Date(del.date + 'T12:00:00');
        const dayIdx = d.getDay();
        const target = days.find(day => day.dayIdx === dayIdx);
        if (target) {
          target.gross += del.revenue;
          target.net += (del.netRevenueShareA || 0) + (del.netRevenueShareB || 0) + (del.carShare || 0);
        }
      });
    }

    const maxVal = Math.max(...days.map(d => d.gross), 1);
    const hasAnyData = days.some(d => d.gross > 0);
    return {
      days: days.map(d => {
        const grossHeight = d.gross > 0 ? Math.min(100, Math.max(15, (d.gross / maxVal) * 100)) : 0;
        const netHeight = d.gross > 0
          ? Math.min(100, Math.max(10, (d.net / Math.max(d.gross, 1)) * 100))
          : 0;

        return {
          ...d,
          grossHeight,
          netHeight,
          formattedGross: formatCurrency(d.gross),
          formattedNet: formatCurrency(d.net),
        };
      }),
      hasAnyData,
    };
  }, [s.recentDeliveries]);

  const { days: weeklyDays, hasAnyData: hasWeeklyData } = weeklyData;

  if (isLoading && !summary) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-96 rounded-2xl lg:col-span-8" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-4" />
        </div>
      </div>
    );
  }

  const gasPercentage = s.grossRevenue > 0 ? ((s.gasolineExpense / s.grossRevenue) * 100).toFixed(0) : '0';
  const netPercentage = s.grossRevenue > 0 ? Math.min(100, (s.netRevenue / s.grossRevenue) * 100) : 100;
  const avgDeliveriesPerDay = s.totalDaysWorked > 0 ? Math.round(s.totalDeliveries / s.totalDaysWorked) : s.totalDeliveries;

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        userName={user?.name || 'Administrador'}
        period={period}
        onPeriodChange={setPeriod}
        onOpenSplitModal={() => setIsSplitModalOpen(true)}
        onRefresh={refresh}
        onNewDelivery={() => setIsDeliveryModalOpen(true)}
        isLoading={isLoading}
      />

      {/* 4-Card KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ingresos Brutos */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 mb-1 font-medium">Ingresos Brutos</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{formatCurrency(s.grossRevenue)}</h3>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{s.totalDeliveries} entregas registradas</span>
          </div>
        </div>

        {/* Gasto Gasolina */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 mb-1 font-medium">Gasto Combustible</p>
            <h3 className="text-2xl font-bold text-rose-400 tracking-tight">{formatCurrency(s.gasolineExpense)}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            {gasPercentage}% de los ingresos brutos
          </p>
        </div>

        {/* Ganancia Neta */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 mb-1 font-medium">Ganancia Neta</p>
            <h3 className="text-2xl font-bold text-lime-400 tracking-tight">{formatCurrency(s.netRevenue)}</h3>
          </div>
          <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-lime-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${netPercentage}%` }}
            />
          </div>
        </div>

        {/* Total Entregas */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-400 mb-1 font-medium">Total Entregas</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{s.totalDeliveries}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Promedio {avgDeliveriesPerDay} / día trabajado
          </p>
        </div>
      </section>

      {/* Main Analysis Section (12 columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Col 8: Evolución de Ingresos */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col p-6 min-h-105">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-lg text-white">Evolución de Ingresos</h4>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block"></span> Ganancia Neta
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span> Ingreso Bruto
              </span>
            </div>
          </div>

          {/* Geometric Bar Canvas */}
          <div className="flex-1 w-full flex items-end gap-3 sm:gap-4 px-2 pt-6 pb-8 border-b border-slate-800/80">
            {weeklyDays.map(day => (
              <div
                key={day.label}
                className="flex-1 bg-slate-800 rounded-t-lg relative group flex flex-col justify-end transition-all hover:bg-slate-750"
                style={{ height: `${day.grossHeight}%` }}
              >
                <div
                  className="w-full bg-lime-400 rounded-t-lg transition-all duration-300 group-hover:bg-lime-300"
                  style={{ height: `${day.netHeight}%` }}
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                  {day.label}
                </span>

                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-950 border border-slate-800 text-[10px] font-semibold text-white px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-20">
                  {day.formattedGross}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action bar below chart */}
          <div className="mt-5 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {!hasWeeklyData && (
                <span className="text-slate-500 font-medium">
                  Sem dados no período — registre entregas para ver a evolução.
                </span>
              )}
              <span className="text-slate-400 font-medium">Accesos rápidos:</span>
              <button
                type="button"
                onClick={() => onNavigateTo('deliveries')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
              >
                Ver entregas
              </button>
              <button
                type="button"
                onClick={() => onNavigateTo('gasoline')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
              >
                Registrar combustible
              </button>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTo('reports')}
              className="text-lime-400 hover:text-lime-300 font-semibold inline-flex items-center gap-1"
            >
              <span>Generar Reportes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Col 4: Reparto Financiero */}
        <div className="lg:col-span-4">
          <FinancialSplitCard
            grossRevenue={s.grossRevenue}
            gasolineExpense={s.gasolineExpense}
            netRevenue={s.netRevenue}
            carShare={s.carShare}
            carPercentage={s.carPercentage}
            employeeAPercentage={s.employeeAPercentage}
            employeeBPercentage={s.employeeBPercentage}
            onOpenSplitConfig={() => setIsSplitModalOpen(true)}
          />
        </div>
      </section>

      {/* Modals */}
      <CustomSplitModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        currentConfig={splitConfig}
        onSave={updateSplit}
        isLoading={isUpdatingSplit}
      />

      <DeliveryFormModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSubmit={handleCreateDelivery}
        employees={employees}
        isLoading={isSubmitting}
      />
    </div>
  );
};
