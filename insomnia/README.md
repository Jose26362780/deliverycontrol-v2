# Insomnia — DeliveryControl

Coleção versionada: `insomnia-deliverycontrol.json` (importe no Insomnia).

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

`token` é só para as rotas `[Legado dev]` (JWT). O fluxo oficial Better Auth usa
cookie de sessão preservado pelo Insomnia (`credentials`/cookies ativados).

## Sequência mínima

1. `GET {{ base_url }}/api/health` (sem auth; em prod exige `database: connected`)
2. Better Auth: `sign-up/email` → `sign-in/email` → `get-session` → `sign-out`;
   Google: `sign-in/social` com `{ "provider": "google" }`
3. CRUD de `/api/employees` (salve `employee_id`)
4. CRUD de `/api/deliveries` com `?startDate=&endDate=&employeeId=` (salve `delivery_id`)
5. CRUD de `/api/gasoline` (salve `gasoline_id`)
6. `GET /api/dashboard`, `/weekly`, `/monthly`
7. `GET /api/analytics/revenue|deliveries|gasoline|distribution`
8. `GET /api/reports/financial?startDate=&endDate=`, `/weekly`, `/monthly`, `/pdf`
9. `GET/PUT /api/settings/split` (soma = 100%)
10. Pasta `8. Isolamento`: token do usuário A com IDs do usuário B → esperado 404

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

- Build Command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
- Start Command: `npm start`
- `NODE_ENV=production`
- `DATABASE_URL`
- `JWT_SECRET` (legado)
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_ENABLED=true`, `BETTER_AUTH_URL`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- variáveis `GOOGLE_*`

O backend usa PostgreSQL em produção; o JSON em `.data/` é só fallback de
desenvolvimento e é ignorado com `NODE_ENV=production`.
