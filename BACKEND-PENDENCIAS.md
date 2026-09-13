# Pendências do Backend — DeliveryControl

Documento operacional para transformar o backend atual em uma API real, testável
no Insomnia e pronta para deploy no Render.

## Diagnóstico atual

O backend atual já possui:

- Express + TypeScript;
- rotas `/api` para autenticação, funcionários, entregas, gasolina, dashboard,
  analytics, relatórios e configurações;
- JWT e bcryptjs para autenticação tradicional;
- validação Zod nos principais módulos;
- isolamento por `userId` nas operações protegidas;
- cálculo financeiro centralizado em `FinanceService`;
- integração do frontend com a API por `frontend/src/services/api/api-client.ts`.

Ele **ainda não está pronto para produção** porque:

- `backend/server/db/database.ts` armazena tudo em `.data/deliverycontrol.db.json`;
- as rotas JWT legadas permanecem enquanto o frontend é migrado para Better Auth;
  o fluxo Google legado não deve ser usado em produção;
- não existe banco relacional, migration, repository ou `DATABASE_URL`;
- `JWT_SECRET` possui fallback inseguro no código;
- não há CORS configurado para frontend hospedado separadamente;
- não há Helmet, rate limiting ou tratamento global consistente de erros;
- não há suíte de integração da API nem coleção do Insomnia versionada;
- o frontend ainda contém arquivos legados em `frontend/src/app/core/mock/`;
- deploy, healthcheck de dependências e seed de produção ainda não estão definidos.

## Ordem de execução

### Fase 1 — Contrato e ambiente de produção

- [ ] Definir o domínio final do frontend e a URL pública da API no Render.
- [ ] Criar `DATABASE_URL` para PostgreSQL gerenciado.
- [ ] Gerar um `JWT_SECRET` forte fora do repositório.
- [ ] Definir `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
      e `BETTER_AUTH_URL` como variáveis do ambiente.
- [x] Remover o fallback de `JWT_SECRET` e falhar no startup em produção quando
      uma variável obrigatória não existir.
- [x] Separar configuração por ambiente sem colocar chaves reais no `.env.example`.

### Fase 2 — Banco PostgreSQL real

- [x] Escolher Prisma ou Drizzle; a opção inicial recomendada é Prisma pela
      facilidade de migration e deploy.
- [ ] Criar schema para `users`, `auth_accounts`, `employees`, `deliveries`,
      `gasoline_expenses` e `split_configs`.
- [ ] Usar `DECIMAL/NUMERIC` ou centavos inteiros para valores monetários; não
      persistir dinheiro como `FLOAT`.
- [ ] Adicionar índices por `user_id` e data.
- [ ] Garantir foreign keys, `employee_b_id` opcional e proibição de funcionário
      duplicado no mesmo turno.
- [ ] Criar migrations e um seed explícito somente para desenvolvimento.
- [ ] Criar repositories e substituir o acesso direto à classe `Database`.
- [ ] Migrar os dados necessários do JSON local para PostgreSQL antes do primeiro
      deploy, sem usar o mock como banco de produção.
- [ ] Tornar o healthcheck capaz de verificar a conectividade com PostgreSQL.

### Fase 3 — Better Auth + Google OAuth/OIDC

- [x] Instalar Better Auth e o adapter PostgreSQL.
- [x] Criar `backend/server/auth/better-auth.ts` com Google e email/senha.
- [x] Preparar o middleware para validar sessões Better Auth.
- [ ] Gerar o schema oficial Better Auth com `npx auth@latest generate` depois
      de confirmar o `DATABASE_URL` local.
- [ ] Criar e aplicar a migration PostgreSQL do Better Auth com
      `npx prisma migrate dev --name add-better-auth`.
- [x] Alterar o frontend para usar `signIn.social`, `signIn.email`,
      `signUp.email`, `getSession` e `signOut` do Better Auth.
- [ ] Criar `auth_accounts` no schema final e migrar usuários existentes.
- [ ] Desativar e remover as rotas JWT legadas `/api/auth/login`, `/register`,
      e `/logout` depois da migração do frontend.
- [ ] Testar token válido, token expirado, audience incorreta, e-mail não verificado
      e tentativa de vinculação indevida.

#### Passo a passo para configurar as chaves Google no Better Auth

1. Acesse `https://console.cloud.google.com/` com a conta que administrará o projeto.
2. Crie ou selecione um projeto chamado `DeliveryControl`.
3. Em **APIs e serviços > Tela de consentimento OAuth**, configure o app,
   informe o domínio autorizado e adicione seu e-mail como usuário de teste
   enquanto o app estiver em modo de testes.
4. Em **APIs e serviços > Credenciais**, crie um cliente OAuth do tipo
   **Aplicativo da Web**.
5. Em **Origens JavaScript autorizadas**, adicione:
   `http://localhost:5173` e a URL final do frontend publicado.
6. Em **URIs de redirecionamento autorizados**, adicione:
   `http://localhost:3000/api/auth/callback/google` e, em produção,
   `https://SEU_BACKEND.onrender.com/api/auth/callback/google`.
7. Copie o **Client ID** para `GOOGLE_CLIENT_ID`. Não copie o client secret para
   o frontend.
8. No desenvolvimento, coloque os valores somente no arquivo `.env` local,
   que já é ignorado pelo Git:

   ```env
   GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=seu-client-secret
   BETTER_AUTH_ENABLED=true
   BETTER_AUTH_SECRET=gere-um-segredo-com-pelo-menos-32-caracteres
   BETTER_AUTH_URL=http://localhost:3000
   ```

9. No Render, abra o serviço do backend em **Environment > Environment
   Variables** e adicione as mesmas variáveis com os valores reais. Gere
   `JWT_SECRET` pelo painel do Render ou com um gerador criptograficamente
   seguro; nunca reutilize o exemplo.
10. Depois de conhecer as URLs públicas, volte ao Google Cloud e adicione o
    domínio do frontend e os endereços autorizados definitivos.
11. Teste primeiro em localhost com `signIn.social({ provider: "google" })`.
    Depois teste o mesmo fluxo no domínio do Render.

Com Better Auth ativo, o login social usa `POST /api/auth/sign-in/social`
com `provider: "google"` e o callback padrão `/api/auth/callback/google`.
O frontend deve enviar cookies (`credentials: include`) e nunca receber o
`GOOGLE_CLIENT_SECRET`.

### Fase 4 — Segurança da API

- [x] Configurar CORS somente para `FRONTEND_URL` e origens locais permitidas.
- [x] Adicionar Helmet.
- [x] Adicionar rate limiting em `/api/auth/*`.
- [x] Adicionar limite de tamanho para JSON.
- [ ] Criar middleware global de erros sem expor stack trace ou detalhes internos.
- [ ] Validar params e query strings com Zod em todos os endpoints.
- [ ] Confirmar que nenhum controller aceita `userId` do frontend.
- [ ] Adicionar expiração, rotação/revogação de refresh token se a sessão longa
      for necessária.
- [ ] Remover logs que possam conter tokens, senhas ou dados sensíveis.

### Fase 5 — Contrato do frontend real

- [ ] Auditar todas as telas ativas para confirmar que usam services da API.
- [ ] Remover ou isolar os arquivos legados de `frontend/src/app/core/mock/`.
- [ ] Confirmar que criação, edição, exclusão, filtros e relatórios usam respostas
      do backend e não dados estáticos.
- [ ] Centralizar tipos de request/response compartilhados ou documentar o contrato.
- [ ] Tratar loading, erro, sessão expirada e resposta vazia em cada feature.
- [ ] Testar o fluxo completo com banco real:
      cadastro/login → funcionário → entrega → gasolina → dashboard → relatório.

### Fase 6 — Insomnia e Render

- [ ] Criar uma coleção Insomnia versionada com variáveis:
      `base_url`, `token`, `user_id`, `employee_id`, `delivery_id`,
      `gasoline_id`.
- [ ] Testar `GET {{ base_url }}/api/health` sem autenticação.
- [ ] Testar cadastro/login e preservar o cookie Better Auth.
- [ ] Testar `GET /api/auth/get-session` com o cookie de sessão.
- [ ] Testar CRUD de funcionários, entregas e gasolina.
- [ ] Testar isolamento: token do usuário A não pode ler ou alterar dados do usuário B.
- [ ] Testar dashboard, analytics, relatórios e atualização da divisão.
- [ ] Configurar no Render:
      `npm install` no build, `npm run build` e `npm start` no start.
- [ ] Configurar `NODE_ENV=production`, `PORT` fornecida pelo Render,
      `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` e variáveis Google.
- [ ] Persistir uploads fora do filesystem local caso comprovantes sejam adicionados.
- [ ] Confirmar que o serviço não depende de `.data/` nem de arquivos graváveis locais.

## Variáveis esperadas

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
JWT_SECRET=gere-um-segredo-forte-fora-do-repositorio
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`GOOGLE_CLIENT_SECRET` e `JWT_SECRET` nunca devem ser enviados ao frontend,
commitados no repositório ou colocados neste arquivo com valores reais.

## Critério de pronto

O backend estará pronto para produção quando as fases 1, 2, 3, 4 e 6 estiverem
concluídas, o fluxo completo da fase 5 passar usando PostgreSQL real e o deploy
for reproduzível sem `.data/deliverycontrol.db.json`.
