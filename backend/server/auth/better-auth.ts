import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { config } from '../config';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL é obrigatório para ativar o Better Auth');
}

if (!config.betterAuth.secret || config.betterAuth.secret.length < 32) {
  throw new Error('BETTER_AUTH_SECRET deve possuir pelo menos 32 caracteres');
}

const isLocal = config.databaseUrl.includes('localhost') || config.databaseUrl.includes('127.0.0.1');
const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

const socialProviders = (config.google.clientId && config.google.clientSecret)
  ? {
      google: {
        clientId: config.google.clientId,
        clientSecret: config.google.clientSecret,
      },
    }
  : undefined;

export const auth = betterAuth({
  database: pool,
  baseURL: config.betterAuth.url,
  secret: config.betterAuth.secret,
  trustedOrigins: config.allowedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  ...(socialProviders ? { socialProviders } : {}),
});
