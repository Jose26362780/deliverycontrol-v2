SKILL: TESTES UNITÁRIOS COM VITEST — DELIVERYCONTROL

OBJETIVO

Esta skill define como criar, organizar, executar e manter testes unitários no DeliveryControl utilizando Vitest e TypeScript.

O objetivo é garantir que unidades isoladas do sistema funcionem corretamente, especialmente:

- Regras de negócio
- Funções puras
- Services
- Validações
- Cálculos financeiros
- Transformações de dados
- Casos de erro
- Comportamentos críticos

Os testes devem ser rápidos, determinísticos, fáceis de entender e independentes de infraestrutura externa.

==================================================
1. STACK
==================================================

Framework de testes:

Vitest

Linguagem:

TypeScript

Tecnologias relacionadas:

- Node.js
- React
- TypeScript
- Zod
- Express
- Prisma
- Zustand

O Vitest deve ser utilizado como ferramenta principal para testes unitários.

==================================================
2. PRINCÍPIO FUNDAMENTAL
==================================================

Um teste unitário deve testar uma unidade de comportamento de forma isolada.

Uma unidade pode ser:

- Função
- Classe
- Service
- Regra de negócio
- Validador
- Transformação
- Cálculo

Evitar depender de:

- Banco de dados real
- API externa
- Google OAuth
- Serviços externos
- Rede
- Arquivos reais
- Estado global desnecessário

Quando uma dependência externa for necessária, utilizar mocks, stubs ou fakes.

==================================================
3. O QUE DEVE SER TESTADO
==================================================

Priorizar testes para:

1. Regras financeiras
2. Regras de negócio
3. Services
4. Validações
5. Funções utilitárias
6. Transformações
7. Autenticação
8. Autorização
9. Cálculos
10. Casos de erro
11. Casos extremos

Nem todo código precisa da mesma quantidade de testes.

Quanto maior o impacto de uma função no comportamento do sistema, maior deve ser a prioridade de cobertura.

==================================================
4. TESTES FINANCEIROS
==================================================

As regras financeiras do DeliveryControl são críticas.

Devem possuir testes específicos.

Regra padrão:

Carro / Empresa:
50%

Funcionário A:
25%

Funcionário B:
25%

A soma deve ser:

100%

==================================================
5. TESTE DE RECEITA LÍQUIDA
==================================================

Testar:

- Receita sem gasolina
- Receita com gasolina
- Receita igual a zero
- Gasolina igual a zero
- Gasolina maior que receita
- Valores inválidos
- Valores negativos quando não permitidos

Exemplo:

Receita bruta:
1000

Gasolina:
200

Resultado esperado:

800


Outro exemplo:

Receita bruta:
500

Gasolina:
700

Resultado esperado:

0

A receita líquida não deve ficar negativa.

==================================================
6. TESTE DE DIVISÃO FINANCEIRA
==================================================

Testar a configuração padrão:

Receita líquida:
1000

Carro:
500

Funcionário A:
250

Funcionário B:
250

Também testar configurações personalizadas.

Exemplo:

Carro:
60%

Funcionário A:
20%

Funcionário B:
20%

Resultado:

Carro:
600

Funcionário A:
200

Funcionário B:
200

==================================================
7. CASOS INVÁLIDOS
==================================================

Testar configurações como:

Carro:
50%

Funcionário A:
30%

Funcionário B:
30%

Total:

110%

Resultado esperado:

Erro de validação.

Também testar:

- Percentual negativo
- Percentual maior que o permitido
- Valor ausente
- Valor não numérico
- NaN
- Infinity
- Soma inferior a 100%

==================================================
8. ESTRUTURA DE UM TESTE
==================================================

Preferir a estrutura:

Arrange
Act
Assert

Arrange:

Preparar os dados.

Act:

Executar a função ou comportamento.

Assert:

Verificar o resultado.

Exemplo conceitual:

describe('calcularReceitaLiquida', () => {
  it('deve descontar a gasolina da receita bruta', () => {
    const receitaBruta = 1000
    const gasolina = 200

    const resultado = calcularReceitaLiquida(
      receitaBruta,
      gasolina
    )

    expect(resultado).toBe(800)
  })
})

==================================================
9. DESCRIBE
==================================================

Utilizar describe para agrupar testes relacionados.

Exemplo:

describe('calcularReceitaLiquida', () => {

  it('deve calcular a receita sem gasolina', () => {
  })

  it('deve descontar a gasolina', () => {
  })

  it('não deve permitir resultado negativo', () => {
  })

})

Os nomes devem explicar o comportamento esperado.

==================================================
10. IT / TEST
==================================================

Utilizar:

it()

ou:

test()

Preferir manter um padrão consistente no projeto.

Exemplo:

it('deve retornar zero quando a gasolina for maior que a receita', () => {
})

Evitar nomes genéricos:

it('teste 1')

it('funciona')

it('deve funcionar')

==================================================
11. EXPECT
==================================================

Utilizar expect para validar resultados.

Exemplos:

expect(resultado).toBe(100)

expect(resultado).toEqual(objetoEsperado)

expect(resultado).toBeTruthy()

expect(resultado).toBeFalsy()

expect(resultado).toBeNull()

expect(resultado).toBeUndefined()

expect(() => executar()).toThrow()

==================================================
12. TESTAR COMPORTAMENTO
==================================================

Os testes devem verificar comportamento e não detalhes internos desnecessários.

Evitar testar:

- Implementação privada
- Ordem interna irrelevante
- Variáveis locais
- Detalhes que podem mudar sem alterar o comportamento

Preferir:

Entrada
↓
Comportamento
↓
Resultado

==================================================
13. FUNÇÕES PURAS
==================================================

Funções puras são excelentes candidatas para testes unitários.

Exemplo:

calcularReceitaLiquida()

calcularDivisaoReceita()

validarPercentuais()

formatarMoeda()

calcularTotalDespesas()

Essas funções devem possuir poucos efeitos colaterais.

Isso facilita:

- Testes
- Manutenção
- Reutilização
- Debug
- Previsibilidade

==================================================
14. TESTANDO SERVICES
==================================================

Services podem possuir dependências.

Exemplo:

DeliveryService

pode depender de:

DeliveryRepository

Para testes unitários, o repository deve ser substituído por um mock ou fake.

Fluxo:

Service
↓
Mock Repository

Não:

Service
↓
Prisma
↓
PostgreSQL

Esse segundo cenário caracteriza mais adequadamente um teste de integração.

==================================================
15. MOCKS
==================================================

Utilizar mocks quando uma dependência externa precisar ser controlada.

Exemplo conceitual:

const repository = {
  buscarPorId: vi.fn(),
}

O mock deve representar apenas o comportamento necessário para o teste.

Evitar mocks excessivamente complexos.

==================================================
16. VI.FN
==================================================

Utilizar:

vi.fn()

para criar funções mockadas.

Exemplo:

const repository = {
  salvar: vi.fn(),
}

Depois:

expect(repository.salvar).toHaveBeenCalled()

Também é possível verificar argumentos:

expect(repository.salvar).toHaveBeenCalledWith(dados)

==================================================
17. VI.MOCK
==================================================

Utilizar:

vi.mock()

quando for necessário substituir um módulo.

Exemplo conceitual:

vi.mock('../servicos/email')

O mock deve ser utilizado apenas quando realmente necessário.

Preferir injeção de dependência quando isso deixar o código mais simples e testável.

==================================================
18. MOCK VS FAKE
==================================================

Mock:

Objeto controlado pelo teste, geralmente com funções simuladas.

Fake:

Implementação simplificada de uma dependência.

Exemplo:

Repository real:

PostgreSQL

Fake:

Repository em memória

Para testes unitários simples, mocks costumam ser suficientes.

Para fluxos mais complexos, um fake pode deixar o teste mais próximo do comportamento real.

==================================================
19. ISOLAMENTO
==================================================

Cada teste deve ser independente.

Um teste não deve depender da execução de outro.

Evitar:

- Variáveis globais mutáveis
- Estado compartilhado
- Banco compartilhado
- Dados modificados por testes anteriores

Cada teste deve preparar seus próprios dados.

==================================================
20. BEFORE EACH
==================================================

Utilizar beforeEach quando houver uma preparação comum.

Exemplo:

beforeEach(() => {
  repository = {
    buscar: vi.fn(),
    salvar: vi.fn(),
  }
})

Evitar colocar lógica excessiva dentro de beforeEach.

O teste deve continuar fácil de entender.

==================================================
21. AFTER EACH
==================================================

Limpar mocks quando necessário.

Exemplo:

afterEach(() => {
  vi.clearAllMocks()
})

Ou utilizar configuração global adequada para limpeza automática.

==================================================
22. TESTES DE ERRO
==================================================

Não testar apenas o caminho feliz.

Também testar:

- Dados inválidos
- Recurso inexistente
- Usuário não autorizado
- Repository retornando erro
- Regra de negócio violada
- Estado inválido
- Dependência indisponível

Exemplo:

it('deve lançar erro quando o funcionário não existir', async () => {
})

==================================================
23. TESTES ASSÍNCRONOS
==================================================

Para funções assíncronas:

Utilizar:

async / await

Exemplo:

it('deve buscar o funcionário', async () => {
  const resultado = await service.buscarFuncionario('1')

  expect(resultado).toEqual(...)
})

Evitar testes dependentes de:

- setTimeout desnecessário
- delays artificiais
- rede real

==================================================
24. REJEIÇÕES
==================================================

Para promises rejeitadas:

expect(
  service.executar()
).rejects.toThrow()

Exemplo:

await expect(
  service.criar(dadosInvalidos)
).rejects.toThrow()

O teste deve verificar o comportamento esperado do erro.

==================================================
25. TESTES DE VALIDAÇÃO COM ZOD
==================================================

Schemas Zod devem possuir testes quando forem importantes para regras do sistema.

Testar:

- Dados válidos
- Campos obrigatórios
- Tipos inválidos
- Valores mínimos
- Valores máximos
- Strings vazias
- Valores negativos
- Formatos inválidos

Exemplo conceitual:

const resultado = schema.safeParse(dados)

expect(resultado.success).toBe(true)

ou:

expect(resultado.success).toBe(false)

==================================================
26. TESTES DE AUTENTICAÇÃO
==================================================

Testar principalmente:

- Senha correta
- Senha incorreta
- Usuário inexistente
- Credenciais inválidas
- Hash de senha
- Token válido
- Token inválido
- Token expirado
- Usuário autenticado
- Usuário não autenticado

Para Google OAuth/OIDC:

- Identidade válida
- Identidade inválida
- Provider correto
- Provider user ID
- Email válido quando aplicável
- Tentativa de associação indevida

Não realizar chamadas reais ao Google durante testes unitários.

==================================================
27. TESTES DE AUTORIZAÇÃO
==================================================

Testar:

Usuário A:

pode acessar seus próprios dados.

Usuário A:

não pode acessar dados do usuário B.

Testar explicitamente cenários de IDOR.

Exemplo:

Usuário autenticado:
10

Registro:
20

Se o registro pertence ao usuário 20:

Resultado esperado:

acesso negado ou recurso não encontrado, conforme contrato da API.

==================================================
28. TESTES DE ISOLAMENTO
==================================================

Os testes devem garantir que Services e regras que trabalham com dados do usuário utilizem corretamente o userId autenticado.

Nunca aceitar o userId enviado pelo cliente como fonte de autoridade.

Testar:

- userId correto
- userId diferente
- recurso de outro usuário
- recurso inexistente

==================================================
29. TESTES DE REPOSITORY
==================================================

Testes de Repository normalmente são mais adequados como testes de integração quando utilizam Prisma e PostgreSQL.

Nos testes unitários:

Mockar o Repository quando ele for dependência de um Service.

Não transformar todos os testes em testes de banco.

Separar claramente:

Testes unitários:

Service + mock

Testes de integração:

Service + Repository + banco de teste

==================================================
30. FRONTEND
==================================================

Componentes React críticos também podem possuir testes unitários ou de componente.

Priorizar:

- Formulários
- Validações
- Componentes com lógica
- Estados importantes
- Comportamentos críticos
- Renderização condicional

Evitar testar detalhes visuais excessivamente específicos.

Exemplo:

Não focar apenas em:

"possui determinada classe CSS"

Preferir:

"deve exibir mensagem de erro quando o formulário for inválido"

==================================================
31. ZUSTAND
==================================================

Stores Zustand que possuem lógica relevante podem ser testadas.

Testar:

- Estado inicial
- Atualização de estado
- Ações
- Reset
- Regras associadas ao estado

Evitar depender de estado compartilhado entre testes.

==================================================
32. TESTES DE CASOS EXTREMOS
==================================================

Sempre considerar:

- Zero
- Um
- Valores máximos
- Valores mínimos
- Lista vazia
- Lista com um item
- Lista com vários itens
- Dados ausentes
- Dados inválidos
- Valores negativos
- Strings vazias
- Objetos incompletos
- Erros de dependências

Casos extremos frequentemente revelam bugs que o caminho feliz não encontra.

==================================================
33. PARAMETRIZAÇÃO
==================================================

Quando vários testes possuem a mesma estrutura, considerar testes parametrizados.

Exemplo conceitual:

it.each([
  [1000, 200, 800],
  [1000, 0, 1000],
  [500, 700, 0],
])(
  'deve calcular receita líquida corretamente',
  (receita, gasolina, esperado) => {
    expect(
      calcularReceitaLiquida(receita, gasolina)
    ).toBe(esperado)
  }
)

Isso evita duplicação e facilita adicionar novos cenários.

==================================================
34. COBERTURA
==================================================

Utilizar cobertura de testes para identificar partes do código que não estão sendo exercitadas.

Analisar:

- Statements
- Branches
- Functions
- Lines

Cobertura alta não significa automaticamente código bem testado.

Um teste ruim pode aumentar cobertura sem verificar comportamento relevante.

Priorizar qualidade dos cenários.

==================================================
35. TESTES E REGRAS CRÍTICAS
==================================================

Toda alteração em uma regra crítica deve atualizar os testes correspondentes.

Exemplo:

Alteração:

regra de divisão financeira

Ações:

[ ] Atualizar implementação
[ ] Atualizar testes unitários
[ ] Adicionar casos novos
[ ] Executar testes
[ ] Verificar regressões
[ ] Atualizar documentação quando necessário

==================================================
36. ORGANIZAÇÃO DOS ARQUIVOS
==================================================

Os testes devem ficar próximos do código quando isso facilitar a manutenção.

Exemplo:

backend/
├── modules/
│   └── financeiro/
│       ├── financeiro.service.ts
│       ├── financeiro.service.test.ts
│       └── financeiro.regras.ts

Ou utilizar uma estrutura centralizada:

tests/
├── unitarios/
│   ├── financeiro/
│   ├── autenticacao/
│   └── funcionarios/

Escolher uma abordagem consistente com a arquitetura existente.

==================================================
37. NOMENCLATURA
==================================================

Preferir nomes claros.

Exemplos:

financeiro.service.test.ts

calcular-receita.test.ts

autenticacao.service.test.ts

validar-divisao.test.ts

Evitar:

teste.ts

teste-final.ts

teste2.ts

novo-teste.ts

==================================================
38. CONFIGURAÇÃO DO VITEST
==================================================

A configuração deve ser centralizada.

Exemplo conceitual:

vitest.config.ts

Configurar quando necessário:

- Ambiente
- Globals
- Coverage
- Setup
- Aliases
- Test patterns

Manter a configuração simples.

==================================================
39. SCRIPTS
==================================================

O projeto deve possuir comandos claros para:

Executar testes:

npm test

Executar testes em modo watch:

npm run test:watch

Executar cobertura:

npm run test:coverage

Executar testes uma única vez:

vitest run

Os scripts reais devem seguir o package.json atual do projeto.

Não documentar comandos que não existam.

==================================================
40. TESTES DETERMINÍSTICOS
==================================================

Um teste determinístico deve produzir o mesmo resultado quando executado nas mesmas condições.

Evitar depender de:

- Hora atual
- Data atual
- Random
- Rede
- Banco externo
- Serviços externos

Quando necessário, controlar tempo e aleatoriedade utilizando ferramentas do Vitest.

==================================================
41. DATAS
==================================================

Quando regras dependem de datas:

- Controlar a data utilizada pelo teste
- Evitar depender da data real
- Testar limites de período
- Testar início e fim de intervalos

Exemplo:

Período:

01/09/2026 até 07/09/2026

Testar registros:

- Antes
- No início
- No meio
- No final
- Depois

==================================================
42. TESTES DE REGRESSÃO
==================================================

Quando um bug for corrigido:

1. Reproduzir o comportamento em um teste
2. Confirmar que o teste falha antes da correção quando possível
3. Corrigir o código
4. Confirmar que o teste passa
5. Executar a suíte relacionada

O teste deve impedir que o mesmo bug volte a acontecer.

==================================================
43. O QUE NÃO FAZER
==================================================

Não:

- Fazer requisições HTTP reais em testes unitários
- Conectar ao PostgreSQL em todos os testes
- Depender de serviços externos
- Usar dados aleatórios sem controle
- Compartilhar estado entre testes
- Ignorar erros
- Testar somente o caminho feliz
- Criar mocks desnecessários
- Testar detalhes internos irrelevantes
- Escrever testes frágeis
- Ignorar testes quebrados
- Remover testes apenas para fazer o build passar

==================================================
44. FLUXO PARA CRIAR UM TESTE
==================================================

Ao implementar uma nova unidade:

1. Identificar o comportamento
2. Identificar entradas
3. Identificar saída
4. Identificar erros
5. Identificar casos extremos
6. Identificar dependências
7. Isolar dependências
8. Criar teste do caminho feliz
9. Criar testes de erro
10. Criar testes de casos extremos
11. Executar testes
12. Analisar cobertura quando necessário
13. Refatorar se necessário

==================================================
45. FLUXO PARA CORRIGIR UM BUG
==================================================

Bug encontrado:

↓

Criar teste reproduzindo o bug

↓

Executar teste

↓

Corrigir implementação

↓

Executar teste novamente

↓

Executar testes relacionados

↓

Executar suíte completa

↓

Confirmar ausência de regressão

==================================================
46. CRITÉRIOS DE QUALIDADE
==================================================

Um teste de qualidade deve ser:

- Claro
- Pequeno
- Determinístico
- Independente
- Repetível
- Rápido
- Focado em comportamento
- Fácil de manter

Um teste deve explicar o comportamento esperado do sistema.

==================================================
47. CHECKLIST
==================================================

Antes de finalizar uma implementação:

[ ] Existe teste para o comportamento principal
[ ] Existe teste para casos inválidos
[ ] Existe teste para erros relevantes
[ ] Casos extremos foram considerados
[ ] Dependências externas foram isoladas
[ ] Banco real não é utilizado desnecessariamente
[ ] Testes são independentes
[ ] Testes são determinísticos
[ ] Nomes dos testes são claros
[ ] Mocks são utilizados somente quando necessários
[ ] Regras financeiras possuem cobertura adequada
[ ] Regras de autorização possuem cobertura adequada
[ ] Isolamento por usuário foi testado
[ ] Testes de regressão foram criados para bugs
[ ] Testes existentes continuam passando
[ ] Cobertura foi analisada quando necessário

==================================================
48. RESPONSABILIDADE DO AGENTE DE TESTES
==================================================

O agente de testes deve:

- Identificar comportamentos críticos
- Criar testes unitários
- Utilizar Vitest
- Isolar dependências
- Testar regras de negócio
- Testar cálculos financeiros
- Testar validações
- Testar erros
- Testar casos extremos
- Criar testes de regressão
- Identificar testes frágeis
- Melhorar cobertura quando necessário
- Executar a suíte de testes
- Reportar falhas claramente

O agente não deve:

- Alterar regras de negócio apenas para fazer testes passarem
- Remover testes que falham sem investigar
- Criar mocks para esconder bugs
- Considerar cobertura como única métrica de qualidade
- Transformar testes unitários em testes de integração sem necessidade
- Ignorar problemas de segurança ou isolamento encontrados durante os testes

==================================================
49. REGRA PRINCIPAL
==================================================

Testes unitários devem proteger o comportamento do DeliveryControl.

Regras de negócio críticas devem ser testadas de forma isolada, determinística e repetível.

Vitest deve ser utilizado para validar funções, Services, regras, validações e comportamentos críticos sem depender desnecessariamente de infraestrutura externa.

Um teste não existe apenas para aumentar cobertura.

Ele existe para garantir que o sistema continue funcionando corretamente quando o código evoluir.