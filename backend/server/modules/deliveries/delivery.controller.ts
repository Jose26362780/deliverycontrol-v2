import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { DeliveryService } from './delivery.service';
import { createDeliverySchema, updateDeliverySchema, deliveryQuerySchema } from './delivery.schemas';
import { sendError, sendSuccess } from '../../utils/response';

export class DeliveryController {
  public static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const queryValidation = deliveryQuerySchema.safeParse(req.query);
      const query = queryValidation.success ? queryValidation.data : {};

      const deliveries = await DeliveryService.list(userId, query);
      sendSuccess(res, deliveries, 200);
    } catch (error: any) {
      sendError(res, 500, error.message || 'Erro ao listar entregas', 'ERRO_INTERNO');
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const delivery = await DeliveryService.getById(id, userId);
      sendSuccess(res, delivery, 200);
    } catch (error: any) {
      sendError(res, 404, error.message || 'Entrega não encontrada', 'ENTREGA_NAO_ENCONTRADA');
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const validation = createDeliverySchema.safeParse(req.body);
      if (!validation.success) {
        sendError(res, 400, 'Dados inválidos para criação da entrega', 'VALIDACAO_ERRO', validation.error.flatten().fieldErrors);
        return;
      }

      const delivery = await DeliveryService.create(validation.data, userId);
      sendSuccess(res, delivery, 201);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao criar entrega', 'OPERACAO_INVALIDA');
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validation = updateDeliverySchema.safeParse(req.body);
      if (!validation.success) {
        sendError(res, 400, 'Dados inválidos para atualização da entrega', 'VALIDACAO_ERRO', validation.error.flatten().fieldErrors);
        return;
      }

      const updated = await DeliveryService.update(id, validation.data, userId);
      sendSuccess(res, updated, 200);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao atualizar entrega', 'OPERACAO_INVALIDA');
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await DeliveryService.delete(id, userId);
      sendSuccess(res, result, 200);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao excluir entrega', 'OPERACAO_INVALIDA');
    }
  }
}
