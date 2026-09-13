# Regras de Testes

Toda alteração relevante deve considerar testes.

## Testar principalmente

- regras financeiras;
- autenticação;
- autorização;
- validações;
- serviços;
- cálculos;
- endpoints;
- componentes críticos.

## Regra financeira

Testar:

1. receita sem gasolina;
2. receita com gasolina;
3. gasolina maior que receita;
4. receita zero;
5. valores inválidos;
6. divisão 50/25/25;
7. diferentes configurações de percentual.

## Testes

Preferir testes pequenos e determinísticos.

Não testar implementação interna quando
for possível testar comportamento.