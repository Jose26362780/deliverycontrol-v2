import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface PropriedadesModal {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
  larguraMaxima?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModalComponente: React.FC<PropriedadesModal> = ({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  larguraMaxima = 'md',
}) => {
  useEffect(() => {
    const tratarTeclaEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aberto) aoFechar();
    };
    if (aberto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', tratarTeclaEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', tratarTeclaEsc);
    };
  }, [aberto, aoFechar]);

  if (!aberto) return null;

  const classesLargura = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Fundo escuro com desfoque */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={aoFechar}
      />

      {/* Cartão do diálogo */}
      <div
        className={`relative w-full ${classesLargura[larguraMaxima]} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 my-auto z-10 transition-all`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {titulo}
            </h3>
            {descricao && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                {descricao}
              </p>
            )}
          </div>
          <button
            onClick={aoFechar}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export const Modal = ModalComponente;
export default ModalComponente;
