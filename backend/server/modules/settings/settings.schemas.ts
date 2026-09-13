import { z } from 'zod';

export const updateSplitConfigSchema = z.object({
  carPercentage: z.coerce.number().min(0).max(100),
  employeeAPercentage: z.coerce.number().min(0).max(100),
  employeeBPercentage: z.coerce.number().min(0).max(100),
}).refine(
  data => Math.abs((data.carPercentage + data.employeeAPercentage + data.employeeBPercentage) - 100) < 0.01,
  { message: 'A soma das porcentagens (Carro + Funcionário A + Funcionário B) deve ser exatamente 100%' }
);

export type UpdateSplitConfigInput = z.infer<typeof updateSplitConfigSchema>;
