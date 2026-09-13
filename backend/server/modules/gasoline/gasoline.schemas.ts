import { z } from 'zod';

export const createGasolineSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
  amount: z.coerce.number().min(0.01, 'Valor da gasolina deve ser maior que zero'),
  liters: z.coerce.number().optional(),
  description: z.string().optional(),
});

export const updateGasolineSchema = createGasolineSchema.partial();

export const gasolineQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateGasolineInput = z.infer<typeof createGasolineSchema>;
export type UpdateGasolineInput = z.infer<typeof updateGasolineSchema>;
export type GasolineQueryParams = z.infer<typeof gasolineQuerySchema>;
