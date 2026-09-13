Skill: Documentação Técnica
Objetivo

Criar e manter documentação técnica clara, precisa e atualizada
sobre a arquitetura, funcionamento e decisões técnicas do projeto.

A documentação deve permitir que outro desenvolvedor consiga:

entender a arquitetura;
localizar responsabilidades;
compreender o fluxo de dados;
entender as regras de negócio;
executar e modificar o projeto;
compreender as APIs;
identificar dependências entre módulos;
realizar manutenção e evolução do sistema.

A documentação deve refletir sempre o código real do projeto.

Princípios

A documentação técnica deve ser:

clara;
objetiva;
precisa;
baseada no código;
organizada;
atualizável;
orientada a desenvolvedores.

Nunca documentar uma arquitetura que não existe no código.

Nunca inventar:

endpoints;
serviços;
módulos;
regras de negócio;
bancos de dados;
tecnologias;
fluxos;
integrações.
Estrutura padrão

Quando aplicável, a documentação técnica deve seguir:

1. Visão geral
2. Arquitetura
3. Estrutura do projeto
4. Frontend
5. Backend
6. Fluxo de dados
7. API
8. Autenticação e segurança
9. Regras de negócio
10. Persistência
11. Estado da aplicação
12. Validação
13. Tratamento de erros
14. Testes
15. Configuração
16. Variáveis de ambiente
17. Build e execução
18. Deploy
19. Decisões técnicas
20. Limitações e melhorias futuras

Nem todas as seções precisam existir em todos os projetos.

1. Visão geral

Explicar tecnicamente:

objetivo do sistema;
tipo de aplicação;
arquitetura utilizada;
principais tecnologias;
principais módulos;
responsabilidade de cada camada.

Exemplo:

# Documentação Técnica

## Visão geral

O DeliveryControl é uma aplicação full stack para gerenciamento
de operações de entrega e controle financeiro.

A aplicação é composta por:

- frontend React + TypeScript + Vite;
- backend Node.js + Express + TypeScript;
- API REST;
- autenticação baseada em JWT;
- persistência local durante o desenvolvimento.

O frontend é responsável pela interface e interação do usuário.

O backend é responsável por autenticação, regras de negócio,
validação, persistência e exposição da API.
2. Arquitetura

Descrever a arquitetura real do sistema.

Sempre que possível, apresentar visualmente.

Exemplo:

┌─────────────────────┐
│      Frontend       │
│ React + TypeScript  │
└──────────┬──────────┘
           │
           │ HTTP / REST
           ▼
┌─────────────────────┐
│       Backend       │
│ Node.js + Express   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Business Rules   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Persistence     │
└─────────────────────┘

Explicar a responsabilidade de cada camada.

3. Estrutura do projeto

Apresentar os principais diretórios.

Exemplo:

frontend/
├── src/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── stores/
│   └── types/

backend/
└── server/
    ├── config/
    ├── db/
    ├── middlewares/
    ├── modules/
    └── types.ts

Para cada diretório importante, explicar:

components/
→ componentes reutilizáveis de interface.

features/
→ funcionalidades organizadas por domínio.

services/
→ comunicação com APIs e serviços externos.

stores/
→ gerenciamento de estado global.

Não documentar arquivos irrelevantes.

4. Frontend

Documentar:

arquitetura;
páginas;
componentes;
services;
stores;
hooks;
schemas;
tipos;
gerenciamento de estado;
comunicação com API.

Exemplo:

Page
 ↓
Component
 ↓
Hook / Store
 ↓
Service
 ↓
HTTP
 ↓
Backend API

Explicar onde cada responsabilidade deve ficar.

5. Backend

Documentar:

servidor;
rotas;
middlewares;
módulos;
services;
regras de negócio;
persistência;
validação;
autenticação.

Exemplo:

Request
   ↓
Route
   ↓
Middleware
   ↓
Handler / Controller
   ↓
Service
   ↓
Business Rule
   ↓
Database

Explicar responsabilidades sem duplicar código.

6. Fluxo de dados

Documentar os principais fluxos da aplicação.

Exemplo:

Usuário
   ↓
Frontend
   ↓
HTTP Request
   ↓
Express
   ↓
Authentication Middleware
   ↓
Service
   ↓
Database
   ↓
Response
   ↓
Frontend
   ↓
UI

Criar fluxos específicos quando necessário.

Exemplo:

Login

Usuário
 ↓
Login Form
 ↓
Auth Service
 ↓
POST /api/auth/login
 ↓
Backend
 ↓
Validação
 ↓
bcrypt
 ↓
JWT
 ↓
Response
 ↓
Frontend
 ↓
Session
7. API

Documentar os endpoints existentes.

Para cada endpoint, utilizar:

### GET /api/example

Descrição:

Retorna ...

Autenticação:

Obrigatória.

Request:

```http
GET /api/example
Authorization: Bearer <TOKEN>

Response:

{
  "data": []
}

Possíveis respostas:

200 — sucesso
400 — requisição inválida
401 — não autenticado
403 — não autorizado
404 — recurso não encontrado
500 — erro interno

Nunca documentar endpoints que não existem.

Sempre verificar as rotas reais antes de atualizar a documentação.

---

# 8. Autenticação e segurança

Documentar:

- método de autenticação;
- geração do token;
- armazenamento do token;
- middleware;
- expiração;
- proteção das rotas;
- autorização;
- isolamento de dados.

Para JWT:

```text
Login
 ↓
Credenciais
 ↓
Validação
 ↓
bcrypt
 ↓
JWT
 ↓
Frontend
 ↓
Authorization: Bearer TOKEN
 ↓
Middleware
 ↓
Usuário autenticado

Nunca documentar ou expor:

senhas reais;
secrets;
tokens reais;
chaves privadas;
credenciais de produção.
9. Regras de negócio

Regras importantes devem possuir documentação própria.

No DeliveryControl:

Receita bruta
      ↓
Despesas com gasolina
      ↓
Receita líquida
      ↓
Distribuição

Regra:

Receita líquida =
máximo(0, receita bruta - despesas com gasolina)

Distribuição padrão:

Veículo/empresa → 50%
Entregador A    → 25%
Entregador B    → 25%

A documentação deve informar:

onde a regra está implementada;
quais dados utiliza;
quais validações possui;
quais casos extremos existem;
quais testes garantem seu comportamento.

Regras financeiras devem ter o backend como fonte de verdade.

10. Persistência

Documentar:

tecnologia utilizada;
estrutura dos dados;
localização;
estratégia de leitura/escrita;
dados de demonstração;
limitações da solução atual.

Exemplo:

## Persistência

Durante o desenvolvimento, a aplicação utiliza persistência local
em arquivo JSON.

Arquivo:

.data/deliverycontrol.db.json

A solução é destinada ao ambiente de desenvolvimento.

Para produção, a persistência deve ser substituída por PostgreSQL.

Não afirmar que PostgreSQL está implementado se ele ainda não estiver.

11. Estado da aplicação

Documentar quando existir gerenciamento de estado.

Para Zustand, explicar:

quais stores existem;
quais dados controlam;
quando são atualizadas;
quais componentes consomem os dados.

Exemplo:

Store
 ├── autenticação
 ├── usuário
 └── sessão

Evitar colocar no estado global dados que pertencem
somente a um componente ou página.

12. Validação

Documentar a estratégia de validação.

Exemplo:

Frontend
 ↓
React Hook Form
 ↓
Zod
 ↓
HTTP
 ↓
Backend
 ↓
Zod
 ↓
Business Rules

A validação do frontend melhora a experiência do usuário.

A validação do backend garante segurança e integridade.

Nunca considerar a validação do frontend suficiente.

13. Tratamento de erros

Documentar como erros são tratados.

Frontend:

API Error
 ↓
Service
 ↓
Component / Hook
 ↓
Feedback visual

Backend:

Invalid Request
 ↓
Validation
 ↓
HTTP 400
Unauthenticated
 ↓
Authentication Middleware
 ↓
HTTP 401
Unauthorized
 ↓
Authorization
 ↓
HTTP 403
Unexpected Error
 ↓
Error Handler
 ↓
HTTP 500
14. Testes

Documentar:

ferramenta utilizada;
localização dos testes;
estratégia;
o que deve ser testado;
comandos para execução.

Priorizar:

regras de negócio;
serviços;
autenticação;
validação;
endpoints;
componentes críticos.

Para regras financeiras, documentar os principais cenários.

15. Configuração

Documentar configurações necessárias.

Exemplo:

## Configuração

Variáveis de ambiente:

```env
PORT=3000
JWT_SECRET=...
NODE_ENV=development

Nunca colocar valores secretos reais.

Se existir `.env.example`, utilizá-lo como fonte de referência.

---

# 16. Variáveis de ambiente

Criar tabela quando houver várias variáveis.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `PORT` | Não | Porta do servidor |
| `JWT_SECRET` | Sim | Secret utilizado para JWT |
| `NODE_ENV` | Não | Ambiente da aplicação |

Nunca documentar secrets reais.

---

# 17. Build e execução

Documentar os comandos reais do projeto.

Exemplo:

```bash
npm install
npm run dev
npm run build
npm start

Antes de documentar, verificar o package.json.

Nunca inventar scripts.

18. Deploy

Documentar somente estratégias realmente suportadas.

Exemplo:

Build
 ↓
Backend
 ↓
Frontend
 ↓
Servidor / Plataforma de hospedagem

Explicar:

build;
variáveis de ambiente;
API pública;
CORS;
frontend;
backend;
persistência;
limitações.

Separar claramente:

Desenvolvimento

de:

Produção
19. Decisões técnicas

Documentar decisões importantes utilizando:

## Decisões técnicas

### React + Vite

Motivo:

...

### Zustand

Motivo:

...

### JWT

Motivo:

...

### Persistência JSON

Motivo:

...

Limitação:

...

O objetivo não é apenas dizer
"o que foi utilizado", mas explicar:

problema;
decisão;
motivo;
consequência;
alternativa considerada, quando relevante.
20. Limitações

Documentar limitações conhecidas.

Exemplo:

## Limitações

- Persistência local durante desenvolvimento.
- Ausência de PostgreSQL na versão atual.
- Algumas funcionalidades dependem de configuração de ambiente.

Não esconder limitações conhecidas.

21. Melhorias futuras

Quando houver roadmap:

## Melhorias futuras

- Migração para PostgreSQL.
- Implementação de testes E2E.
- Melhorias de observabilidade.
- Paginação de grandes volumes de dados.
- Melhorias no sistema de permissões.

Não adicionar itens que não façam sentido para o projeto.

Regra de sincronização

A documentação técnica deve permanecer sincronizada
com o código.

Sempre que ocorrer alteração em:

arquitetura;
API;
banco;
autenticação;
regras de negócio;
estrutura de diretórios;
tecnologias;
variáveis de ambiente;
scripts;
deploy;

verificar se a documentação precisa ser atualizada.

Processo de criação

Antes de criar documentação:

analisar a estrutura do projeto;
analisar package.json;
analisar configurações;
analisar frontend;
analisar backend;
analisar rotas;
analisar services;
analisar stores;
analisar schemas;
analisar persistência;
analisar testes;
identificar regras de negócio;
identificar decisões arquiteturais.

Depois:

criar documentação;
comparar documentação com código;
remover informações não confirmadas;
verificar exemplos;
verificar diagramas;
verificar endpoints;
verificar comandos;
verificar variáveis de ambiente.
Formato dos documentos

Quando o projeto crescer, separar a documentação por domínio.

Exemplo:

docs/
├── arquitetura.md
├── frontend.md
├── backend.md
├── api.md
├── autenticacao.md
├── regras-negocio.md
├── banco-de-dados.md
├── testes.md
├── deploy.md
└── decisoes-tecnicas.md

Para projetos pequenos, pode utilizar um único:

docs/TECHNICAL_DOCUMENTATION.md

A documentação não deve ser fragmentada excessivamente.

Critérios de qualidade

Antes de finalizar:

A arquitetura corresponde ao código.

A estrutura do projeto está atualizada.

As APIs documentadas existem.

Os exemplos de request estão corretos.

Os exemplos de response estão corretos.

A autenticação está documentada.

As regras de negócio estão documentadas.

As validações estão documentadas.

A persistência está documentada.

Os testes estão documentados.

Os comandos foram verificados.

As variáveis de ambiente estão corretas.

Não existem secrets.

Não existem informações inventadas.

Não existem informações desatualizadas.

As decisões técnicas importantes estão registradas.

Resultado esperado

A documentação técnica deve permitir que um novo desenvolvedor
consiga compreender o sistema sem precisar analisar todo o código
antes de começar a trabalhar.

Ela deve explicar:

O que existe?
       ↓
Onde está?
       ↓
Por que está ali?
       ↓
Como funciona?
       ↓
Como os dados circulam?
       ↓
Quais regras existem?
       ↓
Como testar?
       ↓
Como modificar?
       ↓
Como executar?