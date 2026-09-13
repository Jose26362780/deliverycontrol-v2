SKILL: AUTENTICAÇÃO

OBJETIVO

Definir como projetar, implementar, testar e manter o sistema de autenticação do DeliveryControl.

O backend está sendo preparado para Better Auth, com sessões persistidas em
PostgreSQL e suporte a email/senha e Google OAuth/OIDC.
Enquanto `BETTER_AUTH_ENABLED=false`, as rotas JWT legadas permanecem disponíveis
somente para desenvolvimento e migração.

O frontend usa o cliente Better Auth para `signIn.email`, `signUp.email`,
`signIn.social`, `getSession` e `signOut`. A sessão é mantida por cookie; nenhum
token de autenticação deve ser salvo no `localStorage`.

Os dois métodos devem utilizar a mesma entidade central de usuário.

A autenticação externa ou tradicional deve resultar em uma identidade interna do DeliveryControl, utilizada para autorização, isolamento dos dados e acesso às APIs.


--------------------------------------------------
1. PRINCÍPIOS
--------------------------------------------------

A autenticação deve seguir os seguintes princípios:

- Segurança por padrão
- Separação entre autenticação e autorização
- Backend como fonte de verdade
- Senhas nunca armazenadas em texto puro
- Tokens e secrets protegidos
- Validação de identidade no backend
- Isolamento dos dados por usuário
- Prevenção contra acesso indevido
- Prevenção contra contas duplicadas
- Código testável
- Responsabilidades bem separadas
- Não confiar em informações sensíveis enviadas pelo frontend


--------------------------------------------------
2. MÉTODOS DE AUTENTICAÇÃO
--------------------------------------------------

O DeliveryControl deve suportar:

- Email e senha
- Better Auth com email/senha
- Better Auth com Google OAuth/OIDC

Exemplo:

Usuário
    ↓
    ├── Email + Senha
    │
    └── Google

Independentemente do método utilizado, o resultado deve ser:

Autenticação
    ↓
Usuário DeliveryControl
    ↓
Sessão / Token DeliveryControl
    ↓
APIs protegidas


--------------------------------------------------
3. ENTIDADE USUARIO
--------------------------------------------------

Os dois métodos de autenticação devem utilizar uma única identidade interna.

Modelo conceitual:

Usuario

- id
- nome
- email
- senhaHash
- criadoEm
- atualizadoEm

O modelo final deve seguir o schema real do banco de dados.


--------------------------------------------------
4. PROVEDOR DE AUTENTICAÇÃO
--------------------------------------------------

Quando necessário, utilizar uma entidade para representar os métodos de autenticação associados ao usuário.

Modelo conceitual:

ProvedorAutenticacao

- id
- usuarioId
- provider
- providerUserId
- criadoEm

Valores possíveis:

google
password


Exemplo:

Usuario
    ↓
ProvedorAutenticacao
    ├── password
    └── google


Um mesmo usuário pode possuir mais de um método de autenticação.


--------------------------------------------------
5. REGISTRO COM EMAIL E SENHA
--------------------------------------------------

Fluxo:

Frontend
    ↓
POST /api/auth/register
    ↓
Validação
    ↓
Verificar email
    ↓
Criar hash da senha
    ↓
Criar Usuario
    ↓
Criar usuário com hash bcryptjs
    ↓
Criar sessão Better Auth
    ↓
Retornar autenticação


O backend deve validar todos os dados recebidos.


--------------------------------------------------
6. VALIDAÇÃO DO REGISTRO
--------------------------------------------------

Validar:

- nome;
- email;
- senha;
- formato do email;
- tamanho mínimo da senha;
- regras adicionais de segurança;
- existência prévia do email.

Nunca confiar na validação realizada apenas pelo frontend.


--------------------------------------------------
7. SENHA
--------------------------------------------------

A senha nunca deve ser armazenada diretamente.

Errado:

senha = "MinhaSenha123"


Correto:

senha
    ↓
bcrypt
    ↓
senhaHash
    ↓
Database


Utilizar bcryptjs ou biblioteca equivalente para realizar o hash.


--------------------------------------------------
8. SENHA HASH
--------------------------------------------------

Nunca retornar o hash da senha para o frontend.

Nunca incluir `senhaHash` em:

- resposta da API;
- logs;
- mensagens de erro;
- relatórios;
- respostas públicas;
- documentação de exemplo.

O hash deve permanecer protegido no backend.


--------------------------------------------------
9. LOGIN COM EMAIL E SENHA
--------------------------------------------------

Fluxo:

Frontend
    ↓
POST /api/auth/login
    ↓
Validar email e senha
    ↓
Buscar usuário
    ↓
Comparar senha
    ↓
Validar credenciais
    ↓
Criar sessão/token DeliveryControl
    ↓
Retornar autenticação


A comparação da senha deve ser realizada no backend.


--------------------------------------------------
10. ERRO DE LOGIN
--------------------------------------------------

Não revelar informações que permitam descobrir se determinado email está cadastrado.

Evitar respostas diferentes como:

"Email não encontrado"

ou:

"Senha incorreta"


Preferir uma mensagem genérica:

"Email ou senha inválidos."


Isso reduz o risco de enumeração de usuários.


--------------------------------------------------
11. GOOGLE OAUTH / OIDC
--------------------------------------------------

A autenticação com Google deve utilizar OAuth/OIDC através de uma biblioteca estabelecida e confiável.

Não implementar manualmente o protocolo OAuth/OIDC.


Fluxo conceitual:

Frontend
    ↓
Google
    ↓
Autenticação do usuário
    ↓
Consentimento
    ↓
Callback
    ↓
Backend
    ↓
Validar identidade Google
    ↓
Localizar ou criar usuário
    ↓
Associar provedor Google
    ↓
Criar sessão/token DeliveryControl
    ↓
Frontend autenticado


--------------------------------------------------
12. IDENTIDADE DO GOOGLE
--------------------------------------------------

O backend deve validar a identidade retornada pelo Google.

Considerar:

- provider;
- providerUserId;
- email;
- nome;
- claims relevantes;
- validade da identidade;
- status de verificação do email quando aplicável.

Nunca confiar somente em informações enviadas pelo frontend.


--------------------------------------------------
13. GOOGLE CLIENT ID
--------------------------------------------------

O Client ID pode ser utilizado na configuração do fluxo OAuth conforme a arquitetura escolhida.

Exemplo:

GOOGLE_CLIENT_ID


A configuração deve estar centralizada e não espalhada pelo código.


--------------------------------------------------
14. GOOGLE CLIENT SECRET
--------------------------------------------------

O Google Client Secret deve permanecer exclusivamente no backend.

Exemplo:

GOOGLE_CLIENT_SECRET


Nunca colocar o Client Secret:

- no frontend;
- no código versionado;
- no GitHub;
- no README;
- em arquivos públicos;
- em respostas da API.


--------------------------------------------------
15. PROVIDER USER ID
--------------------------------------------------

A identidade Google deve ser associada através do identificador fornecido pelo provedor.

Exemplo conceitual:

provider:

google

providerUserId:

ID fornecido pelo Google


Esse identificador deve possuir uma regra de unicidade apropriada.


--------------------------------------------------
16. USUÁRIO EXISTENTE
--------------------------------------------------

Quando um usuário realizar login com Google, o backend deve verificar se a identidade Google já está associada.

Fluxo:

Google
    ↓
providerUserId
    ↓
Buscar associação
    ↓
Usuário encontrado
    ↓
Autenticar usuário


Não criar uma nova conta quando já existir uma associação válida.


--------------------------------------------------
17. EVITAR CONTAS DUPLICADAS
--------------------------------------------------

O sistema deve evitar situações como:

usuario@gmail.com + senha

e

usuario@gmail.com + Google


serem tratados automaticamente como duas contas independentes quando deveriam representar o mesmo usuário.


A identidade interna deve permanecer centralizada.


--------------------------------------------------
18. VINCULAÇÃO DE CONTA
--------------------------------------------------

Quando um usuário autenticado quiser adicionar Google à conta existente:

Usuário autenticado
    ↓
Solicitar vinculação
    ↓
Autenticar com Google
    ↓
Validar identidade Google
    ↓
Verificar conflitos
    ↓
Associar Google ao usuarioId existente
    ↓
Conta vinculada


A vinculação deve ser uma operação protegida.


--------------------------------------------------
19. VINCULAÇÃO AUTOMÁTICA
--------------------------------------------------

Não vincular automaticamente contas apenas porque o email retornado pelo Google corresponde ao email de uma conta existente sem realizar as validações necessárias.

A associação de identidades deve considerar:

- autenticidade da identidade Google;
- providerUserId;
- email;
- regras de segurança;
- estado da conta;
- contexto da operação.


--------------------------------------------------
20. SESSÃO DO DELIVERYCONTROL
--------------------------------------------------

Depois da autenticação, o DeliveryControl deve possuir sua própria sessão/token.

Exemplo:

Google
    ↓
Identidade externa
    ↓
DeliveryControl
    ↓
Sessão própria
    ↓
APIs internas


O token do Google não deve ser utilizado diretamente como mecanismo de autorização das APIs internas do DeliveryControl.


--------------------------------------------------
21. JWT
--------------------------------------------------

Quando JWT for utilizado, o token deve possuir somente as informações necessárias.

Exemplo conceitual:

{
    "sub": "usuario-id"
}


O campo `sub` deve representar a identidade interna do usuário.


Evitar colocar informações sensíveis desnecessárias no JWT.


--------------------------------------------------
22. VALIDAÇÃO DO JWT
--------------------------------------------------

O backend deve validar:

- assinatura;
- estrutura;
- expiração;
- algoritmo esperado;
- identidade do usuário.

Um JWT inválido deve resultar em:

401 Unauthorized


--------------------------------------------------
23. MIDDLEWARE DE AUTENTICAÇÃO
--------------------------------------------------

Criar um middleware responsável por proteger endpoints autenticados.

Fluxo:

Request
    ↓
Obter token/sessão
    ↓
Validar token
    ↓
Identificar usuário
    ↓
Disponibilizar identidade
    ↓
Controller
    ↓
Service


Exemplo conceitual:

req.user = {
    id: usuarioId
}


O middleware não deve implementar regras específicas de negócio.


--------------------------------------------------
24. AUTENTICAÇÃO X AUTORIZAÇÃO
--------------------------------------------------

Autenticação responde:

"Quem é o usuário?"


Autorização responde:

"O usuário pode executar esta operação?"


Exemplo:

JWT válido
    ↓
Usuário autenticado


Depois:

Usuário autenticado
    ↓
Verificar proprietário do recurso
    ↓
Usuário autorizado


A autenticação não substitui a autorização.


--------------------------------------------------
25. ISOLAMENTO DOS DADOS
--------------------------------------------------

Todos os recursos privados devem estar associados ao usuário correto.

Exemplos:

- funcionários;
- entregas;
- turnos;
- despesas;
- relatórios;
- configurações.


O `userId` deve ser obtido da identidade autenticada.

Nunca confiar em:

req.body.userId

ou:

req.params.userId


quando o usuário autenticado já determina o proprietário do recurso.


--------------------------------------------------
26. PREVENÇÃO CONTRA IDOR
--------------------------------------------------

Prevenir Insecure Direct Object Reference.

Exemplo de tentativa:

GET /api/entregas/ID_DE_OUTRO_USUARIO


O backend deve verificar:

entregaId
+
usuarioId autenticado


Somente então permitir o acesso.


--------------------------------------------------
27. LOGOUT
--------------------------------------------------

O comportamento do logout deve seguir a estratégia de sessão utilizada.

Se forem utilizados tokens stateless, considerar:

- expiração adequada;
- refresh token quando necessário;
- rotação;
- revogação quando aplicável.


Se cookies forem utilizados, considerar:

- HttpOnly;
- Secure em produção;
- SameSite adequado.


--------------------------------------------------
28. COOKIES
--------------------------------------------------

Caso a sessão seja armazenada em cookie, configurar adequadamente:

HttpOnly

Secure em produção

SameSite apropriado


Nunca armazenar informações sensíveis de autenticação em cookies sem proteção adequada.


--------------------------------------------------
29. LOCAL STORAGE
--------------------------------------------------

Se tokens forem utilizados no frontend, avaliar cuidadosamente o mecanismo de armazenamento.

Não armazenar tokens de longa duração de maneira insegura.

A estratégia escolhida deve considerar:

- XSS;
- CSRF;
- expiração;
- refresh token;
- rotação;
- revogação.


--------------------------------------------------
30. RATE LIMITING
--------------------------------------------------

Aplicar rate limiting principalmente em endpoints sensíveis:

- registro;
- login;
- autenticação Google;
- recuperação de senha, caso implementada;
- outros endpoints de autenticação.


Objetivos:

- reduzir brute force;
- reduzir credential stuffing;
- limitar abuso automatizado;
- reduzir tentativas excessivas de autenticação.


--------------------------------------------------
31. PROTEÇÃO CONTRA ENUMERAÇÃO
--------------------------------------------------

Não revelar informações que permitam descobrir usuários cadastrados.

Evitar:

"Este email já está cadastrado."


quando essa informação não for necessária para o fluxo.

As respostas devem ser pensadas considerando o risco de enumeração.


--------------------------------------------------
32. TOKENS
--------------------------------------------------

Nunca registrar tokens em logs.

Não colocar tokens em:

- mensagens de erro;
- banco sem necessidade;
- documentação;
- screenshots;
- código versionado;
- respostas desnecessárias.


Tokens devem possuir:

- expiração;
- escopo adequado;
- proteção;
- rotação quando necessário.


--------------------------------------------------
33. LOGS
--------------------------------------------------

Nunca registrar:

- senha;
- senhaHash;
- JWT;
- refresh token;
- Google Client Secret;
- códigos OAuth;
- credenciais;
- dados sensíveis desnecessários.


Logs devem ajudar no diagnóstico sem expor informações sensíveis.


--------------------------------------------------
34. VARIÁVEIS DE AMBIENTE
--------------------------------------------------

As configurações sensíveis devem utilizar variáveis de ambiente.

Exemplo:

JWT_SECRET=
DATABASE_URL=
FRONTEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


Nunca colocar valores reais no código.


--------------------------------------------------
35. GIT
--------------------------------------------------

Nunca versionar:

.env

.env.local

ou arquivos contendo secrets reais.


Manter:

.env.example


com nomes das variáveis necessárias, mas sem valores reais.


--------------------------------------------------
36. AUTENTICAÇÃO E BANCO
--------------------------------------------------

O sistema deve manter consistência entre:

Usuario

e

ProvedorAutenticacao


Ao criar uma conta, quando necessário, utilizar transação para garantir que:

Usuario
+
ProvedorAutenticacao


sejam criados de forma consistente.


--------------------------------------------------
37. CONFLITOS DE AUTENTICAÇÃO
--------------------------------------------------

Tratar corretamente situações como:

- email já cadastrado;
- Google já associado a outro usuário;
- providerUserId duplicado;
- conta desativada;
- identidade inválida;
- token expirado;
- token inválido;
- tentativa de vinculação conflitante.


Essas situações devem gerar erros controlados.


--------------------------------------------------
38. RECUPERAÇÃO DE SENHA
--------------------------------------------------

Caso a funcionalidade seja implementada posteriormente, ela deverá possuir:

- token temporário;
- expiração;
- uso único;
- rate limiting;
- proteção contra enumeração;
- armazenamento seguro do token;
- invalidação após utilização.


Nunca enviar a senha atual por email.


--------------------------------------------------
39. TESTES DE REGISTRO
--------------------------------------------------

Testar:

- nome válido;
- email válido;
- email inválido;
- senha válida;
- senha inválida;
- email duplicado;
- criação do usuário;
- hash da senha;
- criação do provider password;
- criação da sessão/token.


--------------------------------------------------
40. TESTES DE LOGIN
--------------------------------------------------

Testar:

- credenciais corretas;
- email inexistente;
- senha incorreta;
- token inválido;
- token expirado;
- usuário desativado quando aplicável;
- resposta HTTP correta.


--------------------------------------------------
41. TESTES DO GOOGLE
--------------------------------------------------

Testar:

- identidade Google válida;
- identidade inválida;
- usuário Google existente;
- usuário Google novo;
- providerUserId existente;
- conta já vinculada;
- conflito de associação;
- criação da sessão DeliveryControl;
- falha na autenticação externa.


--------------------------------------------------
42. TESTES DE AUTORIZAÇÃO
--------------------------------------------------

Testar:

- usuário autenticado;
- usuário não autenticado;
- acesso ao próprio recurso;
- tentativa de acessar recurso de outro usuário;
- tentativa de alterar recurso de outro usuário;
- tentativa de excluir recurso de outro usuário.


--------------------------------------------------
43. TESTES DE SEGURANÇA
--------------------------------------------------

Testar quando aplicável:

- JWT inválido;
- JWT expirado;
- token ausente;
- brute force;
- rate limiting;
- tentativa de enumeração;
- acesso cruzado entre usuários;
- dados malformados;
- tentativa de manipulação do userId.


--------------------------------------------------
44. RESPONSABILIDADE DAS CAMADAS
--------------------------------------------------

Route:

Define endpoints e middlewares.


Middleware:

Valida autenticação e preocupações transversais.


Controller:

Recebe a requisição e chama o caso de uso.


Service:

Executa o fluxo de autenticação.


Domain / Business Rules:

Define regras relacionadas à identidade e autenticação.


Repository:

Acessa dados de usuários e provedores.


Database:

Armazena os dados.


--------------------------------------------------
45. FLUXO COMPLETO
--------------------------------------------------

Registro tradicional:

Request
    ↓
Route
    ↓
Validation
    ↓
Controller
    ↓
Auth Service
    ↓
Verificar usuário
    ↓
Hash da senha
    ↓
Repository
    ↓
Database
    ↓
Criar sessão/token
    ↓
Response


Login tradicional:

Request
    ↓
Route
    ↓
Validation
    ↓
Controller
    ↓
Auth Service
    ↓
Buscar usuário
    ↓
Comparar senha
    ↓
Criar sessão/token
    ↓
Response


Login Google:

Frontend
    ↓
Google
    ↓
OAuth/OIDC
    ↓
Backend
    ↓
Validar identidade
    ↓
Buscar/ criar usuário
    ↓
Associar provider
    ↓
Criar sessão/token DeliveryControl
    ↓
Response


--------------------------------------------------
46. CHECKLIST
--------------------------------------------------

[ ] Email e senha implementados

[ ] Better Auth ativado com PostgreSQL
[ ] Google OAuth/OIDC configurado no Google Cloud e no Render

[ ] Biblioteca confiável utilizada para OAuth/OIDC

[ ] Mesma entidade Usuario utilizada pelos métodos

[ ] ProvedorAutenticacao separado quando necessário

[ ] Senhas armazenadas somente como hash

[ ] bcryptjs ou equivalente utilizado

[ ] Google Client Secret protegido

[ ] Provider User ID armazenado corretamente

[ ] Contas duplicadas evitadas

[ ] Vinculação de conta protegida

[ ] Sessão/token próprio do DeliveryControl

[ ] JWT validado

[ ] Middleware de autenticação implementado

[ ] Autorização implementada

[ ] userId obtido da identidade autenticada

[ ] Isolamento entre usuários implementado

[ ] IDOR prevenido

[ ] Rate limiting aplicado nos endpoints sensíveis

[ ] Enumeração de usuários considerada

[ ] Tokens protegidos

[ ] Secrets fora do Git

[ ] Logs não expõem informações sensíveis

[ ] Erros de autenticação tratados

[ ] Testes de registro implementados

[ ] Testes de login implementados

[ ] Testes Google implementados

[ ] Testes de autorização implementados

[ ] Testes de segurança implementados


--------------------------------------------------
REGRA PRINCIPAL
--------------------------------------------------

Google OAuth/OIDC e email/senha são métodos diferentes de autenticação, mas devem resultar na mesma identidade interna do DeliveryControl.

O Google valida a identidade externa.

O email e senha validam a credencial tradicional.

O DeliveryControl é responsável por:

- identidade interna;
- sessão;
- autorização;
- isolamento dos dados;
- proteção das APIs;
- regras de segurança.

O frontend nunca deve ser considerado fonte de verdade para autenticação, autorização ou identidade do usuário.