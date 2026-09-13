import React from 'react';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { DeliveriesPage } from '../features/deliveries/pages/DeliveriesPage';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { GasolinePage } from '../features/gasoline/pages/GasolinePage';
import { ReportsPage } from '../features/reports/pages/ReportsPage';

export interface AppRoute {
  id: string;
  path: string;
  title: string;
  component: React.ComponentType<any>;
}

export const APP_ROUTES: Record<string, AppRoute> = {
  dashboard: {
    id: 'dashboard',
    path: '/dashboard',
    title: 'Dashboard',
    component: DashboardPage,
  },
  deliveries: {
    id: 'deliveries',
    path: '/deliveries',
    title: 'Entregas',
    component: DeliveriesPage,
  },
  employees: {
    id: 'employees',
    path: '/employees',
    title: 'Funcionarios',
    component: EmployeesPage,
  },
  gasoline: {
    id: 'gasoline',
    path: '/gasoline',
    title: 'Gasolina',
    component: GasolinePage,
  },
  reports: {
    id: 'reports',
    path: '/reports',
    title: 'Reportes',
    component: ReportsPage,
  },
};
