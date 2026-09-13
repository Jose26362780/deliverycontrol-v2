import { db } from '../../db/database';
import { SplitRuleConfig } from '../../types';
import { UpdateSplitConfigInput } from './settings.schemas';

export class SettingsService {
  public static getSplitConfig(userId: string): SplitRuleConfig {
    return db.getSplitConfig(userId);
  }

  public static updateSplitConfig(userId: string, data: UpdateSplitConfigInput): SplitRuleConfig {
    const current = db.getSplitConfig(userId);
    current.carPercentage = data.carPercentage;
    current.employeeAPercentage = data.employeeAPercentage;
    current.employeeBPercentage = data.employeeBPercentage;
    current.updatedAt = new Date().toISOString();
    db.saveToDisk();
    return current;
  }
}

