import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || (
    process.env.NODE_ENV === 'production'
      ? (() => { throw new Error('JWT_SECRET é obrigatório em produção'); })()
      : 'delivery-control-development-secret'
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedOrigins: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || '1mb',
  databaseUrl: process.env.DATABASE_URL,
  betterAuth: {
    enabled: process.env.BETTER_AUTH_ENABLED === 'true',
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  defaultSplit: {
    carPercentage: 50,
    employeeAPercentage: 25,
    employeeBPercentage: 25,
  }
};
