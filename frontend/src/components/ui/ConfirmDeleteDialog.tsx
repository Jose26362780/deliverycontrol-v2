import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description?: string;
  entityName: string;
  details: React.ReactNode;
  confirmLabel?: string;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description = 'Esta ação não poderá ser desfeita.',
  entityName,
  details,
  confirmLabel = 'Excluir registro',
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => !isDeleting && onClose()}
      title={title}
      description={description}
      maxWidth="sm"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-950/20 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
          <p className="text-sm leading-relaxed text-slate-300">
            Confirma a exclusão de <strong className="text-white">{entityName}</strong>?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm">
          {details}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="h-4 w-4" />}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
