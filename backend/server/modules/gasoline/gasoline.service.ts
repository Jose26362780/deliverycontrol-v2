import { GasolineRepository } from '../../repositories/gasoline.repository';
import { GasolineExpense } from '../../types';
import { CreateGasolineInput, UpdateGasolineInput, GasolineQueryParams } from './gasoline.schemas';

// Camada fina: regra fica no repository + validação Zod nas rotas/controllers.
export class GasolineService {
  public static list(userId: string, query: GasolineQueryParams = {}): Promise<GasolineExpense[]> {
    return GasolineRepository.list(userId, query.startDate);
  }

  public static async getById(id: string, userId: string): Promise<GasolineExpense> {
    const expense = await GasolineRepository.getById(id, userId);
    if (!expense) throw new Error('Gasto com gasolina não encontrado');
    return expense;
  }

  public static create(data: CreateGasolineInput, userId: string): Promise<GasolineExpense> {
    return GasolineRepository.create(data, userId);
  }

  public static update(id: string, data: UpdateGasolineInput, userId: string): Promise<GasolineExpense> {
    return GasolineRepository.update(id, userId, data);
  }

  public static delete(id: string, userId: string) {
    return GasolineRepository.delete(id, userId);
  }
}
