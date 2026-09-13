import { Response } from 'express';

export interface StandardErrorPayload {
  success: false;
  error: string;
  code: string;
  details?: any;
}

export function sendSuccess<T = any>(res: Response, data: T, status: number = 200): Response {
  return res.status(status).json(data);
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  code: string = 'ERRO_GENERICO',
  details?: any
): Response {
  const payload: StandardErrorPayload = {
    success: false,
    error: message,
    code,
  };

  if (details !== undefined) {
    payload.details = details;
  }

  return res.status(status).json(payload);
}
