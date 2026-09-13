# Workflow: Code Review

## Entrada

Alterações realizadas no projeto.

## Processo

1. Analisar arquivos modificados e o impacto no monorepo.
2. Verificar o fluxo `page -> hook/store -> service -> API` no frontend.
3. Verificar o fluxo `route -> middleware -> handler/controller -> service -> db` no backend.
4. Confirmar que `userId` vem do JWT e que consultas e mutações são isoladas por usuário.
5. Confirmar validação Zod no backend e ausência de regra financeira confiada ao frontend.
6. Conferir `FinanceService`, arredondamento e regra 50/25/25.
7. Executar `npm run lint` e o teste financeiro quando aplicável.
8. Conferir documentação e links para `antigravity/spec-kit`.
9. Classificar somente problemas reproduzíveis por severidade.

## Resultado

### APROVADO

Nenhum problema relevante encontrado.

### APROVADO COM OBSERVAÇÕES

Somente problemas LOW/MEDIUM.

### REPROVADO

Existe problema HIGH/CRITICAL.

## Formato

Problema:
Arquivo:
Linha:
Severidade:
Descrição:
Sugestão:
