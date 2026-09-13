import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import { Employee } from '../../../types';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeModal } from './EmployeeModal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Plus, Search, Users, RefreshCw } from 'lucide-react';

export const EmployeeList: React.FC = () => {
  const {
    employees,
    isLoading,
    isSubmitting,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    refresh,
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.role && e.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenCreate = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, data);
    } else {
      await createEmployee(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-lime-400" />
            <span>Funcionarios y Repartidores</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Gestione su equipo para vincularlos a los turnos y calcular la división de ganancias.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            title="Actualizar lista"
          >
            Actualizar
          </Button>
          <Button
            variant="lime"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            className="flex-1 sm:flex-initial"
          >
            Nuevo Funcionario
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
        <Input
          placeholder="Buscar por nombre o puesto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="bg-slate-950 border-slate-800"
        />
        <div className="text-xs text-slate-400 whitespace-nowrap font-medium px-2">
          {filteredEmployees.length} {filteredEmployees.length === 1 ? 'funcionario' : 'funcionarios'}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Ningún funcionario encontrado</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            {searchTerm
              ? 'No hay funcionarios que coincidan con los términos de búsqueda.'
              : 'Empiece registrando los repartidores de su equipo.'}
          </p>
          <Button variant="lime" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Registrar Primer Funcionario
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(emp => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onEdit={handleOpenEdit}
              onDelete={deleteEmployee}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        employeeToEdit={selectedEmployee}
        isLoading={isSubmitting}
      />
    </div>
  );
};
