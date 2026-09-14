import { z } from 'zod';

// Schemas comuns: params e query validados em todas as rotas protegidas.
// Regra Antigravity: nunca confiar em body/params/query do cliente.
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório').max(100, 'ID inválido'),
});

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve ser AAAA-MM-DD');

export const rangeQuerySchema = z.object({
  startDate: dateOnly.optional(),
  endDate: dateOnly.optional(),
  employeeId: z.string().min(1).max(100).optional(),
}).refine(
  data => !data.startDate || !data.endDate || data.startDate <= data.endDate,
  { message: 'startDate não pode ser maior que endDate', path: ['endDate'] },
);

export type IdParam = z.infer<typeof idParamSchema>;
export type RangeQuery = z.infer<typeof rangeQuerySchema>;
