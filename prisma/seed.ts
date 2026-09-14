import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../backend/server/db/prisma';

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O seed de demonstração não pode ser executado em produção.');
  }

  const prisma = getPrismaClient();

  const passwordHash = await bcrypt.hash('senha123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@deliverycontrol.com' },
    update: {},
    create: {
      name: 'Gestor Demo',
      email: 'demo@deliverycontrol.com',
    },
  });

  await prisma.account.upsert({
    where: {
      providerId_accountId: {
        providerId: 'credential',
        accountId: user.id,
      },
    },
    update: { password: passwordHash },
    create: {
      accountId: user.id,
      providerId: 'credential',
      userId: user.id,
      password: passwordHash,
    },
  });

  await prisma.splitConfig.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  console.log('Seed de desenvolvimento executado com sucesso no PostgreSQL!');
}

main()
  .catch(error => {
    console.error('Falha no seed de desenvolvimento:', error);
    process.exitCode = 1;
  });
