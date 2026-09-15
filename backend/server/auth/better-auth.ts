import { betterAuth as createBetterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../db/prisma';

// Better Auth é o fluxo oficial (cookie + PostgreSQL + Google).
// Usa o Prisma adapter para operar nas MESMAS tabelas do schema
// (users/accounts/sessions/verifications em snake_case).
// O Pool cru ("pg") usaria tabelas singulares inexistentes e quebrava o login.
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL é obrigatório para o Better Auth.');
}

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.length < 32) {
  throw new Error('BETTER_AUTH_SECRET deve ter pelo menos 32 caracteres.');
}

const isSecureContext = (process.env.BETTER_AUTH_URL || '').startsWith('https://');

// FRONTEND_URL pode conter várias origens separadas por vírgula.
const frontendOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const betterAuth = createBetterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret,
  database: prismaAdapter(getPrismaClient(), { provider: 'postgresql' }),
  trustedOrigins: [
    ...frontendOrigins,
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  ].filter(Boolean) as string[],
  emailAndPassword: {
    enabled: true,
    // Sem provedor de e-mail configurado ainda; exigir verificação
    // bloquearia o login. Reative quando houver Resend/SMTP.
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    password: {
      hash: (password) => hashPassword(password),
      verify: async ({ hash, password }) => {
        // Hashes legados da migração do JSON usam bcrypt ($2a$/$2b$).
        if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
          return bcrypt.compare(password, hash);
        }
        return verifyPassword({ hash, password });
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  advanced: {
    useSecureCookies: isSecureContext,
    // Frontend (Netlify) e backend (Render) são sites diferentes.
    // Sem SameSite=None + Secure + Partitioned (CHIPS), o Chrome — sobretudo
    // em aba anônima — bloqueia o cookie de state/PKCE como third-party e o
    // callback do Google falha com `?error=state_mismatch`.
    // Em dev (http://localhost) mantém o padrão Lax, pois
    // SameSite=None exige Secure/HTTPS.
    ...(isSecureContext
      ? {
          defaultCookieAttributes: {
            sameSite: 'none',
            secure: true,
            partitioned: true,
          },
        }
      : {}),
  },
});
