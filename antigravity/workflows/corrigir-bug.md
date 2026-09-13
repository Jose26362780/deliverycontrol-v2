# Workflow: Correção de Bug

## Etapa 1 — Reproduzir

Registrar comportamento esperado, comportamento atual, passos para reprodução,
página, endpoint e dados envolvidos.

## Etapa 2 — Investigar

Seguir o fluxo:

```text
Frontend -> API -> Service -> Persistência (backend/server/db/database.ts)
```

Não modificar código antes de identificar a causa provável.

## Etapa 3 — Corrigir

Alterar somente o necessário e preservar os contratos existentes.
Não mover regra financeira para o frontend nem aceitar `userId` vindo do cliente.

## Etapa 4 — Testar

Criar ou ampliar um teste que reproduza o bug. Executar no mínimo `npm run lint`;
para regras financeiras, executar o teste TypeScript em
`backend/server/modules/finance/finance.service.test.ts`.

## Etapa 5 — Revisar

Executar `revisar-codigo.md`, verificando isolamento por usuário, validação Zod,
autenticação e impacto nos cálculos financeiros.

## Etapa 6 — Documentar

Atualizar o README somente quando comandos, endpoints, arquitetura ou comportamento
documentado forem alterados.
