import React, { useState } from 'react';
import { APP_ROUTES } from './app.routes';
import { Navbar } from './shared/components/navbar/navbar.component';
import { Footer } from './shared/components/footer/footer.component';

export const AppComponent: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');

  const ActiveComponent = APP_ROUTES[currentRoute]?.component || APP_ROUTES.dashboard.component;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <Navbar
        userName="Junior José"
        userRole="Administrador"
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <ActiveComponent onNavigate={(route: string) => setCurrentRoute(route)} />
      </main>
      <Footer />
    </div>
  );
};

export default AppComponent;
