# Workflow: Executar Testes

## Entrada

Código implementado ou alterado no monorepo DeliveryControl.

## Processo

1. Identificar os arquivos e o fluxo afetado.
2. Executar `npm run lint` (`tsc --noEmit`).
3. Executar o teste financeiro disponível:
   `npx tsx -e "import { runFinanceRuleTests } from './backend/server/modules/finance/finance.service.test.ts'; if (!runFinanceRuleTests()) process.exit(1)"`.
4. Executar `npm run build` quando a alteração afetar frontend, backend, rotas ou configuração.
5. Validar manualmente os endpoints e estados de interface alterados.
6. Registrar os comandos executados e as limitações da cobertura atual.

## Critérios

- Falha de tipagem bloqueia a entrega.
- Falha de regra financeira bloqueia a entrega.
- Falha de build bloqueia a entrega quando o build for aplicável.
- Ausência de Vitest/RTL formal deve ser registrada, não simulada.

## Resultado

```text
Status: APROVADO | APROVADO COM OBSERVAÇÕES | REPROVADO
Comandos:
Achados:
Limitações:
```
