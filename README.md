# DeliveryControl

Plataforma full stack para gestão de operações de entrega, desenvolvida com React, TypeScript e Node.js.

O sistema permite controlar entregas, funcionários, despesas com gasolina, regras de divisão financeira, indicadores operacionais e relatórios para fechamento.

## Preview

Aplicação disponível localmente durante o desenvolvimento:

```text
http://localhost:5173
```

O backend disponibiliza a API em:

```text
http://localhost:3000
```

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- Zustand
- React Hook Form e Zod
- Recharts
- Lucide React
- JWT e bcryptjs
- jsPDF e jsPDF AutoTable
- Concurrently

## Funcionalidades

- Autenticação com login, cadastro e sessão por token JWT.
- Dashboard com indicadores de entregas, faturamento, combustível e receita líquida.
- Cadastro, edição e exclusão de funcionários e entregadores.
- Registro, edição e exclusão de turnos de entrega.
- Registro, edição e exclusão de despesas com gasolina.
- Filtros por período, funcionário e tipo de informação.
- Configuração dos percentuais de divisão entre veículo/empresa e entregadores.
- Cálculo de receita líquida com desconto das despesas de combustível.
- Relatórios financeiros com visualização, impressão e exportação para PDF.
- Navegação entre painel, entregas, funcionários, gasolina e relatórios.
- Sidebar fixa, conteúdo central com rolagem e footer no final da página.
- Modais personalizados para confirmar exclusões.

## Regra financeira padrão

O sistema utiliza como configuração padrão:

- 50% para o veículo/empresa.
- 25% para o entregador A.
- 25% para o entregador B.

A receita líquida é calculada da seguinte forma:

```text
Receita líquida = máximo(0, receita bruta - despesas com gasolina)
```

## Como executar

### Pré-requisitos

- Node.js 20 ou superior.
- npm.

### Instalação

1. Clone ou baixe este repositório.
2. Entre na pasta do projeto.
3. Instale as dependências:

```bash
npm install
```

### Desenvolvimento

Inicie frontend e backend juntos:

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

O frontend utiliza o proxy do Vite para encaminhar as requisições `/api` ao backend em `http://localhost:3000`.

Também é possível iniciar os processos separadamente:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

### Credenciais de demonstração

```text
E-mail: demo@deliverycontrol.com
Senha: senha123
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia frontend e backend em paralelo. |
| `npm run dev:backend` | Inicia apenas a API Express. |
| `npm run dev:frontend` | Inicia apenas o Vite. |
| `npm run lint` | Executa a verificação de tipos TypeScript. |
| `npm run build` | Compila frontend e backend para produção. |
| `npm start` | Inicia o servidor compilado. |
| `npm run clean` | Remove a pasta de build `dist`. |

## API

As principais rotas estão disponíveis sob o prefixo `/api`:

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/employees`
- `GET /api/deliveries`
- `GET /api/gasoline`
- `GET /api/dashboard/stats`
- `GET /api/reports/financial`
- `GET /api/settings/split`

As rotas protegidas utilizam o cabeçalho:

```http
Authorization: Bearer <TOKEN_JWT>
```

## Estrutura do projeto

```text
.
├── backend/
│   ├── server.ts                 # Entrada do servidor Express
│   └── server/
│       ├── config/               # Configurações e variáveis de ambiente
│       ├── db/                   # Persistência local e dados de demonstração
│       ├── middlewares/          # Middleware de autenticação
│       ├── modules/              # Auth, entregas, funcionários, gasolina e relatórios
│       └── types.ts              # Tipos do backend
├── frontend/
│   ├── index.html                # Documento base da aplicação
│   ├── public/                   # Assets públicos
│   └── src/
│       ├── components/           # Layout e componentes de interface
│       ├── features/             # Funcionalidades organizadas por domínio
│       ├── services/              # Cliente HTTP e serviços
│       ├── stores/                # Estado global
│       ├── types/                 # Tipos compartilhados do frontend
│       └── App.tsx               # Componente principal
├── dist/                         # Arquivos gerados pelo build
├── package.json                  # Scripts e dependências
├── tsconfig.json                 # Configuração TypeScript
├── vite.config.ts                # Configuração do frontend e proxy da API
├── antigravity/
│   ├── spec-kit/                 # Especificações, plano e tarefas do produto
│   ├── skills/                   # Guias reutilizáveis de implementação
│   ├── rules/                    # Regras permanentes do projeto
│   └── workflows/                # Procedimentos operacionais
└── TASKS.md                      # Roadmap operacional do projeto
```

## Persistência de dados

Durante o desenvolvimento, o backend utiliza um arquivo JSON local em `.data/deliverycontrol.db.json`.

Para produção, recomenda-se substituir essa persistência por PostgreSQL, conforme descrito em
[BACKEND_SPEC_KIT.md](antigravity/spec-kit/BACKEND_SPEC_KIT.md).

## Deploy

O projeto pode ser publicado como um único serviço Node.js ou separado em frontend e backend.

Para um serviço único:

```bash
npm run build
npm start
```

O backend compilado serve os arquivos do frontend a partir da pasta `dist` quando `NODE_ENV=production`.

Também é possível hospedar o backend como Web Service e o frontend como Static Site. Nesse cenário, será necessário configurar a URL pública da API e CORS para permitir a comunicação entre os dois domínios.

## Aprendizados

Este projeto pratica conceitos de desenvolvimento full stack, incluindo:

- Organização de um monorepo com frontend e backend.
- Criação de APIs REST com Express e TypeScript.
- Autenticação e autorização com JWT.
- Validação de dados com Zod.
- Gerenciamento de estado com Zustand.
- Criação de interfaces responsivas com React e Tailwind CSS.
- Cálculos financeiros e regras de divisão de receita.
- Geração de relatórios e documentos PDF.
- Integração entre frontend Vite e backend Node.js.

## Sobre mim

Engenheiro de Software e desenvolvedor apaixonado por tecnologia, com foco em desenvolvimento Full Stack. Atualmente, estudo e trabalho principalmente com JavaScript, TypeScript, Angular, React e Node.js.

## Contato

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jose-martinez-352032222/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:juniorjose1925@gmail.com)
[![Portfólio](https://img.shields.io/badge/Jose.Dev-0A0A03?style=for-the-badge&logo=react&logoColor=white)](https://my-portfolio-jose-martinez.netlify.app/)
