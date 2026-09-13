SKILL: ANÁLISE DE ARQUITETURA — DELIVERYCONTROL

OBJETIVO

Esta skill define como analisar a arquitetura do DeliveryControl antes, durante ou depois de uma implementação.

O objetivo é avaliar se a estrutura do sistema:

- Está coerente com os princípios arquiteturais definidos
- Possui responsabilidades bem separadas
- Evita acoplamento desnecessário
- Possui boa organização
- Facilita manutenção
- Facilita testes
- Permite evolução
- Mantém frontend e backend desacoplados
- Centraliza regras de negócio
- Protege dados e autenticação
- Evita duplicação de responsabilidades

A análise deve considerar a arquitetura atual do projeto antes de propor mudanças.

==================================================
1. PRINCÍPIO FUNDAMENTAL
==================================================

Não alterar a arquitetura apenas por preferência pessoal.

Toda mudança arquitetural deve possuir uma justificativa técnica.

Antes de propor uma alteração:

1. Entender a arquitetura existente
2. Identificar o problema
3. Avaliar o impacto
4. Verificar alternativas
5. Escolher a solução mais simples adequada
6. Justificar a decisão

Evitar complexidade arquitetural sem benefício real.

==================================================
2. STACK DO PROJETO
==================================================

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Hook Form
- Zod
- Recharts
- Lucide React

Backend:

- Node.js
- TypeScript
- Express
- Zod
- JWT
- bcryptjs
- Prisma
- PostgreSQL

Testes:

- Vitest

Documentação:

- Markdown
- Arquivos de especificação
- README

==================================================
3. ARQUITETURA PRINCIPAL
==================================================

O projeto deve manter separação conceitual entre frontend e backend.

Frontend:

Page
↓
Component
↓
Hook / Store
↓
Service
↓
API

Backend:

Route
↓
Middleware
↓
Controller / Handler
↓
Service
↓
Business Rule
↓
Repository
↓
Database

Essa separação não precisa resultar em excesso de abstrações.

A arquitetura deve permanecer simples e coerente com o tamanho do projeto.

==================================================
4. FRONTEND
==================================================

A análise do frontend deve verificar:

- Organização das páginas
- Organização dos componentes
- Separação de responsabilidades
- Hooks
- Stores
- Services
- Interfaces
- Schemas
- Integração com API
- Estado local
- Estado global
- Tratamento de erros
- Loading states
- Responsividade
- Acessibilidade
- Reutilização

Uma Page deve atuar principalmente como composição e orquestração da interface.

Componentes devem possuir responsabilidades claras.

Services devem centralizar comunicação com API.

Stores devem ser utilizados somente quando o estado realmente precisar ser compartilhado.

==================================================
5. BACKEND
==================================================

A análise do backend deve verificar:

- Routes
- Controllers / Handlers
- Services
- Regras de negócio
- Repositories
- Schemas
- Middlewares
- Autenticação
- Autorização
- Persistência
- Tratamento de erros

O backend deve possuir separação clara entre:

HTTP

↓

Aplicação

↓

Domínio / Regras

↓

Persistência

==================================================
6. ROUTES
==================================================

Routes devem ser responsáveis por:

- Definir endpoints
- Definir métodos HTTP
- Registrar middlewares
- Encaminhar requisições

Routes não devem conter:

- Cálculos financeiros
- Queries complexas
- Regras de negócio
- Manipulação direta do Prisma
- Lógica extensa

Se uma Route possuir lógica significativa, investigar possível violação de responsabilidade.

==================================================
7. CONTROLLERS / HANDLERS
==================================================

Controllers devem funcionar como adaptadores entre HTTP e aplicação.

Responsabilidades:

- Receber request
- Extrair dados
- Chamar Service
- Retornar response

Não devem:

- Implementar regras financeiras
- Executar diretamente regras complexas
- Consultar banco diretamente
- Controlar autorização de forma espalhada
- Duplicar validações

==================================================
8. SERVICES
==================================================

Services representam casos de uso da aplicação.

Devem:

- Coordenar operações
- Aplicar regras de negócio
- Validar condições
- Chamar repositories
- Coordenar transações
- Garantir consistência

Evitar Services gigantes.

Quando um Service possuir responsabilidades muito diferentes, analisar possibilidade de separação.

==================================================
9. REPOSITORIES
==================================================

Repositories devem encapsular persistência.

Devem:

- Consultar dados
- Criar dados
- Atualizar dados
- Excluir dados
- Aplicar filtros de persistência

Não devem:

- Calcular divisão financeira
- Decidir regras de negócio
- Controlar fluxo de aplicação
- Implementar regras de autorização

O Repository deve responder:

"Como acessar os dados?"

Não:

"O que o sistema deve decidir?"

==================================================
10. REGRAS DE NEGÓCIO
==================================================

Regras importantes devem estar centralizadas.

Exemplos:

- Receita líquida
- Divisão da receita
- Percentuais
- Validação financeira
- Regras de funcionários
- Regras de turnos
- Regras de autorização
- Isolamento de dados

Evitar regras espalhadas em:

- React
- Controllers
- Routes
- Repositories
- SQL
- Hooks

==================================================
11. REGRA FINANCEIRA
==================================================

A arquitetura deve preservar a regra:

Receita líquida =
MAX(0, Receita bruta - Gasolina)

Divisão padrão:

Carro / Empresa:
50%

Funcionário A:
25%

Funcionário B:
25%

Total:

100%

O cálculo oficial deve ocorrer no backend.

O frontend pode apresentar uma prévia do cálculo, mas não deve ser considerado fonte de verdade.

==================================================
12. AUTENTICAÇÃO
==================================================

A arquitetura deve suportar:

- Email e senha
- Google OAuth / OIDC

Ambos devem resultar na mesma identidade interna:

Usuario

A arquitetura deve evitar duplicação de lógica de autenticação.

Conceitualmente:

Usuario
├── ProvedorAutenticacao: password
└── ProvedorAutenticacao: google

A aplicação deve possuir seu próprio mecanismo de sessão/token.

==================================================
13. AUTORIZAÇÃO
==================================================

Autenticação responde:

"Quem é o usuário?"

Autorização responde:

"O que esse usuário pode fazer?"

A arquitetura deve manter essas responsabilidades claras.

Toda operação protegida deve verificar:

- Usuário autenticado
- Permissão
- Propriedade do recurso
- Contexto da operação

==================================================
14. ISOLAMENTO DE DADOS
==================================================

O sistema deve utilizar o usuário autenticado como fonte de autoridade.

Não confiar em:

- userId enviado pelo frontend
- userId no body
- userId na URL
- userId em query parameters

O backend deve determinar o usuário através do contexto autenticado.

Exemplo:

Usuário A:

userId = 10

Registro:

userId = 20

O usuário A não pode acessar o registro do usuário B.

==================================================
15. IDOR
==================================================

Durante a análise arquitetural, procurar vulnerabilidades de IDOR.

Exemplo:

GET /api/entregas/123

Não é suficiente verificar apenas:

"Existe a entrega 123?"

Também é necessário verificar:

"A entrega 123 pertence ao usuário autenticado?"

Essa verificação deve estar incorporada ao fluxo arquitetural adequado.

==================================================
16. TYPESCRIPT
==================================================

A arquitetura deve favorecer tipagem forte.

Verificar:

- Interfaces
- Types
- DTOs
- Tipos de resposta
- Tipos de request
- Tipos de Service
- Tipos de Repository
- Tipos financeiros

Evitar:

any

Quando o tipo é desconhecido, considerar:

unknown

A arquitetura não deve criar múltiplas definições conflitantes para a mesma entidade.

==================================================
17. DTOs
==================================================

Quando necessário, utilizar DTOs para separar:

- Dados recebidos pela API
- Dados internos da aplicação
- Dados persistidos
- Dados retornados pela API

Evitar expor diretamente modelos do banco quando isso criar acoplamento desnecessário.

Exemplo:

Database Model
≠
API Response
≠
Frontend Model

A separação deve ser aplicada quando houver benefício real.

Não criar DTOs excessivos sem necessidade.

==================================================
18. VALIDAÇÃO
==================================================

A arquitetura deve definir claramente onde cada validação acontece.

Frontend:

Validação para UX.

Backend:

Validação de segurança e integridade.

Banco:

Constraints e integridade estrutural.

Exemplo:

Frontend:

"campo obrigatório"

Backend:

"campo obrigatório"

Banco:

NOT NULL

Essas camadas não substituem umas às outras.

==================================================
19. BANCO DE DADOS
==================================================

Verificar:

- Relacionamentos
- Foreign Keys
- Unique constraints
- Índices
- Integridade
- Cascades
- Transações
- Tipos
- Datas
- Valores financeiros

O banco deve garantir integridade estrutural.

A regra de negócio não deve ser transferida desnecessariamente para o banco.

==================================================
20. PRISMA
==================================================

Prisma deve permanecer dentro da camada de persistência.

Evitar utilizar Prisma diretamente em:

- Controllers
- Routes
- Componentes React
- Hooks de interface
- Regras de negócio

Preferir:

Service
↓
Repository
↓
Prisma

==================================================
21. DEPENDÊNCIAS
==================================================

Analisar a direção das dependências.

Preferir:

Presentation
↓
Application
↓
Domain
↓
Infrastructure

Evitar:

Domain
↓
React

Domain
↓
Express

Domain
↓
Prisma

Domain deve permanecer o mais independente possível.

==================================================
22. ACOPLAMENTO
==================================================

Identificar alto acoplamento.

Sinais:

- Uma alteração exige modificar muitos arquivos
- Componentes conhecem detalhes do banco
- Services conhecem detalhes HTTP
- Repositories conhecem regras de negócio
- Frontend conhece estrutura interna do banco
- Muitos imports circulares
- Classes gigantes
- Funções com muitas responsabilidades

Sempre que possível:

Reduzir dependências desnecessárias.

==================================================
23. COESÃO
==================================================

Cada módulo deve possuir responsabilidades relacionadas.

Exemplo ruim:

financeiro.service.ts

contendo:

- Login
- Funcionários
- Entregas
- Relatórios
- Gasolina
- Autenticação

Exemplo melhor:

financeiro/
funcionarios/
entregas/
turnos/
autenticacao/
relatorios/

A divisão deve seguir responsabilidades reais.

==================================================
24. SOLID
==================================================

Durante a análise, considerar os princípios SOLID.

S — Single Responsibility

Uma unidade deve possuir uma responsabilidade clara.

O — Open / Closed

Evitar alterações extensivas quando uma nova variação puder ser adicionada de forma segura.

L — Liskov Substitution

Implementações devem respeitar seus contratos.

I — Interface Segregation

Interfaces devem ser específicas e não obrigar dependências desnecessárias.

D — Dependency Inversion

Camadas de alto nível não devem depender diretamente de detalhes de infraestrutura quando isso prejudicar testabilidade e manutenção.

Não aplicar SOLID de maneira dogmática.

Simplicidade continua sendo prioridade.

==================================================
25. DRY
==================================================

Evitar duplicação significativa.

Procurar duplicação de:

- Regras financeiras
- Validações
- Tipos
- Chamadas API
- Formatação
- Regras de autorização
- Cálculos

Entretanto, não criar abstrações prematuras apenas para eliminar pequenas repetições.

==================================================
26. KISS
==================================================

Preferir a solução mais simples que resolva corretamente o problema.

Evitar:

- Abstrações excessivas
- Camadas desnecessárias
- Padrões complexos sem necessidade
- Design patterns apenas por estética
- Bibliotecas adicionais sem justificativa

A arquitetura deve acompanhar a complexidade real do projeto.

==================================================
27. YAGNI
==================================================

Não implementar infraestrutura para necessidades hipotéticas.

Evitar criar antecipadamente:

- Microsserviços
- Event Bus
- CQRS
- Message Broker
- Cache complexo
- Sistema de plugins
- Arquitetura distribuída

quando o projeto não possui necessidade real.

==================================================
28. IMPORTS E DEPENDÊNCIAS CIRCULARES
==================================================

Verificar possíveis ciclos:

A
↓
B
↓
C
↓
A

Dependências circulares dificultam:

- Testes
- Build
- Manutenção
- Compreensão do código

Quando encontrados:

1. Identificar causa
2. Identificar responsabilidade incorreta
3. Reorganizar dependências
4. Verificar impacto

==================================================
29. COMPONENTES REACT
==================================================

Analisar se componentes:

- Possuem responsabilidade clara
- Recebem props tipadas
- Evitam lógica excessiva
- Evitam chamadas API diretas desnecessárias
- Não duplicam regras de negócio
- Podem ser reutilizados quando necessário

Evitar transformar componentes em arquivos gigantes.

==================================================
30. HOOKS
==================================================

Hooks devem encapsular lógica relacionada à interface ou estado.

Evitar colocar regras financeiras críticas exclusivamente em hooks.

Exemplo:

useReceita()

pode apresentar dados.

Mas:

calcularReceitaLiquida()

deve possuir uma regra central no domínio/backend.

==================================================
31. ZUSTAND
==================================================

Verificar se Zustand está sendo utilizado apenas onde necessário.

Estado global é apropriado quando:

- Muitos componentes precisam do mesmo estado
- Estado precisa persistir entre páginas
- Estado representa contexto global da aplicação

Evitar colocar todos os estados dentro de Zustand.

Estado local deve permanecer local quando possível.

==================================================
32. SERVIÇOS DO FRONTEND
==================================================

Services do frontend devem centralizar comunicação HTTP.

Exemplo:

funcionarios.service.ts

entregas.service.ts

turnos.service.ts

financeiro.service.ts

Evitar chamadas fetch espalhadas por dezenas de componentes.

==================================================
33. API CONTRACT
==================================================

Analisar consistência entre frontend e backend.

Verificar:

- URLs
- Métodos HTTP
- Request body
- Query params
- Response
- Status codes
- Erros
- Tipos

Uma mudança no backend pode exigir atualização do frontend.

Toda alteração de contrato deve ser analisada como impacto arquitetural.

==================================================
34. TRATAMENTO DE ERROS
==================================================

A arquitetura deve possuir estratégia consistente para erros.

Verificar:

- Erros de validação
- Erros de autenticação
- Erros de autorização
- Erros de negócio
- Erros de persistência
- Erros inesperados

Evitar:

try/catch espalhados sem padrão.

Preferir tratamento centralizado quando apropriado.

==================================================
35. SEGURANÇA
==================================================

Durante a análise arquitetural, verificar:

- Autenticação
- Autorização
- IDOR
- Validação
- CORS
- Rate limiting
- Secrets
- JWT
- Cookies
- XSS
- SQL Injection
- Exposição de dados
- Logs
- Controle de acesso

Segurança deve fazer parte da arquitetura, não ser adicionada somente no final.

==================================================
36. TESTABILIDADE
==================================================

Uma boa arquitetura deve facilitar testes.

Verificar se:

- Regras podem ser testadas isoladamente
- Services podem ser testados com mocks
- Repositories podem ser substituídos
- Funções puras podem ser testadas
- Componentes podem ser testados
- Dependências podem ser controladas

Se uma unidade é extremamente difícil de testar, investigar se existe problema arquitetural.

==================================================
37. PERFORMANCE
==================================================

Performance deve ser analisada sem otimização prematura.

Verificar:

Frontend:

- Renderizações desnecessárias
- Requests duplicadas
- Componentes excessivamente pesados
- Estado global excessivo

Backend:

- Queries desnecessárias
- N+1 queries
- Falta de índices
- Payloads excessivos
- Processamento repetido

Database:

- Índices
- Paginação
- Filtros
- Ordenação
- Consultas complexas

Só otimizar quando houver justificativa técnica.

==================================================
38. ESCALABILIDADE
==================================================

Avaliar se a arquitetura consegue evoluir sem exigir reescrita completa.

Considerar:

- Crescimento de funcionalidades
- Crescimento de usuários
- Crescimento de dados
- Novos relatórios
- Novas regras financeiras
- Novos métodos de autenticação

Não confundir escalabilidade com complexidade.

O objetivo é permitir evolução gradual.

==================================================
39. ANÁLISE DE NOVA FEATURE
==================================================

Antes de implementar uma nova feature:

1. Identificar a página afetada
2. Identificar entidades envolvidas
3. Identificar regras de negócio
4. Identificar APIs necessárias
5. Identificar Services
6. Identificar Repositories
7. Identificar componentes
8. Identificar estado
9. Identificar validações
10. Identificar testes
11. Identificar documentação
12. Avaliar impactos existentes

==================================================
40. ANÁLISE DE NOVA PAGE
==================================================

Para uma nova Page:

1. Identificar responsabilidade da página
2. Identificar dados necessários
3. Identificar API
4. Identificar estado
5. Identificar componentes
6. Identificar formulários
7. Identificar validações
8. Identificar estados loading/error/empty
9. Verificar responsividade
10. Verificar acessibilidade
11. Verificar testes
12. Verificar reutilização

==================================================
41. ANÁLISE DE NOVA API
==================================================

Para uma nova API:

1. Identificar recurso
2. Definir endpoint
3. Definir método HTTP
4. Definir request
5. Definir response
6. Definir validação
7. Definir autenticação
8. Definir autorização
9. Definir regra de negócio
10. Definir Service
11. Definir Repository
12. Definir testes
13. Avaliar impacto no frontend
14. Atualizar documentação

==================================================
42. ANÁLISE DE MUDANÇA ARQUITETURAL
==================================================

Antes de alterar arquitetura:

PERGUNTAR:

Qual problema estamos resolvendo?

Depois analisar:

- Problema atual
- Causa
- Impacto
- Alternativas
- Complexidade
- Risco
- Benefícios
- Custo de migração
- Compatibilidade
- Testes necessários

Uma mudança arquitetural só deve ser recomendada quando o benefício justificar o custo.

==================================================
43. SEVERIDADE DOS PROBLEMAS
==================================================

Classificar problemas encontrados.

CRITICAL

Problemas que podem:

- Comprometer segurança
- Expor dados
- Permitir acesso indevido
- Corromper dados
- Quebrar regra financeira crítica

HIGH

Problemas que:

- Causam falhas importantes
- Criam alto acoplamento
- Quebram responsabilidades fundamentais
- Dificultam significativamente manutenção

MEDIUM

Problemas que:

- Prejudicam manutenção
- Criam duplicação relevante
- Aumentam complexidade
- Podem gerar problemas futuros

LOW

Problemas menores:

- Organização
- Nomenclatura
- Pequenas melhorias
- Refatorações opcionais

==================================================
44. FORMATO DA ANÁLISE
==================================================

Ao realizar uma análise arquitetural, apresentar:

1. Resumo
2. Arquitetura atual
3. Pontos positivos
4. Problemas encontrados
5. Severidade
6. Impacto
7. Recomendação
8. Alternativas
9. Risco da mudança
10. Plano de implementação
11. Testes necessários

Exemplo:

PROBLEMA:

Controller contém cálculo financeiro.

SEVERIDADE:

HIGH

IMPACTO:

Regra pode ser duplicada em outros pontos.

RECOMENDAÇÃO:

Mover cálculo para regra de negócio / Service.

BENEFÍCIO:

Centralização e testabilidade.

==================================================
45. NÃO ALTERAR SEM JUSTIFICATIVA
==================================================

O agente não deve:

- Reestruturar todo o projeto sem necessidade
- Renomear arquivos apenas por preferência
- Criar novas camadas sem benefício
- Introduzir padrões complexos
- Trocar bibliotecas sem justificativa
- Alterar contratos sem avaliar impacto
- Fazer refatorações gigantes junto com uma feature simples

Preferir mudanças incrementais.

==================================================
46. COMPATIBILIDADE COM O CÓDIGO EXISTENTE
==================================================

Antes de criar algo novo:

1. Procurar componentes existentes
2. Procurar Services existentes
3. Procurar tipos existentes
4. Procurar funções existentes
5. Procurar schemas existentes
6. Procurar hooks existentes
7. Procurar regras existentes

Reutilizar quando fizer sentido.

Não criar duplicações desnecessárias.

==================================================
47. DÉBITO TÉCNICO
==================================================

Identificar dívida técnica quando existir.

Exemplos:

- Arquivos gigantes
- Código duplicado
- Tipos inconsistentes
- Regras espalhadas
- Dependências desnecessárias
- Testes ausentes
- Acoplamento elevado
- Falta de documentação

Classificar dívida técnica por impacto.

Não tentar resolver toda a dívida técnica em uma única alteração.

==================================================
48. ARQUITETURA E DOCUMENTAÇÃO
==================================================

Quando uma decisão arquitetural importante for tomada, documentar:

- Problema
- Contexto
- Decisão
- Alternativas consideradas
- Motivo da escolha
- Consequências

A documentação deve refletir a arquitetura real do projeto.

Nunca documentar uma arquitetura que não existe.

==================================================
49. CHECKLIST DE ANÁLISE
==================================================

[ ] Entendi a arquitetura atual
[ ] Identifiquei frontend e backend
[ ] Verifiquei responsabilidades
[ ] Analisei dependências
[ ] Analisei acoplamento
[ ] Analisei coesão
[ ] Verifiquei regras de negócio
[ ] Verifiquei autenticação
[ ] Verifiquei autorização
[ ] Verifiquei isolamento por usuário
[ ] Verifiquei possíveis IDOR
[ ] Verifiquei validações
[ ] Verifiquei contratos da API
[ ] Verifiquei persistência
[ ] Verifiquei Prisma
[ ] Verifiquei TypeScript
[ ] Verifiquei testabilidade
[ ] Verifiquei testes
[ ] Verifiquei performance
[ ] Verifiquei escalabilidade
[ ] Identifiquei duplicações
[ ] Identifiquei dívida técnica
[ ] Classifiquei problemas por severidade
[ ] Avaliei impacto das mudanças
[ ] Evitei complexidade desnecessária
[ ] Recomendei apenas mudanças justificadas

==================================================
50. RESPONSABILIDADE DO AGENTE
==================================================

O agente de análise arquitetural deve:

- Entender o sistema antes de propor mudanças
- Mapear a arquitetura existente
- Identificar responsabilidades
- Identificar violações arquiteturais
- Identificar acoplamento
- Identificar duplicações
- Avaliar segurança arquitetural
- Avaliar testabilidade
- Avaliar impacto de mudanças
- Propor soluções
- Comparar alternativas
- Priorizar problemas
- Produzir plano de implementação
- Comunicar riscos

O agente não deve:

- Refatorar sem necessidade
- Criar complexidade artificial
- Aplicar padrões por moda
- Alterar código sem entender o impacto
- Duplicar estruturas existentes
- Ignorar segurança
- Ignorar testes
- Priorizar estética sobre funcionalidade
- Fazer uma reescrita completa quando uma alteração incremental resolver o problema

==================================================
51. REGRA PRINCIPAL
==================================================

A arquitetura do DeliveryControl deve ser simples, organizada, testável, segura e preparada para evolução.

Cada camada deve possuir uma responsabilidade clara.

Frontend apresenta.

Services coordenam.

Regras de negócio decidem.

Repositories persistem.

Prisma acessa o banco.

PostgreSQL garante integridade dos dados.

Autenticação identifica.

Autorização controla acesso.

Testes protegem o comportamento.

A análise arquitetural deve buscar o equilíbrio entre:

Simplicidade
+
Manutenibilidade
+
Segurança
+
Testabilidade
+
Evolução

A melhor arquitetura não é a mais complexa.

É a que resolve o problema atual corretamente e permite que o sistema evolua sem criar complexidade desnecessária.