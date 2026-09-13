import React, { useState } from 'react';
import { BarraLateral } from './BarraLateral';
import { Rodape } from '../../app/shared/components/rodape/rodape.componente';
import { Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

export interface PropriedadesLayoutPrincipal {
  children: React.ReactNode;
  abaAtiva: string;
  aoSelecionarAba: (aba: string) => void;
}

export const LayoutPrincipal: React.FC<PropriedadesLayoutPrincipal> = ({
  children,
  abaAtiva,
  aoSelecionarAba,
}) => {
  const [abertoMobile, setAbertoMobile] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#070B14] text-slate-100 antialiased">
      {/* Barra lateral conectada sem espaçamento */}
      <BarraLateral
        abaAtiva={abaAtiva}
        aoSelecionarAba={aoSelecionarAba}
        abertoMobile={abertoMobile}
        aoFecharMobile={() => setAbertoMobile(false)}
      />

      {/* Conteúdo Principal com Barra Superior Mobile */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        {/* Barra superior de cabeçalho em telas mobile */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setAbertoMobile(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-bold text-white text-base">DeliveryControl</span>
          </div>

          <div className="w-7 h-7 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-xs border border-lime-400/30">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </header>

        {/* Área de conteúdo rolável com preenchimento responsivo e sem excesso de margem */}
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
          {children}
          </div>
        </main>

        <Rodape />
      </div>
    </div>
  );
};

export const AppLayout = LayoutPrincipal;
export default LayoutPrincipal;
