# Rule: Documentação

## Objetivo

Estabelecer regras e padrões para criação, atualização e manutenção
da documentação do projeto.

Toda documentação deve ser clara, objetiva, técnica e,
principalmente, consistente com o código real da aplicação.

A documentação é parte do projeto e deve evoluir junto com o código.

---

# Princípios fundamentais

Toda documentação deve seguir os seguintes princípios:

1. Documentar o comportamento real do sistema.
2. Nunca inventar informações.
3. Evitar informações duplicadas desnecessariamente.
4. Manter a documentação atualizada.
5. Utilizar linguagem clara e objetiva.
6. Priorizar informações úteis para desenvolvedores.
7. Explicar decisões técnicas relevantes.
8. Documentar regras de negócio importantes.
9. Não documentar detalhes irrelevantes.
10. Preferir exemplos reais do projeto.
11. Não expor informações sensíveis.
12. Manter consistência entre README e documentação técnica.

---

# Fonte da verdade

O código é a principal fonte da verdade.

Antes de documentar qualquer informação técnica,
o agente deve verificar o código e os arquivos relacionados.

Priorizar a análise de:

```text
package.json
tsconfig.json
vite.config.*
estrutura de diretórios
rotas
services
components
features
stores
schemas
middlewares
banco de dados
testes
variáveis de ambiente
scripts
```

Quando houver conflito entre documentação e código:

```text
Código
  ↓
Identificar comportamento atual
  ↓
Corrigir documentação
```

Não alterar o código somente para fazer a documentação
corresponder a uma informação desatualizada,
a menos que essa seja explicitamente a tarefa.

---

# Tipos de documentação

O projeto deve diferenciar os principais tipos de documentação.

## README

Responsável por apresentar o projeto.

Deve responder:

```text
O que é?
Por que foi criado?
Quais tecnologias utiliza?
O que faz?
Como executar?
Como está organizado?
```

---

## Documentação técnica

Responsável por explicar o funcionamento interno.

Deve responder:

```text
Como está arquitetado?
Como os dados circulam?
Como frontend e backend se comunicam?
Como funciona a autenticação?
Onde estão as regras de negócio?
Como funciona a persistência?
Como testar?
Como fazer deploy?
```

---

## Documentação de API

Responsável por documentar:

* endpoints;
* métodos HTTP;
* parâmetros;
* request;
* response;
* autenticação;
* códigos HTTP;
* erros.

---

## Documentação de regras de negócio

Responsável por registrar regras importantes
para o funcionamento do sistema.

Exemplo:

```text
Receita líquida =
máximo(0, receita bruta - despesas)
```

E:

```text
Veículo/empresa → 50%
Entregador A    → 25%
Entregador B    → 25%
```

---

# Localização

Quando o projeto possuir documentação técnica,
utilizar preferencialmente:

```text
docs/
```

Exemplo:

```text
docs/
├── arquitetura.md
├── frontend.md
├── backend.md
├── api.md
├── autenticacao.md
├── regras-negocio.md
├── banco-de-dados.md
├── testes.md
└── deploy.md
```

Para projetos pequenos, não criar documentação excessivamente
fragmentada.

Pode utilizar:

```text
docs/technical-documentation.md
```

ou outro nome definido pelo padrão do projeto.

---

# README

O README deve ser mantido como documentação de entrada do projeto.

Estrutura preferencial:

```text
Título
↓
Descrição
↓
Preview
↓
Tecnologias
↓
Funcionalidades
↓
Como executar
↓
Estrutura
↓
Aprendizados
↓
Sobre mim
↓
Contato
```

Projetos maiores podem adicionar:

```text
API
Arquitetura
Variáveis de ambiente
Testes
Deploy
Roadmap
```

somente quando necessário.

---

# Documentação técnica

A documentação técnica deve priorizar:

```text
Arquitetura
Estrutura
Fluxos
API
Segurança
Regras de negócio
Persistência
Testes
Configuração
Deploy
Decisões técnicas
Limitações
```

Não utilizar a documentação técnica como cópia integral
do código.

Explicar o comportamento e as responsabilidades,
não reproduzir arquivos inteiros.

---

# API

Toda alteração de API deve verificar
se a documentação correspondente precisa ser atualizada.

Exemplo:

```text
Nova rota
    ↓
Implementação
    ↓
Teste
    ↓
Documentação da API
```

Documentar somente endpoints realmente existentes.

Nunca inventar:

* endpoints;
* parâmetros;
* responses;
* códigos HTTP;
* autenticação.

---

# Regras de negócio

Regras críticas devem ser documentadas explicitamente.

Especialmente:

* regras financeiras;
* autenticação;
* autorização;
* cálculo de valores;
* divisão de receita;
* validações;
* limitações do sistema.

Quando uma regra for alterada:

```text
Código
   +
Testes
   +
Documentação
```

devem permanecer consistentes.

---

# Exemplos

Exemplos devem representar situações reais
e válidas dentro do projeto.

Exemplo de request:

```http
GET /api/deliveries
Authorization: Bearer <TOKEN>
```

Exemplo de response:

```json
{
  "data": []
}
```

Não utilizar exemplos que possam induzir
outros desenvolvedores a implementar comportamentos incorretos.

---

# Código dentro da documentação

Utilizar blocos de código para:

* comandos;
* estruturas de diretórios;
* requests;
* responses;
* configurações;
* exemplos de código;
* variáveis de ambiente.

Exemplo:

```bash
npm install
npm run dev
```

Sempre utilizar a linguagem apropriada
quando o Markdown permitir:

````md
```typescript
````

````md
```json
````

````md
```bash
````

---

# Links

Links internos devem apontar para arquivos existentes.

Exemplo:

```md
[Documentação do backend](docs/backend.md)
```

Nunca criar links para arquivos que não existem.

Links externos devem ser utilizados somente
quando forem relevantes.

---

# Variáveis de ambiente

Nunca documentar valores secretos reais.

Permitido:

```env
JWT_SECRET=your-secret-here
```

Não permitido:

```env
JWT_SECRET=senha-real-de-producao
```

Nunca documentar:

* tokens;
* senhas;
* API keys;
* secrets;
* credenciais;
* informações privadas.

Quando existir:

```text
.env.example
```

utilizá-lo como referência para documentar
as variáveis necessárias.

---

# Segurança

A documentação nunca deve expor informações sensíveis.

Não incluir:

* credenciais reais;
* tokens reais;
* secrets;
* chaves privadas;
* dados pessoais desnecessários;
* informações internas de infraestrutura
  que não deveriam ser públicas.

Credenciais de demonstração podem ser documentadas
somente quando forem explicitamente destinadas
ao ambiente de demonstração.

---

# Alterações no código

Sempre que uma alteração afetar alguma das áreas abaixo,
verificar a documentação:

```text
Arquitetura
API
Banco de dados
Autenticação
Autorização
Regras de negócio
Estrutura de pastas
Tecnologias
Scripts
Variáveis de ambiente
Deploy
Configuração
```

Fluxo:

```text
Alteração
   ↓
Verificar impacto na documentação
   ↓
Atualizar documentação necessária
   ↓
Validar consistência
```

---

# Não documentar automaticamente

Não atualizar documentação para alterações
que não tenham impacto relevante.

Exemplos:

* correção simples de typo no código;
* alteração interna sem impacto arquitetural;
* refatoração que preserva comportamento;
* mudança de nome de variável local;
* pequenas alterações de estilo.

A documentação deve representar conhecimento útil,
não cada alteração realizada no código.

---

# Consistência

README, documentação técnica, código e testes
devem representar o mesmo comportamento.

Exemplo:

```text
Código
   ↕
Testes
   ↕
Documentação Técnica
   ↕
README
```

Se existir uma inconsistência:

1. identificar qual é o comportamento real;
2. verificar os testes;
3. determinar a fonte da verdade;
4. atualizar a documentação ou o código conforme a tarefa;
5. verificar novamente a consistência.

---

# Documentação desatualizada

Quando uma documentação estiver desatualizada,
não simplesmente adicionar novas informações por cima.

Primeiro:

```text
Identificar informação antiga
        ↓
Verificar código atual
        ↓
Remover informação incorreta
        ↓
Adicionar informação atual
```

Evitar manter informações históricas
dentro da documentação operacional.

Para decisões históricas importantes,
utilizar uma seção de decisões técnicas ou ADRs.

---

# Decisões técnicas

Decisões arquiteturais importantes podem ser documentadas.

Formato:

```md
## Decisão

### Contexto

Qual problema precisava ser resolvido?

### Decisão

Qual solução foi escolhida?

### Motivo

Por que essa solução foi escolhida?

### Consequências

Quais benefícios e limitações existem?
```

Utilizar esse formato principalmente para decisões como:

* escolha de framework;
* arquitetura;
* banco de dados;
* gerenciamento de estado;
* autenticação;
* estratégia de deploy;
* integração entre serviços.

---

# Documentação para novos desenvolvedores

A documentação deve permitir que um novo desenvolvedor consiga:

```text
1. Entender o projeto
2. Instalar dependências
3. Executar a aplicação
4. Entender a arquitetura
5. Localizar funcionalidades
6. Entender a API
7. Executar os testes
8. Implementar uma alteração
```

Se um desenvolvedor precisar descobrir informações
fundamentais somente lendo todo o código,
verificar se a documentação está incompleta.

---

# Regra de simplicidade

Não criar documentação complexa quando uma explicação simples
for suficiente.

Preferir:

```text
Explicação curta
+
Exemplo
+
Diagrama quando necessário
```

Evitar:

```text
Texto excessivamente longo
+
repetição
+
informações irrelevantes
```

---

# Formatação Markdown

Todos os arquivos Markdown devem:

* utilizar títulos hierárquicos;
* utilizar listas quando apropriado;
* utilizar tabelas quando melhorarem a compreensão;
* utilizar blocos de código;
* manter espaçamento consistente;
* utilizar nomes de arquivos corretos;
* manter links válidos.

Evitar:

* títulos sem hierarquia;
* blocos de código quebrados;
* links inválidos;
* tabelas desnecessariamente complexas;
* excesso de emojis;
* textos sem estrutura.

---

# Responsabilidade dos agentes

## Overview Agent

Deve identificar:

* documentação necessária;
* impacto arquitetural;
* regras que precisam ser documentadas;
* alterações que exigem atualização do README.

---

## Frontend Agent

Deve informar alterações relevantes em:

* páginas;
* componentes;
* estado;
* formulários;
* integração com API;
* tecnologias frontend.

---

## Backend Agent

Deve informar alterações relevantes em:

* endpoints;
* autenticação;
* regras de negócio;
* persistência;
* schemas;
* serviços.

---

## Test Agent

Deve identificar:

* novos cenários;
* alterações de comportamento;
* regras críticas testadas;
* comandos de teste.

---

## Code Reviewer

Deve verificar:

* documentação está atualizada;
* documentação corresponde ao código;
* endpoints estão corretos;
* exemplos estão corretos;
* não existem informações inventadas;
* não existem secrets expostos.

---

## README Agent

É responsável por:

* criar README;
* atualizar README;
* manter padrão visual;
* manter informações atualizadas;
* verificar links;
* verificar comandos;
* verificar estrutura do projeto.

---

# Checklist obrigatório

Antes de considerar uma alteração de documentação concluída:

* [ ] A documentação corresponde ao código atual.
* [ ] Não existem informações inventadas.
* [ ] Não existem informações desatualizadas.
* [ ] Os comandos foram verificados.
* [ ] Os endpoints foram verificados.
* [ ] Os links existem.
* [ ] Os exemplos são válidos.
* [ ] As regras de negócio estão corretas.
* [ ] Não existem secrets ou credenciais expostas.
* [ ] A estrutura de pastas está atualizada.
* [ ] O Markdown está corretamente formatado.
* [ ] Não existe conteúdo duplicado desnecessário.

---

# Regra final

A documentação deve responder:

```text
O que é?
    ↓
Como funciona?
    ↓
Onde está?
    ↓
Como utilizar?
    ↓
Por que foi construído dessa maneira?
    ↓
Como testar?
    ↓
Como modificar?
```

Se uma informação não ajuda a responder
essas perguntas ou não possui valor técnico,
não adicioná-la sem necessidade.
