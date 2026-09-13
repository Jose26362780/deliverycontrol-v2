import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gasolineFormSchema, GasolineFormValues } from '../schemas/gasoline.schema';
import { GasolineExpense } from '../../../types';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Button } from '../../../components/ui/Button';
import { DollarSign, Fuel, FileText } from 'lucide-react';

interface GasolineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GasolineFormValues) => Promise<any>;
  expenseToEdit?: GasolineExpense | null;
  isLoading?: boolean;
}

export const GasolineFormModal: React.FC<GasolineFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  expenseToEdit,
  isLoading = false,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<GasolineFormValues>({
    resolver: zodResolver(gasolineFormSchema),
    defaultValues: {
      date: today,
      amount: 0,
      liters: undefined,
      description: 'Carga de Combustible',
    },
  });

  useEffect(() => {
    if (expenseToEdit) {
      reset({
        date: expenseToEdit.date,
        amount: expenseToEdit.amount,
        liters: expenseToEdit.liters || undefined,
        description: expenseToEdit.description || 'Carga de Combustible',
      });
    } else {
      reset({
        date: today,
        amount: 50,
        liters: 15,
        description: 'Estación de Servicio Principal',
      });
    }
  }, [expenseToEdit, isOpen, reset, today]);

  const handleFormSubmit = async (data: GasolineFormValues) => {
    try {
      await onSubmit(data);
      onClose();
    } catch {
      // Handled by toast
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={expenseToEdit ? 'Editar Gasto de Combustible' : 'Registrar Gasto de Combustible'}
      description="Este gasto será descontado de los ingresos brutos antes de repartir las ganancias netas."
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Improved Date Picker with quick shortcuts */}
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Fecha de la Carga"
              value={field.value}
              onChange={field.onChange}
              error={errors.date?.message}
            />
          )}
        />

        {/* Inline Grid: Monto y Litros with aligned inline labels */}
        <div className="grid grid-cols-2 gap-3.5">
          <Input
            label="Monto Pagado ($)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Ej: 50.00"
            leftIcon={<DollarSign className="w-4 h-4 text-emerald-400" />}
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="liters-input"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider truncate"
              >
                Litros Cargados
              </label>
              <span className="text-[10px] font-medium text-slate-500 lowercase bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/40">
                opcional
              </span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-amber-400 pointer-events-none flex items-center justify-center">
                <Fuel className="w-4 h-4" />
              </div>
              <input
                id="liters-input"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 15.5"
                className={`w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/40 ${
                  errors.liters ? 'border-rose-500' : ''
                }`}
                {...register('liters', { valueAsNumber: true })}
              />
            </div>
            {errors.liters && (
              <p className="text-xs text-rose-400 font-medium mt-1.5">
                {errors.liters.message}
              </p>
            )}
          </div>
        </div>

        {/* Descripción / Estación */}
        <Input
          label="Descripción / Estación (Opcional)"
          placeholder="Ej: Shell Av. Central / YPF"
          leftIcon={<FileText className="w-4 h-4 text-slate-400" />}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="lime" isLoading={isLoading}>
            {expenseToEdit ? 'Guardar Cambios' : 'Registrar Gasto'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
