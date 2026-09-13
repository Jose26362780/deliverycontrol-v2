import bcrypt from 'bcryptjs';

interface PrismaClientLike {
  user: { upsert(args: unknown): Promise<{ id: string }> };
  splitConfig: { upsert(args: unknown): Promise<unknown> };
  $disconnect(): Promise<void>;
}

const prismaModule = await import('@prisma/client') as unknown as {
  PrismaClient: new () => PrismaClientLike;
};
const prisma = new prismaModule.PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('O seed de demonstração não pode ser executado em produção.');
  }

  const passwordHash = await bcrypt.hash('senha123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@deliverycontrol.com' },
    update: {},
    create: {
      name: 'Gestor Demo',
      email: 'demo@deliverycontrol.com',
      passwordHash,
    },
  });

  await prisma.splitConfig.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
}

main()
  .catch(error => {
    console.error('Falha no seed de desenvolvimento:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
