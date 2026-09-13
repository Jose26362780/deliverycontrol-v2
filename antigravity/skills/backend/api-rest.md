SKILL: API REST

OBJETIVO

Definir como projetar, implementar, testar e manter APIs REST no backend do DeliveryControl.

A API deve possuir contratos claros, validação de dados, autenticação, autorização, tratamento consistente de erros e separação entre HTTP, regras de negócio e persistência.

As novas rotas autenticadas usam sessões em cookie do Better Auth. Referências
abaixo a `/api/auth/google` ou Bearer/JWT são compatibilidade histórica e não
devem ser usadas no frontend atual.

--------------------------------------------------
1. STACK
--------------------------------------------------

A API utiliza:

- Node.js
- TypeScript
- Express
- Zod
- Persistência JSON local durante o desenvolvimento
- Prisma/Drizzle e PostgreSQL como alvo de produção
- Better Auth para sessões e Google OAuth/OIDC
- JWT legado somente durante a migração

--------------------------------------------------
2. PRINCÍPIOS
--------------------------------------------------

Toda API deve seguir:

- REST
- TypeScript strict
- SOLID
- Separação de responsabilidades
- Alta coesão
- Baixo acoplamento
- Validação de entrada
- Autenticação e autorização
- Tratamento centralizado de erros
- Respostas HTTP consistentes
- Backend como fonte de verdade
- Testabilidade
- Segurança por padrão

As rotas não devem conter regras de negócio complexas.

--------------------------------------------------
3. FLUXO DA API
--------------------------------------------------

O fluxo padrão deve ser:

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
Regra de negócio
    ↓
Repository/Persistência
    ↓
Database ou arquivo local
    ↓
Response

Cada camada deve possuir uma responsabilidade específica.

--------------------------------------------------
4. ROUTES
--------------------------------------------------

As rotas devem ser responsáveis por:

- definir o endpoint;
- definir o método HTTP;
- registrar middlewares;
- encaminhar a requisição para o Controller/Handler.

Exemplo:

router.post(
    "/entregas",
    autenticarUsuario,
    validarSchema(criarEntregaSchema),
    criarEntrega
);

No estado atual, os handlers dos módulos ainda acessam a instância `db` diretamente.
Ao criar ou alterar endpoints, mantenha essa compatibilidade e não aumente esse acoplamento;
extraia repositories antes da migração para PostgreSQL.

As rotas NÃO devem:

- acessar diretamente o banco;
- executar cálculos financeiros;
- implementar regras de negócio;
- manipular diretamente o Prisma;
- decidir permissões complexas.

Evitar:

router.post("/entregas", async (req, res) => {

    // validação
    // regra financeira
    // acesso ao banco
    // cálculo
    // resposta

});

Preferir:

Route
    ↓
Middleware
    ↓
Controller
    ↓
Service
    ↓
Repository


--------------------------------------------------
5. MÉTODOS HTTP
--------------------------------------------------

Utilizar os métodos HTTP de acordo com a responsabilidade da operação.

GET

Utilizado para consultar recursos.

Exemplos:

GET /api/entregas

GET /api/entregas/:id


POST

Utilizado para criar recursos.

Exemplo:

POST /api/entregas


PUT

Utilizado para substituir ou atualizar completamente um recurso quando essa semântica fizer sentido.


PATCH

Utilizado para atualizar parcialmente um recurso.


DELETE

Utilizado para excluir um recurso.

Exemplo:

DELETE /api/entregas/:id


--------------------------------------------------
6. STATUS HTTP
--------------------------------------------------

Utilizar os status HTTP corretamente.

200
Operação executada com sucesso.

201
Recurso criado com sucesso.

204
Operação concluída sem conteúdo de resposta.

400
Dados da requisição inválidos.

401
Usuário não autenticado.

403
Usuário autenticado, mas sem permissão.

404
Recurso não encontrado.

409
Conflito de dados.

422
Dados semanticamente inválidos, quando aplicável.

500
Erro interno inesperado.


--------------------------------------------------
7. VALIDAÇÃO
--------------------------------------------------

Toda entrada externa deve ser considerada não confiável.

Devem ser validados:

- body;
- params;
- query;
- headers quando necessário;
- dados enviados para serviços externos.

Utilizar Zod para validação.

Exemplo:

const criarEntregaSchema = z.object({
    data: z.string(),
    valor: z.number().nonnegative(),
    funcionarioId: z.string().uuid()
});

Nunca confiar apenas na validação realizada pelo frontend.

O backend deve validar novamente os dados recebidos.


--------------------------------------------------
8. DTOs
--------------------------------------------------

Não utilizar diretamente qualquer objeto recebido do frontend como entidade de domínio.

Os dados devem:

Request
    ↓
Validação
    ↓
DTO
    ↓
Service
    ↓
Domínio

Os DTOs devem representar os dados necessários para cada operação.

Exemplos:

CriarFuncionarioDTO

AtualizarFuncionarioDTO

CriarEntregaDTO

CriarDespesaGasolinaDTO

AtualizarConfiguracaoDTO


--------------------------------------------------
9. IDENTIDADE DO USUÁRIO
--------------------------------------------------

O userId utilizado para autenticação, autorização e isolamento dos dados deve vir da identidade autenticada.

Nunca confiar em um userId enviado pelo frontend.

Errado:

{
    "userId": "usuario-enviado-pelo-frontend"
}

Correto:

JWT
    ↓
Middleware
    ↓
Usuário autenticado
    ↓
req.user.id
    ↓
Service


O frontend não deve decidir qual usuário é proprietário de um recurso.


--------------------------------------------------
10. CONTROLLERS / HANDLERS
--------------------------------------------------

Controllers devem ser responsáveis por:

- receber a requisição;
- acessar dados já validados;
- chamar o Service;
- definir a resposta HTTP;
- encaminhar erros para o middleware apropriado.

Controllers NÃO devem:

- conter regras financeiras;
- realizar queries diretamente;
- implementar regras complexas;
- conhecer detalhes desnecessários do banco.

Fluxo:

Request
    ↓
Controller
    ↓
Service
    ↓
Response


--------------------------------------------------
11. SERVICES
--------------------------------------------------

Services representam os casos de uso da aplicação.

Exemplos:

criarEntrega()

atualizarEntrega()

excluirEntrega()

criarFuncionario()

registrarDespesaGasolina()

calcularRelatorioFinanceiro()

registrarUsuario()

autenticarUsuario()

autenticarComGoogle()


O Service deve:

- receber dados validados;
- executar o caso de uso;
- aplicar regras de negócio;
- verificar autorização;
- utilizar repositories;
- retornar o resultado;
- lançar erros de domínio/aplicação quando necessário.


--------------------------------------------------
12. REPOSITORY
--------------------------------------------------

O acesso ao banco deve ficar isolado no Repository.

Exemplos:

entregaRepository.buscarPorId()

entregaRepository.listar()

entregaRepository.criar()

entregaRepository.atualizar()

entregaRepository.excluir()


O Service não deve depender diretamente de detalhes desnecessários do Prisma.

Fluxo:

Service
    ↓
Repository
    ↓
Prisma
    ↓
Database


--------------------------------------------------
13. RESPOSTAS DA API
--------------------------------------------------

As respostas devem possuir estrutura previsível.

Exemplo de resposta de recurso:

{
    "data": {
        "id": "123",
        "valor": 150
    }
}


Exemplo de lista:

{
    "data": [],
    "meta": {
        "total": 0
    }
}


Exemplo de erro:

{
    "error": {
        "code": "ENTREGA_NAO_ENCONTRADA",
        "message": "Entrega não encontrada."
    }
}


Não retornar informações internas do backend para o cliente.


--------------------------------------------------
14. TRATAMENTO DE ERROS
--------------------------------------------------

Utilizar tratamento centralizado de erros.

Podem existir erros específicos da aplicação, como:

- RecursoNaoEncontradoError
- RegraNegocioError
- NaoAutorizadoError
- DadosInvalidosError
- ConflitoError

O Service pode lançar o erro.

O middleware global de erros deve transformar o erro em uma resposta HTTP apropriada.

Exemplo:

Service
    ↓
Erro de domínio
    ↓
Error Middleware
    ↓
HTTP Response


Nunca retornar stack trace ou informações sensíveis para o frontend.


--------------------------------------------------
15. AUTENTICAÇÃO
--------------------------------------------------

Endpoints protegidos devem utilizar middleware de autenticação.

Exemplo:

router.get(
    "/entregas",
    autenticarUsuario,
    listarEntregas
);


O middleware deve:

- obter o token/sessão;
- validar a autenticação;
- identificar o usuário;
- disponibilizar a identidade para as camadas seguintes.


Fluxo:

Request
    ↓
JWT / Sessão
    ↓
Middleware
    ↓
Usuário autenticado
    ↓
Controller
    ↓
Service


A autenticação do DeliveryControl pode utilizar:

- Google OAuth/OIDC;
- email e senha.

Após a autenticação, o DeliveryControl deve utilizar sua própria sessão/token para proteger suas APIs.


--------------------------------------------------
16. AUTORIZAÇÃO
--------------------------------------------------

Autenticação responde:

"Quem é o usuário?"

Autorização responde:

"O usuário pode executar esta operação?"


Os dois conceitos devem ser tratados separadamente.

Toda operação protegida deve verificar se o usuário possui permissão para acessar ou alterar o recurso.


--------------------------------------------------
17. ISOLAMENTO DE DADOS
--------------------------------------------------

Usuários não podem acessar recursos pertencentes a outros usuários.

Nunca fazer somente:

GET /api/entregas/:id

e buscar apenas pelo ID sem validar o proprietário.

A consulta deve considerar a identidade autenticada.

Exemplo conceitual:

buscarEntrega(
    entregaId,
    usuarioId
)


O mesmo princípio deve ser aplicado para:

- funcionários;
- entregas;
- turnos;
- despesas;
- configurações;
- relatórios;
- demais recursos privados.


--------------------------------------------------
18. PREVENÇÃO DE IDOR
--------------------------------------------------

Prevenir Insecure Direct Object Reference.

Um usuário pode tentar modificar manualmente uma URL ou ID para acessar um recurso de outro usuário.

Exemplo:

/api/entregas/ID_DE_OUTRO_USUARIO


O backend deve impedir esse acesso.

Nunca confiar que o frontend impedirá esse comportamento.


--------------------------------------------------
19. PAGINAÇÃO
--------------------------------------------------

Coleções que podem crescer significativamente devem considerar:

- paginação;
- filtros;
- ordenação;
- limite de registros.

Exemplo:

GET /api/entregas?page=1&limit=20


Evitar retornar quantidades ilimitadas de registros sem necessidade.


--------------------------------------------------
20. FILTROS
--------------------------------------------------

Filtros devem ser validados e aplicados no backend.

Exemplos:

- período;
- funcionário;
- status;
- data;
- valor;
- tipo de despesa.

Nunca confiar que o frontend filtrará corretamente todos os dados.


--------------------------------------------------
21. REGRAS FINANCEIRAS
--------------------------------------------------

Cálculos financeiros devem ser executados no backend.

A regra padrão do DeliveryControl é:

Receita líquida =
Receita bruta - Despesas de gasolina

O resultado mínimo é:

0


Depois:

Receita líquida
    ↓
50% Carro
25% Funcionário A
25% Funcionário B


O frontend pode apresentar uma prévia do cálculo, mas o backend deve recalcular e validar o resultado final.


--------------------------------------------------
22. SEGURANÇA
--------------------------------------------------

A API deve:

- validar todas as entradas;
- exigir autenticação quando necessário;
- verificar autorização;
- isolar dados por usuário;
- proteger endpoints de autenticação;
- utilizar CORS configurado;
- considerar rate limiting;
- não expor secrets;
- não retornar dados sensíveis;
- utilizar HTTPS em produção;
- proteger contra acesso indevido;
- evitar SQL Injection;
- evitar exposição de informações internas.


--------------------------------------------------
23. CORS
--------------------------------------------------

CORS deve permitir apenas origens necessárias.

A origem do frontend deve ser configurada através de variável de ambiente quando apropriado.

Exemplo:

FRONTEND_URL=https://dominio-do-frontend.com


Não utilizar configurações excessivamente permissivas em produção.


--------------------------------------------------
24. RATE LIMITING
--------------------------------------------------

Endpoints sensíveis devem possuir proteção contra abuso.

Principalmente:

- login;
- registro;
- autenticação Google;
- recuperação de senha, caso implementada;
- endpoints de autenticação.


Considerar rate limiting para reduzir:

- brute force;
- credential stuffing;
- abuso automatizado;
- ataques de negação de serviço em endpoints específicos.


--------------------------------------------------
25. VARIÁVEIS DE AMBIENTE
--------------------------------------------------

Informações sensíveis devem utilizar variáveis de ambiente.

Exemplos:

JWT_SECRET=
DATABASE_URL=
FRONTEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=


Nunca colocar secrets diretamente no código.

Nunca versionar:

.env

.env.local

ou arquivos contendo secrets reais.


Manter:

.env.example


sem valores sensíveis reais.


--------------------------------------------------
26. TESTES
--------------------------------------------------

Toda API importante deve possuir testes.

Testar:

- sucesso;
- validação;
- autenticação;
- autorização;
- isolamento entre usuários;
- recurso inexistente;
- dados inválidos;
- conflitos;
- regras de negócio;
- erros internos;
- respostas HTTP.

Exemplos:

POST /api/entregas

Testar:

- dados válidos;
- dados inválidos;
- usuário não autenticado;
- funcionário inexistente;
- funcionário de outro usuário;
- valor negativo;
- criação com sucesso.


--------------------------------------------------
27. DOCUMENTAÇÃO DA API
--------------------------------------------------

Quando uma API for criada ou alterada de forma relevante, atualizar sua documentação.

A documentação deve representar o comportamento real.

Documentar quando necessário:

- endpoint;
- método;
- autenticação;
- parâmetros;
- body;
- resposta;
- status HTTP;
- erros;
- regras relevantes.


Nunca documentar endpoints que não existem.


--------------------------------------------------
28. NOMENCLATURA
--------------------------------------------------

Utilizar nomes claros e consistentes.

Exemplos:

/api/funcionarios

/api/entregas

/api/despesas-gasolina

/api/relatorios

/api/auth/register

/api/auth/login

/api/auth/google


Manter padrão consistente durante todo o projeto.


--------------------------------------------------
29. RESPONSABILIDADE DAS CAMADAS
--------------------------------------------------

Route:

Define o endpoint e middlewares.


Middleware:

Autenticação, autorização, validação e preocupações transversais.


Controller:

Interpreta a requisição e produz a resposta HTTP.


Service:

Executa o caso de uso.


Business Rules:

Define o comportamento do domínio.


Repository:

Realiza a persistência.


Database:

Armazena os dados.


--------------------------------------------------
30. CHECKLIST
--------------------------------------------------

Antes de finalizar uma API:

[ ] Endpoint possui responsabilidade clara

[ ] Método HTTP está correto

[ ] Dados de entrada são validados

[ ] DTO está definido quando necessário

[ ] Autenticação está aplicada

[ ] Autorização está aplicada

[ ] userId vem da identidade autenticada

[ ] Existe isolamento entre usuários

[ ] Controller não possui regra de negócio complexa

[ ] Service implementa o caso de uso

[ ] Regras de negócio estão centralizadas

[ ] Repository está separado da lógica de negócio

[ ] Prisma não é utilizado diretamente no frontend

[ ] Status HTTP está correto

[ ] Resposta possui estrutura consistente

[ ] Erros são tratados

[ ] Informações sensíveis não são expostas

[ ] Rate limiting foi considerado

[ ] CORS está configurado

[ ] Testes foram criados

[ ] Documentação foi atualizada quando necessário


--------------------------------------------------
REGRA PRINCIPAL
--------------------------------------------------

A API REST deve funcionar como uma fronteira segura entre o frontend e o domínio da aplicação.

O frontend envia intenções e dados.

O backend:

1. autentica;
2. autoriza;
3. valida;
4. executa as regras de negócio;
5. acessa a persistência;
6. retorna o resultado.

O frontend nunca deve ser considerado fonte de verdade para segurança, autorização, persistência ou regras financeiras.