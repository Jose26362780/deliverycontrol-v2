import { z } from 'zod';

export const createDeliverySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
  employeeAId: z.string().min(1, 'Funcionário A é obrigatório'),
  employeeBId: z.string().nullable().optional(),
  deliveryCount: z.coerce.number().int().min(1, 'Quantidade de entregas deve ser no mínimo 1'),
  revenue: z.coerce.number().min(0, 'Receita não pode ser negativa'),
  notes: z.string().optional(),
});

export const updateDeliverySchema = createDeliverySchema.partial();

export const deliveryQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  employeeId: z.string().optional(),
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;
export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>;
export type DeliveryQueryParams = z.infer<typeof deliveryQuerySchema>;
