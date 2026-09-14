import { config } from '../config';
import { getPrismaClient } from '../db/prisma';
import { db } from '../db/database';
import { User } from '../types';

const usePg = () => Boolean(config.databaseUrl);

function toUser(u: any, passwordHash: string): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    passwordHash,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}

export class UserRepository {
  public static async findById(id: string): Promise<User | null> {
    if (usePg()) {
      const u = await getPrismaClient().user.findUnique({ where: { id }, include: { accounts: true } });
      if (!u) return null;
      return toUser(u, u.accounts.find(a => a.providerId === 'credential')?.password || '');
    }
    return db.findUserById(id) || null;
  }

  public static async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    if (usePg()) {
      const u = await getPrismaClient().user.findUnique({ where: { email: normalized }, include: { accounts: true } });
      if (!u) return null;
      return toUser(u, u.accounts.find(a => a.providerId === 'credential')?.password || '');
    }
    return db.findUserByEmail(normalized) || null;
  }
}
