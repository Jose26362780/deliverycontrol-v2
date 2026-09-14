import fs from 'node:fs';
import path from 'node:path';
import { getPrismaClient } from '../backend/server/db/prisma';

async function migrateFromJson() {
  const jsonPath = path.join(process.cwd(), '.data', 'deliverycontrol.db.json');
  if (!fs.existsSync(jsonPath)) {
    console.log('Nenhum arquivo .data/deliverycontrol.db.json encontrado para migrar.');
    return;
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);
  const prisma = getPrismaClient();

  console.log('Iniciando migração de dados do JSON local para PostgreSQL...');

  const userIdMap = new Map<string, string>();

  // 1. Users & Accounts
  if (data.users && Array.isArray(data.users)) {
    for (const u of data.users) {
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      let realUserId = existing?.id;

      if (existing) {
        await prisma.user.update({
          where: { id: existing.id },
          data: { name: u.name },
        });
      } else {
        const created = await prisma.user.create({
          data: {
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
            updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
          },
        });
        realUserId = created.id;
      }

      userIdMap.set(u.id, realUserId!);

      if (u.passwordHash && realUserId) {
        await prisma.account.upsert({
          where: {
            providerId_accountId: {
              providerId: 'credential',
              accountId: realUserId,
            },
          },
          update: { password: u.passwordHash },
          create: {
            accountId: realUserId,
            providerId: 'credential',
            userId: realUserId,
            password: u.passwordHash,
          },
        });
      }
    }
    console.log(`✓ ${data.users.length} usuários processados.`);
  }

  // 2. Employees
  const employeeIdMap = new Map<string, string>();
  if (data.employees && Array.isArray(data.employees)) {
    for (const e of data.employees) {
      const targetUserId = userIdMap.get(e.userId) || e.userId;
      const userExists = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!userExists) continue;

      const created = await prisma.employee.upsert({
        where: { id: e.id },
        update: {
          name: e.name,
          role: e.role || null,
          phone: e.phone || null,
          active: e.active !== false,
          userId: targetUserId,
        },
        create: {
          id: e.id,
          userId: targetUserId,
          name: e.name,
          role: e.role || null,
          phone: e.phone || null,
          active: e.active !== false,
          createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
          updatedAt: e.updatedAt ? new Date(e.updatedAt) : new Date(),
        },
      });
      employeeIdMap.set(e.id, created.id);
    }
    console.log(`✓ ${data.employees.length} funcionários processados.`);
  }

  // 3. Deliveries
  if (data.deliveries && Array.isArray(data.deliveries)) {
    let count = 0;
    for (const d of data.deliveries) {
      const targetUserId = userIdMap.get(d.userId) || d.userId;
      const empAId = employeeIdMap.get(d.employeeAId) || d.employeeAId;
      const empA = await prisma.employee.findUnique({ where: { id: empAId } });
      if (!empA) continue;

      let empBId: string | null = (d.employeeBId ? (employeeIdMap.get(d.employeeBId) || d.employeeBId) : null);
      if (empBId) {
        const empB = await prisma.employee.findUnique({ where: { id: empBId } });
        if (!empB || empBId === empAId) {
          empBId = null;
        }
      }

      await prisma.delivery.upsert({
        where: { id: d.id },
        update: {
          date: new Date(d.date),
          deliveryCount: d.deliveryCount,
          revenue: d.revenue,
          notes: d.notes || null,
          employeeAId: empAId,
          employeeBId: empBId,
          userId: targetUserId,
        },
        create: {
          id: d.id,
          userId: targetUserId,
          date: new Date(d.date),
          employeeAId: empAId,
          employeeBId: empBId,
          deliveryCount: d.deliveryCount,
          revenue: d.revenue,
          notes: d.notes || null,
          createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
          updatedAt: d.updatedAt ? new Date(d.updatedAt) : new Date(),
        },
      });
      count++;
    }
    console.log(`✓ ${count} entregas processadas.`);
  }

  // 4. Gasoline Expenses
  if (data.gasolineExpenses && Array.isArray(data.gasolineExpenses)) {
    let count = 0;
    for (const g of data.gasolineExpenses) {
      const targetUserId = userIdMap.get(g.userId) || g.userId;
      const userExists = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!userExists) continue;

      await prisma.gasolineExpense.upsert({
        where: { id: g.id },
        update: {
          date: new Date(g.date),
          amount: g.amount,
          liters: g.liters || null,
          description: g.description || null,
          userId: targetUserId,
        },
        create: {
          id: g.id,
          userId: targetUserId,
          date: new Date(g.date),
          amount: g.amount,
          liters: g.liters || null,
          description: g.description || null,
          createdAt: g.createdAt ? new Date(g.createdAt) : new Date(),
          updatedAt: g.updatedAt ? new Date(g.updatedAt) : new Date(),
        },
      });
      count++;
    }
    console.log(`✓ ${count} despesas de combustível processadas.`);
  }

  // 5. Split Configs
  if (data.splitConfigs && Array.isArray(data.splitConfigs)) {
    for (const s of data.splitConfigs) {
      const targetUserId = userIdMap.get(s.userId) || s.userId;
      const userExists = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!userExists) continue;

      await prisma.splitConfig.upsert({
        where: { userId: targetUserId },
        update: {
          carPercentage: s.carPercentage || 50,
          employeeAPercentage: s.employeeAPercentage || 25,
          employeeBPercentage: s.employeeBPercentage || 25,
        },
        create: {
          userId: targetUserId,
          carPercentage: s.carPercentage || 50,
          employeeAPercentage: s.employeeAPercentage || 25,
          employeeBPercentage: s.employeeBPercentage || 25,
        },
      });
    }
    console.log(`✓ configurações de divisão processadas.`);
  }

  console.log('Migração concluída com sucesso!');
}

migrateFromJson().catch(err => {
  console.error('Erro na migração de dados do JSON:', err);
  process.exitCode = 1;
});
