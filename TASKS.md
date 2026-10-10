# TASKS / ROADMAP DE PRÓXIMOS PASSOS — DELIVERYCONTROL

Auditoria real do código em 14/09/2026. Itens marcados ✅ somente com implementação verificável.
Autenticação oficial: **Better Auth (cookie + PostgreSQL + Google)**. JWT/bcrypt só no legado,
desativado com `BETTER_AUTH_ENABLED=true`.

---

## 📌 Checklist Rápido de Status

- [x] **Fase 1: Especificação & Arquitetura**
  - [x] Elaboração do `BACKEND_SPEC_KIT.md` completo com contratos RESTful, DDL SQL e fórmulas financeiras.
  - [x] Avaliação arquitetural: Monorepo vs Polyrepo (decidido Monorepo Modular `/server` + `/src`).
- [x] **Fase 2: Motor Financeiro & Back-End Base**
  - [x] Algoritmo de rateio 50/25/25 validado com testes unitários.
  - [x] Servidor Node.js/Express modularizado com endpoints protegidos (Better Auth + fallback JWT em dev).
  - [x] Padronização de respostas de erro e persistência em PostgreSQL (JSON só fallback dev).
- [x] **Fase 3: Banco de Dados Relacional em Produção (PostgreSQL)**
  - [x] Prisma adotado (`prisma/schema.prisma` + migration inicial aplicada — `migrate status: up to date`).
  - [x] Repositories duais Prisma/JSON (`backend/server/repositories/` + `db/mappers.ts`).
  - [x] Seed dev-only (`prisma/seed.ts` bloqueia produção).
- [x] **Fase 3b: Autenticação Google (Better Auth) — FUNCIONANDO**
  - [x] `backend/server/auth/better-auth.ts` (Prisma adapter + Google + email/senha com suporte a hash bcrypt legado).
  - [x] Handler `app.all('/api/auth/*')` + CORS credentials + `trustedOrigins`.
  - [x] Frontend `better-auth.client.ts` same-origin (via proxy Vite em dev), botão Google, `callbackURL /home`.
  - [x] Testado: `get-session → null` sem cookie; `sign-in/social → accounts.google.com` com `redirect_uri …/api/auth/callback/google` válido.
  - [ ] Registrar `http://localhost:3000/api/auth/callback/google` no Google Cloud (passo manual — sem isso dá `redirect_uri_mismatch`).
- [ ] **Fase 4: Recursos de Negócio Avançados & Produtividade** (parcial — ver Tarefas 2–4)
- [ ] **Fase 5: Automação, Testes E2E & Deploy** (parcial — ver Tarefa 5 e Deploy)

---

## 📋 Detalhamento das Tarefas

### 🚀 TAREFA 1: Migração para PostgreSQL Persistente (Produção) — ✅ CONCLUÍDA
**Objetivo:** Conectar a camada de repositórios do back-end a um banco relacional robusto para produção.

- [x] **1.1** Escolher e configurar ORM leve (Drizzle ORM ou Prisma) com driver `pg`. → Prisma + `@prisma/adapter-pg`.
- [x] **1.2** Executar script de migração (`users`, `accounts`, `sessions`, `verifications`, `employees`, `deliveries`, `gasoline_expenses`, `split_configs`, DECIMAL p/ dinheiro, índices por `user_id`+data, FKs + `CHECK employee_a <> employee_b`).
- [x] **1.3** Implementar camada de repositório (`backend/server/repositories/` + `db/mappers.ts`) com branch Prisma (prod) + JSON (dev).
- [x] **1.4** Criar script de seed automatizado dev-only (`prisma/seed.ts`, `migrate-from-json.ts` p/ migrar o JSON local antes do go-live).

---

### 💼 TAREFA 2: Gestão Avançada de Entregadores & Telemetria — 🟡 PARCIAL
**Objetivo:** Enriquecer a gestão de equipe e controle de produtividade dos motoristas.

- [x] **2.1 Filtro por Ativos/Inativos**: abas Ativos/Arquivados/Todos em `EmployeeList.tsx`; badge de status + Archivar/Reactivar em `EmployeeCard.tsx` (backend já fazia soft-delete `active=false`).
- [ ] **2.2 Histórico Individual do Entregador**: página/gaveta com turnos, total de repasse, média/dia e desempenho.
- [ ] **2.3 Chave PIX e Dados Bancários**: campo opcional no `Employee` (schema + migration + formulário).

---

### ⛽ TAREFA 3: Gestão e Comprovantes de Combustível — ⬜ NÃO INICIADA
**Objetivo:** Facilitar o controle de despesas e evitar inconsistências contábeis.

- [ ] **3.1 Upload de Comprovante**: anexo/foto da nota junto ao lançamento (exige storage externo — Render não persiste filesystem).
- [ ] **3.2 Média de Consumo (km/litro ou R$/entrega)**: campo odômetro (existe só `liters` hoje).
- [ ] **3.3 Alerta de Custo Excessivo**: aviso no dashboard quando combustível > % da receita (ex: 25%).

---

### 📊 TAREFA 4: Relatórios, Fechamentos & Exportações — 🟡 PARCIAL
**Objetivo:** Dar autonomia contábil e agilidade no fechamento de contas da empresa.

- [x] **4.1 Fechamento por Período Customizado**: `ReportFilters.tsx` com `DatePicker` start/end → `GET /reports/financial?startDate&endDate` (validado com `rangeQuerySchema`).
- [ ] **4.2 Envio Direto via WhatsApp**: link `https://wa.me/?text=…` com resumo do repasse por entregador.
- [ ] **4.3 Exportação CSV / Excel**: download `.csv` de entregas + despesas (hoje só PDF client-side; `GET /reports/pdf` do backend está ocioso).

---

### 🔒 TAREFA 5: Segurança, Observabilidade & Auditoria — 🟡 PARCIAL
**Objetivo:** Garantir robustez operacional antes de abrir para múltiplos clientes.

- [x] **5.1 Sessões & Revogação**: Better Auth cobre sessão 7d + `signOut` com revogação. (JWT legado 7d só dev/migração.)
- [x] **5.2 Rate Limiting nas Rotas de Login**: `express-rate-limit` 30/15min em `/api/auth/*`, com `skip` p/ `get-session` e `callback` (polling + retorno do Google não podem ser limitados).
- [ ] **5.3 Logs Estruturados com Pino**: hoje só `console.log` de porta/startup (sem dados sensíveis — regra mantida: nunca logar senha/token/secret).
- [x] **5.4 Validação de Healthcheck**: `GET /api/health` faz `SELECT 1` no PG; 503 em produção sem banco.
- [x] **Extra — Isolamento por usuário**: todos os controllers usam `req.user.id`; `DeliveryRepository.update` valida employeeA/B contra o usuário (anti-IDOR); nenhum controller aceita `userId` do frontend.
- [x] **Extra — Validação**: Zod no body (todos os módulos) + `validateParams(id)` e `validateQuery(range)` nas listagens. Dashboard/analytics (só GET sem params) sem validação — risco baixo.
- [x] **Extra — Lint verde**: `npx tsc --noEmit` passa; legado morto `frontend/src/app/core|shared|routes` excluído no `tsconfig.json` (remoção física pendente).

---

### 🧹 DÍVIDA TÉCNICA MAPEADA (não quebra produção, mas limpar)
- [ ] **D.1** Remover fisicamente `frontend/src/app/core|shared|routes|rotas|component` (código morto de outro domínio bancário; `mock/*.json` nem existe mais).
- [ ] **D.2** Remover páginas EN duplicadas inativas (`features/*/pages/*` — as ativas são as PT `paginas/`; `app.routes.ts` as referencia mas `App.tsx` não usa).
- [ ] **D.3** Remover rotas JWT legadas `/api/auth/register|login|logout` + `AuthService` legado + fallback Bearer no `auth.middleware` após migração total p/ Better Auth.
- [ ] **D.4** Decidir PDF: usar `GET /reports/pdf` do backend ou remover endpoint ocioso (hoje o PDF é 100% client-side via `pdfGenerator.ts`).
- [ ] **D.5** Remover mock visual restante: `DashboardView` agora mostra R$ 0,00 + aviso "Sem dados no período" (barras `defaultHeights`/`Demo` removidas em 14/09/2026).

---

### 🚢 DEPLOY (Render + Netlify) — 🟡 FALTA SÓ PREENCHER VALORES REAIS
- [x] `render.yaml` com build `npm install && prisma generate && prisma migrate deploy && npm run build` e start `npm start`.
- [x] Coleção Insomnia versionada (`insomnia-deliverycontrol.json` + `insomnia/README.md`).
- [x] Healthcheck não depende de `.data/`; `Database.saveToDisk()` é no-op em produção.
- [ ] Preencher no painel do Render: `DATABASE_URL` (Internal), `BETTER_AUTH_URL` + `FRONTEND_URL` públicas, `GOOGLE_CLIENT_ID/SECRET`, `BETTER_AUTH_SECRET`, `JWT_SECRET`.
- [ ] Adicionar redirect `https://SEU_BACKEND.onrender.com/api/auth/callback/google` no Google Cloud + domínio do frontend nas origens.
- [ ] Rodar uma vez antes do go-live: `prisma migrate deploy` + `npx tsx prisma/migrate-from-json.ts`.
- [ ] Testes E2E com banco real: cadastro/login → funcionário → entrega → gasolina → dashboard → relatório + isolamento A×B.

---

## ✅ RESPOSTA: já dá para usar?
**SIM para o fluxo core.** Um usuário pode hoje: cadastrar-se (email/senha ou Google) → cadastrar funcionários → lançar entregas e gasolina → ver dashboard com rateio → gerar relatório por período com PDF. Tudo ligado à API real com isolamento por `userId`, validado no banco Render (`migrate status: up to date`). **Falta antes de abrir ao público:** valores reais no Render (Deploy), redirect do Google, e os itens ⬜/🟡 acima conforme prioridade — fora os testes, o mínimo é o bloco DEPLOY + D.3 (remover JWT legado).
