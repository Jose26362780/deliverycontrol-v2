import React from 'react';
import { ContainerPainel } from '../containers/ContainerPainel';

export interface PropriedadesPaginaPainelEntregas {
  aoNavegarPara?: (aba: string) => void;
}

export const PaginaPainelEntregas: React.FC<PropriedadesPaginaPainelEntregas> = ({ aoNavegarPara }) => {
  return <ContainerPainel aoNavegarPara={aoNavegarPara} />;
};

export const DashboardPage = PaginaPainelEntregas;
export default PaginaPainelEntregas;
