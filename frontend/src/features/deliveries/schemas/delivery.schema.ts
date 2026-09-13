import { z } from 'zod';

export const deliveryFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
  employeeAId: z.string().min(1, 'Selecione o Funcionário A'),
  employeeBId: z.string().optional().nullable(),
  deliveryCount: z.number().int().min(1, 'Mínimo de 1 entrega'),
  revenue: z.number().min(0, 'O valor gerado deve ser positivo'),
  notes: z.string().optional(),
}).refine(data => {
  if (data.employeeBId && data.employeeBId === data.employeeAId) {
    return false;
  }
  return true;
}, {
  message: 'Funcionário A e Funcionário B não podem ser a mesma pessoa',
  path: ['employeeBId'],
});

export type DeliveryFormValues = {
  date: string;
  employeeAId: string;
  employeeBId?: string | null;
  deliveryCount: number;
  revenue: number;
  notes?: string;
};
