import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { db } from '../db/database';
import { fromNodeHeaders } from 'better-auth/node';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  if (config.betterAuth.enabled) {
    try {
      const { auth } = await import('../auth/better-auth');
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.user) {
        res.status(401).json({ error: 'Sessão não encontrada ou expirada' });
        return;
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      };
      next();
    } catch {
      res.status(401).json({ error: 'Não foi possível validar a sessão' });
    }
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido ou inválido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    const user = db.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token expirado ou inválido' });
  }
}
