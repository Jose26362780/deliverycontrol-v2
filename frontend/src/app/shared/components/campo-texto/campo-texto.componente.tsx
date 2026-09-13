import React, { forwardRef } from 'react';

export interface PropriedadesCampoTexto extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo?: string;
  erro?: string;
  textoAjuda?: string;
  iconeEsquerda?: React.ReactNode;
  iconeDireita?: React.ReactNode;
}

export const CampoTexto = forwardRef<HTMLInputElement, PropriedadesCampoTexto>(
  ({ rotulo, erro, textoAjuda, iconeEsquerda, iconeDireita, className = '', id, ...props }, ref) => {
    const inputId = id || (rotulo ? rotulo.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {rotulo && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-300 uppercase tracking-wider"
          >
            {rotulo}
          </label>
        )}

        <div className="relative flex items-center">
          {iconeEsquerda && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center shrink-0">
              {iconeEsquerda}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-slate-900 border rounded-xl px-3.5 py-2.5 text-sm sm:text-base md:text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-1 focus:ring-lime-400/40 min-h-[44px] sm:min-h-[40px] ${
              iconeEsquerda ? 'pl-10' : ''
            } ${iconeDireita ? 'pr-10' : ''} ${
              erro
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-700/80 focus:border-lime-400'
            } ${className}`}
            {...props}
          />

          {iconeDireita && (
            <div className="absolute right-3.5 text-slate-400 flex items-center justify-center shrink-0">
              {iconeDireita}
            </div>
          )}
        </div>

        {erro && <p className="text-xs text-rose-400 font-medium">{erro}</p>}
        {!erro && textoAjuda && <p className="text-xs text-slate-500">{textoAjuda}</p>}
      </div>
    );
  }
);

CampoTexto.displayName = 'CampoTexto';
export const Input = CampoTexto;
export default CampoTexto;
