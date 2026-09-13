SKILL: REGRAS DE NEGÓCIO — DELIVERYCONTROL

OBJETIVO

Esta skill define como identificar, implementar, centralizar, validar e testar as regras de negócio do DeliveryControl.

As regras de negócio representam o comportamento real da aplicação e devem permanecer independentes de:

- Controllers
- Routes
- Express
- React
- Componentes de interface
- Prisma
- PostgreSQL
- Detalhes de infraestrutura

O objetivo é garantir que as regras importantes do sistema sejam executadas de forma consistente, previsível, testável e segura.

PRINCÍPIO CENTRAL

A regra de negócio deve existir em um único lugar sempre que possível.

Nunca duplicar uma regra importante entre:

- Frontend
- Backend
- Controller
- Service
- Repository
- Componentes React
- Queries SQL
- Hooks

O frontend pode calcular ou apresentar informações para melhorar a experiência do usuário, mas o backend deve ser sempre a fonte de verdade.

==================================================
1. ARQUITETURA
==================================================

A execução das regras deve seguir preferencialmente:

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
Regra de Negócio
↓
Repository
↓
Database

O Service coordena o caso de uso.

A regra de negócio determina o comportamento da aplicação.

O Repository apenas fornece acesso aos dados necessários.

O Controller não deve implementar regras de negócio.

==================================================
2. RESPONSABILIDADES
==================================================

CONTROLLER / HANDLER

Responsável por:

- Receber a requisição
- Extrair parâmetros
- Receber body
- Acionar validação
- Obter usuário autenticado
- Chamar o Service
- Retornar resposta HTTP

Não deve:

- Calcular divisão financeira
- Determinar regras de pagamento
- Implementar regras de autorização
- Manipular diretamente o banco
- Conter lógica complexa de negócio

SERVICE

Responsável por:

- Coordenar casos de uso
- Buscar informações necessárias
- Aplicar regras de negócio
- Validar condições do domínio
- Chamar repositories
- Garantir consistência da operação
- Executar transações quando necessário

REPOSITORY

Responsável por:

- Consultar dados
- Criar registros
- Atualizar registros
- Excluir registros
- Executar operações de persistência

Não deve:

- Decidir regras financeiras
- Decidir permissões de negócio
- Calcular distribuição de receita
- Implementar regras de domínio

==================================================
3. REGRA FINANCEIRA PRINCIPAL
==================================================

O DeliveryControl possui uma regra padrão para divisão da receita líquida:

50% → Carro / Empresa
25% → Funcionário A
25% → Funcionário B

A soma deve sempre resultar em:

100%

A configuração pode futuramente ser alterada pelo usuário, desde que:

- Os percentuais sejam válidos
- A soma dos percentuais seja exatamente 100%
- Os valores sejam armazenados corretamente
- O backend valide a configuração
- O cálculo utilize a configuração vigente

==================================================
4. RECEITA BRUTA
==================================================

Receita bruta representa o valor total recebido pelas entregas antes da dedução das despesas de gasolina.

Exemplo:

Receita das entregas:
R$ 1.000,00

Receita bruta:

R$ 1.000,00

==================================================
5. DESPESAS DE GASOLINA
==================================================

As despesas de gasolina devem ser registradas separadamente.

Gasolina não deve ser misturada diretamente ao valor bruto das entregas.

Exemplo:

Receita bruta:
R$ 1.000,00

Gasolina:
R$ 100,00

Receita líquida:
R$ 900,00

A gasolina deve continuar existindo como registro próprio para:

- Histórico
- Relatórios
- Filtros
- Auditoria
- Indicadores
- Análise financeira

==================================================
6. RECEITA LÍQUIDA
==================================================

A fórmula principal é:

Receita líquida =
Receita bruta - Despesas de gasolina

O resultado não deve ser negativo.

Portanto:

Receita líquida =
MAX(0, Receita bruta - Despesas de gasolina)

Exemplo:

Receita bruta:
R$ 1.000,00

Gasolina:
R$ 200,00

Receita líquida:
R$ 800,00

Outro exemplo:

Receita bruta:
R$ 500,00

Gasolina:
R$ 700,00

Resultado matemático:
- R$ 200,00

Resultado do sistema:
R$ 0,00

A aplicação deve registrar a despesa normalmente, mas a receita líquida utilizada para distribuição não deve ficar negativa.

==================================================
7. DIVISÃO DA RECEITA LÍQUIDA
==================================================

Depois de calcular a receita líquida, o valor deve ser distribuído de acordo com os percentuais configurados.

Configuração padrão:

Carro / Empresa:
50%

Funcionário A:
25%

Funcionário B:
25%

Exemplo:

Receita bruta:
R$ 2.000,00

Gasolina:
R$ 400,00

Receita líquida:
R$ 1.600,00

Divisão:

Carro / Empresa:
R$ 800,00

Funcionário A:
R$ 400,00

Funcionário B:
R$ 400,00

Total:
R$ 1.600,00

==================================================
8. FUNCIONÁRIOS
==================================================

O sistema deve considerar os funcionários que efetivamente participaram do turno ou operação correspondente.

Antes de realizar uma divisão que dependa de funcionários, o backend deve verificar:

- Funcionário existente
- Funcionário pertencente ao usuário autenticado
- Funcionário ativo quando aplicável
- Funcionário associado corretamente ao turno
- Quantidade de funcionários necessária para a operação

Nunca confiar apenas no frontend para determinar quais funcionários podem participar.

==================================================
9. TURNOS / ENTREGAS
==================================================

Um turno pode possuir:

- Data
- Funcionários envolvidos
- Entregas
- Receita
- Despesas relacionadas

As regras devem garantir que:

- Os funcionários existam
- Os registros pertençam ao usuário autenticado
- Os valores sejam válidos
- As datas sejam válidas
- As relações entre os registros sejam consistentes

==================================================
10. VALIDAÇÃO DE VALORES FINANCEIROS
==================================================

Valores financeiros nunca devem aceitar:

- NaN
- Infinity
- Valores não numéricos
- Valores negativos quando não permitidos
- Valores indefinidos
- Valores nulos quando obrigatórios

Sempre validar os valores no backend.

Exemplo conceitual:

valor >= 0

Para valores monetários, evitar operações que possam gerar problemas de precisão de ponto flutuante.

Quando apropriado, utilizar valores inteiros representando centavos ou mecanismo equivalente.

Exemplo:

R$ 10,50

pode ser armazenado como:

1050 centavos

==================================================
11. PERCENTUAIS
==================================================

Percentuais devem obedecer às seguintes regras:

- Devem ser numéricos
- Não podem ser negativos
- Devem possuir limite máximo coerente
- A soma da configuração deve ser 100%

Exemplo válido:

Carro: 50
Funcionário A: 25
Funcionário B: 25

Total:
100

Exemplo inválido:

Carro: 50
Funcionário A: 30
Funcionário B: 30

Total:
110

O backend deve rejeitar a configuração inválida.

==================================================
12. ALTERAÇÃO DA CONFIGURAÇÃO FINANCEIRA
==================================================

A configuração de divisão deve ser tratada como uma configuração de negócio.

Ao atualizar:

1. Validar os valores
2. Validar a soma
3. Validar o usuário autenticado
4. Persistir a configuração
5. Utilizar a nova configuração somente após confirmação da operação

Não permitir que o frontend altere diretamente o resultado financeiro.

==================================================
13. HISTÓRICO E CONSISTÊNCIA
==================================================

Quando uma regra financeira depender de dados históricos, deve-se considerar cuidadosamente se a alteração de uma configuração deve afetar:

- Apenas novos registros
- Registros existentes
- Relatórios históricos
- Cálculos já realizados

Por padrão, evitar alterar resultados históricos de maneira inesperada.

Quando necessário, armazenar a configuração ou os valores calculados utilizados no momento da operação.

==================================================
14. AUTENTICAÇÃO E ISOLAMENTO
==================================================

Toda regra de negócio que trabalha com dados do usuário deve utilizar a identidade autenticada.

O userId deve ser obtido do contexto de autenticação.

Nunca confiar em:

- userId enviado pelo frontend
- userId presente em query string
- userId enviado no body
- IDs manipulados pelo cliente

Exemplo:

A requisição pode enviar:

GET /api/entregas/123

O backend deve verificar se a entrega 123 pertence ao usuário autenticado.

==================================================
15. PREVENÇÃO DE IDOR
==================================================

IDOR significa permitir que um usuário acesse ou altere um recurso pertencente a outro usuário simplesmente alterando seu ID.

Toda regra de negócio que acessa um recurso deve verificar sua propriedade.

Exemplo:

Usuário autenticado:
userId = 10

Entrega:
id = 50
userId = 20

O usuário 10 não pode acessar ou alterar a entrega 50.

Essa validação deve acontecer no backend.

==================================================
16. REGRAS DE EXCLUSÃO
==================================================

Antes de excluir um registro, verificar suas dependências.

Exemplo:

Não excluir automaticamente um funcionário se isso causar inconsistência em:

- Turnos
- Entregas
- Relatórios
- Histórico financeiro

Quando necessário, utilizar:

- Soft delete
- Status ativo/inativo
- Regras de integridade
- Exclusão em cascata controlada

A estratégia deve ser definida de acordo com o domínio.

==================================================
17. REGRAS DE ATUALIZAÇÃO
==================================================

Atualizações devem preservar invariantes do sistema.

Exemplo:

Uma atualização não pode resultar em:

- Percentuais inválidos
- Receita negativa
- Funcionário inexistente
- Relação com usuário incorreta
- Dados financeiros inconsistentes

Nunca assumir que um registro continua válido apenas porque ele foi válido anteriormente.

Revalidar os dados necessários durante operações críticas.

==================================================
18. TRANSAÇÕES
==================================================

Utilizar transações quando uma operação alterar múltiplos registros e todos precisarem ser consistentes.

Exemplo:

Criar um turno pode envolver:

- Criar turno
- Associar funcionários
- Registrar entregas
- Registrar despesas

Se uma etapa crítica falhar, a operação deve ser revertida quando necessário.

A transação deve garantir atomicidade.

==================================================
19. REGRAS DE RELATÓRIOS
==================================================

Relatórios devem utilizar os mesmos cálculos definidos pelas regras de negócio.

Não criar uma fórmula diferente apenas para uma página ou relatório.

Exemplo:

Dashboard:
Receita líquida = Receita bruta - Gasolina

Relatório:
Receita líquida = Receita bruta - Gasolina

PDF:
Receita líquida = Receita bruta - Gasolina

Todos devem utilizar a mesma regra central.

==================================================
20. FILTROS E PERÍODOS
==================================================

Filtros financeiros devem considerar corretamente:

- Data inicial
- Data final
- Turnos
- Entregas
- Funcionários
- Despesas
- Receita

As regras de inclusão/exclusão das datas devem ser consistentes.

Exemplo:

Período:

01/09/2026 até 07/09/2026

O relatório deve incluir corretamente todos os registros pertencentes ao período definido.

==================================================
21. REGRAS DE ESTADO
==================================================

Entidades podem possuir estados.

Exemplo:

Funcionário:

- Ativo
- Inativo

Uma regra de negócio deve definir quando cada estado pode ser utilizado.

Exemplo:

Funcionário inativo não deve ser selecionado para novos turnos.

Entretanto, registros históricos associados ao funcionário devem continuar preservados quando necessário.

==================================================
22. ERROS DE NEGÓCIO
==================================================

Erros causados por regras de negócio devem ser diferentes de erros inesperados do sistema.

Exemplos:

- Percentuais não somam 100%
- Funcionário não pertence ao usuário
- Funcionário inativo
- Turno inexistente
- Recurso não pertence ao usuário
- Valor financeiro inválido
- Operação não permitida

Esses erros devem gerar mensagens claras e códigos/status HTTP apropriados.

Nunca expor detalhes internos do banco ou stack trace para o cliente.

==================================================
23. FRONTEND E REGRAS DE NEGÓCIO
==================================================

O frontend pode:

- Exibir cálculos
- Pré-validar campos
- Mostrar mensagens
- Desabilitar ações impossíveis
- Atualizar indicadores
- Melhorar experiência do usuário

Porém:

O frontend NÃO é a fonte de verdade.

Toda regra crítica deve ser validada novamente no backend.

Exemplo:

Frontend:

"Percentuais somam 100%"

Backend:

deve verificar novamente.

==================================================
24. DUPLICAÇÃO DE REGRAS
==================================================

Evitar:

Frontend:

calcularA()

Backend:

calcularB()

Relatório:

calcularC()

Se todos deveriam representar a mesma regra, deve existir uma definição central.

Sempre que possível, criar funções ou serviços reutilizáveis.

Exemplo conceitual:

calcularReceitaLiquida()

calcularDivisaoReceita()

validarConfiguracaoDivisao()

==================================================
25. FUNÇÕES PURAS
==================================================

Quando possível, regras matemáticas e transformações de domínio devem ser implementadas como funções puras.

Exemplo conceitual:

calcularReceitaLiquida(receitaBruta, gasolina)

Entrada:
receitaBruta
gasolina

Saída:
receitaLiquida

A função não deve:

- Fazer requisição HTTP
- Acessar banco
- Alterar estado global
- Depender de Express
- Depender de React

Isso facilita os testes unitários.

==================================================
26. TESTES DAS REGRAS DE NEGÓCIO
==================================================

Toda regra crítica deve possuir testes.

Testar principalmente:

1. Receita sem gasolina
2. Receita com gasolina
3. Gasolina maior que receita
4. Receita igual a zero
5. Receita negativa
6. Gasolina negativa
7. Percentuais válidos
8. Percentuais inválidos
9. Soma diferente de 100%
10. Configuração 50/25/25
11. Configuração personalizada válida
12. Funcionário inexistente
13. Funcionário pertencente a outro usuário
14. Funcionário inativo
15. Entrega pertencente a outro usuário
16. Turno inexistente
17. Dados financeiros inválidos
18. Operações envolvendo múltiplos registros
19. Falha durante transação
20. Relatórios utilizando os mesmos cálculos

==================================================
27. EXEMPLOS DE TESTES FINANCEIROS
==================================================

CASO 1

Receita:
R$ 1.000,00

Gasolina:
R$ 0,00

Resultado:

Receita líquida:
R$ 1.000,00

Carro:
R$ 500,00

Funcionário A:
R$ 250,00

Funcionário B:
R$ 250,00


CASO 2

Receita:
R$ 1.000,00

Gasolina:
R$ 200,00

Resultado:

Receita líquida:
R$ 800,00

Carro:
R$ 400,00

Funcionário A:
R$ 200,00

Funcionário B:
R$ 200,00


CASO 3

Receita:
R$ 500,00

Gasolina:
R$ 700,00

Resultado:

Receita líquida:
R$ 0,00

Nenhuma distribuição negativa deve ser criada.


CASO 4

Receita:
R$ 0,00

Gasolina:
R$ 0,00

Resultado:

Receita líquida:
R$ 0,00


CASO 5

Configuração:

Carro:
60%

Funcionário A:
20%

Funcionário B:
20%

Total:
100%

Configuração válida.


CASO 6

Configuração:

Carro:
50%

Funcionário A:
30%

Funcionário B:
30%

Total:
110%

Configuração inválida.

==================================================
28. ALTERAÇÃO DE REGRAS
==================================================

Antes de alterar uma regra de negócio:

1. Identificar onde ela é utilizada
2. Verificar impacto no frontend
3. Verificar impacto no backend
4. Verificar impacto nos relatórios
5. Verificar impacto nos testes
6. Verificar impacto na persistência
7. Atualizar documentação
8. Atualizar os testes
9. Executar os testes
10. Solicitar revisão quando necessário

Não alterar uma regra central apenas em uma tela.

==================================================
29. NOVA REGRA DE NEGÓCIO
==================================================

Ao implementar uma nova regra:

1. Descrever claramente a regra
2. Identificar entradas
3. Identificar saídas
4. Identificar condições
5. Identificar exceções
6. Definir validações
7. Definir onde a regra ficará
8. Implementar no backend
9. Criar testes
10. Integrar com os Services
11. Atualizar frontend quando necessário
12. Atualizar documentação

==================================================
30. CHECKLIST DE IMPLEMENTAÇÃO
==================================================

Antes de considerar uma regra pronta:

[ ] A regra está claramente definida
[ ] Existe uma única fonte de verdade
[ ] A regra está no backend
[ ] O Controller não contém lógica de negócio
[ ] O Repository não contém lógica de negócio
[ ] O frontend não é considerado fonte de verdade
[ ] Os inputs são validados
[ ] O usuário autenticado é utilizado
[ ] O isolamento por userId foi verificado
[ ] IDOR foi considerado
[ ] Erros de negócio foram tratados
[ ] Valores financeiros foram validados
[ ] Transações foram consideradas
[ ] Casos extremos foram considerados
[ ] Testes unitários foram criados
[ ] Testes de integração foram considerados
[ ] Relatórios utilizam a mesma regra
[ ] Documentação foi atualizada quando necessário

==================================================
31. RESPONSABILIDADE DO AGENTE
==================================================

O agente responsável pelas regras de negócio deve:

- Identificar regras existentes
- Identificar regras duplicadas
- Centralizar regras importantes
- Implementar regras no backend
- Manter Services organizados
- Garantir consistência dos cálculos
- Validar invariantes
- Criar testes
- Identificar casos extremos
- Verificar impactos em outras partes do sistema
- Evitar lógica de negócio espalhada
- Garantir que o frontend não seja a fonte de verdade

O agente NÃO deve:

- Colocar regras importantes em componentes React
- Colocar regras complexas em Routes
- Colocar regras de negócio em Controllers
- Colocar regras de domínio em Repositories
- Confiar somente em validações do frontend
- Duplicar cálculos financeiros
- Alterar comportamento sem atualizar testes

==================================================
32. REGRA PRINCIPAL
==================================================

O DeliveryControl deve possuir uma única fonte de verdade para suas regras de negócio.

O Service coordena.

A regra de negócio decide.

O Repository persiste.

O Controller comunica.

O frontend apresenta.

O banco garante integridade dos dados.

Nenhuma camada deve assumir a responsabilidade de outra.

As regras financeiras, de autorização, validação, distribuição de receita e consistência dos dados devem ser executadas de maneira centralizada, testável e previsível no backend.