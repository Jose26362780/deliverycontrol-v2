import { SplitConfigRepository } from '../../repositories/split-config.repository';
import { SplitRuleConfig } from '../../types';
import { UpdateSplitConfigInput } from './settings.schemas';

export class SettingsService {
  public static async getSplitConfig(userId: string): Promise<SplitRuleConfig> {
    return SplitConfigRepository.get(userId);
  }

  public static async updateSplitConfig(userId: string, data: UpdateSplitConfigInput): Promise<SplitRuleConfig> {
    return SplitConfigRepository.update(userId, data);
  }
}
