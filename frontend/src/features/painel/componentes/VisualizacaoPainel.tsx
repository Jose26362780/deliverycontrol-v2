import React from 'react';
import { DashboardView } from '../../dashboard/components/DashboardView';

export interface PropriedadesVisualizacaoPainel {
  aoNavegarPara?: (aba: string) => void;
}

export const VisualizacaoPainel: React.FC<PropriedadesVisualizacaoPainel> = ({ aoNavegarPara }) => {
  return <DashboardView onNavigateTo={aoNavegarPara} />;
};

export default VisualizacaoPainel;
