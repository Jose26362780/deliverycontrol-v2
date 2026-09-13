import { DeliveryService, DeliveryFilters } from '../../deliveries/services/delivery.service';
import { Delivery } from '../../../types';
import { DeliveryFormValues } from '../../deliveries/schemas/delivery.schema';

export interface FiltrosEntrega extends DeliveryFilters {}

export class ServicoEntrega {
  public static async listar(filtros?: FiltrosEntrega): Promise<Delivery[]> {
    return DeliveryService.list(filtros);
  }

  public static async obterPorId(id: string): Promise<Delivery> {
    return DeliveryService.getById(id);
  }

  public static async criar(dados: DeliveryFormValues): Promise<Delivery> {
    return DeliveryService.create(dados);
  }

  public static async atualizar(id: string, dados: DeliveryFormValues): Promise<Delivery> {
    return DeliveryService.update(id, dados);
  }

  public static async excluir(id: string): Promise<{ success: boolean }> {
    return DeliveryService.delete(id);
  }
}

export const servicoEntrega = ServicoEntrega;
export const deliveryService = ServicoEntrega;
export default ServicoEntrega;
