import { createAuthClient } from 'better-auth/client';

const baseURL = import.meta.env.VITE_API_URL || window.location.origin;

export const betterAuthClient = createAuthClient({
  baseURL,
});
