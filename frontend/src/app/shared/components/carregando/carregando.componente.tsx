import React from 'react';
import { Loader2 } from 'lucide-react';

export interface PropriedadesCarregando {
  mensagem?: string;
  tamanho?: 'sm' | 'md' | 'lg';
  telaInteira?: boolean;
}

export const Carregando: React.FC<PropriedadesCarregando> = ({
  mensagem = 'Carregando...',
  tamanho = 'md',
  telaInteira = false,
}) => {
  const mapaTamanhos = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const conteudo = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-slate-400">
      <Loader2 className={`${mapaTamanhos[tamanho]} text-lime-400 animate-spin`} />
      {mensagem && <p className="text-sm font-medium text-slate-300 animate-pulse">{mensagem}</p>}
    </div>
  );

  if (telaInteira) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {conteudo}
      </div>
    );
  }

  return conteudo;
};

export const Esqueleto: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-800/60 ${className}`}
    />
  );
};

export const Loading = Carregando;
export const Skeleton = Esqueleto;
export default Carregando;
