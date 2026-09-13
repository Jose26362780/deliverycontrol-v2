import { z } from 'zod';

export const employeeFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  role: z.string().optional(),
});

export type EmployeeFormValues = {
  name: string;
  role?: string;
};
