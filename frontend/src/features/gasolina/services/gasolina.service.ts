import { GasolineService, GasolineFilters } from '../../gasoline/services/gasoline.service';
import { GasolineExpense } from '../../../types';
import { GasolineFormValues } from '../../gasoline/schemas/gasoline.schema';

export interface FiltrosGasolina extends GasolineFilters {}

export class ServicoGasolina {
  public static async listar(filtros?: FiltrosGasolina): Promise<GasolineExpense[]> {
    return GasolineService.list(filtros);
  }

  public static async obterPorId(id: string): Promise<GasolineExpense> {
    return GasolineService.getById(id);
  }

  public static async criar(dados: GasolineFormValues): Promise<GasolineExpense> {
    return GasolineService.create(dados);
  }

  public static async atualizar(id: string, dados: GasolineFormValues): Promise<GasolineExpense> {
    return GasolineService.update(id, dados);
  }

  public static async excluir(id: string): Promise<{ success: boolean }> {
    return GasolineService.delete(id);
  }
}

export const servicoGasolina = ServicoGasolina;
export const gasolineService = ServicoGasolina;
export default ServicoGasolina;
