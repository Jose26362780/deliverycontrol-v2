# Regras Gerais do Projeto

## Projeto

DeliveryControl é uma plataforma full stack para gestão de operações
de entrega e controle financeiro.

## Stack

Frontend:
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Hook Form
- Zod
- Recharts
- Lucide React

Backend:
- Node.js
- Express
- TypeScript
- JWT
- bcryptjs

Relatórios:
- jsPDF
- jsPDF AutoTable

## Princípios

Todos os agentes devem:

1. Respeitar a arquitetura existente.
2. Evitar alterações desnecessárias.
3. Reutilizar componentes, serviços e tipos existentes.
4. Não duplicar lógica de negócio.
5. Não criar abstrações sem necessidade.
6. Manter TypeScript fortemente tipado.
7. Validar dados de entrada.
8. Preservar compatibilidade com funcionalidades existentes.
9. Criar código simples e legível.
10. Priorizar manutenção e escalabilidade.

## Idioma

Código:
- nomes técnicos em portugues quando fizer sentido para APIs e bibliotecas.

Documentação:
- português.

Comentários:
- somente quando agregarem contexto.

## Regra financeira

A regra financeira pertence ao backend.

Distribuição padrão:

- 50% veículo/empresa
- 25% entregador A
- 25% entregador B

Receita líquida:

receita líquida = máximo(0, receita bruta - gasolina)

Nenhum frontend pode ser considerado fonte de verdade
para cálculos financeiros.

## Segurança

Nunca confiar em dados enviados pelo frontend.

O backend deve:

- validar entradas;
- validar autenticação;
- validar autorização;
- isolar dados pelo usuário autenticado;
- revalidar regras de negócio.