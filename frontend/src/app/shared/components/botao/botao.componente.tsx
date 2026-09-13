import React from 'react';
import { Loader2 } from 'lucide-react';

export interface PropriedadesBotao extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'contorno' | 'fantasma' | 'perigo' | 'lima';
  tamanho?: 'sm' | 'md' | 'lg';
  carregando?: boolean;
  iconeEsquerda?: React.ReactNode;
  iconeDireita?: React.ReactNode;
}

export const Botao: React.FC<PropriedadesBotao> = ({
  children,
  variante = 'primario',
  tamanho = 'md',
  carregando = false,
  iconeEsquerda,
  iconeDireita,
  disabled,
  type = 'button',
  className = '',
  ...props
}) => {
  const estilosBase =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] min-h-[40px] sm:min-h-[38px]';

  const estilosTamanho = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px] sm:min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[44px] sm:min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
  };

  const estilosVariante = {
    primario:
      'bg-emerald-500 hover:bg-emerald-400 text-slate-950 focus:ring-emerald-400 shadow-md shadow-emerald-500/20',
    lima:
      'bg-lime-400 hover:bg-lime-300 text-slate-950 focus:ring-lime-400 shadow-md shadow-lime-400/20',
    secundario:
      'bg-slate-800 hover:bg-slate-700 text-white focus:ring-slate-400 border border-slate-700/80',
    contorno:
      'border border-slate-700 hover:border-slate-600 bg-transparent text-slate-200 hover:bg-slate-800/60 focus:ring-slate-400',
    fantasma:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-slate-400',
    perigo:
      'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-md shadow-rose-600/20',
  };

  return (
    <button
      type={type}
      disabled={disabled || carregando}
      className={`${estilosBase} ${estilosTamanho[tamanho]} ${estilosVariante[variante]} ${className}`}
      {...props}
    >
      {carregando ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        iconeEsquerda && <span className="shrink-0">{iconeEsquerda}</span>
      )}
      <span className="truncate">{children}</span>
      {!carregando && iconeDireita && <span className="shrink-0">{iconeDireita}</span>}
    </button>
  );
};

export const Button = Botao;
export default Botao;
