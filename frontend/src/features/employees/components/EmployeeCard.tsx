import React, { useState } from 'react';
import { Employee } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ConfirmDeleteDialog } from '../../../components/ui/ConfirmDeleteDialog';
import { formatDate } from '../../../utils/formatters';
import { UserCheck, UserX, Edit2, Archive, RotateCcw, Calendar } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isActive = employee.active !== false;

  return (
    <>
      <Card className="hover:border-slate-750 transition-all flex flex-col justify-between group">
        <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-lime-400 font-bold shrink-0">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-white text-base leading-tight group-hover:text-lime-400 transition-colors">
                {employee.name}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">{employee.role || 'Repartidor'}</p>
            </div>
          </div>
          {isActive ? (
            <Badge variant="success" size="sm">
              <UserCheck className="w-3 h-3" />
              <span>Activo</span>
            </Badge>
          ) : (
            <Badge variant="default" size="sm">
              <UserX className="w-3 h-3" />
              <span>Archivado</span>
            </Badge>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Registrado el {formatDate(employee.createdAt)}
          </span>
        </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          {isActive ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(employee)}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                onClick={() => setIsDeleteDialogOpen(true)}
                leftIcon={<Archive className="w-3.5 h-3.5" />}
              >
                Archivar
              </Button>
            </>
          ) : (
            <Button
              variant="lime"
              size="sm"
              onClick={() => onToggleActive(employee.id, true)}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reactivar
            </Button>
          )}
        </div>
      </Card>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => onDelete(employee.id, employee.name)}
        title="Archivar funcionario"
        entityName={employee.name}
        confirmLabel="Archivar funcionário"
        details={
          <>
            <div>
              <p className="text-xs text-slate-500">Função</p>
              <p className="mt-1 font-medium text-slate-200">{employee.role || 'Repartidor'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Cadastrado em</p>
              <p className="mt-1 font-medium text-slate-200">{formatDate(employee.createdAt)}</p>
            </div>
          </>
        }
      >
      </ConfirmDeleteDialog>
    </>
  );
};
