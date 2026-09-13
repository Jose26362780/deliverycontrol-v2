import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { config } from '../config';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL é obrigatório para ativar o Better Auth');
}

if (!config.betterAuth.secret || config.betterAuth.secret.length < 32) {
  throw new Error('BETTER_AUTH_SECRET deve possuir pelo menos 32 caracteres');
}

if (!config.google.clientId || !config.google.clientSecret) {
  throw new Error('GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET são obrigatórios para o Better Auth');
}

const pool = new Pool({ connectionString: config.databaseUrl });

export const auth = betterAuth({
  database: pool,
  baseURL: config.betterAuth.url,
  secret: config.betterAuth.secret,
  trustedOrigins: config.allowedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
    },
  },
});
