import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response';

// Valida params OU query com Zod e retorna 400 padronizado.
// Uso: router.get('/:id', validateParams(idParamSchema), handler)
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      sendError(res, 400, 'Parâmetro da URL inválido', 'VALIDACAO_ERRO', parsed.error.flatten().fieldErrors);
      return;
    }
    req.params = parsed.data as any;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      sendError(res, 400, 'Filtro da URL inválido', 'VALIDACAO_ERRO', parsed.error.flatten().fieldErrors);
      return;
    }
    req.query = parsed.data as any;
    next();
  };
}
