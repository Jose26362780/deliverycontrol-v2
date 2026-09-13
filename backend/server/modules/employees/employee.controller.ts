import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { EmployeeService } from './employee.service';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.schemas';
import { sendError, sendSuccess } from '../../utils/response';

export class EmployeeController {
  public static list(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const employees = EmployeeService.list(userId);
      sendSuccess(res, employees, 200);
    } catch (error: any) {
      sendError(res, 500, error.message || 'Erro ao listar funcionários', 'ERRO_INTERNO');
    }
  }

  public static getById(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const employee = EmployeeService.getById(id, userId);
      sendSuccess(res, employee, 200);
    } catch (error: any) {
      sendError(res, 404, error.message || 'Funcionário não encontrado', 'FUNCIONARIO_NAO_ENCONTRADO');
    }
  }

  public static create(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const validation = createEmployeeSchema.safeParse(req.body);
      if (!validation.success) {
        sendError(res, 400, 'Dados inválidos para criação do funcionário', 'VALIDACAO_ERRO', validation.error.flatten().fieldErrors);
        return;
      }

      const employee = EmployeeService.create(validation.data, userId);
      sendSuccess(res, employee, 201);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao criar funcionário', 'OPERACAO_INVALIDA');
    }
  }

  public static update(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const validation = updateEmployeeSchema.safeParse(req.body);
      if (!validation.success) {
        sendError(res, 400, 'Dados inválidos para atualização do funcionário', 'VALIDACAO_ERRO', validation.error.flatten().fieldErrors);
        return;
      }

      const updated = EmployeeService.update(id, validation.data, userId);
      sendSuccess(res, updated, 200);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao atualizar funcionário', 'OPERACAO_INVALIDA');
    }
  }

  public static delete(req: AuthenticatedRequest, res: Response): void {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = EmployeeService.delete(id, userId);
      sendSuccess(res, result, 200);
    } catch (error: any) {
      sendError(res, 400, error.message || 'Erro ao excluir funcionário', 'OPERACAO_INVALIDA');
    }
  }
}

