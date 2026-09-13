import React from 'react';
import { Card } from '../../../components/ui/Card';
import { EmployeeFinancialSummary } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { Users, Award, TrendingUp } from 'lucide-react';

interface EmployeeEarningsCardProps {
  employeesSummary: EmployeeFinancialSummary[];
}

export const EmployeeEarningsCard: React.FC<EmployeeEarningsCardProps> = ({ employeesSummary }) => {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            <span>Repasses e Desempenho por Entregador</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ganhos acumulados no período selecionado calculados automaticamente.
          </p>
        </div>
      </div>

      {employeesSummary.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500">
          Nenhum dado de funcionário para este período.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {employeesSummary.map((emp, index) => (
            <div
              key={emp.employeeId}
              className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                  {index === 0 ? <Award className="w-4 h-4 text-amber-400" /> : index + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{emp.employeeName}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{emp.shiftsCount} {emp.shiftsCount === 1 ? 'turno' : 'turnos'}</span>
                    <span>•</span>
                    <span>{emp.deliveriesCount} entregas</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm sm:text-base font-bold text-lime-400 block">
                  {formatCurrency(emp.totalEarned)}
                </span>
                <span className="text-[11px] text-slate-500">Total a Repassar</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
