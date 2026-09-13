import React from 'react';
import { DashboardContainer } from '../containers/DashboardContainer';

export interface DashboardPageProps {
  onNavigateTo: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTo }) => {
  return <DashboardContainer onNavigateTo={onNavigateTo} />;
};

export default DashboardPage;
