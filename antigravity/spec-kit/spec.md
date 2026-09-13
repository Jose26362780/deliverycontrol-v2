# DeliveryControl — Spec

## 1. Visão geral

O **DeliveryControl** é uma aplicação SaaS para gerenciamento de entregas e controle financeiro. Permite que usuários registrem funcionários, entregas e gastos com gasolina, e acompanhem os resultados financeiros por meio de um dashboard semanal e mensal.

## 2. Objetivo do produto

O sistema deve controlar:

- Pessoas que trabalharam
- Quantidade de entregas
- Valor gerado
- Data das entregas
- Gastos com gasolina
- Receita líquida
- Divisão financeira
- Indicadores semanais e mensais
- Relatórios

## 3. Regra de negócio central

```
Receita bruta
- Gasolina
= Receita líquida

Receita líquida
→ 50% carro
→ 25% funcionário A
→ 25% funcionário B
```

Essa regra é o coração do produto e **deve ser centralizada, testável e validada no backend** — nunca decidida apenas na interface.

## 4. Fluxo principal do usuário

```
Cadastro → Login → Cadastrar funcionários → Registrar entregas
→ Registrar gasolina → Visualizar Dashboard → Visualizar métricas
→ Visualizar divisão financeira → Gerar relatório PDF
```

## 5. Funcionalidades obrigatórias (MVP)

### Authentication
- Cadastro, login, logout
- Rotas protegidas
- JWT, hash de senha

### Employees
- Criar, editar, excluir, listar funcionário

### Deliveries
- Criar, editar, excluir, listar entrega
- Filtrar por período
- Selecionar funcionários
- Informar quantidade de entregas, receita e data

### Gasoline
- Registrar, editar, excluir, listar gasto
- Associar gasto a uma data
- Filtrar gastos por período

### Dashboard
- Receita semanal e mensal
- Número de entregas
- Dias trabalhados
- Gasolina
- Receita líquida
- Divisão financeira



### Reports
- Relatório semanal e mensal
- Exportação em PDF


## 7. Regras de acesso e dados

- Usuários só podem acessar seus próprios dados.
- Todo dado sensível deve estar isolado por `userId`.
- O backend deve validar novamente todos os dados recebidos do frontend, mesmo que já validados na interface.

## 8. Definition of Done

O MVP estará concluído quando o usuário conseguir, de ponta a ponta:

```
Cadastrar conta → Fazer login → Cadastrar funcionários → Registrar entregas
→ Registrar gasolina → Visualizar dashboard → Visualizar métricas semanais
→ Visualizar métricas mensais → Visualizar divisão 50/25/25
→ Visualizar analytics → Gerar relatório PDF
```

E quando, adicionalmente:

- [ ] Frontend estiver responsivo (mobile-first)
- [ ] Dark mode estiver implementado
- [ ] Backend estiver protegido (JWT, rate limiting, Helmet, CORS)
- [ ] Dados estiverem isolados por usuário
- [ ] Validações existirem no frontend **e** no backend
- [ ] Regras financeiras possuírem testes automatizados
- [ ] Projeto estiver documentado
- [ ] Aplicação puder ser executada localmente
- [ ] Aplicação puder ser publicada em produção

## 9. Princípios do produto

Simplicidade · Confiabilidade nos cálculos financeiros · Clareza visual dos números · Evitar overengineering · Código sustentável por um dev júnior em evolução para pleno.
