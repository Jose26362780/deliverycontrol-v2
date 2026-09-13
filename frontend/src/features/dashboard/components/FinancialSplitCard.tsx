import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

interface FinancialSplitCardProps {
  grossRevenue: number;
  gasolineExpense: number;
  netRevenue: number;
  carShare: number;
  carPercentage: number;
  employeeAPercentage: number;
  employeeBPercentage: number;
  onOpenSplitConfig: () => void;
}

export const FinancialSplitCard: React.FC<FinancialSplitCardProps> = ({
  grossRevenue,
  gasolineExpense,
  netRevenue,
  carShare,
  carPercentage,
  employeeAPercentage,
  employeeBPercentage,
  onOpenSplitConfig,
}) => {
  const employeeAShare = Number((netRevenue * (employeeAPercentage / 100)).toFixed(2));
  const employeeBShare = Number((netRevenue * (employeeBPercentage / 100)).toFixed(2));

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg text-white">Reparto Financiero</h4>
        <span className="text-xs text-slate-400 font-medium">
          Base neta: {formatCurrency(netRevenue)}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {/* Empresa */}
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">Empresa / Vehículo ({carPercentage}%)</span>
            <span className="text-sm font-bold text-white">{formatCurrency(carShare)}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, carPercentage))}%` }}
            />
          </div>
        </div>

        {/* Empleado A */}
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">Repartidor A ({employeeAPercentage}%)</span>
            <span className="text-sm font-bold text-white">{formatCurrency(employeeAShare)}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, employeeAPercentage))}%` }}
            />
          </div>
        </div>

        {/* Empleado B */}
        <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">Repartidor B ({employeeBPercentage}%)</span>
            <span className="text-sm font-bold text-white">{formatCurrency(employeeBShare)}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, employeeBPercentage))}%` }}
            />
          </div>
        </div>

        <button
          onClick={onOpenSplitConfig}
          className="w-full py-3 bg-slate-800 rounded-xl text-sm font-bold text-white hover:bg-slate-750 transition-colors mt-auto block text-center border border-slate-700/50"
        >
          Ajustar Porcentajes
        </button>
      </div>
    </div>
  );
};
