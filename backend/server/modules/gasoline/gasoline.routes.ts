import { Router } from 'express';
import { GasolineController } from './gasoline.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateParams, validateQuery } from '../../middlewares/validate.middleware';
import { idParamSchema, rangeQuerySchema } from '../../utils/validation';

export const gasolineRoutes = Router();

gasolineRoutes.use(authMiddleware as any);

gasolineRoutes.get('/', validateQuery(rangeQuerySchema), GasolineController.list as any);
gasolineRoutes.get('/:id', validateParams(idParamSchema), GasolineController.getById as any);
gasolineRoutes.post('/', GasolineController.create as any);
gasolineRoutes.put('/:id', validateParams(idParamSchema), GasolineController.update as any);
gasolineRoutes.delete('/:id', validateParams(idParamSchema), GasolineController.delete as any);
