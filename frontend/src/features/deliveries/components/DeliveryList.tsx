import React, { useState } from 'react';
import { useDeliveries } from '../hooks/useDeliveries';
import { useEmployees } from '../../employees/hooks/useEmployees';
import { Delivery } from '../../../types';
import { DeliveryCard } from './DeliveryCard';
import { DeliveryFormModal } from './DeliveryFormModal';
import { DeliveryFilterBar } from './DeliveryFilterBar';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Plus, Package, RefreshCw, AlertCircle } from 'lucide-react';

export const DeliveryList: React.FC = () => {
  const {
    deliveries,
    filters,
    isLoading,
    isSubmitting,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    updateFilters,
    clearFilters,
    refresh,
  } = useDeliveries();

  const { employees } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const handleOpenCreate = () => {
    setSelectedDelivery(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (selectedDelivery) {
      await updateDelivery(selectedDelivery.id, data);
    } else {
      await createDelivery(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-lime-400" />
            <span>Gestión de Entregas</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Registre los turnos de entrega diarios con conteo, recaudación bruta y repartidores asignados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="md"
            onClick={refresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            title="Actualizar"
          >
            Actualizar
          </Button>
          <Button
            variant="lime"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={employees.length === 0}
            className="flex-1 sm:flex-initial"
          >
            Registrar Entrega
          </Button>
        </div>
      </div>

      {employees.length === 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-center gap-3 text-amber-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>
            Debe registrar al menos un empleado en la pestaña <strong>Funcionarios</strong> antes de registrar entregas.
          </span>
        </div>
      )}

      {/* Filter Bar */}
      <DeliveryFilterBar
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        employees={employees}
      />

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No hay entregas registradas</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            {Object.keys(filters).length > 0
              ? 'No se encontraron entregas para el filtro o período seleccionado.'
              : 'Comience registrando el primer turno de entregas de su operación.'}
          </p>
          {employees.length > 0 ? (
            <Button variant="lime" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
              Registrar Primera Entrega
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map(del => (
            <DeliveryCard
              key={del.id}
              delivery={del}
              onEdit={handleOpenEdit}
              onDelete={deleteDelivery}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <DeliveryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        employees={employees}
        deliveryToEdit={selectedDelivery}
        isLoading={isSubmitting}
      />
    </div>
  );
};
