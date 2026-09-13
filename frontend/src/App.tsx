import React, { useState, useEffect } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { useAuthStore } from './stores/auth.store';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { LayoutPrincipal } from './components/layout/LayoutPrincipal';
import { PaginaPainelEntregas } from './features/painel/paginas/PaginaPainel';
import { PaginaEntregas } from './features/entregas/paginas/PaginaEntregas';
import { PaginaGasolina } from './features/gasolina/paginas/PaginaGasolina';
import { PaginaFuncionarios } from './features/funcionarios/paginas/PaginaFuncionarios';
import { PaginaRelatorios } from './features/relatorios/paginas/PaginaRelatorios';
import { ToastProvider } from './components/ui/Toast';

function MainApp() {
  const { isAuthenticated, isInitialized } = useAuth();
  const initAuth = useAuthStore(state => state.init);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const getTabFromPath = () => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const pathToTab: Record<string, string> = {
      '/': 'dashboard',
      '/home': 'dashboard',
      '/entregas': 'deliveries',
      '/deliveries': 'deliveries',
      '/funcionarios': 'employees',
      '/employees': 'employees',
      '/gasolina': 'gasoline',
      '/gasoline': 'gasoline',
      '/relatorios': 'reports',
      '/reports': 'reports',
    };

    return pathToTab[path] || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath);

  const navigateToTab = (tab: string) => {
    const tabToPath: Record<string, string> = {
      dashboard: '/home',
      deliveries: '/entregas',
      employees: '/funcionarios',
      gasoline: '/gasolina',
      reports: '/relatorios',
    };

    setActiveTab(tab);
    window.history.pushState({}, '', tabToPath[tab] || '/home');
  };

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    const handlePopState = () => setActiveTab(getTabFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-lg mb-4 animate-pulse shadow-lg shadow-lime-400/20">
          DC
        </div>
        <p className="text-sm font-semibold text-slate-300">Carregando DeliveryControl...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-lime-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full relative z-10">
          {authMode === 'login' ? (
            <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <LayoutPrincipal abaAtiva={activeTab} aoSelecionarAba={navigateToTab}>
      {activeTab === 'dashboard' && <PaginaPainelEntregas aoNavegarPara={navigateToTab} />}
      {activeTab === 'deliveries' && <PaginaEntregas />}
      {activeTab === 'employees' && <PaginaFuncionarios />}
      {activeTab === 'gasolina' && <PaginaGasolina />}
      {activeTab === 'gasoline' && <PaginaGasolina />}
      {activeTab === 'reports' && <PaginaRelatorios />}
    </LayoutPrincipal>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
