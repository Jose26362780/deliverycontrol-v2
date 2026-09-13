# SPEC KIT DE ENGENHARIA DE BACK-END — DELIVERYCONTROL

> Os contratos de autenticação históricos deste documento usam JWT. A
> implementação atual usa Better Auth com sessões em cookie e Google OAuth/OIDC.
> Para novos fluxos, use `sign-in/email`, `sign-up/email`, `sign-in/social`,
> `get-session` e `sign-out` sob `/api/auth`.

> **Atualização de implementação (2026-09-12):** Better Auth é o fluxo oficial
> de autenticação deste repositório, com sessões em cookie, PostgreSQL e Google
> OAuth/OIDC. As referências abaixo a JWT, `localStorage` e Lucia são
> requisitos históricos e não devem ser usadas para novos endpoints. O JWT
> permanece apenas durante a migração da persistência e dos contratos legados.
**Versão:** 2.0.0  
**Data:** 2026-09-08  
**Status:** Aprovado para Implementação e Integração  
**Autor:** Engenharia de Software DeliveryControl  

---

## ÍNDICE
1. [Avaliação Estratégica: Projeto Separado (Polyrepo) vs Mesma Pasta (Monorepo)](#1-avaliação-estratégica-projeto-separado-polyrepo-vs-mesma-pasta-monorepo)
2. [Visão Geral & Requisitos do Back-End](#2-visão-geral--requisitos-do-back-end)
3. [Stack Tecnológica Recomendada](#3-stack-tecnológica-recomendada)
4. [Arquitetura de Dados & Modelagem SQL Relacional](#4-arquitetura-de-dados--modelagem-sql-relacional)
5. [Motor Financeiro & Algoritmo de Repasse](#5-motor-financeiro--algoritmo-de-repasse)
6. [Contratos de API RESTful (Endpoints, Payloads & Respostas)](#6-contratos-de-api-restful-endpoints-payloads--respostas)
7. [Segurança, Autenticação & Multi-Tenancy](#7-segurança-autenticação--multi-tenancy)
8. [Padronização de Erros & Validações](#8-padronização-de-erros--validações)
9. [Variáveis de Ambiente & Infraestrutura](#9-variáveis-de-ambiente--infraestrutura)
10. [Roteiro de Implementação Passo a Passo](#10-roteiro-de-implementação-passo-a-passo)

---

## 1. AVALIAÇÃO ESTRATÉGICA: PROJETO SEPARADO (POLYREPO) VS MESMA PASTA (MONOREPO)

Uma das decisões arquiteturais mais críticas no início do ciclo de vida de uma aplicação é a organização dos repositórios entre o front-end e o back-end. Abaixo apresentamos uma análise técnica aprofundada para o ecossistema do **DeliveryControl**.

### 1.1 Cenário A: Mesmo Projeto / Monorepo (`apps/web` + `apps/api` ou `/src` + `/server`)
Neste modelo, tanto a aplicação web React quanto a API Node.js/TypeScript residem no mesmo repositório git.

#### Vantagens:
- **Compartilhamento Direto de Tipos (`Single Source of Truth`)**: Tipos TypeScript de entidades (`Delivery`, `Employee`, `SplitRuleConfig`, `FinancialCalculationResult`) são importados diretamente ou via pacote interno `@deliverycontrol/types`. Se um campo mudar no back-end, o build do front-end quebra imediatamente no CI (`tsc --noEmit`), prevenindo regressões em produção.
- **Deploys Atômicos e Sincronizados**: Modificações em regras de negócio ou nos contratos de API são commitadas e versionadas juntas. Não há risco de incompatibilidade entre versões do cliente e do servidor.
- **Zero Atrito com CORS em Produção**: O mesmo host/domínio pode servir a API e o front-end (ou utilizar proxy reverso nativo Nginx/Cloud Run), eliminando complexidades com cookies `SameSite`, preflights `OPTIONS` e cabeçalhos `Access-Control-Allow-Origin`.
- **Pipeline de CI/CD Simplificado**: Um único repositório para configurar branches, linting, testes unitários, automações do GitHub Actions e release tags.
- **Velocidade de Desenvolvimento**: Mudanças end-to-end (novo endpoint + tela consumidora) são desenvolvidas em uma única branch e revisadas em um único Pull Request.

#### Desvantagens:
- Builds no CI podem se tornar mais lentos se o cache de monorepo (Turborepo ou Nx) não for configurado.
- Se a equipe de back-end e front-end for estritamente separada e grande (+10 desenvolvedores), pode haver maior concorrência de commits na branch principal.

---

### 1.2 Cenário B: Projetos Separados / Polyrepo (`deliverycontrol-web` e `deliverycontrol-api`)
Neste modelo, o repositório do back-end é 100% isolado do repositório do front-end SPA.

#### Vantagens:
- **Independência Total de Infraestrutura**: O back-end pode ser hospedado em instâncias Docker/Kubernetes/Render/AWS ECS, enquanto o front-end é servido como arquivos estáticos puros em CDNs globais (Vercel, Cloudflare Pages, Netlify).
- **Escala e Recursos Independentes**: A equipe pode escalar horizontalmente servidores da API sem qualquer relação com a entrega de assets estáticos do front-end.
- **Liberdade Tecnológica**: Possibilidade de reescrever ou migrar o back-end para outra stack (Go, NestJS, Kotlin, Python/FastAPI) sem alterar o repositório do front-end.

#### Desvantagens:
- **Duplicação ou Gerenciamento de Tipos**: Exige publicar pacotes privados no NPM/GitHub Packages ou manter arquivos de tipos sincronizados manualmente, o que frequentemente gera descompassos de contrato.
- **Gerenciamento de CORS e Domínios**: Exige configuração rigorosa de CORS, DNS para subdomínios (`api.deliverycontrol.com` vs `app.deliverycontrol.com`) e tratamento de credenciais em requisições de origens diferentes.
- **Complexidade de Versionamento**: Obriga o back-end a manter retrocompatibilidade com versões anteriores do front-end que ainda estejam cacheadas no navegador dos usuários.

---

### 1.3 Matriz Comparativa

| Critério | Mesmo Projeto (Monorepo) | Projetos Separados (Polyrepo) |
|---|---|---|
| **Velocidade Inicial (Time-to-Market)** | ⭐⭐⭐⭐⭐ Muito Alta | ⭐⭐⭐ Média |
| **Consistência de Tipos (TypeScript End-to-End)** | ⭐⭐⭐⭐⭐ Perfeita e Imediata | ⭐⭐ Exige Pacote Externo |
| **Simplicidade de Infraestrutura** | ⭐⭐⭐⭐⭐ Baixo Custo / 1 Serviço | ⭐⭐⭐ 2 Serviços Distintos |
| **Configuração de CORS & Redirecionamentos** | ⭐⭐⭐⭐⭐ Trivial | ⭐⭐⭐ Exige Configuração Cuidadosa |
| **Isolamento de Responsabilidade por Equipe** | ⭐⭐⭐ Médio | ⭐⭐⭐⭐⭐ Total |
| **Deploy de Hotfixes Isolados** | ⭐⭐⭐ Build de Ambos | ⭐⭐⭐⭐⭐ Deploy Isolado |

---

### 1.4 Veredito e Recomendação Arquitetural

> **RECOMENDAÇÃO OFICIAL: MONOREPO ESTRUTURADO (MESMO PROJETO)**
>
> Para o porte e objetivo do **DeliveryControl**, **a abordagem mais conveniente, ágil e livre de bugs é manter o Front-end e o Back-end no mesmo repositório**, adotando uma estrutura modular organizada (`/src` para a SPA e `/server` para a API, ou estrutura de pastas `apps/web` e `apps/api` via NPM Workspaces).
>
> **Por que esta é a melhor escolha?**
> 1. O sistema possui regras financeiras estritas (reparto 50/25/25) onde qualquer divergência entre a resposta do back-end e a exibição do front-end causa prejuízo e inconsistência nos relatórios em PDF.
> 2. Evita a manutenção de 2 esteiras de deploy separadas e problemas clássicos de CORS.
> 3. Caso o projeto atinja centenas de milhares de requisições no futuro, a arquitetura modular em pastas independentes permite destacar a pasta `/server` para um repositório isolado em **menos de 30 minutos** sem refatoração de código.

---

## 2. VISÃO GERAL & REQUISITOS DO BACK-END

### 2.1 Escopo Funcional
O back-end do **DeliveryControl** é o núcleo de autoridade de dados e cálculos financeiros da operação. Suas responsabilidades são:
1. **Autenticação e Multi-Tenancy**: Cadastro, login seguro, emissão e validação de tokens JWT. Cada conta administrativa gerencia isoladamente seus próprios entregadores, turnos e despesas.
2. **Gestão de Entregadores (Motoristas)**: CRUD completo com controle de status ativo/inativo e histórico de participação em turnos.
3. **Turnos de Entrega**: Lançamento de turnos com data, quantidade de entregas, faturamento bruto e atribuição de 1 ou 2 entregadores.
4. **Despesas de Combustível (Gasolina)**: Lançamento de notas fiscais de abastecimento com data, valor e litragem, vinculados ao período de apuração.
5. **Cálculo Financeiro e Repasse Automatizado**: Apuração da receita líquida com base na dedução de combustível e divisão percentual configurável (padrão 50% empresa / 25% entregador A / 25% entregador B).
6. **Agregação de Métricas (Dashboard & Relatórios)**: Geração de dados consolidados para os cards de métricas, gráficos temporais e dados estruturados para emissão de fechamentos em PDF.

### 2.2 Requisitos Não-Funcionais
- **Precisão Monetária**: Todos os cálculos e persistências monetárias devem ser estritamente manipulados em centavos (inteiros) ou tipos de dados de ponto fixo `DECIMAL(10,2)`. Proibido o uso de `FLOAT` ou `DOUBLE` em banco de dados.
- **Idempotência**: Criação de transações e cálculos repetidos com os mesmos parâmetros devem produzir o mesmo resultado consolidado.
- **Tempo de Resposta**: Endpoints de leitura e escrita devem responder em menos de **80ms** (p95) sob carga normal.
- **Integridade Referencial**: Entregadores que possuam turnos registrados não podem ser fisicamente deletados do banco (deve-se utilizar soft-delete ou restrição `RESTRICT` de chave estrangeira).

---

## 3. STACK TECNOLÓGICA RECOMENDADA

| Componente | Tecnologia Recomendada | Alternativa Viável |
|---|---|---|
| **Linguagem & Runtime** | Node.js 20+ LTS com TypeScript 5+ | Bun 1.1+ |
| **Framework Web** | Express.js 4/5 ou Fastify | NestJS |
| **Banco de Dados** | PostgreSQL 15+ | MySQL 8.0+ |
| **ORM / Query Builder** | Drizzle ORM ou Prisma ORM | Kysely |
| **Autenticação** | JWT (`jsonwebtoken`) + Argon2id / Bcrypt | Lucia Auth |
| **Validação de Schemas** | Zod | Yup / Joi |
| **Testes Automatizados** | Vitest / Jest | Node Test Runner |
| **Geração de Logs** | Pino ou Winston | Morgan |
| **Containerização** | Docker com Alpine Linux | Distroless Node |

---

## 4. ARQUITETURA DE DADOS & MODELAGEM SQL RELACIONAL

### 4.1 Diagrama Entidade-Relacionamento (Conceitual)
```
[ users ] (1) ──────────< (N) [ employees ]
    │ (1)                       │ (1)
    │                           │
    │ (1)                       ├───< (N) [ deliveries.employee_a_id ]
    ├───< (N) [ deliveries ] ───┘
    │                           └───< (N) [ deliveries.employee_b_id (nullable) ]
    │ (1)
    ├───< (N) [ gasoline_expenses ]
    │
    │ (1)
    └───── (1) [ split_configs ]
```

### 4.2 Esquema SQL DDL Completo (PostgreSQL)

```sql
-- Extensão para UUID nativo
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE USUÁRIOS ADMINISTRADORES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 2. TABELA DE ENTREGADORES / MOTORISTAS
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Entregador',
    phone VARCHAR(50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_active ON employees(user_id, active);

-- 3. TABELA DE CONFIGURAÇÃO DE REPASSE FINANCEIRO (POR TENANT)
CREATE TABLE split_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_percentage NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    employee_a_percentage NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    employee_b_percentage NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_percentage_sum CHECK (
        (car_percentage + employee_a_percentage + employee_b_percentage) = 100.00
    )
);

-- 4. TABELA DE TURNOS E ENTREGAS REALIZADAS
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    employee_a_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    employee_b_id UUID REFERENCES employees(id) ON DELETE RESTRICT,
    delivery_count INTEGER NOT NULL CHECK (delivery_count >= 0),
    revenue NUMERIC(10, 2) NOT NULL CHECK (revenue >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_distinct_employees CHECK (
        employee_b_id IS NULL OR employee_a_id <> employee_b_id
    )
);

CREATE INDEX idx_deliveries_user_date ON deliveries(user_id, date);
CREATE INDEX idx_deliveries_employee_a ON deliveries(employee_a_id);
CREATE INDEX idx_deliveries_employee_b ON deliveries(employee_b_id);

-- 5. TABELA DE DESPESAS COM COMBUSTÍVEL
CREATE TABLE gasoline_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    liters NUMERIC(8, 3),
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gasoline_user_date ON gasoline_expenses(user_id, date);
```

---

## 5. MOTOR FINANCEIRO & ALGORITMO DE REPASSE

O motor financeiro é o coração da regra de negócio do **DeliveryControl**. Qualquer reimplementação de back-end deve seguir estritamente as fórmulas e tratamentos a seguir.

### 5.1 Fórmulas Matemáticas
1. **Receita Bruta Total**:
   $$\text{Receita Bruta} = \sum \text{revenue de todas as entregas do período}$$

2. **Despesa Total com Combustível**:
   $$\text{Combustível} = \sum \text{amount de todas as despesas de combustível do período}$$

3. **Receita Líquida do Período**:
   $$\text{Receita Líquida} = \max(0, \text{Receita Bruta} - \text{Combustível})$$
   *Nota: Caso o combustível exceda a receita bruta, a receita líquida nunca se torna negativa (limite em R$ 0,00) para evitar cálculos de repasse anômalos.*

4. **Distribuição Percentual dos Repasses**:
   Configuração padrão definida pelo sistema:
   - **Cota do Veículo / Empresa**: $50\%$
   - **Cota Total dos Entregadores**: $50\%$

5. **Distribuição por Turno / Individual**:
   Para cada entrega realizada:
   - Se o turno possui **apenas 1 entregador (Entregador A)**:
     $$\text{Repasse Entregador A} = \text{Receita Líquida do Turno} \times 0.50$$
     $$\text{Cota Carro / Empresa} = \text{Receita Líquida do Turno} \times 0.50$$
   - Se o turno possui **dupla (Entregador A e Entregador B)**:
     $$\text{Repasse Entregador A} = \text{Receita Líquida do Turno} \times 0.25$$
     $$\text{Repasse Entregador B} = \text{Receita Líquida do Turno} \times 0.25$$
     $$\text{Cota Carro / Empresa} = \text{Receita Líquida do Turno} \times 0.50$$

### 5.2 Algoritmo de Referência em TypeScript (Implementação Pura)
```typescript
export interface SplitConfig {
  carPercentage: number;       // Padrão: 50
  employeeAPercentage: number; // Padrão: 25
  employeeBPercentage: number; // Padrão: 25
}

export function calculateFinancialSplit(
  grossRevenue: number,
  gasolineExpense: number,
  config: SplitConfig = { carPercentage: 50, employeeAPercentage: 25, employeeBPercentage: 25 }
) {
  const netRevenue = Math.max(0, grossRevenue - gasolineExpense);
  const totalPercentage = config.carPercentage + config.employeeAPercentage + config.employeeBPercentage;

  const normalizedCar = totalPercentage > 0 ? (config.carPercentage / totalPercentage) : 0.50;
  const normalizedA = totalPercentage > 0 ? (config.employeeAPercentage / totalPercentage) : 0.25;
  const normalizedB = totalPercentage > 0 ? (config.employeeBPercentage / totalPercentage) : 0.25;

  const carAmount = Number((netRevenue * normalizedCar).toFixed(2));
  const employeeAAmount = Number((netRevenue * normalizedA).toFixed(2));
  const employeeBAmount = Number((netRevenue * normalizedB).toFixed(2));

  return {
    grossRevenue: Number(grossRevenue.toFixed(2)),
    gasolineExpense: Number(gasolineExpense.toFixed(2)),
    netRevenue: Number(netRevenue.toFixed(2)),
    carAmount,
    employeeAAmount,
    employeeBAmount,
    carPercentage: config.carPercentage,
    employeeAPercentage: config.employeeAPercentage,
    employeeBPercentage: config.employeeBPercentage,
  };
}
```

---

## 6. CONTRATOS DE API RESTFUL (ENDPOINTS, PAYLOADS & RESPOSTAS)

Todos os endpoints operam sobre protocolo JSON. Todas as requisições autenticadas devem enviar o cabeçalho HTTP:
`Authorization: Bearer <TOKEN_JWT>`

---

### 6.1 Módulo de Autenticação (`/api/auth`)

#### `POST /api/auth/register`
Cria uma nova conta administrativa.
- **Request Body:**
```json
{
  "name": "João Gestor",
  "email": "gestor@empresa.com",
  "password": "SenhaSegura123!"
}
```
- **Response `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "e932b132-7491-4e4b-9721-a4b08d234671",
    "name": "João Gestor",
    "email": "gestor@empresa.com",
    "createdAt": "2026-09-08T10:00:00.000Z"
  }
}
```

#### `POST /api/auth/login`
Autentica o usuário e gera o token de acesso.
- **Request Body:**
```json
{
  "email": "gestor@empresa.com",
  "password": "SenhaSegura123!"
}
```
- **Response `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "e932b132-7491-4e4b-9721-a4b08d234671",
    "name": "João Gestor",
    "email": "gestor@empresa.com"
  }
}
```

#### `GET /api/auth/me`
Retorna os dados do administrador autenticado.
- **Response `200 OK`:**
```json
{
  "id": "e932b132-7491-4e4b-9721-a4b08d234671",
  "name": "João Gestor",
  "email": "gestor@empresa.com"
}
```

---

### 6.2 Módulo de Entregadores (`/api/employees`)

#### `GET /api/employees`
Retorna todos os entregadores cadastrados para o administrador autenticado.
- **Response `200 OK`:**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Carlos Silva",
    "role": "Motorista Principal",
    "phone": "(11) 98765-4321",
    "active": true,
    "createdAt": "2026-09-01T08:00:00.000Z"
  }
]
```

#### `POST /api/employees`
Cadastra um novo entregador.
- **Request Body:**
```json
{
  "name": "Rodrigo Santos",
  "role": "Entregador Parceiro",
  "phone": "(11) 91234-5678"
}
```
- **Response `201 Created`:**
```json
{
  "id": "f5e4d3c2-b1a0-4321-9876-dcba09876543",
  "name": "Rodrigo Santos",
  "role": "Entregador Parceiro",
  "phone": "(11) 91234-5678",
  "active": true,
  "createdAt": "2026-09-08T10:15:00.000Z"
}
```

#### `PUT /api/employees/:id`
Atualiza dados cadastrais ou status de um entregador.
- **Request Body:**
```json
{
  "name": "Rodrigo Santos Jr.",
  "role": "Entregador Titular",
  "phone": "(11) 99999-8888",
  "active": true
}
```
- **Response `200 OK`:**
```json
{
  "id": "f5e4d3c2-b1a0-4321-9876-dcba09876543",
  "name": "Rodrigo Santos Jr.",
  "role": "Entregador Titular",
  "phone": "(11) 99999-8888",
  "active": true,
  "updatedAt": "2026-09-08T10:20:00.000Z"
}
```

#### `DELETE /api/employees/:id`
Exclui ou inativa o entregador.
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Funcionário excluído com sucesso."
}
```

---

### 6.3 Módulo de Turnos de Entrega (`/api/deliveries`)

#### `GET /api/deliveries`
Lista os turnos registrados, com suporte a filtros via query string.
- **Query Params opcionais**:
  - `startDate`: `YYYY-MM-DD`
  - `endDate`: `YYYY-MM-DD`
  - `employeeId`: `UUID`
- **Response `200 OK`:**
```json
[
  {
    "id": "d001-uuid",
    "date": "2026-09-07",
    "employeeAId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "employeeAName": "Carlos Silva",
    "employeeBId": "f5e4d3c2-b1a0-4321-9876-dcba09876543",
    "employeeBName": "Rodrigo Santos",
    "deliveryCount": 42,
    "revenue": 850.00,
    "notes": "Turno da tarde - Centro expandido",
    "carShare": 425.00,
    "netRevenueShareA": 212.50,
    "netRevenueShareB": 212.50,
    "createdAt": "2026-09-07T18:00:00.000Z"
  }
]
```

#### `POST /api/deliveries`
Registra um novo turno com cálculo automático dos repasses.
- **Request Body:**
```json
{
  "date": "2026-09-08",
  "employeeAId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "employeeBId": "f5e4d3c2-b1a0-4321-9876-dcba09876543",
  "deliveryCount": 50,
  "revenue": 1000.00,
  "notes": "Operação normal com dupla"
}
```
- **Response `201 Created`:**
```json
{
  "id": "d002-uuid",
  "date": "2026-09-08",
  "employeeAId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "employeeAName": "Carlos Silva",
  "employeeBId": "f5e4d3c2-b1a0-4321-9876-dcba09876543",
  "employeeBName": "Rodrigo Santos",
  "deliveryCount": 50,
  "revenue": 1000.00,
  "notes": "Operação normal com dupla",
  "carShare": 500.00,
  "netRevenueShareA": 250.00,
  "netRevenueShareB": 250.00,
  "createdAt": "2026-09-08T11:00:00.000Z"
}
```

#### `DELETE /api/deliveries/:id`
Exclui um turno lançado.
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Turno de entrega excluído com sucesso."
}
```

---

### 6.4 Módulo de Despesas com Combustível (`/api/gasoline`)

#### `GET /api/gasoline`
Lista todos os lançamentos de combustível ordenados por data decrescente.
- **Response `200 OK`:**
```json
[
  {
    "id": "g001-uuid",
    "date": "2026-09-06",
    "amount": 180.00,
    "liters": 32.5,
    "description": "Posto Shell - Abastecimento completo",
    "createdAt": "2026-09-06T09:30:00.000Z"
  }
]
```

#### `POST /api/gasoline`
Registra uma nova despesa com combustível.
- **Request Body:**
```json
{
  "date": "2026-09-08",
  "amount": 120.00,
  "liters": 21.8,
  "description": "Posto Ipiranga Av. Principal"
}
```
- **Response `201 Created`:**
```json
{
  "id": "g002-uuid",
  "date": "2026-09-08",
  "amount": 120.00,
  "liters": 21.8,
  "description": "Posto Ipiranga Av. Principal",
  "createdAt": "2026-09-08T11:30:00.000Z"
}
```

#### `DELETE /api/gasoline/:id`
Exclui o lançamento de combustível.
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Despesa com combustível excluída com sucesso."
}
```

---

### 6.5 Módulo de Dashboard & Relatórios Financeiros

#### `GET /api/dashboard/stats`
Retorna as estatísticas consolidadas para os cards do painel inicial.
- **Query Params opcionais**: `period=all|weekly|monthly`
- **Response `200 OK`:**
```json
{
  "period": "monthly",
  "totalDeliveries": 540,
  "totalDaysWorked": 22,
  "grossRevenue": 14200.00,
  "gasolineExpense": 2100.00,
  "netRevenue": 12100.00,
  "carShare": 6050.00,
  "employeesShare": 6050.00,
  "carPercentage": 50,
  "employeeAPercentage": 25,
  "employeeBPercentage": 25,
  "recentDeliveries": [ /* array com as últimas 5 entregas */ ],
  "employeesSummary": [
    {
      "employeeId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "employeeName": "Carlos Silva",
      "deliveriesCount": 310,
      "shiftsCount": 16,
      "totalEarned": 3820.50
    }
  ]
}
```

#### `GET /api/reports/financial`
Retorna o fechamento financeiro detalhado pronto para visualização na tela e para exportação de PDF oficial.
- **Query Params opcionais**: `startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Response `200 OK`:**
```json
{
  "period": {
    "startDate": "2026-09-01",
    "endDate": "2026-09-08"
  },
  "grossRevenue": 10000.00,
  "gasolineExpense": 1200.00,
  "netRevenue": 8800.00,
  "carShare": 4400.00,
  "employeesShare": 4400.00,
  "carPercentage": 50,
  "employeeAPercentage": 25,
  "employeeBPercentage": 25,
  "totalDeliveries": 320,
  "deliveriesList": [ /* turnos no período */ ],
  "gasolineList": [ /* abastecimentos no período */ ],
  "employeesSummary": [
    {
      "employeeId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "employeeName": "Carlos Silva",
      "shiftsCount": 8,
      "deliveriesCount": 180,
      "totalEarned": 2200.00
    }
  ]
}
```

---

### 6.6 Módulo de Configuração de Repasse (`/api/settings/split`)

#### `GET /api/settings/split`
Obtém os percentuais configurados para o usuário autenticado.
- **Response `200 OK`:**
```json
{
  "userId": "e932b132-7491-4e4b-9721-a4b08d234671",
  "carPercentage": 50,
  "employeeAPercentage": 25,
  "employeeBPercentage": 25
}
```

#### `PUT /api/settings/split`
Atualiza a regra percentual de rateio. A soma obrigatória deve totalizar 100%.
- **Request Body:**
```json
{
  "carPercentage": 50,
  "employeeAPercentage": 25,
  "employeeBPercentage": 25
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "splitConfig": {
    "carPercentage": 50,
    "employeeAPercentage": 25,
    "employeeBPercentage": 25
  }
}
```

---

## 7. SEGURANÇA, AUTENTICAÇÃO & MULTI-TENANCY

### 7.1 Isolamento de Dados (Tenant Isolation)
Toda entidade de negócio (`employees`, `deliveries`, `gasoline_expenses`, `split_configs`) possui uma chave estrangeira obrigatória `user_id`.
- **Regra Crítica de Segurança**: Nenhuma query de `SELECT`, `UPDATE` ou `DELETE` pode ser executada sem filtrar explicitamente por `user_id = req.user.id`.
- Isso garante que nenhum administrador acesse turnos, valores ou dados de outro locatário do sistema.

### 7.2 Fluxo de Autenticação JWT
1. O usuário faz `POST /api/auth/login`.
2. O back-end valida a senha com `argon2.verify` ou `bcrypt.compare`.
3. É gerado um JWT assinado com chave secreta `JWT_SECRET`:
   ```typescript
   const token = jwt.sign(
     { id: user.id, email: user.email },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   ```
4. O cliente armazena o token no `localStorage` sob a chave `deliverycontrol_token`.
5. O cliente anexa o cabeçalho `Authorization: Bearer <token>` em todas as requisições subsequentes através do `ApiClient`.

### 7.3 Middleware de Proteção de Rotas (`authenticateToken`)
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    req.user = user as { id: string; email: string };
    next();
  });
}
```

---

## 8. PADRONIZAÇÃO DE ERROS & VALIDAÇÕES

### 8.1 Estrutura de Resposta de Erro
Para garantir uma experiência de usuário consistente no front-end (exibição amigável de toasts e mensagens de validação em campos), o back-end adota um formato uniforme de erro:

```json
{
  "success": false,
  "error": "Descrição legível do erro",
  "code": "VALOR_INVALIDO",
  "details": [
    {
      "field": "revenue",
      "message": "O faturamento bruto deve ser maior que zero."
    }
  ]
}
```

### 8.2 Tabela de Códigos HTTP Padrão
| Código | Significado | Exemplo de Aplicação |
|---|---|---|
| `200 OK` | Sucesso em consultas (`GET`) ou alterações (`PUT`) | Retorno de listagens, relatórios e dashboard |
| `201 Created` | Recurso criado com sucesso | Cadastro de novo entregador ou novo turno |
| `400 Bad Request` | Payload inválido ou regra percentual incorreta | Soma dos percentuais não totaliza 100% |
| `401 Unauthorized` | Token ausente, inválido ou expirado | Tentativa de requisição sem header Bearer |
| `403 Forbidden` | Usuário autenticado sem permissão sobre o recurso | Tentativa de alterar recurso de outro `user_id` |
| `404 Not Found` | Recurso não localizado | Entregador ou turno de ID inexistente |
| `422 Unprocessable Entity` | Erro de validação de campos (Zod Schema) | E-mail com formato inválido |
| `500 Internal Server Error`| Falha inesperada no servidor ou banco | Queda de conexão com banco de dados |

---

## 9. VARIÁVEIS DE AMBIENTE & INFRAESTRUTURA

O arquivo `.env.example` deve conter a documentação de todas as chaves necessárias:

```env
# Configuração do Servidor
PORT=3000
NODE_ENV=production

# Segurança e Criptografia
JWT_SECRET=super_secret_jwt_key_deliverycontrol_change_in_production
JWT_EXPIRES_IN=7d

# Banco de Dados Relacional (PostgreSQL)
DATABASE_URL=postgres://usuario:senha@localhost:5432/deliverycontrol_db

# Configurações de Repasse Padrão
DEFAULT_CAR_PERCENTAGE=50
DEFAULT_EMPLOYEE_A_PERCENTAGE=25
DEFAULT_EMPLOYEE_B_PERCENTAGE=25
```

---

## 10. ROTEIRO DE IMPLEMENTAÇÃO PASSO A PASSO

Caso a equipe deseje expandir o atual servidor em memória para um banco de dados persistente PostgreSQL em produção, seguir o checklist abaixo:

1. **Passo 1: Instalação das Dependências de Produção**
   - Instalar ORM (`drizzle-orm` + `pg` ou `@prisma/client`).
   - Instalar validador de schemas (`zod`).
2. **Passo 2: Provisionamento do Banco de Dados**
   - Criar banco PostgreSQL e rodar as migrações DDL especificadas na **Seção 4.2**.
3. **Passo 3: Mapeamento dos Repositórios / Camada de Dados**
  - Substituir os arrays da classe in-memory (`backend/server/db/database.ts`) pelas queries parametrizadas do ORM escolhido.
4. **Passo 4: Execução da Bateria de Testes Financeiros**
  - Executar os testes unitários de repasse (`backend/server/modules/finance/finance.service.test.ts`) para garantir que 1000 - 100 com regra 50/25/25 resulte exatamente em R$ 450 (carro), R$ 225 (entregador A) e R$ 225 (entregador B).
5. **Passo 5: Conexão Transparente com o Front-End**
   - Como o `ApiClient` do front-end já consome exatamente essas rotas (`/api/deliveries`, `/api/employees`, `/api/gasoline`, etc.), **nenhuma linha de código do front-end precisa ser alterada**.
