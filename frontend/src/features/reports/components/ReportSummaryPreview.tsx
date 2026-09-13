import React from 'react';
import { FinancialReport } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Users, Fuel, Package } from 'lucide-react';

interface ReportSummaryPreviewProps {
  report: FinancialReport;
}

export const ReportSummaryPreview: React.FC<ReportSummaryPreviewProps> = ({ report }) => {
  return (
    <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 print:bg-white print:text-black print:border-none print:p-0">
      {/* Report Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lime-400 print:text-emerald-700 font-black text-xl">DeliveryControl</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 print:bg-slate-100 print:text-slate-800 font-semibold">
              Cierre Financiero Oficial
            </span>
          </div>
          <h2 className="text-2xl font-black text-white print:text-black tracking-tight mt-1">
            Estado de Liquidación y Resultados
          </h2>
          <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
            Período: <strong>{report.period}</strong> • Generado el: {formatDate(report.generatedAt)}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400 print:text-slate-600 block">Ganancia Neta Total</span>
          <span className="text-2xl sm:text-3xl font-black text-lime-400 print:text-emerald-700">
            {formatCurrency(report.netRevenue)}
          </span>
        </div>
      </div>

      {/* KPI Balance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
        <div className="p-3.5 bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 uppercase block">Ingresos Brutos</span>
          <span className="text-lg font-bold text-white print:text-black">{formatCurrency(report.grossRevenue)}</span>
        </div>
        <div className="p-3.5 bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold text-rose-400 uppercase block">Total Combustible</span>
          <span className="text-lg font-bold text-rose-400">{formatCurrency(report.gasolineExpense)}</span>
        </div>
        <div className="p-3.5 bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold text-lime-400 print:text-emerald-700 uppercase block">Empresa / Vehículo (50%)</span>
          <span className="text-lg font-bold text-lime-400 print:text-emerald-700">{formatCurrency(report.carShare)}</span>
        </div>
        <div className="p-3.5 bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-xl">
          <span className="text-[10px] font-bold text-violet-400 uppercase block">Total Repartidores</span>
          <span className="text-lg font-bold text-violet-300 print:text-violet-900">{formatCurrency(report.employeesShare)}</span>
        </div>
      </div>

      {/* Employees Payout Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white print:text-black tracking-wide uppercase flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-400" />
          <span>1. Liquidación Individual a Repartidores</span>
        </h3>

        <Table className="print:text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Repartidor</TableHead>
              <TableHead>Turnos Trabajados</TableHead>
              <TableHead>Entregas Realizadas</TableHead>
              <TableHead className="text-right">Total a Pagar (Neto)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.employeesSummary.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                  Ningún repartidor con turnos registrados en el período.
                </TableCell>
              </TableRow>
            ) : (
              report.employeesSummary.map(emp => (
                <TableRow key={emp.employeeId}>
                  <TableCell className="font-bold text-white print:text-black">{emp.employeeName}</TableCell>
                  <TableCell>{emp.shiftsCount} turnos</TableCell>
                  <TableCell>{emp.deliveriesCount} entregas</TableCell>
                  <TableCell className="text-right font-black text-lime-400 print:text-emerald-700">
                    {formatCurrency(emp.totalEarned)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Deliveries Turn Details Table */}
      <div className="space-y-3 pt-4 border-t border-slate-800 print:border-slate-300">
        <h3 className="text-sm font-bold text-white print:text-black tracking-wide uppercase flex items-center gap-2">
          <Package className="w-4 h-4 text-sky-400" />
          <span>2. Detalle de Turnos de Entrega</span>
        </h3>

        <Table className="print:text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Equipo / Repartidores</TableHead>
              <TableHead>Cant. Entregas</TableHead>
              <TableHead>Ingresos Brutos</TableHead>
              <TableHead>Vehículo / Empresa</TableHead>
              <TableHead className="text-right">Liquidación Equipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-slate-500">
                  No hay turnos registrados en el período.
                </TableCell>
              </TableRow>
            ) : (
              report.deliveries.map(del => (
                <TableRow key={del.id}>
                  <TableCell className="font-medium">{formatDate(del.date)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <span className="text-white print:text-black font-semibold">{del.employeeAName}</span>
                      {del.employeeBName && (
                        <span className="text-slate-400 print:text-slate-600 block">+ {del.employeeBName}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{del.deliveryCount}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(del.revenue)}</TableCell>
                  <TableCell className="text-lime-400 print:text-emerald-700 font-medium">
                    {formatCurrency(del.carShare)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-violet-300 print:text-violet-900">
                    {formatCurrency(del.netRevenueShareA + (del.netRevenueShareB || 0))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Fuel Expenses List */}
      <div className="space-y-3 pt-4 border-t border-slate-800 print:border-slate-300">
        <h3 className="text-sm font-bold text-white print:text-black tracking-wide uppercase flex items-center gap-2">
          <Fuel className="w-4 h-4 text-rose-400" />
          <span>3. Deducciones por Combustible</span>
        </h3>

        <Table className="print:text-xs">
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Descripción / Estación</TableHead>
              <TableHead>Litros</TableHead>
              <TableHead className="text-right">Monto Deducido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.gasolineExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                  No hay gastos de combustible registrados en el período.
                </TableCell>
              </TableRow>
            ) : (
              report.gasolineExpenses.map(gas => (
                <TableRow key={gas.id}>
                  <TableCell>{formatDate(gas.date)}</TableCell>
                  <TableCell className="text-white print:text-black">{gas.description || 'Combustible'}</TableCell>
                  <TableCell>{gas.liters ? `${gas.liters} L` : '--'}</TableCell>
                  <TableCell className="text-right font-bold text-rose-400">
                    {formatCurrency(gas.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Sign-off footer for print */}
      <div className="pt-8 border-t border-slate-800 print:border-slate-400 grid grid-cols-2 gap-8 text-center text-xs text-slate-400 print:text-black mt-8">
        <div>
          <div className="w-48 mx-auto border-b border-slate-600 print:border-black mb-2" />
          <span>Firma del Administrador / Empresa</span>
        </div>
        <div>
          <div className="w-48 mx-auto border-b border-slate-600 print:border-black mb-2" />
          <span>Firma del / de los Repartidor(es)</span>
        </div>
      </div>
    </div>
  );
};
