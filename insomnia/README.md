# Insomnia — DeliveryControl

## Ambiente local

Crie um ambiente `Local` com:

```json
{
  "base_url": "http://localhost:3000",
  "token": "",
  "user_id": "",
  "employee_id": "",
  "delivery_id": "",
  "gasoline_id": ""
}
```

Use `Authorization: Bearer {{ token }}` nas rotas protegidas.

## Sequência mínima

1. `GET {{ base_url }}/api/health`
2. `POST {{ base_url }}/api/auth/register`
3. `POST {{ base_url }}/api/auth/login`; copie `token` para o ambiente.
4. `GET {{ base_url }}/api/auth/me`
5. CRUD de `/api/employees`
6. CRUD de `/api/deliveries`
7. CRUD de `/api/gasoline`
8. `GET {{ base_url }}/api/dashboard/stats`
9. `GET {{ base_url }}/api/analytics`
10. `GET {{ base_url }}/api/reports/financial`

## Better Auth e Google

Com `BETTER_AUTH_ENABLED=true`, use os endpoints gerenciados pelo Better Auth:

- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/social` com `{ "provider": "google" }`
- `GET /api/auth/get-session`
- `POST /api/auth/sign-out`

As requisições devem preservar cookies (`credentials: include`). O backend não
aceita e-mail manual como prova de identidade.

As variáveis `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e `BETTER_AUTH_URL`
devem ser configuradas no `.env` local ou no painel Environment do Render. Nunca
adicione valores reais a este arquivo.

## Render

Configure:

- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- `NODE_ENV=production`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- variáveis `GOOGLE_*`

O backend ainda usa JSON local até a migração Prisma ser concluída; não use essa
persistência em produção.
