import React, { useState, useEffect } from 'react';
import { Dialog } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SplitRuleConfig } from '../../../types';
import { Car, Users, AlertCircle, RotateCcw } from 'lucide-react';

interface CustomSplitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig?: SplitRuleConfig | null;
  onSave: (config: { carPercentage: number; employeeAPercentage: number; employeeBPercentage: number }) => Promise<any>;
  isLoading?: boolean;
}

export const CustomSplitModal: React.FC<CustomSplitModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
  isLoading = false,
}) => {
  const [car, setCar] = useState(50);
  const [empA, setEmpA] = useState(25);
  const [empB, setEmpB] = useState(25);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentConfig) {
      setCar(currentConfig.carPercentage);
      setEmpA(currentConfig.employeeAPercentage);
      setEmpB(currentConfig.employeeBPercentage);
    }
  }, [currentConfig, isOpen]);

  const total = Number(car) + Number(empA) + Number(empB);
  const isValid = Math.abs(total - 100) < 0.01;

  const handleResetDefaults = () => {
    setCar(50);
    setEmpA(25);
    setEmpB(25);
    setError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('La suma de todos los porcentajes debe ser exactamente 100%.');
      return;
    }
    setError(null);
    try {
      await onSave({
        carPercentage: Number(car),
        employeeAPercentage: Number(empA),
        employeeBPercentage: Number(empB),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar configuración.');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Personalizar Reparto Financiero"
      description="Configure el porcentaje de distribución de la Ganancia Neta (Ingresos Brutos - Combustible)."
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Suma de porcentajes:</span>
          <span className={`text-sm font-black ${isValid ? 'text-lime-400' : 'text-rose-400'}`}>
            {total}% / 100%
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 pt-1">
          <Input
            label="Porcentaje Empresa / Vehículo (%)"
            type="number"
            min="0"
            max="100"
            value={car}
            onChange={e => setCar(Number(e.target.value))}
            leftIcon={<Car className="w-4 h-4 text-lime-400" />}
            helperText="Predeterminado del sistema: 50%"
          />

          <Input
            label="Porcentaje Repartidor A (%)"
            type="number"
            min="0"
            max="100"
            value={empA}
            onChange={e => setEmpA(Number(e.target.value))}
            leftIcon={<Users className="w-4 h-4 text-sky-400" />}
            helperText="Predeterminado del sistema: 25%"
          />

          <Input
            label="Porcentaje Repartidor B (%)"
            type="number"
            min="0"
            max="100"
            value={empB}
            onChange={e => setEmpB(Number(e.target.value))}
            leftIcon={<Users className="w-4 h-4 text-emerald-400" />}
            helperText="Predeterminado del sistema: 25%"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetDefaults}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Restaurar 50/25/25
          </Button>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="lime"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};
