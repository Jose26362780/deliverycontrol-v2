import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db/database';
import { config } from '../../config';
import { getPrismaClient } from '../../db/prisma';
import { RegisterInput, LoginInput } from './auth.schemas';
import { User } from '../../types';

// LEGADO (migração): Better Auth com PostgreSQL é o fluxo oficial.
// Este service JWT existe só para desenvolvimento sem BETTER_AUTH_ENABLED=true
// e será removido após a migração do frontend.
const usePg = () => Boolean(config.databaseUrl);

function signToken(id: string, email: string): string {
  return jwt.sign({ id, email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

function withoutPassword(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

export class AuthService {
  public static async register(data: RegisterInput): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const email = data.email.toLowerCase().trim();
    if (usePg()) {
      const prisma = getPrismaClient();
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error('E-mail já registrado no sistema.');
      const passwordHash = await bcrypt.hash(data.password, 10);
      const created = await prisma.$transaction(async tx => {
        const u = await tx.user.create({ data: { name: data.name.trim(), email } });
        await tx.account.create({
          data: { accountId: u.id, providerId: 'credential', userId: u.id, password: passwordHash },
        });
        await tx.splitConfig.create({ data: { userId: u.id } });
        return u;
      });
      const user: User = {
        id: created.id,
        name: created.name,
        email: created.email,
        passwordHash: '',
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
      return { user: withoutPassword(user), token: signToken(user.id, user.email) };
    }

    if (db.findUserByEmail(email)) throw new Error('E-mail já registrado no sistema.');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const now = new Date().toISOString();
    const user: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: data.name.trim(),
      email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };
    db.users.push(user);
    db.saveSplitConfig(user.id, { carPercentage: 50, employeeAPercentage: 25, employeeBPercentage: 25 });
    db.saveToDisk();
    return { user: withoutPassword(user), token: signToken(user.id, user.email) };
  }

  public static async login(data: LoginInput): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const email = data.email.toLowerCase().trim();
    const invalid = 'Credenciais inválidas. Verifique e-mail e senha.';
    if (usePg()) {
      const prisma = getPrismaClient();
      const u = await prisma.user.findUnique({ where: { email }, include: { accounts: true } });
      const hash = u?.accounts.find(a => a.providerId === 'credential')?.password;
      if (!u || !hash || !(await bcrypt.compare(data.password, hash))) throw new Error(invalid);
      const user: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: '',
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      };
      return { user: withoutPassword(user), token: signToken(user.id, user.email) };
    }

    const user = db.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) throw new Error(invalid);
    return { user: withoutPassword(user), token: signToken(user.id, user.email) };
  }

  public static async getMe(userId: string): Promise<Omit<User, 'passwordHash'>> {
    if (usePg()) {
      const prisma = getPrismaClient();
      const u = await prisma.user.findUnique({ where: { id: userId } });
      if (!u) throw new Error('Usuário não encontrado');
      return { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt.toISOString(), updatedAt: u.updatedAt.toISOString() } as any;
    }
    const user = db.findUserById(userId);
    if (!user) throw new Error('Usuário não encontrado');
    return withoutPassword(user);
  }
}
