import React from 'react';
import { VisualizacaoPainel } from '../componentes/VisualizacaoPainel';

export interface PropriedadesContainerPainel {
  aoNavegarPara?: (aba: string) => void;
}

export const ContainerPainel: React.FC<PropriedadesContainerPainel> = ({ aoNavegarPara }) => {
  return <VisualizacaoPainel aoNavegarPara={aoNavegarPara} />;
};

export default ContainerPainel;
