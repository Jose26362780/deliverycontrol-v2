# DeliveryControl — Plan

## 1. Contexto para o agente

Você é um desenvolvedor Full Stack responsável por construir o DeliveryControl a partir do `spec.md`. Este documento define **como** implementar — arquitetura, stack e convenções. O `spec.md` define o quê e o porquê; não redefina regras de negócio aqui, apenas referencie-as.

A aplicação deve ser desenvolvida com **arquitetura Feature-First** e princípios **SOLID**, priorizando: alta coesão, baixo acoplamento, single responsibility, separação de responsabilidades, reutilização, tipagem forte, testabilidade, código simples e legível, evitando overengineering.

## 2. Stack

**Frontend atual:** React 19, Vite, TypeScript, Tailwind CSS, Recharts, React Hook Form, Zod, Zustand e Lucide React

**Frontend alvo:** manter React/Vite; shadcn/ui e Framer Motion são opcionais e não justificam uma migração para Next.js.

**Backend atual:** Node.js, Express, TypeScript, persistência JSON local, JWT legado, bcryptjs e Zod

**Autenticação alvo:** Better Auth com sessões persistidas e Google OAuth/OIDC

**Backend alvo de produção:** Node.js, Express, TypeScript, Prisma ou Drizzle ORM, PostgreSQL, Better Auth e Zod

**Testes:** testes unitários TypeScript existentes; Vitest e React Testing Library serão adotados quando a suíte formal for configurada.

## 3. Diretrizes de implementação (regras fixas)

- Não colocar regra de negócio diretamente em componentes.
- Não realizar chamadas HTTP diretamente dentro de componentes.
- Utilizar services para comunicação com a API.
- Utilizar hooks para encapsular comportamento da interface.
- Utilizar schemas (Zod) para validação.
- Utilizar tipos TypeScript para contratos.
- Manter componentes pequenos e focados.
- Não criar abstrações sem necessidade.
- Toda regra financeira importante deve possuir testes automatizados.

## 4. Frontend

### 4.1 Arquitetura Feature-First

```
src/
├── app/
├── features/
│   ├── auth/          { components, hooks, services, schemas, types }
│   ├── employees/      { components, hooks, services, schemas, types }
│   ├── deliveries/      { components, hooks, services, schemas, types }
│   ├── dashboard/       { components, hooks, services, types }
│   ├── analytics/       { components, hooks, services, types }
│   └── reports/         { components, hooks, services, types }
├── components/ui/
├── services/
│   ├── api/
│   └── http/
├── stores/
├── hooks/
├── types/
├── utils/
└── styles/
```

| Camada | Responsabilidade |
|---|---|
| `app/` | Rotas, layouts, pages, loading, error boundaries |
| `features/` | Domínios da aplicação — cada feature contém somente o que pertence ao seu contexto |
| `components/ui/` | Componentes visuais genéricos (Button, Input, Select, Card, Dialog, Sheet, Calendar, Badge, Table, Tabs, Skeleton) |
| `services/` | Infraestrutura compartilhada para HTTP (`api-client.ts`); regras específicas de uma feature ficam no service da própria feature |
| `stores/` | Estado global via Zustand, somente quando realmente necessário |
| `utils/` | Funções auxiliares puras (`formatCurrency()`, `formatDate()`) — nunca regra de negócio |

### 4.2 Fluxo de dados

```
Page → Feature Component → Hook → Feature Service → HTTP Client → Backend API
```

Exemplo: `DeliveryPage → DeliveryForm → useDeliveries() → delivery.service.ts → api-client.ts → POST /deliveries`

### 4.3 Formulários e estado

- React Hook Form + Zod para controle, validação, mensagens de erro, submit, loading e feedback.
- Zustand somente para estado global; estado local fica no componente/hook.

### 4.4 Responsividade

| Mobile | Desktop |
|---|---|
| Sidebar em drawer | Sidebar fixa |
| Cards empilhados | Dashboard em grid |
| Formulários em coluna | Gráficos maiores |
| Tabelas com scroll horizontal | Tabelas completas |

### 4.5 Motion Design

Framer Motion moderado em: entrada de cards, transições, hover, feedback de ações, mudanças de estado. Nunca prejudicar performance ou acessibilidade.

## 5. Backend

### 5.1 Arquitetura Feature-First

```
src/
├── modules/
│   ├── auth/         { controllers, services, schemas, types }
│   ├── employees/     { controllers, services, schemas, types }
│   ├── deliveries/     { controllers, services, schemas, types }
│   ├── dashboard/      { controllers, services, types }
│   ├── analytics/      { controllers, services, types }
│   └── reports/        { controllers, services, types }
├── middlewares/
├── services/
├── prisma/
├── config/
├── utils/
├── app.ts
└── server.ts
```

### 5.2 Fluxo da API

```
Request → Route → Controller → Service → Persistência

Durante o desenvolvimento, a persistência é feita por `backend/server/db/database.ts` em arquivo JSON.
Na migração para produção, o repository deverá encapsular Prisma/Drizzle e PostgreSQL sem alterar os services.
```

| Camada | Responsabilidade |
|---|---|
| Controller | Receber request, extrair parâmetros, chamar service, retornar response — sem regra de negócio |
| Service | Regras de negócio, cálculos, orquestração, validação de domínio |
| Prisma | Acesso ao banco |

### 5.3 Modelo de dados

**User:** `id, name, email, password, createdAt`
**Employee:** `id, name, userId, createdAt`
**Delivery:** `id, date, employeeAId, employeeBId, deliveryCount, revenue, userId, createdAt`
**GasolineExpense:** `id, date, amount, userId, createdAt`

```
User ── Employees
User ── Deliveries
User ── GasolineExpenses
Delivery ── Employee A
Delivery ── Employee B
```

> Métricas do dashboard são calculadas pelo backend em tempo real — não persistidas como tabela no MVP.

### 5.4 Endpoints

```
Auth
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me

Employees
GET /employees | GET /employees/:id | POST /employees | PUT /employees/:id | DELETE /employees/:id

Deliveries
GET /deliveries | GET /deliveries/:id | POST /deliveries | PUT /deliveries/:id | DELETE /deliveries/:id

Gasoline
GET /gasoline | POST /gasoline | PUT /gasoline/:id | DELETE /gasoline/:id

Dashboard
GET /dashboard | GET /dashboard/weekly | GET /dashboard/monthly

Analytics
GET /analytics/revenue | GET /analytics/deliveries | GET /analytics/gasoline | GET /analytics/distribution

Reports
GET /reports/weekly | GET /reports/monthly | GET /reports/monthly/pdf
```

### 5.5 Segurança

bcrypt · JWT · rotas protegidas · Zod · CORS · Helmet · rate limiting · variáveis de ambiente · logs sem dados sensíveis · isolamento de dados por usuário.

### 5.6 SOLID na prática

| Princípio | Aplicação |
|---|---|
| **S** | `Controller` → HTTP · `Service` → regra de negócio · `Schema` → validação |
| **O** | Estruturas extensíveis sem alterar comportamento existente |
| **L** | Implementações respeitam os contratos das abstrações usadas |
| **I** | Interfaces pequenas e específicas, nunca genéricas demais |
| **D** | Services importantes não dependem de detalhes concretos sem necessidade real |

## 6. Design System

### Paleta

| Uso | Cor |
|---|---|
| Background | `slate-950`, `slate-900`, `slate-800` |
| Texto | `white` |
| Destaque | `lime-400` |
| Analytics | `violet-500`, `sky-400`, `emerald-400`, `yellow-400`, `amber-700` |

### Componentes base
Button, Input, Textarea, Select, Checkbox, Radio, Switch, Card, Badge, Dialog, Sheet, Dropdown, Calendar, Table, Tabs, Tooltip, Toast, Skeleton, Avatar

### Componentes de negócio
StatsCard, DeliveryForm, DeliveryCard, DeliveryTable, DashboardHeader, RevenueChart, DeliveryChart, SalaryDistributionChart, GasolineSummary, DateFilter, ReportCard

### Estados obrigatórios
Default, Hover, Focus, Active, Disabled, Loading, Error, Success, Empty.

Espaçamento e border-radius seguem o sistema padrão do Tailwind, sem valores arbitrários.

## 7. Estratégia de testes

**Stack:** Vitest + React Testing Library

**Alta prioridade:** cálculo de receita líquida, desconto de gasolina, divisão 50/25/25, cálculo de lucro, métricas semanais/mensais, validações, autenticação.

**Média prioridade:** CRUD de funcionários/entregas, filtros, componentes principais, estados de loading/erro.

**Meta:** 70–80% de cobertura nas regras de negócio principais — não perseguir 100% por métrica.
