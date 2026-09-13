import React, { useState } from 'react';
import { Delivery } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ConfirmDeleteDialog } from '../../../components/ui/ConfirmDeleteDialog';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Calendar, Package, Users, Edit2, Trash2 } from 'lucide-react';

interface DeliveryCardProps {
  delivery: Delivery;
  onEdit: (delivery: Delivery) => void;
  onDelete: (id: string) => void;
}

export const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
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
            <Badge variant="info" size="sm">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(delivery.date)}</span>
            </Badge>
            <Badge variant="success" size="sm">
              <Package className="w-3 h-3" />
              <span>{delivery.deliveryCount} entregas</span>
            </Badge>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Ingreso Bruto</span>
            <span className="text-lg font-black text-lime-400">
              {formatCurrency(delivery.revenue)}
            </span>
          </div>
        </div>

        {/* Reparto del turno */}
        <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              {delivery.employeeAName}
            </span>
            <span className="font-semibold text-violet-300">
              {formatCurrency(delivery.netRevenueShareA)}
            </span>
          </div>

          {delivery.employeeBName && (
            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                {delivery.employeeBName}
              </span>
              <span className="font-semibold text-sky-300">
                {formatCurrency(delivery.netRevenueShareB)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-800/60">
            <span className="text-slate-400">Parte Empresa / Vehículo</span>
            <span className="font-semibold text-lime-400">
              {formatCurrency(delivery.carShare)}
            </span>
          </div>
        </div>

        {delivery.notes && (
          <p className="mt-3 text-xs text-slate-400 italic bg-slate-900/40 p-2 rounded-lg">
            "{delivery.notes}"
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(delivery)}
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
        onConfirm={() => onDelete(delivery.id)}
        title="Eliminar entrega"
        entityName={`entrega de ${formatDate(delivery.date)}`}
        confirmLabel="Excluir entrega"
        details={
          <>
            <div>
              <p className="text-xs text-slate-500">Entregas</p>
              <p className="mt-1 font-medium text-slate-200">{delivery.deliveryCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Faturamento</p>
              <p className="mt-1 font-medium text-slate-200">{formatCurrency(delivery.revenue)}</p>
            </div>
          </>
        }
      />
    </>
  );
};
