import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma';
import { config } from '../config';

let prismaClient: PrismaClient | undefined;

export function getPrismaClient(): PrismaClient {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL é obrigatório para usar a persistência PostgreSQL');
  }

  if (!prismaClient) {
    const isLocal = config.databaseUrl.includes('localhost') || config.databaseUrl.includes('127.0.0.1');
    const pool = new pg.Pool({
      connectionString: config.databaseUrl,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    prismaClient = new PrismaClient({ adapter });
  }

  return prismaClient;
}
