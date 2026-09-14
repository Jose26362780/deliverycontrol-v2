import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.schemas';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const validation = registerSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ 
          error: 'Datos inválidos', 
          details: validation.error.flatten().fieldErrors 
        });
        return;
      }

      const result = await AuthService.register(validation.data);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error al registrar usuario' });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ 
          error: 'Datos inválidos', 
          details: validation.error.flatten().fieldErrors 
        });
        return;
      }

      const result = await AuthService.login(validation.data);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Error al iniciar sesión' });
    }
  }

  public static logout(req: Request, res: Response): void {
    res.status(200).json({ message: 'Sesión cerrada con éxito' });
  }

  public static async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autorizado' });
        return;
      }

      const user = await AuthService.getMe(req.user.id);
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(404).json({ error: error.message || 'Usuario no encontrado' });
    }
  }
}
