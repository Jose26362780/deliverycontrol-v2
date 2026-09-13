SKILL: REVISÃO DE CÓDIGO — DELIVERYCONTROL

OBJETIVO

Esta skill define como realizar revisões de código no DeliveryControl.

O objetivo é analisar alterações de código antes de considerá-las concluídas, identificando:

- Bugs
- Violações arquiteturais
- Problemas de segurança
- Erros de regra de negócio
- Problemas de tipagem
- Código duplicado
- Problemas de manutenção
- Falta de testes
- Problemas de performance
- Problemas de UX
- Problemas de acessibilidade
- Alterações desnecessárias
- Riscos de regressão

A revisão deve priorizar problemas reais e relevantes.

Não transformar a revisão em uma busca excessiva por questões de estilo sem impacto.

==================================================
1. PRINCÍPIO FUNDAMENTAL
==================================================

O objetivo do Code Review é garantir que o código:

- Funcione corretamente
- Respeite a arquitetura
- Seja seguro
- Preserve as regras de negócio
- Seja testável
- Seja sustentável
- Não introduza regressões

A revisão deve analisar o código dentro do contexto do projeto.

Não analisar um arquivo isoladamente quando suas dependências e impactos forem relevantes.

==================================================
2. ORDEM DA REVISÃO
==================================================

Seguir preferencialmente esta ordem:

1. Correção
2. Segurança
3. Regras de negócio
4. Arquitetura
5. Tipagem
6. Testes
7. Performance
8. Manutenibilidade
9. UX e acessibilidade
10. Estilo

Problemas críticos devem ser identificados antes de questões menores.

==================================================
3. ENTENDER A ALTERAÇÃO
==================================================

Antes de revisar:

1. Identificar o objetivo da alteração
2. Identificar arquivos modificados
3. Identificar novas funcionalidades
4. Identificar regras alteradas
5. Identificar APIs afetadas
6. Identificar entidades afetadas
7. Identificar testes afetados
8. Identificar documentação afetada

Não revisar apenas o código sem entender o propósito da mudança.

==================================================
4. ESCOPO
==================================================

Determinar se a alteração está dentro do escopo esperado.

Verificar:

- O código resolve o problema solicitado?
- Existem alterações não relacionadas?
- Foram modificados arquivos desnecessariamente?
- Houve refatoração fora do escopo?
- Foram adicionadas dependências sem necessidade?

Evitar que uma feature pequena resulte em mudanças arquiteturais desnecessárias.

==================================================
5. CORREÇÃO FUNCIONAL
==================================================

Verificar:

- O comportamento está correto?
- Os dados são processados corretamente?
- Os casos principais funcionam?
- Os casos extremos foram considerados?
- Os erros são tratados?
- Os estados inválidos são bloqueados?

Perguntar:

"Existe algum cenário em que essa implementação produza um resultado incorreto?"

==================================================
6. CAMINHO FELIZ
==================================================

Verificar o cenário esperado.

Exemplo:

Criar entrega:

Usuário autenticado
+
Dados válidos
+
Funcionário válido
+
Valor válido

↓

Entrega criada corretamente.

O caminho feliz deve estar coberto por testes quando apropriado.

==================================================
7. CASOS EXTREMOS
==================================================

Procurar cenários como:

- Zero
- Valores negativos
- Valores muito grandes
- Lista vazia
- Dados ausentes
- IDs inexistentes
- Usuário inexistente
- Dados duplicados
- Datas inválidas
- Datas limite
- Requisições simultâneas
- Falha de dependência

==================================================
8. REGRAS DE NEGÓCIO
==================================================

Verificar se as regras do DeliveryControl continuam sendo respeitadas.

Regra financeira principal:

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

O Code Review deve identificar qualquer implementação que:

- Duplique a fórmula
- Utilize percentuais incorretos
- Permita receita líquida negativa
- Calcule somente no frontend
- Ignore despesas de gasolina
- Altere resultados históricos indevidamente

==================================================
9. BACKEND COMO FONTE DE VERDADE
==================================================

Regras críticas devem ser validadas no backend.

Se o frontend calcula:

receita líquida = receita - gasolina

isso pode ser utilizado para exibição.

Porém o backend deve recalcular ou validar o resultado oficial.

O Code Review deve rejeitar implementações que confiem exclusivamente no frontend para:

- Valores financeiros
- Percentuais
- Permissões
- userId
- Regras de acesso
- Dados críticos

==================================================
10. SEGURANÇA
==================================================

A revisão deve procurar problemas de segurança.

Verificar:

- Autenticação
- Autorização
- IDOR
- Validação de entrada
- SQL Injection
- XSS
- CSRF quando aplicável
- CORS
- Rate limiting
- JWT
- Cookies
- LocalStorage
- Secrets
- Logs
- Exposição de dados

==================================================
11. AUTENTICAÇÃO
==================================================

O sistema suporta:

- Email e senha
- Google OAuth / OIDC

Verificar:

- Senha armazenada com hash seguro
- Token validado corretamente
- Expiração considerada
- Google identity validada
- Provider ID validado
- Contas duplicadas evitadas
- Associação de contas protegida

Nunca confiar em dados de identidade enviados diretamente pelo frontend.

==================================================
12. AUTORIZAÇÃO
==================================================

Verificar se toda operação protegida valida:

- Usuário autenticado
- Permissão necessária
- Propriedade do recurso
- Contexto da operação

Autenticação não é autorização.

Um usuário autenticado não significa que ele pode acessar qualquer recurso.

==================================================
13. IDOR
==================================================

Sempre procurar vulnerabilidades de acesso por ID.

Exemplo:

GET /api/entregas/123

Não basta verificar:

"Entrega 123 existe?"

É necessário verificar:

"Entrega 123 pertence ao usuário autenticado?"

O mesmo deve ser analisado para:

- Funcionários
- Turnos
- Entregas
- Despesas
- Relatórios
- Configurações

==================================================
14. USER ID
==================================================

O userId utilizado para autorização deve vir do contexto autenticado.

Rejeitar implementações que utilizem como fonte de autoridade:

- userId do body
- userId da query
- userId enviado pelo frontend
- userId arbitrário da URL

O cliente pode informar um ID de recurso.

O backend deve determinar a identidade do usuário.

==================================================
15. TYPESCRIPT
==================================================

Verificar:

- Tipagem correta
- Interfaces
- Types
- DTOs
- Retornos
- Props
- Estados
- Erros
- APIs

Evitar:

any

Quando o tipo for desconhecido:

unknown

Verificar também:

- Type assertions desnecessárias
- Casts perigosos
- Tipos duplicados
- Tipos incompatíveis
- Null / undefined
- Tipos opcionais incorretos

==================================================
16. ANY
==================================================

Questionar qualquer uso de:

any

Perguntar:

"Existe uma forma segura de representar esse tipo?"

Preferir:

- Interface
- Type
- Generic
- unknown
- Type guard

Um any só deve existir quando houver justificativa técnica clara.

==================================================
17. FRONTEND
==================================================

Revisar:

- Componentes
- Pages
- Hooks
- Stores
- Services
- Forms
- Schemas
- Estados
- Responsividade
- Acessibilidade

Verificar se a Page não está acumulando responsabilidades excessivas.

==================================================
18. COMPONENTES REACT
==================================================

Verificar:

- Responsabilidade única
- Props tipadas
- Reutilização
- Composição
- Hooks
- Estados
- Efeitos

Evitar componentes gigantes.

Sinais de problema:

- Muitas responsabilidades
- Muitos estados
- Muitos useEffect
- Chamadas API espalhadas
- Regras financeiras
- Lógica complexa de negócio

==================================================
19. HOOKS
==================================================

Verificar se Hooks:

- Encapsulam lógica de interface
- Possuem dependências corretas
- Evitam efeitos desnecessários
- Não possuem regras críticas duplicadas

Evitar colocar regras de negócio importantes exclusivamente em Hooks.

==================================================
20. ZUSTAND
==================================================

Verificar:

- Estado realmente global
- Ações bem definidas
- Tipagem
- Reset
- Persistência quando aplicável

Evitar utilizar Zustand para todo estado da aplicação.

==================================================
21. FORMULÁRIOS
==================================================

Quando utilizar React Hook Form + Zod:

Verificar:

- Schema
- Campos
- Mensagens
- Valores padrão
- Estados de loading
- Erros
- Submit
- Reset
- Validação

A validação do frontend não substitui a validação do backend.

==================================================
22. BACKEND
==================================================

Revisar:

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

Verificar se cada camada mantém sua responsabilidade.

==================================================
23. ROUTES
==================================================

Routes não devem conter:

- Regras financeiras
- Queries complexas
- Regras de autorização espalhadas
- Lógica extensa
- Manipulação direta do Prisma

Routes devem encaminhar a operação.

==================================================
24. CONTROLLERS
==================================================

Controllers devem:

- Receber request
- Extrair dados
- Chamar Service
- Retornar response

Não devem conter lógica de negócio complexa.

==================================================
25. SERVICES
==================================================

Verificar se Services:

- Coordenam casos de uso
- Aplicam regras
- Validam condições
- Utilizam repositories
- Mantêm consistência

Sinal de problema:

Service excessivamente grande.

Quando houver responsabilidades diferentes, avaliar separação.

==================================================
26. REPOSITORIES
==================================================

Repositories devem cuidar da persistência.

Verificar se não estão:

- Calculando valores financeiros
- Decidindo regras
- Controlando fluxo
- Implementando autorização

Repository responde:

"Como acessar os dados?"

Service responde:

"O que precisa acontecer?"

==================================================
27. PRISMA
==================================================

Prisma deve permanecer na camada de persistência.

Rejeitar acoplamento desnecessário entre Prisma e:

- React
- Components
- Pages
- Controllers
- Regras de domínio

Preferir:

Service
↓
Repository
↓
Prisma

==================================================
28. ARQUITETURA
==================================================

Comparar a alteração com a arquitetura definida.

Verificar:

- Separação frontend/backend
- Responsabilidades
- Acoplamento
- Coesão
- Dependências
- SOLID
- DRY
- KISS
- YAGNI

Não exigir abstrações que não agreguem valor.

==================================================
29. ACOPLAMENTO
==================================================

Procurar:

- Imports desnecessários
- Dependências circulares
- Componentes conhecendo backend
- Services conhecendo HTTP
- Repositories conhecendo interface
- Código difícil de testar

Quanto maior o acoplamento, maior o custo de manutenção.

==================================================
30. DUPLICAÇÃO
==================================================

Procurar duplicação de:

- Regras
- Cálculos
- Validações
- Tipos
- Chamadas API
- Componentes
- Funções

Especial atenção:

Regra financeira duplicada.

Se a mesma regra existe em dois lugares, avaliar centralização.

==================================================
31. TESTES
==================================================

Toda alteração relevante deve possuir testes adequados.

Verificar:

- Teste do caminho feliz
- Teste de erro
- Casos extremos
- Regressão
- Regras financeiras
- Autorização
- Validação

Utilizar Vitest para testes unitários.

==================================================
32. TESTES UNITÁRIOS
==================================================

Priorizar testes para:

- Funções
- Regras de negócio
- Services
- Validações
- Cálculos
- Transformações

Dependências externas devem ser isoladas quando necessário.

Evitar testes unitários dependentes de:

- PostgreSQL real
- APIs externas
- Google
- Rede

==================================================
33. TESTES DE REGRESSÃO
==================================================

Se a alteração corrige um bug, verificar se existe um teste que proteja contra a regressão.

Exemplo:

Bug:

Receita líquida ficava negativa.

Teste:

receita = 500
gasolina = 700

Resultado esperado:

0

==================================================
34. API CONTRACT
==================================================

Verificar consistência entre frontend e backend.

Comparar:

- Endpoint
- HTTP method
- Request
- Response
- Status code
- Erros
- Tipos

Alterações de contrato devem ser identificadas.

==================================================
35. TRATAMENTO DE ERROS
==================================================

Verificar:

- Erros esperados tratados
- Erros de negócio identificados
- Status HTTP correto
- Mensagens adequadas
- Nenhum stack trace exposto
- Nenhuma informação sensível exposta

Evitar:

catch vazio

ou:

catch que simplesmente ignora o erro.

==================================================
36. PERFORMANCE
==================================================

Verificar problemas óbvios:

Frontend:

- Renderizações desnecessárias
- Requests duplicadas
- Listas sem controle
- Estado global excessivo

Backend:

- Queries duplicadas
- N+1
- Payload excessivo
- Falta de paginação
- Processamento desnecessário

Database:

- Índices necessários
- Consultas ineficientes

Não otimizar prematuramente.

==================================================
37. CONCORRÊNCIA
==================================================

Para operações financeiras ou de atualização crítica, considerar:

- Duas requisições simultâneas
- Atualizações concorrentes
- Dados sobrescritos
- Transações
- Integridade

Se a operação alterar múltiplos registros relacionados, avaliar necessidade de transação.

==================================================
38. DATAS
==================================================

Verificar:

- Timezone
- Formato
- Conversões
- Início do período
- Final do período
- Datas inválidas

Relatórios financeiros devem possuir comportamento consistente em relação às datas.

==================================================
39. VALORES FINANCEIROS
==================================================

Verificar:

- Valores negativos
- Precisão
- Arredondamento
- Soma
- Percentuais
- Centavos
- Receita líquida
- Despesas

Evitar erros de ponto flutuante em cálculos monetários.

Quando apropriado, utilizar valores em centavos.

==================================================
40. UX
==================================================

No frontend verificar:

- Loading
- Error
- Empty state
- Feedback de sucesso
- Feedback de erro
- Botões desabilitados
- Confirmação de ações destrutivas

O usuário deve entender o resultado da operação.

==================================================
41. ACESSIBILIDADE
==================================================

Verificar:

- Labels
- Inputs
- Botões
- Navegação por teclado
- Contraste
- Mensagens de erro
- Foco
- Semântica HTML
- Modais acessíveis

Não depender exclusivamente de cor para transmitir informação.

==================================================
42. RESPONSIVIDADE
==================================================

Verificar:

- Mobile
- Tablet
- Desktop
- Tabelas
- Formulários
- Navegação
- Modais
- Gráficos

Uma alteração visual não deve quebrar outros tamanhos de tela.

==================================================
43. DEPENDÊNCIAS
==================================================

Ao adicionar uma biblioteca:

Verificar:

- É realmente necessária?
- Existe solução já disponível?
- A biblioteca é compatível com o projeto?
- Aumenta significativamente o bundle?
- Possui manutenção adequada?
- Cria acoplamento desnecessário?

Evitar dependências para problemas simples.

==================================================
44. CÓDIGO MORTO
==================================================

Identificar:

- Imports não utilizados
- Funções não utilizadas
- Variáveis não utilizadas
- Componentes abandonados
- Código comentado
- Código duplicado

Não manter código morto sem justificativa.

==================================================
45. COMPLEXIDADE
==================================================

Questionar:

- Funções muito grandes
- Condicionais muito profundas
- Muitos níveis de nesting
- Classes gigantes
- Services gigantes
- Componentes gigantes

Refatorar quando a complexidade realmente prejudicar compreensão ou manutenção.

==================================================
46. NOMENCLATURA
==================================================

Verificar se nomes representam claramente:

- Variáveis
- Funções
- Classes
- Services
- Components
- Interfaces
- Types
- Arquivos

Preferir nomes que expliquem intenção.

Evitar:

data

value

temp

foo

handleThing

quando nomes mais específicos forem possíveis.

==================================================
47. COMENTÁRIOS
==================================================

Comentários devem explicar:

- Por que algo existe
- Uma decisão não óbvia
- Uma limitação
- Uma regra especial

Evitar comentários que apenas repetem o código.

Exemplo ruim:

// Soma dois números
const total = a + b

==================================================
48. CONFIGURAÇÃO
==================================================

Verificar:

- Variáveis de ambiente
- URLs
- Secrets
- Configuração de produção
- Configuração de desenvolvimento

Nunca aceitar:

- Senhas hardcoded
- JWT secret hardcoded
- Client Secret hardcoded
- API keys no código

==================================================
49. GIT
==================================================

Verificar se a alteração contém:

- Arquivos temporários
- .env
- Secrets
- Builds
- node_modules
- Logs
- Arquivos de debug

Não permitir credenciais no commit.

==================================================
50. CLASSIFICAÇÃO DOS PROBLEMAS
==================================================

CRITICAL

Problemas que podem:

- Comprometer segurança
- Expor dados
- Corromper dados
- Permitir acesso indevido
- Quebrar regras financeiras críticas
- Impedir funcionamento da aplicação

HIGH

Problemas importantes que:

- Causam bugs relevantes
- Quebram arquitetura
- Podem gerar perda de dados
- Criam vulnerabilidade significativa
- Afetam funcionalidades principais

MEDIUM

Problemas que:

- Dificultam manutenção
- Criam duplicação
- Aumentam complexidade
- Podem causar problemas futuros

LOW

Problemas menores:

- Organização
- Nomenclatura
- Pequenas melhorias
- Refatorações opcionais
- Melhorias de estilo

==================================================
51. FORMATO DOS ACHADOS
==================================================

Cada problema encontrado deve seguir preferencialmente:

SEVERIDADE:

HIGH

LOCAL:

arquivo.ts

PROBLEMA:

Descrição objetiva do problema.

IMPACTO:

Explicar o que pode acontecer.

RECOMENDAÇÃO:

Explicar como corrigir.

Exemplo:

SEVERIDADE:

HIGH

LOCAL:

financeiro.service.ts

PROBLEMA:

A receita líquida está sendo calculada no Service utilizando uma fórmula diferente da regra central.

IMPACTO:

Relatórios e dashboard podem apresentar valores diferentes.

RECOMENDAÇÃO:

Centralizar o cálculo em uma única regra de negócio e reutilizar a mesma implementação.

==================================================
52. PRIORIDADE
==================================================

A revisão deve priorizar:

1. Segurança
2. Corrupção de dados
3. Regras financeiras
4. Bugs funcionais
5. Autorização
6. Regressões
7. Arquitetura
8. Testes
9. Performance
10. Manutenção
11. Estilo

Não bloquear uma implementação por questões puramente estéticas quando não houver impacto relevante.

==================================================
53. DECISÃO FINAL
==================================================

Ao finalizar a revisão, classificar:

APROVADO

Nenhum problema relevante encontrado.

APROVADO COM RESSALVAS

Existem problemas de baixa prioridade que podem ser tratados posteriormente.

ALTERAÇÕES NECESSÁRIAS

Existem problemas que devem ser corrigidos antes da conclusão.

BLOQUEADO

Existe problema crítico, principalmente relacionado a:

- Segurança
- Dados
- Autorização
- Regra financeira
- Funcionamento fundamental

==================================================
54. REVISÃO APÓS CORREÇÃO
==================================================

Quando problemas forem encontrados:

1. Registrar problema
2. Classificar severidade
3. Corrigir
4. Executar testes
5. Revisar novamente
6. Verificar regressões
7. Confirmar resolução

Não considerar um problema resolvido apenas porque o código foi alterado.

==================================================
55. CHECKLIST GERAL
==================================================

[ ] Entendi o objetivo da alteração
[ ] Analisei o escopo
[ ] Verifiquei comportamento
[ ] Verifiquei casos extremos
[ ] Verifiquei regras de negócio
[ ] Verifiquei regras financeiras
[ ] Verifiquei autenticação
[ ] Verifiquei autorização
[ ] Verifiquei IDOR
[ ] Verifiquei isolamento por usuário
[ ] Verifiquei validações
[ ] Verifiquei TypeScript
[ ] Verifiquei uso de any
[ ] Verifiquei arquitetura
[ ] Verifiquei responsabilidades
[ ] Verifiquei acoplamento
[ ] Verifiquei duplicação
[ ] Verifiquei Services
[ ] Verifiquei Repositories
[ ] Verifiquei Prisma
[ ] Verifiquei API contract
[ ] Verifiquei tratamento de erros
[ ] Verifiquei testes
[ ] Verifiquei testes de regressão
[ ] Verifiquei performance
[ ] Verifiquei concorrência quando necessário
[ ] Verifiquei valores financeiros
[ ] Verifiquei datas
[ ] Verifiquei UX
[ ] Verifiquei acessibilidade
[ ] Verifiquei responsividade
[ ] Verifiquei dependências
[ ] Verifiquei secrets
[ ] Verifiquei arquivos indevidos
[ ] Classifiquei os problemas
[ ] Avaliei o risco
[ ] Defini decisão final

==================================================
56. RESPONSABILIDADE DO AGENTE
==================================================

O Code Review Agent deve:

- Revisar alterações antes da conclusão
- Identificar bugs
- Identificar vulnerabilidades
- Verificar regras de negócio
- Verificar arquitetura
- Verificar TypeScript
- Verificar testes
- Verificar regressões
- Verificar performance
- Verificar UX
- Classificar problemas
- Explicar impacto
- Sugerir correções
- Reavaliar após correções

O agente não deve:

- Reescrever o projeto sem necessidade
- Bloquear código por preferência pessoal
- Exigir abstrações desnecessárias
- Alterar regras de negócio sem autorização
- Ignorar problemas de segurança
- Ignorar falhas de testes
- Considerar cobertura como única métrica
- Aprovar código apenas porque compila

==================================================
57. REGRA PRINCIPAL
==================================================

Uma revisão de código não deve perguntar apenas:

"O código funciona?"

Deve perguntar:

"Este código funciona corretamente, com segurança, dentro da arquitetura, respeitando as regras de negócio e podendo ser mantido e testado no futuro?"

O Code Review Agent deve priorizar problemas reais, explicar seus impactos e propor soluções proporcionais ao problema.

A revisão deve proteger:

CORREÇÃO
+
SEGURANÇA
+
ARQUITETURA
+
REGRAS DE NEGÓCIO
+
TESTABILIDADE
+
MANUTENIBILIDADE

Sem criar complexidade desnecessária.