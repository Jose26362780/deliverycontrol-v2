import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { SettingsService } from './settings.service';
import { updateSplitConfigSchema } from './settings.schemas';
import { sendError, sendSuccess } from '../../utils/response';

export class SettingsController {
  public static async getSplitConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const config = await SettingsService.getSplitConfig(userId);
      sendSuccess(res, config, 200);
    } catch (error: any) {
      sendError(res, 500, error.message || 'Erro ao carregar configurações de divisão', 'ERRO_INTERNO');
    }
  }

  public static async updateSplitConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const validation = updateSplitConfigSchema.safeParse(req.body);
      if (!validation.success) {
        sendError(
          res,
          400,
          'A soma dos percentuais deve ser exatamente 100%',
          'PERCENTUAL_INVALIDO',
          validation.error.flatten().fieldErrors
        );
        return;
      }

      const updated = await SettingsService.updateSplitConfig(userId, validation.data);
      res.status(200).json({
        ...updated,
        success: true,
        splitConfig: {
          carPercentage: updated.carPercentage,
          employeeAPercentage: updated.employeeAPercentage,
          employeeBPercentage: updated.employeeBPercentage,
        }
      });
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao salvar configurações', 'OPERACAO_INVALIDA');
    }
  }
}
