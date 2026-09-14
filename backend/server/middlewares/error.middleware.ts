import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { config } from '../config';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Dados da requisição inválidos',
      code: 'VALIDACAO_ERRO',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Handle CORS errors
  if (err.message === 'Origem não permitida pelo CORS') {
    res.status(403).json({
      success: false,
      error: 'Origem não permitida pela política de CORS',
      code: 'CORS_PROIBIDO',
    });
    return;
  }

  // Handle JSON body limit error
  if (err.type === 'entity.too.large') {
    res.status(413).json({
      success: false,
      error: 'Payload da requisição excede o tamanho máximo permitido',
      code: 'PAYLOAD_MUITO_GRANDE',
    });
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  const isProduction = config.nodeEnv === 'production';

  res.status(statusCode).json({
    success: false,
    error: isProduction && statusCode === 500 ? 'Erro interno no servidor' : err.message || 'Erro interno',
    code: err.code || 'ERRO_INTERNO',
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

