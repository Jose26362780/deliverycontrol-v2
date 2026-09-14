import { DeliveryRepository } from '../../repositories/delivery.repository';
import { DeliveryWithEmployees } from '../../types';
import { CreateDeliveryInput, UpdateDeliveryInput, DeliveryQueryParams } from './delivery.schemas';

export class DeliveryService {
  public static async list(userId: string, query: DeliveryQueryParams = {}): Promise<DeliveryWithEmployees[]> {
    return DeliveryRepository.list(userId, query);
  }

  public static async getById(id: string, userId: string): Promise<DeliveryWithEmployees> {
    const delivery = await DeliveryRepository.getById(id, userId);
    if (!delivery) {
      throw new Error('Registro de entrega não encontrado');
    }
    return delivery;
  }

  public static async create(data: CreateDeliveryInput, userId: string): Promise<DeliveryWithEmployees> {
    return DeliveryRepository.create(data, userId);
  }

  public static async update(id: string, data: UpdateDeliveryInput, userId: string): Promise<DeliveryWithEmployees> {
    return DeliveryRepository.update(id, data, userId);
  }

  public static async delete(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    return DeliveryRepository.delete(id, userId);
  }
}
