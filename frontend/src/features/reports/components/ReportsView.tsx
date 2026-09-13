import React, { useState } from 'react';
import { useReports, PeriodoPredefinido } from '../hooks/useReports';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { Button } from '../../../components/ui/Button';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import {
  FileText,
  Download,
  Printer,
  RefreshCw,
  Truck,
  Users,
  Fuel,
  Package,
  Calendar,
  Filter,
  DollarSign,
  TrendingDown,
  Building2,
  Wallet,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    report,
    filters,
    periodo,
    isLoading,
    isExporting,
    refresh,
    aplicarPeriodoPredefinido,
    updateFilters,
    clearFilters,
    downloadPdf,
    printOrViewPdf,
  } = useReports();

  const { employees } = useEmployees();
  const [mostrarFiltroAvancado, setMostrarFiltroAvancado] = useState(false);

  const opcoesFuncionarios = [
    { value: '', label: 'Todos os Entregadores' },
    ...employees.map(e => ({ value: e.id, label: e.name })),
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-2 pb-8 pt-4 sm:space-y-6 sm:px-0 sm:pb-12 sm:pt-8">
      {/* Barra de Ações Superior - 100% Responsiva */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 print:hidden shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <span className="p-2.5 rounded-xl bg-lime-400/10 text-lime-400 border border-lime-400/20 shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Relatório & Fechamento Financeiro
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Visualize os dados oficiais consolidados e baixe em formato PDF.
              </p>
            </div>
          </div>

          {/* Botões de Ação - Display Block/Stacked no Mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <Button
              variant="outline"
              size="md"
              onClick={printOrViewPdf}
              leftIcon={<Printer className="w-4 h-4" />}
              className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-slate-200 justify-center text-xs sm:text-sm"
              title="Visualizar para impressão ou em nova aba"
            >
              Visualizar / Imprimir
            </Button>

            <Button
              variant="lime"
              size="md"
              onClick={downloadPdf}
              isLoading={isExporting}
              leftIcon={<Download className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-lg shadow-lime-400/20 font-bold justify-center text-xs sm:text-sm"
              title="Baixar relatório em arquivo PDF"
            >
              Baixar Relatório em PDF
            </Button>
          </div>
        </div>

        {/* Filtro Rápido de Período */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-lime-400" />
              Período:
            </span>
            {(
              [
                { id: 'todos', label: 'Tudo' },
                { id: 'hoje', label: 'Hoje' },
                { id: 'semana', label: 'Esta Semana' },
                { id: 'mes', label: 'Este Mês' },
              ] as { id: PeriodoPredefinido; label: string }[]
            ).map(p => (
              <button
                type="button"
                key={p.id}
                onClick={() => aplicarPeriodoPredefinido(p.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                  periodo === p.id
                    ? 'bg-lime-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setMostrarFiltroAvancado(!mostrarFiltroAvancado)}
              className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white flex items-center gap-1 ml-1 hover:bg-slate-800 transition-colors shrink-0"
              title="Filtrar por datas específicas ou entregador"
            >
              <Filter className="w-3 h-3" />
              <span>{mostrarFiltroAvancado ? 'Ocultar Filtros' : 'Mais Filtros'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors self-end sm:self-auto py-1"
            title="Atualizar dados"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
        </div>

        {/* Filtros Avançados Expansíveis */}
        {mostrarFiltroAvancado && (
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
            <DatePicker
              label="Data Início"
              value={filters.startDate || ''}
              onChange={value => updateFilters({ startDate: value || undefined })}
              showShortcuts={false}
            />
            <DatePicker
              label="Data Fim"
              value={filters.endDate || ''}
              onChange={value => updateFilters({ endDate: value || undefined })}
              showShortcuts={false}
            />
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Entregador</label>
              <Select
                options={opcoesFuncionarios}
                value={filters.employeeId || ''}
                onChange={e => updateFilters({ employeeId: e.target.value || undefined })}
                className="bg-slate-900 border-slate-700 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* Visualizador do Relatório Oficial (Display Block & Mobile Responsivo) */}
      {isLoading && !report ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      ) : report ? (
        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-8 md:p-10 font-sans print:shadow-none print:border-none print:p-0">
          
          {/* Cabeçalho do Documento */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 text-lime-400 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-black tracking-tight text-slate-950">
                    DeliveryControl
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
                    Dados Oficiais
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                  Relatório de Fechamento Financeiro
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Período: <strong>{report.period || 'Geral'}</strong> • Emitido em: {formatDate(report.generatedAt)}
                </p>
              </div>

              <div className="bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-slate-200">
                <span className="text-[11px] uppercase font-bold text-slate-500 block">
                  Lucro Líquido Distribuível
                </span>
                <span className="text-xl sm:text-3xl font-black text-slate-950 block">
                  {formatCurrency(report.netRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Resumo Financeiro Consolidado - DISPLAY BLOCK (um abaixo do outro) */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Resumo Financeiro Consolidado
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Bloco 1: Receita Bruta */}
              <div className="block p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl transition-colors hover:bg-slate-100/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Receita Bruta Total</span>
                      <span className="text-[11px] text-slate-500 block">Total faturado com entregas e pedidos no período</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-10 sm:pl-0">
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      {formatCurrency(report.grossRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 2: Despesa com Combustível */}
              <div className="block p-3.5 sm:p-4 bg-rose-50/70 border border-rose-200 rounded-xl transition-colors hover:bg-rose-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <TrendingDown className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-rose-900 block">Despesa com Combustível (Gasolina)</span>
                      <span className="text-[11px] text-rose-600/90 block">Dedução direta de abastecimentos dos veículos</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-10 sm:pl-0">
                    <span className="text-base sm:text-lg font-black text-rose-600">
                      -{formatCurrency(report.gasolineExpense)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 3: Lucro Líquido Distribuível */}
              <div className="block p-3.5 sm:p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl transition-colors hover:bg-emerald-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">Lucro Líquido Apurado</span>
                      <span className="text-[11px] text-emerald-700 block">Receita Bruta deduzida das despesas de combustível</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-10 sm:pl-0">
                    <span className="text-base sm:text-lg font-black text-emerald-800">
                      {formatCurrency(report.netRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 4: Repasse Empresa / Veículo (50%) */}
              <div className="block p-3.5 sm:p-4 bg-sky-50/70 border border-sky-200 rounded-xl transition-colors hover:bg-sky-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-sky-950 block">Parte da Empresa / Veículo (50%)</span>
                      <span className="text-[11px] text-sky-700 block">Custo operacional, amortização e margem veicular</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-10 sm:pl-0">
                    <span className="text-base sm:text-lg font-black text-sky-800">
                      {formatCurrency(report.carShare)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bloco 5: Repasse Total aos Entregadores (50%) */}
              <div className="block p-3.5 sm:p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl transition-colors hover:bg-indigo-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-indigo-950 block">Repasse Total aos Entregadores (50%)</span>
                      <span className="text-[11px] text-indigo-700 block">Montante total destinado aos motoristas no período</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right pl-10 sm:pl-0">
                    <span className="text-base sm:text-lg font-black text-indigo-900">
                      {formatCurrency(report.employeesShare)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Liquidação Individual aos Entregadores - DISPLAY BLOCK & RESPONSIVO */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Liquidação Individual aos Entregadores
              </h3>
            </div>

            {report.employeesSummary.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl">
                Nenhum entregador com registros no período.
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Visualização em Cartões Bloco (responsivo tanto no mobile quanto no desktop) */}
                {report.employeesSummary.map(emp => (
                  <div
                    key={emp.employeeId}
                    className="block p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{emp.employeeName}</span>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>{emp.shiftsCount} turnos</span>
                          <span>•</span>
                          <span>{emp.deliveriesCount} entregas realizadas</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden">
                          Valor Líquido:
                        </span>
                        <span className="text-base sm:text-lg font-black text-emerald-700">
                          {formatCurrency(emp.totalEarned)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Turnos e Entregas Registradas - DISPLAY BLOCK & RESPONSIVO */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Turnos e Entregas Registradas
              </h3>
            </div>

            {report.deliveries.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl">
                Sem turnos de entregas registrados no período.
              </div>
            ) : (
              <div className="space-y-2">
                {report.deliveries.slice(0, 15).map(del => (
                  <div
                    key={del.id}
                    className="block p-3 sm:p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{formatDate(del.date)}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                            {del.deliveryCount} entregas
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {del.employeeAName}
                          {del.employeeBName && (
                            <span className="text-slate-400"> + {del.employeeBName}</span>
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-6 text-xs text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                        <div>
                          <span className="text-[10px] text-slate-400 block sm:hidden">Bruto</span>
                          <span className="font-semibold text-slate-800">{formatCurrency(del.revenue)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block sm:hidden">Veículo</span>
                          <span className="text-sky-700 font-medium">{formatCurrency(del.carShare)}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block sm:hidden">Equipe</span>
                          <span className="font-black text-slate-900">
                            {formatCurrency(del.netRevenueShareA + (del.netRevenueShareB || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Deduções de Combustível - DISPLAY BLOCK & RESPONSIVO */}
          {report.gasolineExpenses && report.gasolineExpenses.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Fuel className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  4. Deduções de Combustível
                </h3>
              </div>

              <div className="space-y-2">
                {report.gasolineExpenses.slice(0, 10).map(gas => (
                  <div
                    key={gas.id}
                    className="block p-3 sm:p-3.5 bg-rose-50/40 border border-rose-200/70 rounded-xl"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{formatDate(gas.date)}</span>
                          {gas.liters && (
                            <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-medium">
                              {gas.liters} L
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {gas.description || 'Abastecimento'}
                        </p>
                      </div>

                      <span className="text-xs sm:text-sm font-black text-rose-600">
                        -{formatCurrency(gas.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rodapé Informativo Simples (Sem assinaturas, apenas dados oficiais) */}
          <div className="pt-5 border-t border-slate-200 mt-6 text-center text-[11px] text-slate-400">
            Documento gerado eletronicamente por DeliveryControl. Válido para controle interno e prestação de contas.
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center text-slate-400">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-semibold text-white text-sm sm:text-base">Nenhum dado registrado para este período.</p>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre entregas ou abastecimentos para visualizar e baixar o fechamento em PDF.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};
