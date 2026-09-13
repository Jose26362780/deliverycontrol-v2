import React from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Button } from '../ui/Button';
import { LogOut, User, Menu, Sparkles } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, activeTab }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between print:hidden">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-lime-400/20">
            DC
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight leading-none block">
              Delivery<span className="text-lime-400">Control</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Gestão & Finanças
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="w-2 h-2 rounded-full bg-lime-400" />
          <span className="text-slate-300 font-medium">{user?.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
            {user?.role || 'Admin'}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
          leftIcon={<LogOut className="w-4 h-4" />}
          title="Sair do sistema"
        >
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </div>
    </header>
  );
};
