# Spec Kit — DeliveryControl

Documento de Especificação Técnica e Funcional do sistema **DeliveryControl**.
Para a especificação aprofundada de arquitetura do servidor, contratos de API e banco de dados, consulte o [Spec Kit de Back-End](./BACKEND_SPEC_KIT.md).
Para o roadmap de implementação e lista de tarefas operacionais, consulte o [Roadmap de Tarefas](./tasks.md).

---

## 1. OVERVIEW (Visão Geral)

### 1.1 Identidade & Propósito
O **DeliveryControl** é uma plataforma web full-stack desenvolvida para a gestão operacional e fechamento financeiro de empresas de logística, frotas e delivery. O sistema centraliza o controle de turnos de entregas, entregadores (motoristas), despesas com combustível (gasolina) e prestação de contas com divisão automatizada de receitas e despesas.

### 1.2 Regra de Negócio Central (Divisão Financeira)
O core financeiro da plataforma opera sobre o princípio de prestação de contas transparente:

$$\text{Receita Líquida} = \text{Receita Bruta (Entregas)} - \text{Despesas com Combustível (Gasolina)}$$

A partir da **Receita Líquida**, aplica-se a distribuição de repasses configurável 50% carro 25% funcionario a 25% funcionario b
- **50% — Empresa / Amortização Veicular**: Custos do veículo, manutenção, margem da empresa.
- **50% — Equipe de Entregadores**:
  - **1 Entregador no Turno**: Recebe integralmente os 50% da receita líquida gerada no turno.
  - **2 Entregadores no Turno (Dupla A + B)**: Divisão igualitária dos 50% (25% para Entregador A e 25% para Entregador B).

### 1.3 Histórico de Evolução Recente
1. **Desacoplamento e Limpeza**: Remoção completa de módulos não relacionados a entregas (antigo módulo bancário), mantendo a arquitetura coesa e focada.
2. **Simplificação do Módulo de Fechamento**:
   - Eliminação de campos de assinatura desnecessários, focando estritamente nos dados oficiais de auditoria.
   - Geração e download sob demanda de **Relatório Oficial em PDF** com motor `jspdf` e `jspdf-autotable`.
   - Reorganização dos blocos informativos em formato **Display Block** vertical (um abaixo do outro).
3. **Responsividade Mobile-First**:
   - Ajuste dos botões de ação e tabelas para cartões adaptáveis sem overflow horizontal.
4. **Alinhamento do Sistema de Notificações (Toast)**:
   - Toasts centralizados na parte inferior da tela (`bottom-6 left-1/2 -translate-x-1/2`), com profundidade de sobreposição `z-[100]` e animação de subida suave.

---

## 2. FRONT-END

### 2.1 Stack Tecnológico
- **Framework**: React 19 com TypeScript
- **Bundler & Dev Server**: Vite com HMR gerenciado
- **Estilização**: Tailwind CSS (paleta escura moderna `#070B14`, `#0B1120`, Slate e acentos em Lime `#84cc16`)
- **Ícones**: Lucide React
- **Geração de Documentos**: `jspdf` e `jspdf-autotable` para PDF client-side

### 2.2 Arquitetura de Pastas & Módulos
```
frontend/src/
├── app/                      # Roteamento e layouts estruturais
│   ├── app.routes.ts         # Mapeamento de rotas e metadados
│   └── shared/               # Componentes compartilhados
├── components/
│   ├── layout/               # LayoutPrincipal, BarraLateral, Navbar
│   └── ui/                   # Button, Input, Select, Dialog, Card, Table, Toast
├── features/
│   ├── auth/                 # Login, registro e autenticação
│   ├── dashboard/            # Painel com métricas consolidada e gráficos
│   ├── deliveries/           # Gestão e registro de turnos de entrega
│   ├── employees/            # Cadastro e histórico de entregadores
│   ├── gasoline/             # Lançamento e controle de combustível
│   └── reports/              # Visualização e exportação PDF do fechamento
├── types/                    # Interfaces e tipos globais de TypeScript
└── utils/                    # Utilitários de moeda (BRL), datas e classes CSS
```

### 2.3 Módulos de Interface Detalhados

#### A. Painel (Dashboard)
- **KPIs em Destaque**: Faturamento bruto, total de entregas, gastos com combustível e receita líquida apurada.
- **Gráficos e Indicadores**: Acompanhamento diário e mensal.
- **Ações Rápidas**: Atalhos para novo lançamento de entrega ou abastecimento.

#### B. Gestão de Entregas (`/deliveries` ou `/entregas`)
- **Registro de Turno**: Data, turno, faturamento bruto gerado, seleção de Entregador Principal (A) e opcionalmente Entregador Secundário (B).
- **Cálculo em Tempo Real**: Pré-visualização instantânea da cota de cada participante antes de salvar.
- **Listagem & Filtros**: Tabela de turnos com paginação, busca e exclusão.

#### C. Funcionários / Entregadores (`/employees` ou `/funcionarios`)
- **Cadastro**: Nome, cargo/função, contato, dados de integração.
- **Métricas Individuais**: Total acumulado a receber, quantidade de turnos e entregas realizadas.
- **Edição e Desativação**: Controle de status ativo/inativo.

#### D. Combustível / Gasolina (`/gasoline` ou `/gasolina`)
- **Lançamento de Despesa**: Data, posto/descrição, volume em litros e valor total pago.
- **Impacto no Fechamento**: Vinculação automática aos cálculos de fechamento do período correspondente.

#### E. Relatório & Fechamento Financeiro (`/reports` ou `/relatorios`)
- **Exportação em PDF**: Botão direto para download do arquivo `.pdf` formatado com cabeçalho oficial, tabelas paginadas e cálculos consolidados.
- **Visualização / Impressão**: Pré-visualização em formato de folha oficial com suporte à impressão nativa.
- **Layout Display Block**: Dados financeiros estruturados sequencialmente em blocos empilhados verticais:
  1. *Receita Bruta Total*
  2. *Despesa com Combustível*
  3. *Lucro Líquido Apurado*
  4. *Cota da Empresa (50%)*
  5. *Repasse aos Entregadores (50%)*
  6. *Liquidação Individual por Entregador*
  7. *Turnos Realizados*
  8. *Deduções de Combustível*

#### F. Sistema de Notificações (Toast)
- Posicionado estrategicamente em **centro inferior** (`bottom-6 left-1/2 -translate-x-1/2`).
- Profundidade `z-[100]`, garantindo que alertas de confirmação ou erro sobreponham modais sem quebrar o layout.
- Animação suave `slide-in-from-bottom-4 fade-in-0`.

---

## 3. BACK-END

### 3.1 Stack Tecnológico
- **Runtime**: Node.js com TypeScript
- **Framework Web**: Express.js
- **Segurança & Criptografia**: Better Auth para sessões em cookie e Google
  OAuth/OIDC; `bcryptjs`/JWT somente para compatibilidade legada
- **Validação de Schemas**: `zod` para validação estrita de payloads de entrada
- **Persistência atual**: arquivo JSON local em `.data/deliverycontrol.db.json`
- **Banco de produção planejado**: PostgreSQL, conforme `BACKEND_SPEC_KIT.md`
- **Integração Vite**: proxy de desenvolvimento e fallback de SPA estático em produção

### 3.2 Estrutura do Servidor (`backend/`)
```
backend/
├── server.ts                 # Ponto de entrada do Express + Vite
└── server/
   ├── config/               # Variáveis de ambiente e segredos JWT
   ├── db/                   # Database in-memory com seed de demonstração
   ├── middlewares/          # Autenticação JWT e tratamento de erros
   ├── modules/
   │   ├── auth/             # Login, registro, perfil
   │   ├── deliveries/       # Endpoints CRUD de entregas
   │   ├── employees/        # Endpoints CRUD de funcionários
   │   ├── gasoline/         # Endpoints CRUD de combustível
   │   ├── finance/          # Serviço de cálculo e testes unitários de regras
   │   ├── dashboard/        # Agregações para o painel principal
   │   ├── reports/          # Agregações para fechamento e relatórios
   │   └── settings/         # Configurações de taxas de divisão
   └── types.ts              # Tipos TypeScript do backend
```

### 3.3 Rotas e Endpoints da API

Todas as rotas estão mapeadas tanto no prefixo `/api/*` quanto na raiz para máxima compatibilidade:

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Healthcheck do servidor |
| `POST` | `/api/auth/login` | Autenticação com e-mail e senha, retorna token JWT |
| `POST` | `/api/auth/register` | Registro de novos administradores |
| `GET` | `/api/auth/me` | Dados do usuário autenticado atual |
| `GET` | `/api/employees` | Listagem de todos os funcionários |
| `POST` | `/api/employees` | Criação de novo entregador |
| `PUT` | `/api/employees/:id` | Atualização de dados cadastrais |
| `DELETE` | `/api/employees/:id` | Remoção de entregador |
| `GET` | `/api/deliveries` | Listagem de turnos com filtros de data e entregador |
| `POST` | `/api/deliveries` | Registro de novo turno e cálculo automático de repasses |
| `DELETE` | `/api/deliveries/:id` | Exclusão de lançamento de turno |
| `GET` | `/api/gasoline` | Listagem de abastecimentos |
| `POST` | `/api/gasoline` | Lançamento de despesa com combustível |
| `DELETE` | `/api/gasoline/:id` | Exclusão de despesa |
| `GET` | `/api/dashboard/stats` | Métricas agregadas do dashboard |
| `GET` | `/api/reports/financial`| Fechamento financeiro consolidado por período |
| `GET` | `/api/settings/split` | Obtenção da regra percentual de divisão |
| `PUT` | `/api/settings/split` | Atualização das regras percentuais de divisão |

### 3.4 Regras de Cálculo & Testes Unitários
O módulo `backend/server/modules/finance/finance.service.test.ts` contém os testes das regras financeiras e pode ser executado de forma independente, validando:
- Consistência da fórmula `Receita Bruta - Gasolina = Líquido`.
- Garantia de que a soma dos percentuais não ultrapasse 100%.
- Divisão proporcional exata quando há 1 ou 2 entregadores.

---

## 4. GUIA DE EXECUÇÃO & BUILD

- **Desenvolvimento**: `npm run dev` (Inicia o servidor Node com middleware Vite na porta 3000).
- **Verificação de Tipagem**: `npm run lint` (`tsc --noEmit`).
- **Build de Produção**: `npm run build` (Gera arquivos estáticos em `dist/` e compila o servidor).
- **Inicialização em Produção**: `npm start` (`node dist/server.cjs`).
