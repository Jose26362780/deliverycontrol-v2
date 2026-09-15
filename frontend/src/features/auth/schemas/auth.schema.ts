import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const registerFormSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'La confirmación de contraseña es obligatoria'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
