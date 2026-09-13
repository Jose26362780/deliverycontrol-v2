# TASKS / ROADMAP DE PRÓXIMOS PASSOS — DELIVERYCONTROL

Este documento lista todas as tarefas operacionais e técnicas organizadas em ordem prioritária para guiar a evolução do sistema até a entrada em produção.

---

## 📌 Checklist Rápido de Status

- [x] **Fase 1: Especificação & Arquitetura**
  - [x] Elaboração do `BACKEND_SPEC_KIT.md` completo com contratos RESTful, DDL SQL e fórmulas financeiras.
  - [x] Avaliação arquitetural: Monorepo vs Polyrepo (decidido Monorepo Modular `/server` + `/src`).
- [x] **Fase 2: Motor Financeiro & Back-End Base**
  - [x] Algoritmo de rateio 50/25/25 validado com testes unitários.
  - [x] Servidor Node.js/Express modularizado com endpoints protegidos por JWT.
  - [x] Padronização de respostas de erro e persistência dos dados em disco.
- [ ] **Fase 3: Banco de Dados Relacional em Produção (PostgreSQL)**
- [ ] **Fase 4: Recursos de Negócio Avançados & Produtividade**
- [ ] **Fase 5: Automação, Testes E2E & Deploy**

---

## 📋 Detalhamento das Tarefas

### 🚀 TAREFA 1: Migração para PostgreSQL Persistente (Produção)
**Objetivo:** Conectar a camada de repositórios do back-end a um banco relacional robusto para produção.

- [ ] **1.1** Escolher e configurar ORM leve (Drizzle ORM ou Prisma) com driver `pg`.
- [ ] **1.2** Executar script de migração com base no schema SQL já definido na Seção 4.2 do `BACKEND_SPEC_KIT.md` (`users`, `employees`, `deliveries`, `gasoline_expenses`, `split_configs`).
- [ ] **1.3** Implementar camada de repositório (`backend/server/db/repositories/`) para substituir as operações em disco mantendo exatamente as mesmas assinaturas de serviço.
- [ ] **1.4** Criar script de seed automatizado para popular dados de demonstração em ambientes de desenvolvimento e homologação.

---

### 💼 TAREFA 2: Gestão Avançada de Entregadores & Telemetria
**Objetivo:** Enriquecer a gestão de equipe e controle de produtividade dos motoristas.

- [ ] **2.1 Filtro por Ativos/Inativos**: Permitir alternar a visualização de motoristas arquivados ou ativos na listagem do front-end.
- [ ] **2.2 Histórico Individual do Entregador**: Criar página ou gaveta de detalhes mostrando todos os turnos, total acumulado de repasse, média de entregas por dia e notas de desempenho do motorista.
- [ ] **2.3 Chave PIX e Dados Bancários**: Adicionar campos opcionais de chave PIX / dados para agilizar o acerto semanal/mensal de repasse aos entregadores.

---

### ⛽ TAREFA 3: Gestão e Comprovantes de Combustível
**Objetivo:** Facilitar o controle de despesas e evitar inconsistências contábeis.

- [ ] **3.1 Upload de Comprovante**: Permitir anexo ou foto da nota fiscal do posto de gasolina junto ao lançamento do abastecimento.
- [ ] **3.2 Média de Consumo (km/litro ou R$/entrega)**: Campo opcional de odômetro (km inicial e final) para apurar eficiência do veículo e custo médio de combustível por entrega realizada.
- [ ] **3.3 Alerta de Custo Excessivo**: Indicar no dashboard quando o combustível do período ultrapassar uma porcentagem estipulada da receita bruta (ex: acima de 25%).

---

### 📊 TAREFA 4: Relatórios, Fechamentos & Exportações
**Objetivo:** Dar autonomia contábil e agilidade no fechamento de contas da empresa.

- [ ] **4.1 Fechamento por Período Customizado**: Adicionar seletor de intervalo de datas (`startDate` até `endDate`) com botão de "Fechar Período".
- [ ] **4.2 Envio Direto via WhatsApp**: Gerar link rápido formatado com o resumo do repasse de cada entregador para envio via WhatsApp (`https://wa.me/?text=...`).
- [ ] **4.3 Exportação CSV / Excel**: Disponibilizar download de arquivo `.csv` detalhado de todas as entregas e despesas para conciliação fiscal externa.

---

### 🔒 TAREFA 5: Segurança, Observabilidade & Auditoria
**Objetivo:** Garantir robustez operacional antes de abrir para múltiplos clientes.

- [ ] **5.1 Refresh Tokens & Revogação**: Implementar rota de renovação de token JWT e invalidação no logout.
- [ ] **5.2 Rate Limiting nas Rotas de Login**: Aplicar proteção contra ataques de força bruta no endpoint `/api/auth/login` (ex: `express-rate-limit`).
- [ ] **5.3 Logs Estruturados com Pino**: Configurar logs em formato JSON para facilitar monitoramento em ferramentas como Datadog, Grafana ou Cloud Logging.
- [ ] **5.4 Validação de Healthcheck**: Endpoint `/api/health` validando conectividade ativa com o banco de dados.

---

### 🧪 TAREFA 6: Testes Automatizados & CI/CD
**Objetivo:** Garantir que novas funcionalidades não quebrem regras financeiras.

- [ ] **6.1 Testes de Integração da API**: Testes automatizados com Supertest cobrindo fluxo completo: *Cadastro de Usuário -> Criação de Motoristas -> Lançamento de Turno -> Abastecimento -> Cálculo no Relatório*.
- [ ] **6.2 Pipeline no GitHub Actions**: Executar lint (`tsc --noEmit`), testes unitários financeiros e build a cada Pull Request.
