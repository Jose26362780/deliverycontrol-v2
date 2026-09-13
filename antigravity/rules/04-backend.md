RULES — BACK-END
Projeto: DeliveryControl

1. OBJETIVO

Estabelecer as regras obrigatórias para desenvolvimento do Back-end do DeliveryControl.

O Back-end é responsável por:

- Expor a API.
- Autenticar usuários.
- Autorizar operações.
- Validar dados.
- Aplicar regras de negócio.
- Calcular valores financeiros.
- Isolar dados por usuário.
- Persistir dados.
- Gerenciar erros.
- Garantir segurança da aplicação.

O Back-end deve ser considerado a fonte de verdade da aplicação.

Nenhuma regra importante de negócio ou segurança deve depender exclusivamente do Front-end.


2. STACK

O Back-end deve utilizar as tecnologias já definidas para o projeto.

Tecnologias principais:

- Node.js.
- TypeScript.
- Express.
- Prisma.
- PostgreSQL em produção.
- Zod para validação.
- JWT ou mecanismo de sessão definido pelo projeto.
- bcryptjs ou solução equivalente para senhas.

Novas tecnologias ou bibliotecas somente devem ser adicionadas quando houver necessidade técnica real.


3. PRINCÍPIOS

O Back-end deve seguir:

- SOLID.
- Separação de responsabilidades.
- Alta coesão.
- Baixo acoplamento.
- Código tipado.
- Validação de entrada.
- Segurança por padrão.
- Reutilização.
- Código simples e legível.
- Funções pequenas e testáveis.

Evitar:

- Controllers com regras de negócio.
- Services acessando diretamente objetos HTTP quando não necessário.
- SQL espalhado pela aplicação.
- Regras financeiras duplicadas.
- Validações duplicadas.
- Código difícil de testar.


4. ARQUITETURA

O fluxo principal do Back-end deve seguir:

Request
    ↓
Route
    ↓
Middleware
    ↓
Controller / Handler
    ↓
Service
    ↓
Business Rules
    ↓
Repository
    ↓
Database

Cada camada deve possuir uma responsabilidade clara.


5. ROUTES

As Routes devem:

- Definir endpoints.
- Definir métodos HTTP.
- Encaminhar requisições para o Controller/Handler.
- Aplicar Middlewares necessários.

As Routes não devem conter regras de negócio complexas.

Exemplo:

router.post(
    "/funcionarios",
    autenticar,
    criarFuncionario
);


6. CONTROLLERS / HANDLERS

Controllers devem ser responsáveis por:

- Receber a requisição.
- Extrair os dados necessários.
- Chamar o Service.
- Retornar a resposta HTTP.
- Encaminhar erros para o mecanismo apropriado.

Controllers não devem concentrar regras de negócio.

Evitar:

Controller
    ↓
Calcula receita
    ↓
Valida percentuais
    ↓
Acessa banco
    ↓
Cria resposta

Preferir:

Controller
    ↓
Service
    ↓
Regra de negócio
    ↓
Repository


7. SERVICES

Services devem concentrar os casos de uso da aplicação.

Exemplos:

- Criar funcionário.
- Atualizar funcionário.
- Registrar entrega.
- Registrar despesa.
- Calcular receita líquida.
- Gerar relatório.
- Criar usuário.
- Autenticar usuário.
- Autenticar com Google.
- Vincular método de autenticação.

Services devem ser fáceis de testar isoladamente.


8. REGRAS DE NEGÓCIO

Regras de negócio devem estar no Back-end.

Não depender de cálculos realizados pelo Front-end.

Exemplo:

Frontend
    ↓
Dados da operação
    ↓
Backend
    ↓
Validação
    ↓
Business Rule
    ↓
Resultado


9. AUTENTICAÇÃO

O DeliveryControl deve oferecer dois métodos de autenticação:

1. Google OAuth.
2. Cadastro e login tradicional com e-mail e senha.

Os dois métodos devem utilizar a mesma entidade principal de usuário.

Não criar sistemas de usuários separados para Google e e-mail/senha.


10. MODELO DE USUÁRIO

O sistema deve possuir uma entidade central de usuário.

Conceitualmente:

Usuario

- id
- nome
- email
- senhaHash
- criadoEm
- atualizadoEm

Métodos externos de autenticação podem ser representados separadamente.

Exemplo conceitual:

ProvedorAutenticacao

- id
- usuarioId
- provider
- providerUserId
- criadoEm

Possíveis valores de provider:

- google
- password

A implementação final deve seguir o modelo definido pelo banco e pela arquitetura do projeto.


11. AUTENTICAÇÃO TRADICIONAL

O usuário poderá criar uma conta utilizando:

- Nome.
- E-mail.
- Senha.

Fluxo:

Frontend
    ↓
Nome + e-mail + senha
    ↓
API
    ↓
Validação
    ↓
Verificar e-mail existente
    ↓
Hash da senha
    ↓
Criar usuário
    ↓
Criar método de autenticação
    ↓
Criar sessão/token
    ↓
Frontend autenticado


12. LOGIN TRADICIONAL

Fluxo:

Frontend
    ↓
E-mail + senha
    ↓
API
    ↓
Validação
    ↓
Buscar usuário
    ↓
Verificar senha com hash
    ↓
Criar sessão/token
    ↓
Frontend autenticado

Nunca comparar senhas armazenadas em texto puro.


13. SENHAS

Senhas devem ser armazenadas utilizando hash seguro.

Utilizar bcryptjs ou solução equivalente.

Exemplo:

const senhaHash = await bcrypt.hash(senha, 10);

Durante o login:

const senhaValida = await bcrypt.compare(
    senha,
    usuario.senhaHash
);

Nunca armazenar senha em texto puro.

Nunca retornar senhaHash para o Front-end.


14. GOOGLE OAUTH

O DeliveryControl deve permitir autenticação através do Google.

O fluxo OAuth/OIDC deve utilizar biblioteca ou solução consolidada.

Não implementar manualmente o protocolo OAuth.

Fluxo:

Frontend
    ↓
Continuar com Google
    ↓
Google
    ↓
Autenticação do usuário
    ↓
Backend
    ↓
Validação da identidade
    ↓
Localização ou criação do usuário
    ↓
Sessão/token DeliveryControl
    ↓
Frontend autenticado


15. VALIDAÇÃO DA IDENTIDADE GOOGLE

O Back-end deve validar a identidade recebida do Google.

Nunca confiar somente em:

- Nome.
- E-mail enviado pelo Front-end.
- Dados enviados diretamente pelo navegador.

O Back-end deve validar as informações provenientes do provedor Google conforme o fluxo OAuth/OIDC utilizado.


16. GOOGLE CLIENT SECRET

O Google Client Secret deve existir somente no ambiente seguro do Back-end.

Nunca colocar o Client Secret:

- No React.
- No código enviado ao navegador.
- No Git.
- No README.
- Em arquivos públicos.
- Em variáveis expostas ao Front-end.

Exemplo:

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

O Client Secret deve ser carregado através de variável de ambiente.


17. IDENTIDADE GOOGLE

A identidade Google deve possuir um identificador único fornecido pelo provedor.

Exemplo conceitual:

provider = "google"

providerUserId = "identificador-google"

Esse identificador deve ser utilizado para reconhecer posteriormente a mesma identidade.


18. CONTAS DUPLICADAS

O sistema deve evitar contas duplicadas.

Exemplo:

Usuário cria:

usuario@gmail.com

através do cadastro tradicional.

Depois tenta entrar com Google utilizando:

usuario@gmail.com

O sistema não deve criar automaticamente uma segunda conta sem uma estratégia definida.

Deve verificar se existe uma conta correspondente e aplicar o fluxo seguro de vinculação ou autenticação definido pelo sistema.


19. VINCULAÇÃO DE CONTAS

Quando o sistema permitir vincular Google a uma conta tradicional existente:

1. Identificar a conta.
2. Autenticar o usuário.
3. Validar a identidade Google.
4. Confirmar que a identidade pertence ao usuário.
5. Associar o provedor Google à mesma conta.
6. Manter o mesmo userId.

Nunca permitir vinculação simplesmente porque alguém informou um e-mail.


20. SESSÃO DA APLICAÇÃO

Após autenticação com:

- Google.
- E-mail e senha.

o Back-end deve criar uma sessão/token próprio do DeliveryControl.

O token do Google não deve ser utilizado diretamente como autorização das APIs internas do DeliveryControl.

Fluxo:

Google
    ↓
Identidade validada
    ↓
DeliveryControl
    ↓
Sessão/token próprio
    ↓
API DeliveryControl


21. JWT

Quando JWT for utilizado:

- O secret deve estar em variável de ambiente.
- Validar assinatura.
- Validar expiração.
- Não armazenar dados sensíveis desnecessários.
- Não expor o secret.
- Não confiar em tokens sem validação.

Exemplo:

const JWT_SECRET = process.env.JWT_SECRET;


22. MIDDLEWARE DE AUTENTICAÇÃO

Endpoints protegidos devem utilizar middleware de autenticação.

Exemplo:

router.get(
    "/funcionarios",
    autenticar,
    listarFuncionarios
);

O middleware deve:

1. Obter o token/sessão.
2. Validar.
3. Identificar o usuário.
4. Disponibilizar o usuário autenticado para as camadas seguintes.


23. USER ID AUTENTICADO

O userId deve vir da identidade autenticada.

Nunca confiar em:

req.body.userId

ou:

req.params.userId

para determinar o proprietário do recurso.

Preferir:

const userId = req.user.id;


24. ISOLAMENTO DE DADOS

Todos os recursos privados devem ser filtrados pelo usuário autenticado.

Exemplo:

buscarFuncionarios(userId);

Não permitir:

buscarTodosFuncionarios();

quando isso possibilitar acesso a dados de outros usuários.


25. IDOR

O Back-end deve impedir acesso indevido através da manipulação de IDs.

Exemplo:

GET /api/funcionarios/123

Deve verificar:

- Usuário autenticado.
- Funcionário existente.
- Funcionário pertence ao usuário.
- Usuário possui permissão.

Essa regra vale para:

- Funcionários.
- Entregas.
- Lotes.
- Despesas.
- Relatórios.
- Configurações.
- Dados financeiros.


26. VALIDAÇÃO

Toda entrada recebida pela API deve ser validada.

Validar:

- Body.
- Params.
- Query.
- Headers quando necessário.

Utilizar Zod ou solução equivalente.

Exemplo:

const schema = z.object({
    nome: z.string().min(1).max(100)
});


27. VALIDAÇÃO NO BACK-END

Mesmo que o Front-end utilize Zod ou outra biblioteca, o Back-end deve validar novamente.

Nunca assumir que o Front-end executou corretamente a validação.


28. API REST

A API deve seguir princípios REST quando aplicáveis.

Utilizar corretamente:

GET
POST
PUT
PATCH
DELETE

Exemplos:

GET /api/funcionarios
POST /api/funcionarios
GET /api/funcionarios/:id
PUT /api/funcionarios/:id
DELETE /api/funcionarios/:id


29. STATUS HTTP

Utilizar status HTTP apropriados.

Exemplos:

200 — Operação realizada com sucesso.

201 — Recurso criado.

400 — Requisição inválida.

401 — Não autenticado.

403 — Sem permissão.

404 — Recurso não encontrado.

409 — Conflito.

422 — Dados semanticamente inválidos, quando apropriado.

429 — Muitas requisições.

500 — Erro interno.


30. REGRAS FINANCEIRAS

O Back-end é a fonte de verdade para todas as regras financeiras.

Receita líquida:

receita líquida =
receita bruta - despesas de gasolina

A receita líquida não deve ser menor que zero.

Depois:

50% → carro
25% → funcionário A
25% → funcionário B

Os percentuais devem ser centralizados e configuráveis quando essa funcionalidade existir.

Nunca confiar em percentuais enviados pelo Front-end sem validação.


31. CÁLCULOS FINANCEIROS

Os cálculos financeiros devem:

- Ser realizados no Back-end.
- Ser centralizados.
- Ser testáveis.
- Possuir tipos claros.
- Possuir validação.
- Não depender de componentes React.

Exemplo:

calcularReceitaLiquida()

calcularDivisaoFinanceira()


32. PERSISTÊNCIA

O acesso ao banco deve ser separado da lógica de negócio.

Preferir:

Service
    ↓
Repository
    ↓
Prisma
    ↓
Database

Evitar acessar Prisma diretamente em vários Controllers.


33. PRISMA

Quando Prisma for utilizado:

- Utilizar somente no Back-end.
- Não expor Prisma Client ao Front-end.
- Validar dados antes da persistência.
- Utilizar filtros de usuário.
- Evitar retornar informações desnecessárias.
- Evitar queries excessivamente amplas.


34. TRANSAÇÕES

Quando uma operação envolver múltiplas alterações relacionadas, avaliar utilização de transações.

Exemplo:

Criar entrega
    ↓
Registrar receita
    ↓
Atualizar dados relacionados

Se uma parte da operação falhar, evitar deixar o banco em estado inconsistente.


35. ERROS

Erros devem ser tratados de maneira consistente.

Não retornar informações internas da aplicação.

Evitar retornar:

- Stack trace.
- SQL.
- Caminho do servidor.
- Credenciais.
- Secrets.
- Informações internas do banco.

Detalhes técnicos devem permanecer nos logs.


36. TRATAMENTO DE ERROS

Utilizar um mecanismo centralizado de tratamento de erros quando possível.

Fluxo:

Service
    ↓
Erro
    ↓
Error Handler
    ↓
Status HTTP
    ↓
Resposta padronizada


37. LOGS

Logs devem ser seguros e úteis.

Nunca registrar:

- Senhas.
- Tokens completos.
- JWT completo.
- Client Secret do Google.
- JWT Secret.
- Credenciais.
- Informações pessoais desnecessárias.

Utilizar logs para diagnóstico e monitoramento.


38. CORS

Configurar CORS explicitamente.

Evitar em produção:

origin: "*"

quando a aplicação possui autenticação e dados privados.

Preferir:

origin: process.env.FRONTEND_URL


39. RATE LIMITING

Endpoints sensíveis devem possuir proteção contra excesso de requisições.

Priorizar:

- Login.
- Cadastro.
- Google OAuth.
- Recuperação de senha.
- Endpoints de autenticação.

Quando aplicável, retornar:

429 Too Many Requests


40. SEGURANÇA DA API

Toda API protegida deve verificar:

Usuário autenticado?
    ↓
Usuário autorizado?
    ↓
Recurso pertence ao usuário?
    ↓
Dados válidos?
    ↓
Regra de negócio válida?
    ↓
Executar operação


41. CONFIGURAÇÕES SENSÍVEIS

Utilizar variáveis de ambiente para:

- JWT_SECRET.
- DATABASE_URL.
- GOOGLE_CLIENT_ID.
- GOOGLE_CLIENT_SECRET.
- FRONTEND_URL.
- Outras credenciais necessárias.

Nunca colocar secrets diretamente no código.


42. DESENVOLVIMENTO E PRODUÇÃO

Configurações de produção devem ser diferentes das configurações de desenvolvimento quando necessário.

Verificar:

- CORS.
- HTTPS.
- Cookies.
- Logs.
- Secrets.
- Banco.
- Rate limiting.
- Google OAuth.
- Mensagens de erro.


43. ESTRUTURA

A estrutura deve manter responsabilidades separadas.

Exemplo:

backend/
│
├── config/
│
├── database/
│
├── middlewares/
│
├── modules/
│   ├── autenticacao/
│   ├── usuarios/
│   ├── funcionarios/
│   ├── entregas/
│   ├── despesas/
│   └── relatorios/
│
├── services/
├── repositories/
├── schemas/
├── routes/
├── controllers/
└── server.ts

A estrutura existente do projeto deve ser respeitada antes de criar novas pastas.


44. NÃO DUPLICAR LÓGICA

Evitar duplicar:

- Regras financeiras.
- Validações.
- Autenticação.
- Autorização.
- Consultas.
- Tratamento de erros.

Se uma regra for utilizada em vários lugares, avaliar sua centralização em uma camada apropriada.


45. TESTABILIDADE

Services e regras de negócio devem ser desenvolvidos de forma que possam ser testados sem depender necessariamente do servidor completo.

Priorizar testes para:

- Autenticação.
- Google OAuth.
- Cadastro.
- Login.
- Autorização.
- Isolamento de dados.
- Funcionários.
- Entregas.
- Gasolina.
- Cálculos financeiros.
- Relatórios.


46. CHECKLIST — AUTENTICAÇÃO

[ ] Cadastro com e-mail e senha funciona.

[ ] Login com e-mail e senha funciona.

[ ] Senha é armazenada com hash.

[ ] Senha nunca é retornada pela API.

[ ] Login com Google funciona.

[ ] Identidade Google é validada no Back-end.

[ ] Google Client Secret permanece no Back-end.

[ ] Usuário Google utiliza a mesma entidade Usuario.

[ ] Contas duplicadas são evitadas.

[ ] Vinculação de contas possui fluxo seguro.

[ ] Sessão/token do DeliveryControl é criado após autenticação.

[ ] Tokens são validados corretamente.


47. CHECKLIST — AUTORIZAÇÃO

[ ] Endpoints privados exigem autenticação.

[ ] userId vem do usuário autenticado.

[ ] Não confiar em userId enviado pelo Front-end.

[ ] Recursos são filtrados pelo usuário.

[ ] Usuário não consegue acessar dados de outro usuário.

[ ] Usuário não consegue alterar dados de outro usuário.

[ ] Usuário não consegue excluir dados de outro usuário.


48. CHECKLIST — API

[ ] Body validado.

[ ] Params validados.

[ ] Query validada.

[ ] Status HTTP apropriados.

[ ] Erros tratados.

[ ] CORS configurado.

[ ] Rate limiting aplicado quando necessário.

[ ] Nenhum secret é exposto.


49. CHECKLIST — BANCO

[ ] Prisma utilizado somente no Back-end.

[ ] Dados filtrados por userId.

[ ] Credenciais do banco não estão no Front-end.

[ ] Dados sensíveis não são retornados desnecessariamente.

[ ] Transações utilizadas quando necessário.


50. CHECKLIST — SEGURANÇA

[ ] Não existem senhas em texto puro.

[ ] Não existem secrets no código.

[ ] Não existe Google Client Secret no Front-end.

[ ] Não existe JWT Secret no código.

[ ] Não existem tokens nos logs.

[ ] Não existem dados reais sensíveis no Git.

[ ] Erros não expõem informações internas.

[ ] Dados externos são validados.

[ ] Regras financeiras são executadas no Back-end.


51. REGRA PRINCIPAL

O BACK-END É A FONTE DE VERDADE DA APLICAÇÃO.

O Front-end pode solicitar uma operação, mas o Back-end deve decidir se ela pode ser executada.

Fluxo obrigatório:

Frontend
    ↓
Request
    ↓
Autenticação
    ↓
Autorização
    ↓
Validação
    ↓
Service
    ↓
Regra de negócio
    ↓
Repository
    ↓
Database

Para autenticação:

Google OAuth
        OU
E-mail + Senha
        ↓
Backend
        ↓
Validação da identidade
        ↓
Usuario
        ↓
Sessão/Token DeliveryControl
        ↓
APIs protegidas

Nenhuma operação crítica deve depender exclusivamente da segurança ou validação implementada no Front-end.