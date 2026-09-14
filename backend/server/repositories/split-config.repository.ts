import { config } from '../config';
import { getPrismaClient } from '../db/prisma';
import { db } from '../db/database';
import { toSplit } from '../db/mappers';
import { SplitRuleConfig } from '../types';

const usePg = () => Boolean(config.databaseUrl);

type SplitInput = { carPercentage: number; employeeAPercentage: number; employeeBPercentage: number };

export class SplitConfigRepository {
  public static async get(userId: string): Promise<SplitRuleConfig> {
    if (usePg()) {
      const prisma = getPrismaClient();
      const found = await prisma.splitConfig.findUnique({ where: { userId } });
      if (found) return toSplit(found);
      const created = await prisma.splitConfig.create({
        data: {
          userId,
          carPercentage: config.defaultSplit.carPercentage,
          employeeAPercentage: config.defaultSplit.employeeAPercentage,
          employeeBPercentage: config.defaultSplit.employeeBPercentage,
        },
      });
      return toSplit(created);
    }
    return db.getSplitConfig(userId);
  }

  public static async update(userId: string, data: SplitInput): Promise<SplitRuleConfig> {
    if (usePg()) {
      const prisma = getPrismaClient();
      const record = await prisma.splitConfig.upsert({
        where: { userId },
        update: { ...data },
        create: { userId, ...data },
      });
      return toSplit(record);
    }
    return db.saveSplitConfig(userId, data);
  }
}
