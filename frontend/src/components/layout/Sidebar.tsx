import React from 'react';
import {
  LayoutDashboard,
  Package,
  Fuel,
  Users,
  FileText,
  Truck,
  ChevronRight,
  LogOut,
  User as UserIcon,
  X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../features/auth/hooks/useAuth';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'deliveries', label: 'Entregas', icon: Package },
    { id: 'employees', label: 'Funcionários', icon: Users },
    { id: 'gasoline', label: 'Gasolina', icon: Fuel },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: Zero margin, zero extra padding around, flush with top and bottom */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0B1120] border-r border-slate-800/80 flex flex-col justify-between shrink-0 z-50 transition-transform duration-200 print:hidden select-none',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-lime-400 rounded-xl flex items-center justify-center shadow-md shadow-lime-400/20 shrink-0">
                <Truck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">DeliveryControl</span>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Section */}
          <div className="px-4 py-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2.5">
              MENU
            </p>

            <nav className="space-y-1.5">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 text-left group',
                      isActive
                        ? 'bg-lime-500/10 text-lime-400 border border-lime-500/30 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 shrink-0 transition-colors',
                        isActive ? 'text-lime-400' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-lime-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1120] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center shrink-0 border border-lime-400/30">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user?.name || 'Administrador'}
              </p>
              <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">
                {user?.email || 'admin@deliverycontrol.com'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
            <span>Encerrar sessão</span>
          </button>
        </div>
      </aside>
    </>
  );
};
