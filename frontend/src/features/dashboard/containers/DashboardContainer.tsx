import React from 'react';
import { DashboardView } from '../components/DashboardView';

export interface DashboardContainerProps {
  onNavigateTo: (tab: string) => void;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ onNavigateTo }) => {
  return <DashboardView onNavigateTo={onNavigateTo} />;
};

export default DashboardContainer;
