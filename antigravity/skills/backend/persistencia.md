SKILL: PERSISTÊNCIA

OBJETIVO

Definir como projetar, implementar, testar e manter a camada de persistência do DeliveryControl.

A persistência é responsável por armazenar, consultar, atualizar e excluir dados de forma segura e consistente.

A camada de persistência deve permanecer separada das regras de negócio, autenticação, controllers e lógica de apresentação.

--------------------------------------------------
1. STACK
--------------------------------------------------

A persistência atual do DeliveryControl utiliza:

- `backend/server/db/database.ts`;
- arquivo JSON local em `.data/deliverycontrol.db.json`;
- TypeScript.

Para produção, a migração prevista no spec-kit utiliza Prisma ou Drizzle ORM com PostgreSQL.
Essa migração deve preservar os contratos dos services e isolar o novo acesso em repositories.
- TypeScript

O Prisma deve ser utilizado exclusivamente no backend.

O frontend nunca deve acessar diretamente:

- PostgreSQL
- Prisma
- Database
- Repository


--------------------------------------------------
2. PRINCÍPIOS
--------------------------------------------------

A persistência deve seguir:

- Separação de responsabilidades
- SOLID
- Baixo acoplamento
- Alta coesão
- Tipagem forte
- Integridade dos dados
- Segurança
- Testabilidade
- Reutilização
- Simplicidade
- Consistência

A persistência deve armazenar e recuperar dados.

Ela não deve decidir regras de negócio.


--------------------------------------------------
3. ARQUITETURA
--------------------------------------------------

O fluxo alvo deve ser:

Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma/Drizzle ou persistência local
    ↓
PostgreSQL ou arquivo JSON local


Responsabilidades:

Controller
- recebe a requisição;
- chama o Service;
- retorna a resposta HTTP.

Service
- executa o caso de uso;
- aplica regras de negócio;
- controla o fluxo da operação.

Repository
- realiza operações de persistência;
- consulta;
- cria;
- atualiza;
- exclui dados.

Prisma/Drizzle
- realiza a comunicação com o banco quando a persistência relacional for adotada.

PostgreSQL ou arquivo local
- armazena os dados conforme o ambiente.


--------------------------------------------------
4. REPOSITORY
--------------------------------------------------

O Repository deve encapsular o acesso ao banco.

Exemplo:

entregaRepository.buscarPorId()

entregaRepository.listar()

entregaRepository.criar()

entregaRepository.atualizar()

entregaRepository.excluir()


O Service não deve precisar conhecer detalhes internos do Prisma.

Evitar:

Service
    ↓
Prisma diretamente


Preferir:

Service
    ↓
Repository
    ↓
Prisma


--------------------------------------------------
5. INTERFACES DE REPOSITORY
--------------------------------------------------

Quando apropriado, utilizar interfaces para definir contratos de persistência.

Exemplo:

interface EntregaRepository {

    buscarPorId(
        id: string,
        usuarioId: string
    ): Promise<Entrega | null>;

    listar(
        usuarioId: string
    ): Promise<Entrega[]>;

    criar(
        dados: CriarEntrega
    ): Promise<Entrega>;

    atualizar(
        id: string,
        usuarioId: string,
        dados: AtualizarEntrega
    ): Promise<Entrega>;

    excluir(
        id: string,
        usuarioId: string
    ): Promise<void>;
}


Isso facilita:

- testes;
- mocks;
- fakes;
- substituição de implementação;
- baixo acoplamento.


--------------------------------------------------
6. ISOLAMENTO POR USUÁRIO
--------------------------------------------------

Todos os recursos privados devem respeitar o usuário autenticado.

Exemplos:

- Funcionarios
- Entregas
- Turnos
- DespesasGasolina
- Relatorios
- Configuracoes


As consultas devem considerar o `usuarioId` quando o recurso pertencer a um usuário.

Evitar:

prisma.entrega.findUnique({
    where: {
        id
    }
});


Preferir uma consulta que também valide o proprietário do recurso.

Conceitualmente:

buscar:

id
+
usuarioId


O objetivo é impedir que um usuário consiga acessar dados de outro usuário.


--------------------------------------------------
7. USER ID
--------------------------------------------------

O `userId` utilizado para isolamento deve vir da identidade autenticada.

Nunca confiar em:

req.body.userId

req.params.userId

ou qualquer valor equivalente enviado pelo frontend.


Fluxo:

JWT
    ↓
Middleware
    ↓
Usuário autenticado
    ↓
Service
    ↓
Repository
    ↓
Consulta com usuarioId


--------------------------------------------------
8. MODELAGEM DO BANCO
--------------------------------------------------

As entidades do banco devem representar o domínio real da aplicação.

Exemplos conceituais:

Usuario

ProvedorAutenticacao

Funcionario

Entrega

Turno

DespesaGasolina

ConfiguracaoDivisao


A estrutura final deve seguir o schema real do projeto.


--------------------------------------------------
9. RELACIONAMENTOS
--------------------------------------------------

Os relacionamentos entre entidades devem ser explicitamente definidos.

Exemplo:

Usuario
    │
    ├── Funcionarios
    │
    ├── Entregas
    │
    ├── Turnos
    │
    ├── DespesasGasolina
    │
    └── ConfiguracaoDivisao


Os relacionamentos devem preservar a integridade dos dados.


--------------------------------------------------
10. FOREIGN KEYS
--------------------------------------------------

Utilizar relacionamentos e foreign keys quando apropriado.

Exemplo conceitual:

Entrega
    ↓
Funcionario


Se uma entrega possuir um funcionário associado, o banco deve possuir uma relação consistente entre os registros.


--------------------------------------------------
11. CONSTRAINTS
--------------------------------------------------

Utilizar constraints do banco quando necessário.

Exemplos:

- UNIQUE
- NOT NULL
- FOREIGN KEY
- índices
- constraints de integridade


Não depender somente da aplicação para garantir integridade quando o banco puder garantir a mesma regra estruturalmente.


--------------------------------------------------
12. UNIQUE
--------------------------------------------------

Utilizar UNIQUE para dados que realmente precisam ser únicos.

Exemplo:

email do usuário


Também considerar unicidade para:

- providerUserId;
- combinações específicas de campos;
- identificadores externos.


A regra deve refletir o domínio real da aplicação.


--------------------------------------------------
13. ÍNDICES
--------------------------------------------------

Criar índices para consultas frequentes.

Possíveis exemplos:

usuarioId

email

data

usuarioId + data

usuarioId + funcionarioId


Não criar índices indiscriminadamente.

Antes de criar um índice, considerar:

- frequência da consulta;
- filtros utilizados;
- cardinalidade;
- tamanho da tabela;
- custo de escrita.


--------------------------------------------------
14. CONSULTAS
--------------------------------------------------

As consultas devem buscar somente os dados necessários quando isso melhorar clareza ou performance.

Evitar:

- consultas sem filtros;
- retorno de grandes quantidades de dados desnecessários;
- consultas duplicadas;
- N+1 queries;
- chamadas repetitivas ao banco.


Quando apropriado, utilizar:

- select;
- include;
- filtros;
- paginação;
- ordenação.


--------------------------------------------------
15. PAGINAÇÃO
--------------------------------------------------

Listagens que podem crescer devem considerar paginação.

Exemplo:

GET /api/entregas?page=1&limit=20


O Repository deve receber os parâmetros necessários para executar a consulta.

Exemplo conceitual:

listar({
    usuarioId,
    pagina,
    limite
});


Evitar carregar todos os registros quando isso não for necessário.


--------------------------------------------------
16. FILTROS
--------------------------------------------------

Filtros devem ser aplicados na consulta quando possível.

Exemplos:

- período;
- funcionário;
- data;
- status;
- tipo;
- valor.


Evitar buscar todos os dados para depois filtrar grandes volumes na aplicação.


--------------------------------------------------
17. ORDENAÇÃO
--------------------------------------------------

Quando houver ordenação dinâmica, validar os campos permitidos.

Nunca permitir que valores arbitrários enviados pelo cliente sejam utilizados diretamente para construir consultas perigosas.


Exemplo:

Ordenações permitidas:

data

valor

criadoEm


Não aceitar qualquer campo arbitrário sem validação.


--------------------------------------------------
18. DATAS
--------------------------------------------------

A aplicação deve possuir uma estratégia consistente para datas.

Definir:

- formato;
- timezone;
- armazenamento;
- serialização;
- comparação;
- filtros;
- relatórios.


Evitar misturar diferentes interpretações de datas dentro do sistema.


--------------------------------------------------
19. VALORES MONETÁRIOS
--------------------------------------------------

Valores financeiros exigem tratamento cuidadoso.

Evitar depender de operações com ponto flutuante sem uma estratégia definida.

Considerar:

- tipo utilizado no banco;
- representação monetária;
- precisão;
- arredondamento;
- conversão;
- consistência dos cálculos.


As regras financeiras devem estar centralizadas no domínio/backend.


--------------------------------------------------
20. PERSISTÊNCIA DE VALORES FINANCEIROS
--------------------------------------------------

Exemplos de dados financeiros:

- receita;
- despesa;
- gasolina;
- participação do carro;
- participação dos funcionários.


A persistência deve armazenar os dados necessários para reproduzir os cálculos.

Não armazenar somente resultados derivados quando eles puderem ser calculados de forma confiável a partir dos dados de origem.


Exemplo:

Receita bruta
+
Despesa de gasolina
+
Configuração de divisão


podem ser utilizados para gerar:

Receita líquida
+
Participação do carro
+
Participação dos funcionários.


--------------------------------------------------
21. REGRAS DE NEGÓCIO
--------------------------------------------------

Repository não deve decidir regras de negócio.

Evitar:

repository.calcularReceitaLiquida()


quando o cálculo pertence ao domínio.


Preferir:

Service
    ↓
Regra de negócio
    ↓
Repository


O Repository apenas fornece os dados necessários.


--------------------------------------------------
22. TRANSAÇÕES
--------------------------------------------------

Utilizar transações quando uma operação possuir múltiplas alterações que precisam ser realizadas de forma atômica.

Exemplo:

Criar Usuario
    +
Criar ProvedorAutenticacao
    +
Criar ConfiguracaoInicial


Se uma etapa falhar e a operação exigir consistência total, todas as alterações devem ser revertidas.


--------------------------------------------------
23. TRANSAÇÕES FINANCEIRAS
--------------------------------------------------

Operações que alteram múltiplos dados financeiros devem considerar transações.

Exemplo:

Registrar operação
    ↓
Atualizar dados relacionados
    ↓
Persistir alterações


O sistema não deve terminar em um estado parcialmente atualizado quando isso quebrar uma regra de consistência.


--------------------------------------------------
24. MIGRATIONS
--------------------------------------------------

Alterações estruturais do banco devem ser realizadas através de migrations.

Fluxo:

Alterar schema Prisma
    ↓
Criar migration
    ↓
Aplicar migration
    ↓
Executar testes
    ↓
Validar aplicação


Não realizar alterações manuais não rastreáveis em produção.


--------------------------------------------------
25. SCHEMA PRISMA
--------------------------------------------------

O schema Prisma deve permanecer organizado e representar o modelo real da aplicação.

Exemplo conceitual:

model Usuario {
    id          String   @id
    nome        String
    email       String   @unique
    senhaHash   String?
    criadoEm    DateTime
    atualizadoEm DateTime
}


O modelo real deve seguir as necessidades atuais do projeto.


--------------------------------------------------
26. SEED
--------------------------------------------------

Seeds podem ser utilizados para:

- desenvolvimento;
- testes;
- demonstração;
- ambientes locais.


Nunca utilizar:

- senhas reais;
- tokens reais;
- Client Secrets;
- dados pessoais reais;
- informações de produção.


--------------------------------------------------
27. EXCLUSÃO
--------------------------------------------------

Antes de excluir um registro:

1. verificar se existe;
2. verificar proprietário;
3. verificar permissões;
4. verificar dependências;
5. verificar regras do domínio;
6. executar exclusão.


Nunca excluir somente com base em um ID enviado pelo cliente.


--------------------------------------------------
28. SOFT DELETE
--------------------------------------------------

Soft delete pode ser utilizado quando houver necessidade de:

- histórico;
- auditoria;
- recuperação;
- preservação de relacionamentos.


Não implementar soft delete automaticamente.

Utilizar somente quando houver uma necessidade real do domínio.


--------------------------------------------------
29. CASCADE
--------------------------------------------------

Relacionamentos com cascade devem ser utilizados com cuidado.

Antes de configurar exclusão em cascata, avaliar:

- impacto nos dados;
- relacionamentos;
- necessidade de histórico;
- risco de exclusão acidental.


Nunca utilizar cascade sem compreender os efeitos.


--------------------------------------------------
30. ERROS DO PRISMA
--------------------------------------------------

Erros do Prisma não devem ser enviados diretamente para o frontend.

Fluxo:

Prisma Error
    ↓
Repository
    ↓
Application Error
    ↓
Error Middleware
    ↓
HTTP Response


Exemplos de situações:

- registro inexistente;
- unique constraint;
- foreign key constraint;
- conexão com banco;
- timeout.


--------------------------------------------------
31. TRATAMENTO DE ERROS
--------------------------------------------------

Transformar erros de infraestrutura em erros compreensíveis para a aplicação.

Exemplo:

Prisma Unique Constraint
    ↓
ConflitoError
    ↓
409 Conflict


Prisma Not Found
    ↓
RecursoNaoEncontradoError
    ↓
404 Not Found


O frontend não deve receber detalhes internos do banco.


--------------------------------------------------
32. PERFORMANCE
--------------------------------------------------

Evitar:

- N+1 queries;
- queries duplicadas;
- joins desnecessários;
- consultas sem filtros;
- retorno excessivo de dados;
- transações muito longas;
- operações repetitivas.


Quando necessário:

- utilizar índices;
- paginação;
- selects específicos;
- includes controlados;
- consultas otimizadas.


--------------------------------------------------
33. CONCORRÊNCIA
--------------------------------------------------

Operações que podem ser executadas simultaneamente devem considerar problemas de concorrência.

Exemplos:

- atualização simultânea;
- alteração de configuração;
- operações financeiras;
- exclusões;
- criação de registros únicos.


Quando necessário, utilizar:

- transações;
- constraints;
- controle de concorrência;
- operações atômicas.


--------------------------------------------------
34. SEGURANÇA
--------------------------------------------------

A camada de persistência deve:

- evitar SQL Injection;
- utilizar Prisma de forma segura;
- validar dados antes da persistência;
- proteger dados sensíveis;
- respeitar isolamento por usuário;
- não expor credenciais;
- não registrar secrets;
- não permitir consultas arbitrárias do cliente.


Nunca construir SQL com concatenação de strings contendo entrada não confiável.


--------------------------------------------------
35. DADOS SENSÍVEIS
--------------------------------------------------

Nunca retornar ou expor desnecessariamente:

- senhaHash;
- tokens;
- refresh tokens;
- Client Secrets;
- credenciais;
- dados internos de autenticação.


Selecionar somente os campos necessários.


--------------------------------------------------
36. AUTENTICAÇÃO E PERSISTÊNCIA
--------------------------------------------------

A persistência de autenticação deve manter consistência entre:

Usuario

e

ProvedorAutenticacao


Exemplo:

Usuario
    ↓
ProvedorAutenticacao
    ├── password
    └── google


A associação deve respeitar constraints e regras de integridade.


--------------------------------------------------
37. TESTABILIDADE
--------------------------------------------------

Services devem poder ser testados sem depender obrigatoriamente do banco real.

Para isso, utilizar:

- interfaces;
- repositories;
- mocks;
- fakes;
- banco de teste;
- testes de integração quando necessário.


Exemplo:

Service
    ↓
Interface Repository
    ↓
Fake Repository


Durante testes unitários.


--------------------------------------------------
38. TESTES DE PERSISTÊNCIA
--------------------------------------------------

Testar quando necessário:

- criação;
- consulta;
- atualização;
- exclusão;
- filtros;
- paginação;
- relacionamentos;
- constraints;
- isolamento por usuário;
- transações;
- erros.


Testes de integração devem validar o comportamento real com o banco quando a operação for crítica.


--------------------------------------------------
39. TESTES DE ISOLAMENTO
--------------------------------------------------

É obrigatório verificar que:

Usuário A

não consegue:

- consultar recursos do Usuário B;
- alterar recursos do Usuário B;
- excluir recursos do Usuário B.


Exemplo:

Usuario A
    ↓
GET entrega do Usuario B
    ↓
Acesso negado / recurso não encontrado


--------------------------------------------------
40. BACKUP E PRODUÇÃO
--------------------------------------------------

O PostgreSQL de produção deve possuir estratégia de:

- backup;
- recuperação;
- monitoramento;
- segurança;
- gerenciamento de credenciais;
- migrations.


Essas responsabilidades devem estar integradas ao processo de infraestrutura e deploy.


--------------------------------------------------
41. DESENVOLVIMENTO LOCAL
--------------------------------------------------

O ambiente local pode utilizar uma estratégia de persistência temporária quando explicitamente definida pelo projeto.

Exemplo atual de desenvolvimento:

.data/deliverycontrol.db.json


Caso essa estratégia seja utilizada temporariamente, ela não deve alterar a arquitetura planejada para produção.

A evolução esperada para produção é:

PostgreSQL
    +
Prisma


--------------------------------------------------
42. EVOLUÇÃO DO BANCO
--------------------------------------------------

Quando o projeto migrar de uma persistência temporária para PostgreSQL:

Dados
    ↓
Schema
    ↓
Migration
    ↓
Repository
    ↓
Testes
    ↓
Validação


A migração não deve alterar as regras de negócio.


--------------------------------------------------
43. RESPONSABILIDADES
--------------------------------------------------

Service:

- executa casos de uso;
- aplica regras;
- controla fluxo.


Repository:

- consulta;
- cria;
- atualiza;
- exclui;
- persiste.


Prisma:

- ORM;
- comunicação com banco.


PostgreSQL:

- armazenamento;
- integridade;
- constraints;
- índices.


--------------------------------------------------
44. O QUE NÃO FAZER
--------------------------------------------------

Não:

- acessar Prisma diretamente no Controller;
- acessar banco diretamente no frontend;
- colocar regras financeiras no Repository;
- confiar no userId enviado pelo frontend;
- retornar senhaHash;
- retornar erros internos do Prisma;
- construir SQL inseguro;
- ignorar migrations;
- criar queries sem necessidade;
- retornar grandes volumes sem paginação;
- criar índices sem justificativa;
- utilizar cascade sem avaliar impacto.


--------------------------------------------------
45. CHECKLIST
--------------------------------------------------

[ ] Prisma está isolado no backend

[ ] PostgreSQL definido para produção

[ ] Repository utilizado

[ ] Interfaces de Repository utilizadas quando necessário

[ ] Service não depende diretamente do Prisma

[ ] userId vem da identidade autenticada

[ ] Consultas respeitam isolamento por usuário

[ ] Relacionamentos definidos

[ ] Foreign Keys utilizadas quando apropriado

[ ] Constraints definidas

[ ] UNIQUE utilizado quando necessário

[ ] Índices avaliados

[ ] Paginação implementada quando necessária

[ ] Filtros aplicados no banco quando apropriado

[ ] Datas possuem estratégia consistente

[ ] Valores monetários possuem estratégia definida

[ ] Regras de negócio não estão no Repository

[ ] Transações utilizadas quando necessárias

[ ] Migrations controladas

[ ] Seeds não possuem dados sensíveis

[ ] Exclusões verificam proprietário e dependências

[ ] Erros do Prisma são tratados

[ ] SQL Injection é evitado

[ ] Dados sensíveis não são expostos

[ ] Testes de persistência implementados quando necessários

[ ] Testes de isolamento implementados

[ ] Estratégia de backup considerada para produção


--------------------------------------------------
REGRA PRINCIPAL
--------------------------------------------------

A camada de persistência é responsável por armazenar e recuperar dados de maneira segura, consistente e eficiente.

Ela NÃO deve decidir regras de negócio.

O fluxo deve permanecer:

Controller
    ↓
Service
    ↓
Repository
    ↓
Prisma
    ↓
PostgreSQL


O Service decide o que precisa ser feito.

O Repository decide como acessar os dados.

O Prisma executa a comunicação com o banco.

O PostgreSQL garante o armazenamento e a integridade dos dados.