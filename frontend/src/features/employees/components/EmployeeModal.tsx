import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from '../schemas/employee.schema';
import { Employee } from '../../../types';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { User, Briefcase } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormValues) => Promise<any>;
  employeeToEdit?: Employee | null;
  isLoading?: boolean;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeToEdit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      role: 'Repartidor',
    },
  });

  useEffect(() => {
    if (employeeToEdit) {
      reset({
        name: employeeToEdit.name,
        role: employeeToEdit.role || 'Repartidor',
      });
    } else {
      reset({
        name: '',
        role: 'Repartidor',
      });
    }
  }, [employeeToEdit, isOpen, reset]);

  const handleFormSubmit = async (data: EmployeeFormValues) => {
    try {
      await onSubmit(data);
      onClose();
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? 'Editar Funcionario' : 'Nuevo Funcionario / Repartidor'}
      description={
        employeeToEdit
          ? 'Actualice los datos del funcionario registrado.'
          : 'Registre un repartidor para vincularlo a los turnos de entrega y reportes.'
      }
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Nombre Completo"
          placeholder="Ej: Carlos Ortiz"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Puesto / Función"
          placeholder="Ej: Repartidor Principal / Repartidor Nocturno"
          leftIcon={<Briefcase className="w-4 h-4" />}
          error={errors.role?.message}
          {...register('role')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="lime" isLoading={isLoading}>
            {employeeToEdit ? 'Guardar Cambios' : 'Registrar Funcionario'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
