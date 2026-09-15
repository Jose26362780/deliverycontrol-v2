import React from 'react';
import { PaginaEntregas } from '../features/entregas/paginas/PaginaEntregas';
import { PaginaFuncionarios } from '../features/funcionarios/paginas/PaginaFuncionarios';
import { PaginaGasolina } from '../features/gasolina/paginas/PaginaGasolina';
import { PaginaRelatorios } from '../features/relatorios/paginas/PaginaRelatorios';
import { PaginaPainelEntregas } from '../features/painel/paginas/PaginaPainel';

export interface RotaApp {
  id: string;
  caminho: string;
  titulo: string;
  componente: React.ComponentType<any>;
}

export const ROTAS_APP: Record<string, RotaApp> = {
  painel: {
    id: 'painel',
    caminho: '/painel',
    titulo: 'Dashboard',
    componente: PaginaPainelEntregas,
  },
  entregas: {
    id: 'entregas',
    caminho: '/entregas',
    titulo: 'Entregas',
    componente: PaginaEntregas,
  },
  funcionarios: {
    id: 'funcionarios',
    caminho: '/funcionarios',
    titulo: 'Funcionários',
    componente: PaginaFuncionarios,
  },
  gasolina: {
    id: 'gasolina',
    caminho: '/gasolina',
    titulo: 'Gasolina',
    componente: PaginaGasolina,
  },
  relatorios: {
    id: 'relatorios',
    caminho: '/relatorios',
    titulo: 'Relatórios',
    componente: PaginaRelatorios,
  },
};
