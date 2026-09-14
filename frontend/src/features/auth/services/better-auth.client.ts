import { createAuthClient } from 'better-auth/client';

// Em dev o Vite faz proxy de /api -> http://localhost:3000 (vite.config.ts).
// Em prod frontend e backend são o mesmo servidor (dist/).
// Por isso usamos same-origin: evita cookie cross-origin (sessão null após callback Google).
// NÃO use VITE_API_URL absoluto aqui — quebraria o cookie de sessão entre :5173 e :3000.
export const betterAuthClient = createAuthClient({
  baseURL: window.location.origin,
});
