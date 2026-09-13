import { z } from 'zod';

export const gasolineFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
  amount: z.number().min(0.01, 'Informe um valor válido de combustível'),
  liters: z.number().optional(),
  description: z.string().optional(),
});

export type GasolineFormValues = {
  date: string;
  amount: number;
  liters?: number;
  description?: string;
};
