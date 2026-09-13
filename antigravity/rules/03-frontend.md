# Regras Frontend

## React

Utilizar React moderno e componentes funcionais.

Preferir:

- hooks;
- composição;
- componentes pequenos;
- props tipadas;
- Zustand para estado global quando necessário.

## Componentes

Diferenciar:

- componentes de apresentação;
- componentes de página;
- componentes reutilizáveis.

Evitar componentes com múltiplas responsabilidades.

## Formulários

Utilizar:

- React Hook Form;
- Zod.

Validações importantes devem existir também no backend.

## API

Não realizar chamadas HTTP diretamente em componentes complexos.

Utilizar services.

Exemplo:

features/entregas/
├── components/
├── hooks/
├── services/
├── schemas/
└── types/

## Estado

Não utilizar estado global quando o estado puder permanecer local.

Zustand deve ser utilizado apenas quando houver necessidade real
de compartilhamento de estado.

## UI

Utilizar Tailwind CSS.

Priorizar:

- responsividade;
- acessibilidade;
- consistência visual;
- estados de loading;
- estados de erro;
- estados vazios;
- feedback de sucesso.