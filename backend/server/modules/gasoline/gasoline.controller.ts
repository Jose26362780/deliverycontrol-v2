import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { GasolineService } from './gasoline.service';
import { createGasolineSchema, updateGasolineSchema, gasolineQuerySchema } from './gasoline.schemas';
import { sendError, sendSuccess } from '../../utils/response';

export class GasolineController {
  public static list(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const queryValidation = gasolineQuerySchema.safeParse(req.query);
      const query = queryValidation.success ? queryValidation.data : {};

      const expenses = GasolineService.list(userId, query);
      sendSuccess(res, expenses, 200);
    } catch (error: any) {
      sendError(res, 500, error.message || 'Erro ao listar gastos com gasolina', 'ERRO_INTERNO');
    }
  }

  public static getById(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const expense = GasolineService.getById(id, userId);
      sendSuccess(res, expense, 200);
    } catch (error: any) {
      sendError(res, 404, error.message || 'Gasto não encontrado', 'GASTO_NAO_ENCONTRADO');
    }
  }

  public static create(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const validation = createGasolineSchema.safeParse(req.body);
      if (!validation.success) {
        sendError(res, 400, 'Dados inválidos para registro de gasolina', 'VALIDACAO_ERRO', validation.error.flatten().fieldErrors);
        return;
      }

      const expense = GasolineService.create(validation.data, userId);
      sendSuccess(res, expense, 201);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao registrar gasto com gasolina', 'OPERACAO_INVALIDA');
    }
  }

  public static update(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validation = updateGasolineSchema.safeParse(req.body);
      if (!validation.success) {
        sendError(res, 400, 'Dados inválidos para atualização de gasolina', 'VALIDACAO_ERRO', validation.error.flatten().fieldErrors);
        return;
      }

      const updated = GasolineService.update(id, validation.data, userId);
      sendSuccess(res, updated, 200);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao atualizar gasto com gasolina', 'OPERACAO_INVALIDA');
    }
  }

  public static delete(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = GasolineService.delete(id, userId);
      sendSuccess(res, result, 200);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao excluir gasto', 'OPERACAO_INVALIDA');
    }
  }
}

