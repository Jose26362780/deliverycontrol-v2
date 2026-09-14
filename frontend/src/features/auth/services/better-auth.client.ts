import { createAuthClient } from 'better-auth/client';

// Em dev o Vite faz proxy de /api -> http://localhost:3000 (vite.config.ts),
// então sem VITE_API_URL usamos same-origin (evita cookie cross-origin entre :5173 e :3000).
// Em prod (Netlify + Render) o frontend e o backend estão em origens diferentes,
// então VITE_API_URL (ex: https://deliverycontrol-api.onrender.com) é obrigatório:
// sem ele o login chamaria /api/... no próprio Netlify (que é só estático) e falharia.
const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');

export const betterAuthClient = createAuthClient({
  baseURL: apiBaseUrl || window.location.origin,
  fetchOptions: {
    credentials: 'include',
  },
});
