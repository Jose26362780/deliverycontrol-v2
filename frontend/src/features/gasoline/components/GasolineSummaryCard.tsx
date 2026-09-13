import React, { useState } from 'react';
import { GasolineExpense } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ConfirmDeleteDialog } from '../../../components/ui/ConfirmDeleteDialog';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Fuel, Calendar, Edit2, Trash2 } from 'lucide-react';

interface GasolineSummaryCardProps {
  expense: GasolineExpense;
  onEdit: (expense: GasolineExpense) => void;
  onDelete: (id: string) => void;
}

export const GasolineSummaryCard: React.FC<GasolineSummaryCardProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <Card className="hover:border-slate-750 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base leading-tight">
                {expense.description || 'Carga de Combustible'}
              </h4>
              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                {formatDate(expense.date)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-rose-400">
              {formatCurrency(expense.amount)}
            </span>
            {expense.liters && (
              <span className="block text-[11px] text-slate-400 font-medium">
                {expense.liters} Litros
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(expense)}
          leftIcon={<Edit2 className="w-3.5 h-3.5" />}
        >
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
          onClick={() => setIsDeleteDialogOpen(true)}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
        >
          Eliminar
        </Button>
      </div>
      </Card>
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => onDelete(expense.id)}
        title="Eliminar registro de gasolina"
        entityName={expense.description || 'Carga de combustible'}
        confirmLabel="Excluir registro"
        details={
          <>
            <div>
              <p className="text-xs text-slate-500">Data</p>
              <p className="mt-1 font-medium text-slate-200">{formatDate(expense.date)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Valor</p>
              <p className="mt-1 font-medium text-slate-200">{formatCurrency(expense.amount)}</p>
            </div>
          </>
        }
      />
    </>
  );
};
