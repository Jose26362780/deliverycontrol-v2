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
    toggleActive,
    deleteEmployee,
    refresh,
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.role && e.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const isActive = e.active !== false;
    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'active' ? isActive : !isActive);
    return matchesSearch && matchesStatus;
  });

  const activeCount = employees.filter(e => e.active !== false).length;
  const archivedCount = employees.length - activeCount;

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
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3">
        <Input
          placeholder="Buscar por nombre o puesto..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="bg-slate-950 border-slate-800"
        />
        <div className="flex items-center gap-2 shrink-0">
          {(
            [
              { key: 'active', label: `Ativos (${activeCount})` },
              { key: 'archived', label: `Arquivados (${archivedCount})` },
              { key: 'all', label: `Todos (${employees.length})` },
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab.key
                  ? 'bg-lime-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
              : statusFilter === 'archived'
                ? 'No hay funcionarios archivados.'
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
              onToggleActive={toggleActive}
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
