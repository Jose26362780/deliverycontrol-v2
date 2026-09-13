RULES — SEGURANÇA
Projeto: DeliveryControl

1. OBJETIVO

Estabelecer regras obrigatórias de segurança para o projeto DeliveryControl.

A aplicação utilizará dois métodos principais de autenticação:

1. Autenticação com Google OAuth.
2. Autenticação tradicional com e-mail e senha.

A aplicação deve proteger:

- Dados dos usuários.
- Dados financeiros.
- Dados dos funcionários.
- Dados das entregas.
- Sessões e tokens de autenticação.
- APIs.
- Banco de dados.
- Informações de configuração.
- Ambiente de desenvolvimento e produção.

Segurança deve ser considerada durante todo o desenvolvimento e não somente após a implementação.


2. PRINCÍPIOS DE SEGURANÇA

Todo código deve seguir os seguintes princípios:

- Nunca confiar em dados enviados pelo cliente.
- Validar dados no Back-end.
- Aplicar autenticação nas operações protegidas.
- Aplicar autorização para garantir acesso somente aos recursos permitidos.
- Garantir isolamento dos dados entre usuários.
- Nunca expor credenciais ou secrets.
- Utilizar o princípio do menor privilégio.
- Não armazenar informações sensíveis desnecessariamente.
- Não retornar informações internas do sistema.
- Evitar mensagens de erro que revelem detalhes da implementação.
- Manter dependências atualizadas.
- Corrigir vulnerabilidades identificadas antes de considerar uma funcionalidade concluída.


3. MÉTODOS DE AUTENTICAÇÃO

O DeliveryControl terá dois métodos de autenticação:

A. AUTENTICAÇÃO COM GOOGLE

O usuário poderá:

- Criar uma conta utilizando sua conta Google.
- Entrar utilizando sua conta Google.
- Utilizar o Google como provedor de identidade.

B. AUTENTICAÇÃO TRADICIONAL

O usuário poderá:

- Criar uma conta utilizando e-mail e senha.
- Entrar utilizando e-mail e senha.

Os dois métodos devem utilizar a mesma estrutura de usuário no sistema.


4. ARQUITETURA DE AUTENTICAÇÃO

A autenticação deve ser centralizada no Back-end.

Fluxo geral:

Frontend
    ↓
Autenticação
    ↓
Backend
    ↓
Validação da identidade
    ↓
Localização ou criação do usuário
    ↓
Criação da sessão/token da aplicação
    ↓
Frontend autenticado


5. GOOGLE OAUTH

A autenticação com Google deve utilizar OAuth/OIDC através de uma biblioteca ou solução consolidada.

O sistema não deve implementar manualmente o protocolo OAuth.

O Back-end deve validar corretamente a identidade fornecida pelo Google antes de considerar o usuário autenticado.

O sistema deve validar, quando aplicável:

- Identidade do usuário.
- Provedor de autenticação.
- Identificador único fornecido pelo Google.
- E-mail.
- Estado da autenticação.
- Tokens recebidos.
- Informações necessárias do fluxo OAuth/OIDC.

Nunca confiar somente em um e-mail enviado pelo Front-end para identificar uma conta Google.


6. IDENTIDADE GOOGLE

O usuário autenticado pelo Google deve possuir um identificador único do provedor.

Exemplo conceitual:

provider = google

providerUserId = identificador_fornecido_pelo_google

O identificador do Google deve ser armazenado de forma segura quando necessário para reconhecer posteriormente o usuário.

Não utilizar o nome do usuário como identificador.

Não utilizar somente o e-mail como identificador do provedor.


7. E-MAIL DO GOOGLE

O e-mail retornado pelo Google deve ser tratado como informação de identidade fornecida pelo provedor.

Quando aplicável, verificar se o e-mail está devidamente verificado pelo Google.

O sistema não deve permitir que o usuário altere arbitrariamente o e-mail associado a uma identidade Google sem um fluxo de segurança apropriado.


8. AUTENTICAÇÃO TRADICIONAL

O cadastro tradicional deve utilizar:

- Nome.
- E-mail.
- Senha.

O e-mail deve ser validado.

A senha deve obedecer aos requisitos mínimos definidos pelo sistema.

A senha nunca deve ser armazenada em texto puro.


9. SENHAS

Senhas devem ser armazenadas utilizando algoritmo adequado de hash, como bcrypt ou solução equivalente.

Exemplo:

const senhaHash = await bcrypt.hash(senha, 10);

Durante o login:

const senhaValida = await bcrypt.compare(
    senha,
    usuario.senhaHash
);

Nunca armazenar:

password = senha

Nunca retornar:

- senha;
- senhaHash;
- credenciais internas;

nas respostas da API.


10. CONTAS E IDENTIDADE

O sistema deve possuir uma entidade central de usuário.

Exemplo conceitual:

Usuario

    id
    nome
    email
    senhaHash
    criadoEm
    atualizadoEm

Para autenticação externa, quando necessário:

ProvedorAutenticacao

    id
    usuarioId
    provider
    providerUserId

Isso permite que um usuário possa possuir uma ou mais formas de autenticação sem duplicar seus dados de negócio.


11. CONTA GOOGLE E CONTA POR E-MAIL

O sistema deve evitar a criação de contas duplicadas.

Exemplo:

Usuário cria uma conta tradicional:

email = usuario@gmail.com

Posteriormente tenta entrar utilizando Google com o mesmo e-mail.

O sistema deve possuir uma estratégia clara para esse cenário.

Não criar automaticamente duas contas diferentes para a mesma identidade sem uma justificativa de negócio.

Quando houver correspondência de e-mail, o sistema deve aplicar um fluxo seguro de vinculação ou confirmação da identidade.


12. VINCULAÇÃO DE CONTAS

Quando for permitido vincular Google a uma conta tradicional existente:

1. Identificar a conta existente.
2. Confirmar a identidade do usuário.
3. Validar a autenticação Google.
4. Associar o provedor Google à conta existente.
5. Manter o mesmo userId.
6. Nunca criar uma nova conta de negócio desnecessariamente.

A vinculação deve ser realizada somente após uma autenticação válida.

Nunca permitir que alguém associe uma conta Google a outro usuário simplesmente informando o e-mail.


13. LOGIN COM GOOGLE

Fluxo esperado:

Usuário
    ↓
"Continuar com Google"
    ↓
Google OAuth
    ↓
Google autentica usuário
    ↓
Backend recebe retorno
    ↓
Backend valida identidade
    ↓
Busca provedor Google
    ↓
Se encontrado → autentica usuário
    ↓
Se não encontrado → verifica estratégia de criação/vinculação
    ↓
Cria sessão/token da aplicação
    ↓
Frontend autenticado


14. LOGIN TRADICIONAL

Fluxo esperado:

Usuário
    ↓
E-mail + senha
    ↓
Backend
    ↓
Validação dos dados
    ↓
Busca usuário
    ↓
Verificação do hash
    ↓
Senha válida?
    ↓
Criação da sessão/token
    ↓
Frontend autenticado


15. REGISTRO TRADICIONAL

Fluxo esperado:

Usuário
    ↓
Nome + e-mail + senha
    ↓
Frontend valida
    ↓
Backend valida novamente
    ↓
Verifica se e-mail já existe
    ↓
Hash da senha
    ↓
Criação do usuário
    ↓
Criação da autenticação
    ↓
Sessão/token


16. E-MAIL DUPLICADO

O sistema deve impedir o cadastro de múltiplas contas tradicionais com o mesmo e-mail.

O banco de dados deve possuir uma restrição de unicidade para o e-mail quando essa regra fizer parte do modelo adotado.

O Back-end nunca deve depender somente de uma verificação realizada pelo Front-end.


17. AUTENTICAÇÃO E AUTORIZAÇÃO

Autenticação responde:

"Quem é o usuário?"

Autorização responde:

"O usuário pode acessar esse recurso?"

Depois de autenticar o usuário, todas as requisições protegidas devem identificar corretamente o usuário autenticado.


18. JWT

Quando JWT for utilizado:

- O secret deve estar em variável de ambiente.
- Nunca colocar o secret diretamente no código.
- Nunca versionar o secret no Git.
- Validar assinatura.
- Validar expiração.
- Não confiar em informações do token sem validação.
- Não armazenar informações sensíveis desnecessárias no token.

Exemplo:

const JWT_SECRET = process.env.JWT_SECRET;

Nunca:

const JWT_SECRET = "minha-chave-secreta";


19. SESSÃO

A aplicação deve possuir uma estratégia clara para gerenciamento de sessão.

Após autenticação com Google ou e-mail/senha, o usuário deve receber uma sessão/token próprio da aplicação.

O sistema não deve utilizar diretamente o token do Google como mecanismo de autorização das APIs internas.

Fluxo:

Google OAuth
    ↓
Identidade validada
    ↓
Backend DeliveryControl
    ↓
Sessão própria
    ↓
API DeliveryControl


20. AUTORIZAÇÃO E ISOLAMENTO DE DADOS

Todo dado pertencente a um usuário deve ser isolado utilizando o userId do usuário autenticado.

Nunca confiar em:

req.body.userId

ou:

req.params.userId

para determinar o proprietário dos dados.

O userId deve ser obtido a partir da sessão/token validado pelo Back-end.

Exemplo:

const userId = req.user.id;


21. IDOR E ACESSO INDEVIDO

A aplicação deve impedir que um usuário consiga acessar recursos pertencentes a outro usuário alterando um ID.

Exemplo:

GET /api/funcionarios/123

O Back-end deve verificar se o funcionário 123 pertence ao usuário autenticado.

Essa regra deve ser aplicada a:

- Funcionários.
- Entregas.
- Lotes.
- Despesas.
- Relatórios.
- Configurações.
- Dados financeiros.
- Qualquer outro recurso privado.


22. VALIDAÇÃO DE ENTRADA

Toda entrada externa deve ser considerada não confiável.

Validar:

- req.body
- req.params
- req.query
- headers
- formulários
- APIs externas
- cookies
- dados enviados pelo cliente.

Utilizar Zod ou mecanismo equivalente.

A validação deve ocorrer no Back-end mesmo que o Front-end também valide.


23. FRONT-END NÃO É CAMADA DE SEGURANÇA

O Front-end não deve ser considerado confiável.

Nunca utilizar o Front-end como única proteção para:

- Autenticação.
- Autorização.
- Permissões.
- Validação.
- Regras financeiras.

Toda regra importante deve ser validada no Back-end.


24. DADOS FINANCEIROS

O Front-end nunca deve ser a fonte de verdade para:

- Receita líquida.
- Percentuais.
- Gasolina.
- Valor destinado ao carro.
- Valor destinado aos funcionários.
- Totais.
- Relatórios.

O Back-end deve calcular e validar os valores.

Regra padrão:

Receita líquida
    ↓
50% carro
25% funcionário A
25% funcionário B

A gasolina deve ser tratada conforme as regras de negócio definidas pelo projeto.


25. SQL INJECTION

Nunca construir consultas SQL utilizando concatenação direta de dados recebidos do usuário.

Evitar:

const query = `
    SELECT *
    FROM usuarios
    WHERE email = '${email}'
`;

Preferir:

- Prisma.
- Queries parametrizadas.
- Prepared statements.
- Bibliotecas seguras de acesso ao banco.


26. XSS

Dados fornecidos pelo usuário devem ser tratados como conteúdo não confiável.

Evitar HTML inserido diretamente.

Evitar utilizar dangerouslySetInnerHTML sem necessidade real.

Preferir renderização normal:

<div>{nome}</div>

Quando HTML dinâmico for necessário, utilizar sanitização adequada.


27. CSRF

Quando autenticação baseada em cookies for utilizada, avaliar proteção contra CSRF.

Considerar:

- SameSite.
- Secure.
- HttpOnly.
- CSRF tokens quando necessários.
- Validação de origem quando apropriado.

CORS não substitui proteção contra CSRF.


28. COOKIES

Quando cookies forem utilizados para autenticação, utilizar configurações adequadas.

Preferir:

- HttpOnly.
- Secure.
- SameSite.

A configuração deve considerar corretamente desenvolvimento e produção.


29. LOCALSTORAGE

Não armazenar informações altamente sensíveis no LocalStorage sem justificativa técnica.

Evitar armazenar:

- Senhas.
- Secrets.
- Chaves privadas.
- Informações financeiras desnecessárias.
- Tokens de longa duração sem avaliação de risco.

A estratégia de armazenamento do token deve considerar os riscos de XSS.


30. CORS

O CORS deve ser configurado de forma explícita.

Evitar:

cors({
    origin: "*"
});

em produção quando existirem dados privados ou autenticação.

Preferir:

cors({
    origin: process.env.FRONTEND_URL
});


31. HEADERS DE SEGURANÇA

Quando apropriado, utilizar mecanismos como Helmet.

Avaliar:

- Content-Security-Policy.
- X-Content-Type-Options.
- Referrer-Policy.
- Proteção contra frames.
- Strict-Transport-Security em produção.


32. RATE LIMITING

Endpoints sensíveis devem possuir proteção contra excesso de requisições.

Priorizar:

- Login.
- Cadastro.
- Autenticação Google.
- Recuperação de senha.
- Endpoints de autenticação.
- Operações potencialmente abusáveis.

Quando aplicável, utilizar HTTP 429.


33. MENSAGENS DE ERRO

Nunca retornar ao usuário:

- Stack traces.
- Queries SQL.
- Caminhos internos.
- Informações do banco.
- Secrets.
- Configurações internas.

Evitar mensagens que permitam descobrir se uma conta específica existe quando isso representar risco de enumeração de usuários.

Mensagens de autenticação devem ser cuidadosamente definidas para evitar vazamento desnecessário de informações.


34. LOGS

Nunca registrar:

- Senhas.
- Tokens completos.
- JWT completo.
- Secrets.
- Credenciais.
- Dados financeiros desnecessários.
- Informações pessoais desnecessárias.

Evitar:

console.log({
    email,
    password,
    token
});

Logs devem conter somente informações necessárias para diagnóstico e auditoria.


35. VARIÁVEIS DE AMBIENTE

Informações sensíveis devem permanecer em variáveis de ambiente.

Exemplo:

JWT_SECRET=
DATABASE_URL=
FRONTEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

Nunca versionar secrets reais.

O .env.example pode conter somente os nomes das variáveis:

JWT_SECRET=
DATABASE_URL=
FRONTEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


36. GOOGLE OAUTH SECRETS

O Google Client Secret nunca deve ser exposto no Front-end.

O Client Secret deve existir somente no ambiente seguro do Back-end.

O Client ID pode possuir tratamento diferente dependendo da configuração do provedor, mas nunca assumir que qualquer configuração pública é secreta.

Nunca colocar:

GOOGLE_CLIENT_SECRET

em código React ou arquivos enviados ao navegador.


37. GIT

Antes de realizar um commit, verificar se não existem:

- .env
- Tokens.
- Secrets.
- Credenciais.
- Google Client Secret.
- Dumps do banco.
- Dados reais de usuários.

Nenhuma credencial deve entrar no histórico do Git.


38. DADOS PESSOAIS

Coletar somente os dados necessários.

Evitar armazenar informações pessoais sem finalidade.

Proteger:

- Nome.
- E-mail.
- Dados financeiros.
- Dados de funcionários.
- Informações de autenticação.

Não retornar informações pessoais desnecessárias pela API.


39. BANCO DE DADOS

O acesso ao banco deve ocorrer exclusivamente pelo Back-end.

Fluxo correto:

Frontend
    ↓
API
    ↓
Service
    ↓
Repository
    ↓
Database

O Front-end nunca deve possuir credenciais do banco.


40. PRISMA

Quando Prisma for utilizado:

- Utilizar somente no Back-end.
- Nunca expor o Prisma Client ao Front-end.
- Validar entradas antes das operações.
- Limitar os dados retornados.
- Filtrar recursos pelo usuário autenticado.
- Evitar consultas desnecessariamente amplas.


41. DELETE

Operações de exclusão devem verificar:

- Autenticação.
- Autorização.
- Propriedade do recurso.
- Existência.
- Dependências quando necessário.

A confirmação realizada pelo Front-end não substitui a proteção do Back-end.


42. HTTPS

Em produção, toda comunicação envolvendo:

- Login.
- Cadastro.
- Google OAuth.
- Tokens.
- Dados financeiros.
- Dados pessoais;

deve utilizar HTTPS.


43. DESENVOLVIMENTO E PRODUÇÃO

Configurações de desenvolvimento não devem ser copiadas diretamente para produção.

Verificar:

- CORS.
- Cookies.
- HTTPS.
- Logs.
- Secrets.
- Rate limiting.
- Banco de dados.
- Headers.
- Google OAuth.
- Mensagens de erro.

Produção não deve utilizar secrets de desenvolvimento.


44. TESTES DE AUTENTICAÇÃO

Os testes devem cobrir:

AUTENTICAÇÃO TRADICIONAL

[ ] Cadastro válido.
[ ] Cadastro com e-mail inválido.
[ ] Cadastro com e-mail já existente.
[ ] Cadastro com senha inválida.
[ ] Login válido.
[ ] Login com senha incorreta.
[ ] Login com usuário inexistente.
[ ] Token ausente.
[ ] Token inválido.
[ ] Token expirado.

GOOGLE

[ ] Login Google válido.
[ ] Retorno Google inválido.
[ ] Identidade Google não encontrada.
[ ] Usuário Google existente.
[ ] Criação de novo usuário Google.
[ ] Tentativa de associação indevida.
[ ] Conta Google com e-mail já cadastrado.
[ ] Falha na autenticação externa.


45. TESTES DE AUTORIZAÇÃO

Testar:

[ ] Usuário acessando seus próprios dados.
[ ] Usuário tentando acessar dados de outro usuário.
[ ] Usuário tentando alterar dados de outro usuário.
[ ] Usuário tentando excluir dados de outro usuário.
[ ] Usuário tentando acessar relatório de outro usuário.
[ ] Usuário tentando manipular userId.


46. TESTES DE SEGURANÇA FINANCEIRA

Testar:

[ ] Receita manipulada pelo Front-end.
[ ] Percentuais manipulados.
[ ] Gasolina com valor inválido.
[ ] Receita líquida manipulada.
[ ] Valores negativos.
[ ] Valores infinitos.
[ ] Usuário tentando acessar dados financeiros de outro usuário.


47. CHECKLIST DE SEGURANÇA ANTES DE FINALIZAR UMA FEATURE

AUTENTICAÇÃO

[ ] Endpoint protegido exige autenticação.
[ ] Login tradicional funciona corretamente.
[ ] Cadastro tradicional funciona corretamente.
[ ] Login Google funciona corretamente.
[ ] Tokens são validados.
[ ] Secrets estão protegidos.
[ ] Senhas são armazenadas com hash.

AUTORIZAÇÃO

[ ] O usuário somente acessa seus próprios dados.
[ ] userId não é confiado vindo do cliente.
[ ] Operações CRUD verificam propriedade do recurso.

VALIDAÇÃO

[ ] Body validado.
[ ] Params validados.
[ ] Query params validados.
[ ] Dados financeiros validados.

GOOGLE

[ ] Client Secret não está no Front-end.
[ ] Identidade Google é validada.
[ ] Contas duplicadas são evitadas.
[ ] Vinculação de contas possui fluxo seguro.

DADOS

[ ] Senhas não são armazenadas em texto puro.
[ ] Informações sensíveis não são retornadas.
[ ] Logs não possuem secrets.

API

[ ] CORS configurado corretamente.
[ ] Erros não expõem detalhes internos.
[ ] Status HTTP apropriados.
[ ] Endpoints sensíveis possuem proteção contra abuso quando necessário.

FRONT-END

[ ] Não existem secrets no código.
[ ] Dados externos não são considerados confiáveis.
[ ] Não existe renderização insegura de HTML.

GIT

[ ] .env não está versionado.
[ ] Não existem tokens no código.
[ ] Não existem credenciais no commit.
[ ] Google Client Secret não está no repositório.
[ ] Dados reais de usuários não foram adicionados ao repositório.


48. REGRA PRINCIPAL

NUNCA CONFIAR NO CLIENTE.

O Front-end pode ser manipulado.

Tanto o login tradicional quanto o login Google devem passar por uma camada de autenticação segura no Back-end.

Fluxo:

Frontend
    ↓
Google OAuth ou E-mail + Senha
    ↓
Backend
    ↓
Validação da identidade
    ↓
Autorização
    ↓
Identificação do userId
    ↓
Regra de negócio
    ↓
Database

A autenticação identifica o usuário.

A autorização determina o que o usuário pode fazer.

O Back-end é responsável por garantir que o usuário somente consiga acessar e modificar os recursos aos quais possui acesso.

Uma funcionalidade somente deve ser considerada concluída quando estiver funcionando corretamente e protegida contra:

- Acesso indevido.
- Contas duplicadas.
- Manipulação de dados.
- Falhas de autenticação.
- Falhas de autorização.
- Exposição de credenciais.
- Exposição de informações sensíveis.
- Vulnerabilidades conhecidas.