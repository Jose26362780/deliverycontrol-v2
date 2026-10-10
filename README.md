# 🚚 DeliveryControl | Gestão de Entregas e Fechamento Financeiro

O **DeliveryControl** é uma plataforma full stack para gestão de operações de entrega. O sistema centraliza o cadastro de funcionários, o registro de entregas, o controle de despesas com gasolina, os indicadores operacionais e o fechamento financeiro por período.

O projeto foi estruturado para separar claramente a experiência do usuário no **React** da API de negócio em **Node.js/Express**. A autenticação principal utiliza **Better Auth**, com sessões em cookies e suporte a login tradicional e Google OAuth. O banco de dados é modelado com **Prisma** e PostgreSQL.

Durante o desenvolvimento, os principais objetivos foram:

- Construir uma aplicação web responsiva organizada por funcionalidades de negócio.
- Manter as regras financeiras no backend, que é a fonte de verdade dos cálculos.
- Isolar os dados de cada usuário autenticado.
- Implementar a autenticação com o google 
- Permitir execução local com Vite e API Express, além de deploy separado no Netlify e Render.
- Usar o **Antigravity** para centralizar regras de arquitetura, especificações, skills e workflows do projeto.

![preview](.github/cover.png)

## 🚀 Tecnologias utilizadas

### Frontend

![React](https://img.shields.io/badge/React-0175C2?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)


- React 19 com TypeScript e Vite.
- Tailwind CSS, Lucide React e componentes reutilizáveis.
- Zustand para o estado de autenticação.
- React Hook Form e Zod para formulários e validação.
- Recharts para gráficos.
- jsPDF e AutoTable para relatórios em PDF.

### Backend e dados

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)


- Node.js, TypeScript e Express.
- Prisma Client com adapter PostgreSQL.
- Better Auth para sessões, cookies, e-mail/senha e Google OAuth.
- Zod para validação de entradas.
- Helmet, CORS configurável e rate limiting nas rotas de autenticação.
- `bcryptjs` e JWT mantidos para compatibilidade com o fluxo legado.

---

## ✨ Funcionalidades

- Dashboard com entregas, faturamento, gasolina e receita líquida.
- Cadastro, edição, ativação/desativação e remoção de funcionários.
- Registro e manutenção de entregas por período e funcionário.
- Registro de despesas com gasolina, incluindo valor e litragem.
- Configuração da divisão financeira entre empresa/veículo e entregadores.
- Relatórios financeiros com visualização, impressão e exportação em PDF.
- Navegação por dashboard, entregas, funcionários, gasolina e relatórios.
- Feedback visual com loading, estados vazios, erros e toasts.
- Autenticação por e-mail e senha ou pelo Google.



## 🧱 Arquitetura do projeto

```text
.
├── backend/
│   ├── server.ts                 # Inicialização do Express, middlewares e API
│   └── server/
│       ├── auth/                 # Configuração do Better Auth
│       ├── config/               # Ambiente, CORS e configurações
│       ├── db/                   # Cliente Prisma/PostgreSQL
│       ├── middlewares/          # Auth, validação e tratamento de erros
│       ├── modules/              # Controllers e rotas por domínio
│       ├── repositories/         # Acesso persistente aos dados
│       └── utils/                # Respostas e validações compartilhadas
├── frontend/
│   └── src/
│       ├── app/                  # Rotas e componentes compartilhados
│       ├── components/           # Layout e componentes de UI
│       ├── features/             # Auth, dashboard, entregas, funcionários etc.
│       ├── services/             # Cliente HTTP e integrações
│       └── stores/               # Estado global, incluindo autenticação
├── prisma/
│   ├── schema.prisma             # Modelos e relações do banco
│   └── migrations/               # Migrações PostgreSQL
├── antigravity/
│   ├── rules/                    # Regras permanentes de frontend, backend e segurança
│   ├── skills/                   # Guias reutilizáveis por área
│   ├── spec-kit/                 # Especificação, plano e tarefas do produto
│   └── workflows/                # Procedimentos para documentação, testes e revisão
├── .env.example                  # Modelo de configuração local
├── vite.config.ts                # Vite, alias e proxy de /api
├── render.yaml                   # Deploy do backend e PostgreSQL no Render
└── netlify.toml                  # Build e fallback SPA do frontend no Netlify
```

### Arquitetura do frontend

O frontend é uma SPA React. A composição principal segue o fluxo:

```text
App
  ↓
useAuth / Zustand
  ↓
Layout e navegação
  ↓
Páginas por feature
  ↓
Hooks e services
  ↓
API REST em /api
```

Cada domínio fica em `frontend/src/features/`, com páginas, containers, componentes e hooks próprios. O `api-client.ts` centraliza as requisições, prefixa os endpoints com `/api`, envia cookies com `credentials: include` e sinaliza sessões não autorizadas.

### Arquitetura do backend

O Express organiza a API por módulos:

```text
Request
  ↓
Route
  ↓
Middleware de autenticação/validação
  ↓
Controller
  ↓
Service ou Repository
  ↓
Prisma
  ↓
PostgreSQL
```

Os módulos atuais incluem `auth`, `employees`, `deliveries`, `gasoline`, `dashboard`, `analytics`, `reports` e `settings`. As rotas são montadas sob o prefixo `/api`, e o servidor também serve o build do frontend em produção.

## 🔐 Autenticação com Google

O login social é implementado pelo Better Auth, não por um fluxo OAuth manual no React:

1. O usuário seleciona **Continuar com Google** no `LoginForm` ou `RegisterForm`.
2. O cliente Better Auth inicia o fluxo social com o provedor `google`.
3. O backend conduz o callback em `/api/auth/callback/google`.
4. O Google é configurado no backend com `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.
5. O Better Auth cria ou localiza o usuário e a conta vinculada nas tabelas `users` e `accounts`.
6. A aplicação mantém uma sessão própria em cookie e redireciona para `/dashboard`.

O `GOOGLE_CLIENT_SECRET` nunca deve ser colocado no frontend, no README ou no Git. Em produção, frontend e backend podem estar em domínios diferentes; por isso, o Better Auth usa cookies `Secure` e `SameSite=None` quando `BETTER_AUTH_URL` é HTTPS, e o frontend deve definir `VITE_API_URL`.

O projeto também oferece cadastro/login por e-mail e senha. Quando `BETTER_AUTH_ENABLED=true`, esse é o fluxo principal; com a flag desativada, as rotas JWT legadas permanecem disponíveis para migração e desenvolvimento.

## 🔌 API principal

Todas as rotas abaixo usam o prefixo `/api`:

| Método | Endpoint | Responsabilidade |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck da aplicação e do banco |
| `GET/POST/PUT/DELETE` | `/api/employees` | Gestão de funcionários |
| `GET/POST/PUT/DELETE` | `/api/deliveries` | Gestão de entregas |
| `GET/POST/PUT/DELETE` | `/api/gasoline` | Gestão de despesas com gasolina |
| `GET` | `/api/dashboard/stats` | Indicadores do dashboard |
| `GET` | `/api/analytics/*` | Consultas analíticas |
| `GET` | `/api/reports/financial` | Fechamento financeiro |
| `GET/PUT` | `/api/settings/split` | Configuração dos percentuais |
| `ALL` | `/api/auth/*` | Better Auth, incluindo login social |

Com Better Auth ativo, a sessão é enviada por cookie. O middleware de autenticação recupera essa sessão e associa o `userId` às operações protegidas, impedindo que o frontend escolha o proprietário dos dados.



### Pré-requisitos

- Node.js 20 ou superior.
- npm.
- PostgreSQL local ou uma URL de PostgreSQL acessível.
- Credenciais OAuth do Google para habilitar o login social.

### Instalação

```bash
git clone https://github.com/Jose26362780/deliverycontrol-v2.git
cd deliverycontrol-v2
npm install
```

Copie `.env.example` para `.env` e preencha pelo menos:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/deliverycontrol_db"
BETTER_AUTH_ENABLED=true
BETTER_AUTH_SECRET="use-uma-chave-com-pelo-menos-32-caracteres"
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

Gere o client Prisma e aplique as migrações:

```bash
npm run db:generate
npm run db:migrate
```

Inicie frontend e backend juntos:

```bash
npm run dev
```

Acesse `http://localhost:5173`. A API estará em `http://localhost:3000` e o Vite encaminhará `/api` para o backend.

## 📜 Scripts disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia frontend e backend em paralelo. |
| `npm run dev:backend` | Inicia somente o Express. |
| `npm run dev:frontend` | Inicia somente o Vite. |
| `npm run lint` | Executa a verificação de tipos com TypeScript. |
| `npm run build` | Gera o Prisma Client, compila o frontend e empacota o backend. |
| `npm run build:frontend` | Gera somente o build estático do frontend. |
| `npm start` | Inicia o servidor compilado em `dist/server.cjs`. |
| `npm run db:generate` | Gera o Prisma Client. |
| `npm run db:migrate` | Executa migrações em desenvolvimento. |
| `npm run db:deploy` | Aplica migrações em produção. |

## ☁️ Deploy

O projeto possui duas estratégias:

- **Netlify**: publica somente o frontend com `npm run build:frontend`, servindo `dist` e mantendo o fallback SPA.
- **Render**: executa o backend Node.js e o PostgreSQL. O `render.yaml` configura geração do Prisma Client, migrações e build de produção.

No deploy separado, configure `VITE_API_URL` no frontend, `FRONTEND_URL` no backend e os mesmos domínios autorizados no Google Cloud Console. O callback OAuth deve apontar para:

```text
https://seu-backend/api/auth/callback/google
```

Também é possível executar como serviço único:

```bash
npm run build
npm start
```

## 🧭 Antigravity no projeto

O diretório `antigravity/` funciona como uma camada de governança e produtividade para desenvolvimento assistido por IA. Ele não é uma dependência executada pela aplicação; organiza o conhecimento que orienta novas alterações:

- `rules/`: padrões obrigatórios de arquitetura, segurança, frontend, backend e documentação.
- `skills/`: guias práticos para API REST, autenticação, persistência, React e regras de negócio.
- `spec-kit/`: visão do produto, especificação técnica do backend, plano e tarefas.
- `workflows/`: processos repetíveis para atualizar o README, executar testes e revisar código.

O README deve permanecer conciso; os detalhes de implementação e o roadmap continuam no [Spec Kit](antigravity/spec-kit/SPEC_KIT.md), no [Spec Kit do backend](antigravity/spec-kit/BACKEND_SPEC_KIT.md) e no [TASKS.md](TASKS.md).

## 👨‍💻 Sobre mim

Engenheiro de Software e desenvolvedor apaixonado por tecnologia, com foco em desenvolvimento Full Stack e experiência com JavaScript, TypeScript, React, Angular e Node.js.

## 🔗 Contato

[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jose-martinez-352032222/)
[![gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](https://mailto:juniorjose1925@gmail.com)
[![portfolio](https://img.shields.io/badge/Jose.Dev-0A0A0A?style=for-the-badge&logo=MyWeb&logoColor=white)](https://my-portfolio-jose-martinez.netlify.app/)