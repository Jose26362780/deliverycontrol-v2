# DeliveryControl — Tasks

Checklist executável, em ordem de dependência. Cada tarefa deve seguir as regras de `plan.md` e satisfazer o que está descrito em `spec.md`. Marque `[x]` conforme for concluindo.

## Fase 0 — Setup

- [ ] Criar monorepo ou dois repositórios (`frontend`, `backend`)
- [x] Inicializar projeto React + Vite + TypeScript + Tailwind
- [ ] Inicializar projeto Node.js + Express + TypeScript
- [ ] Configurar Prisma + PostgreSQL (schema inicial: User, Employee, Delivery, GasolineExpense)
- [ ] Configurar ESLint/Prettier em ambos os projetos
- [x] Configurar variáveis de ambiente (`.env.example`)
- [ ] Configurar CORS, Helmet e rate limiting no backend
- [ ] Configurar estrutura de pastas Feature-First (frontend `features/`, backend `modules/`) — a implementação atual ainda usa camadas em português

## Fase 1 — Authentication

- [] Backend: `POST /auth/register` (hash de senha com scrypt; migrar para bcrypt conforme o plano)
- [x] Backend: Better Auth com cadastro/login e sessões persistidas
- [] Backend: `POST /auth/logout`
- [] Backend: `GET /auth/me`
- [x] Backend: middleware de rota protegida (validação de sessão Better Auth)
- [ ] Frontend: feature `auth/` — schemas Zod (register/login)
- [x] Frontend: telas de cadastro e login
- [x] Frontend: autenticação Google via `signIn.social({ provider: "google" })`
- [ ] Frontend: proteção de rotas autenticadas
- [x] Frontend: `useAuth()` hook + store de sessão
- [ ] Testes: fluxo de autenticação (registro, login, rota protegida)

## Fase 2 — Employees

- [x] Backend: CRUD `/employees` (isolado por `userId`, com listagem, criação, edição e exclusão)
- [x] Backend: schema Zod de validação de funcionário
- [ ] Frontend: feature `employees/` — service, hook `useEmployees()`
- [ ] Frontend: formulário de criação/edição (React Hook Form + Zod)
- [ ] Frontend: listagem e exclusão de funcionários
- [ ] Testes: CRUD de funcionários

## Fase 3 — Gasoline

- [x] Backend: CRUD `/gasoline` (isolado por `userId`, associado a data)
- [ ] Frontend: feature `gasoline/` (ou dentro de `deliveries/`, conforme organização) — service, hook
- [ ] Frontend: formulário de registro de gasto
- [ ] Frontend: listagem com filtro por período
- [ ] Testes: CRUD de gastos com gasolina

## Fase 4 — Deliveries + regra financeira

- [x] Backend: **implementar a regra de negócio central** (receita líquida = receita - gasolina; divisão 50/25/25) como domínio isolado e testável
- [ ] Backend: CRUD `/deliveries` (seleção de funcionários A/B, quantidade, receita, data)
- [ ] Backend: filtro de entregas por período
- [ ] Frontend: feature `deliveries/` — service, hook `useDeliveries()`
- [ ] Frontend: formulário de entrega (seleção de funcionários, quantidade, receita, data)
- [ ] Frontend: listagem com filtro por período
- [x] Testes: **regra 50/25/25**, desconto de gasolina e cálculo de receita líquida (cálculo de lucro detalhado ainda pendente)

## Fase 5 — Dashboard

- [x] Backend: `GET /dashboard/stats` (cálculo em tempo real, sem persistência)
- [ ] Frontend: feature `dashboard/` — service, hook
- [x] Frontend: cabeçalho do dashboard e cards de receita, entregas, dias trabalhados e receita líquida
- [ ] Testes: métricas semanais e mensais

## Fase 6 — Analytics

- [x] Backend: rotas de analytics implementadas no módulo `analytics`
- [ ] Frontend: feature `analytics/` — service, hook
- [ ] Frontend: `RevenueChart`, `DeliveryChart`, `SalaryDistributionChart`, `GasolineSummary` (Recharts)
- [ ] Frontend: comparação semanal e mensal

## Fase 7 — Reports

- [x] Backend: `GET /reports/financial`
- [x] Frontend: geração de PDF client-side com jsPDF/AutoTable
- [ ] Frontend: feature `reports/` — `ReportCard`, botão de exportação

## Fase 8 — Design System e responsividade

- [x] Implementar tema dark mode (paleta slate; destaque atual em indigo, devendo ser alinhado a lime-400)
- [ ] Garantir todos os estados de componente (default, hover, focus, active, disabled, loading, error, success, empty)
- [x] Ajustar layout mobile (sidebar em drawer, cards empilhados, tabelas com scroll horizontal)
- [x] Ajustar layout desktop (sidebar fixa, grid de dashboard, gráficos maiores)
- [ ] Aplicar Framer Motion em entrada de cards, transições e feedback de ações

## Fase 9 — Qualidade e finalização

- [ ] Revisar cobertura de testes das regras financeiras (meta 70–80%)
- [ ] Revisar isolamento de dados por usuário em todos os endpoints
- [ ] Revisar validação dupla (frontend + backend) em todos os formulários
- [x] Documentar setup do projeto (README com instruções de execução local)
- [ ] Preparar build de produção (frontend e backend)
- [ ] Publicar aplicação em produção
- [ ] Conferir todos os itens da Definition of Done em `spec.md`
