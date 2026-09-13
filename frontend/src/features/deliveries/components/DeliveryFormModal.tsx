import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { deliveryFormSchema, DeliveryFormValues } from '../schemas/delivery.schema';
import { Delivery, Employee } from '../../../types';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { DatePicker } from '../../../components/ui/DatePicker';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { DollarSign, Package, FileText } from 'lucide-react';

interface DeliveryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryFormValues) => Promise<any>;
  employees: Employee[];
  deliveryToEdit?: Delivery | null;
  isLoading?: boolean;
}

export const DeliveryFormModal: React.FC<DeliveryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employees,
  deliveryToEdit,
  isLoading = false,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      date: today,
      employeeAId: '',
      employeeBId: '',
      deliveryCount: 1,
      revenue: 0,
      notes: '',
    },
  });

  useEffect(() => {
    if (deliveryToEdit) {
      reset({
        date: deliveryToEdit.date,
        employeeAId: deliveryToEdit.employeeAId,
        employeeBId: deliveryToEdit.employeeBId || '',
        deliveryCount: deliveryToEdit.deliveryCount,
        revenue: deliveryToEdit.revenue,
        notes: deliveryToEdit.notes || '',
      });
    } else {
      reset({
        date: today,
        employeeAId: employees[0]?.id || '',
        employeeBId: '',
        deliveryCount: 10,
        revenue: 350,
        notes: '',
      });
    }
  }, [deliveryToEdit, isOpen, reset, employees, today]);

  const handleFormSubmit = async (data: DeliveryFormValues) => {
    try {
      await onSubmit({
        ...data,
        employeeBId: data.employeeBId ? data.employeeBId : null,
      });
      onClose();
    } catch {
      // Handled by toast
    }
  };

  const employeeOptions = employees.map(e => ({
    value: e.id,
    label: e.name,
  }));

  const employeeBOptions = [
    { value: '', label: 'Ninguno (Solo Repartidor A trabajó)' },
    ...employees.map(e => ({
      value: e.id,
      label: e.name,
    })),
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={deliveryToEdit ? 'Editar Registro de Entrega' : 'Registrar Turno de Entregas'}
      description="Indique la cantidad de entregas, los ingresos generados y los repartidores de la jornada."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Fecha de Entrega"
                value={field.value}
                onChange={field.onChange}
                error={errors.date?.message}
              />
            )}
          />

          <Input
            label="Cantidad de Entregas"
            type="number"
            min="1"
            placeholder="Ej: 25"
            leftIcon={<Package className="w-4 h-4" />}
            error={errors.deliveryCount?.message}
            {...register('deliveryCount', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Ingresos Brutos Generados ($)"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          leftIcon={<DollarSign className="w-4 h-4 text-lime-400" />}
          error={errors.revenue?.message}
          helperText="Monto total cobrado por el turno de entregas"
          {...register('revenue', { valueAsNumber: true })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
          <Select
            label="Repartidor Principal (A)"
            options={employeeOptions}
            placeholder="Seleccione el repartidor A"
            error={errors.employeeAId?.message}
            {...register('employeeAId')}
          />

          <Select
            label="Repartidor Auxiliar (B)"
            badge="Opcional"
            options={employeeBOptions}
            error={errors.employeeBId?.message}
            {...register('employeeBId')}
          />
        </div>

        <Input
          label="Observaciones (Opcional)"
          type="text"
          placeholder="Ej: Turno lluvioso, ruta norte, etc."
          leftIcon={<FileText className="w-4 h-4" />}
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="lime" isLoading={isLoading}>
            {deliveryToEdit ? 'Actualizar Entrega' : 'Guardar Entrega'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
