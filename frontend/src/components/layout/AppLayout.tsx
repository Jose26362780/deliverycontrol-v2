import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Truck } from 'lucide-react';

interface AppLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onSelectTab,
  children,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#0B1120] border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center shadow-md shadow-lime-400/20">
            <Truck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">DeliveryControl</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Zero spacing sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content container */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
