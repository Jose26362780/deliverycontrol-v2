import React from 'react';
import { Menu, User, Bell, LogOut } from 'lucide-react';

export interface NavbarProps {
  title?: string;
  userName?: string;
  userRole?: string;
  onToggleSidebar?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  title = 'DeliveryControl',
  userName = 'Junior José',
  userRole = 'Admin',
  onToggleSidebar,
  onLogout,
  className = '',
}) => {
  return (
    <header
      className={`h-16 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between print:hidden ${className}`}
    >
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            aria-label="Alternar menu lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-lime-400/20">
            DC
          </div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="w-2 h-2 rounded-full bg-lime-400" />
          <span className="text-slate-300 font-medium truncate max-w-30 md:max-w-none">
            {userName}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
            {userRole}
          </span>
        </div>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Encerrar sessão"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
