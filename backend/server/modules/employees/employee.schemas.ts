import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Nome do funcionário deve ter no mínimo 2 caracteres'),
  role: z.string().optional().default('Entregador'),
  phone: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(2, 'Nome do funcionário deve ter no mínimo 2 caracteres').optional(),
  role: z.string().optional(),
  phone: z.string().optional(),
  active: z.boolean().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
