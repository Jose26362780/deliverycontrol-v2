# Skill: Documentação README

## Objetivo

Criar e atualizar arquivos `README.md` dos projetos seguindo um padrão
visual, técnico e profissional consistente.

O README deve apresentar o projeto de forma clara, objetiva e organizada,
servindo como documentação para desenvolvedores, recrutadores e visitantes
do GitHub.

---

# Estrutura padrão

Todo README deve seguir, quando aplicável, esta ordem:

1. Título e descrição
2. Preview
3. Tecnologias
4. Funcionalidades
5. Como executar
6. Estrutura do projeto
7. Aprendizados
8. Sobre mim
9. Contato

Nem todas as seções são obrigatórias.

A documentação deve ser adaptada ao tamanho e à natureza do projeto.

---

# 1. Título e descrição

Começar com:

```md
# Nome do Projeto
```

Logo abaixo, apresentar uma descrição curta explicando:

* o que é o projeto;
* qual problema resolve ou qual objetivo possui;
* contexto em que foi desenvolvido;
* principais características.

Para projetos de estudo, desafios ou formações, informar o contexto.

Exemplo:

```md
# Local Turístico: Busan

Página web sobre Busan, na Coreia do Sul, desenvolvida como desafio
prático de HTML e CSS da formação Full Stack da Rocketseat.

O projeto apresenta informações sobre a cidade e três destinos turísticos:
o Templo Haedong Yonggungsa, o Templo Beomeo-sa e o Parque Yongdusan.
```

Evitar descrições genéricas como:

```text
Projeto feito para aprender programação.
```

Preferir uma descrição que explique concretamente o projeto.

---

# 2. Preview

Quando existir uma imagem de preview, utilizar:

```md
## Preview

![Descrição do projeto](.github/cover.png)
```

Preferir:

```text
.github/cover.png
```

como localização padrão da imagem de capa.

A descrição alternativa (`alt`) deve explicar o conteúdo da imagem.

Exemplo:

```md
![Preview da página turística de Busan](.github/cover.png)
```

Se o projeto possuir uma URL pública, pode incluir:

```md
## Preview

🔗 [Acessar projeto](URL)

![Preview do projeto](.github/cover.png)
```

Nunca inventar URL.

---

# 3. Tecnologias

Listar somente tecnologias realmente utilizadas no projeto.

Formato:

```md
## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
```

Organizar as tecnologias das mais importantes
para as complementares.

Não adicionar tecnologias apenas porque são comuns
ao tipo de projeto.

Exemplo:

Se o projeto utiliza apenas HTML e CSS, não adicionar:

```text
JavaScript
React
Node.js
TypeScript
```

---

# 4. Funcionalidades

Descrever as principais funcionalidades implementadas.

Formato:

```md
## Funcionalidades

- Apresentação introdutória.
- Seção de informações.
- Navegação entre páginas.
- Formulários de cadastro.
- Validação de dados.
- Responsividade.
```

As funcionalidades devem ser baseadas no código real.

Não confundir:

```text
Tecnologia → React
Funcionalidade → Cadastro de usuários
```

Evitar transformar detalhes de implementação em funcionalidades.

---

# 5. Como executar

Explicar como executar o projeto localmente.

Para projetos simples:

```md
## Como executar

1. Clone ou baixe este repositório.
2. Entre na pasta do projeto.
3. Abra o arquivo `index.html` no navegador.
```

Para projetos Node.js:

````md
## Como executar

### Pré-requisitos

- Node.js 20+
- npm

### Instalação

```bash
npm install
````

### Desenvolvimento

```bash
npm run dev
```

````

Para projetos que possuem backend e frontend,
explicar os comandos necessários para executar cada parte.

Nunca inventar scripts.

Antes de documentar comandos, verificar:

- `package.json`;
- scripts disponíveis;
- arquivos de configuração;
- variáveis de ambiente;
- README existente.

---

# 6. Estrutura do projeto

Adicionar uma representação simplificada da estrutura.

Exemplo:

```md
## Estrutura do projeto

```text
.
├── index.html
├── style.css
├── assets/
├── .github/
└── vscode/
````

````

Regras:

- representar somente arquivos e pastas relevantes;
- adicionar comentários explicativos quando ajudarem;
- evitar listar `node_modules`;
- evitar listar arquivos gerados;
- evitar estruturas excessivamente detalhadas.

Para projetos maiores, mostrar apenas os principais diretórios.

---

# 7. Aprendizados

Descrever os principais conhecimentos praticados no projeto.

Formato:

```md
## Aprendizados

Este projeto pratica conceitos fundamentais de desenvolvimento web,
incluindo:

- Estrutura semântica com HTML.
- Seletores, classes e IDs no CSS.
- Organização de espaçamentos.
- Tipografia.
- Responsividade.
````

Essa seção deve refletir aquilo que realmente foi praticado.

Para projetos profissionais, pode substituir ou complementar
com uma seção:

```md
## Conceitos aplicados
```

ou:

```md
## Arquitetura
```

---

# 8. Sobre mim

Utilizar uma apresentação profissional curta e consistente.

Padrão:

```md
## Sobre mim

Engenheiro de Software e desenvolvedor apaixonado por tecnologia,
com foco em desenvolviment
```
