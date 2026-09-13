# Arquitetura

## Estrutura

O projeto possui frontend e backend separados conceitualmente.

Frontend:

frontend/
└── src/
    ├── components/
    ├── features/
    ├── services/
    ├── stores/
    ├── types/
    └── App.tsx

Backend:

backend/
└── server/
    ├── config/
    ├── db/
    ├── middlewares/
    ├── modules/
    └── types.ts

## Organização

Funcionalidades devem ser organizadas por domínio/página.

Evitar componentes gigantes.

Evitar serviços com responsabilidades múltiplas.

Separar:

- componentes;
- interfaces/tipos;
- hooks;
- serviços;
- validações;
- regras de negócio;
- acesso a dados.

## Fluxo recomendado

Frontend:

Page
→ Component
→ Hook/Store
→ Service
→ API

Backend:

Route
→ Middleware
→ Controller/Handler
→ Service
→ Business Rule
→ Repository/Database

## Princípios

Aplicar:

- SRP;
- baixo acoplamento;
- alta coesão;
- composição;
- reutilização;
- separação de responsabilidades.