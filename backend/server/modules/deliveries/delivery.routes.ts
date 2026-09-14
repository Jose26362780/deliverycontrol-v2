import { Router } from 'express';
import { DeliveryController } from './delivery.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateParams, validateQuery } from '../../middlewares/validate.middleware';
import { idParamSchema, rangeQuerySchema } from '../../utils/validation';

export const deliveryRoutes = Router();

deliveryRoutes.use(authMiddleware as any);

deliveryRoutes.get('/', validateQuery(rangeQuerySchema), DeliveryController.list as any);
deliveryRoutes.get('/:id', validateParams(idParamSchema), DeliveryController.getById as any);
deliveryRoutes.post('/', DeliveryController.create as any);
deliveryRoutes.put('/:id', validateParams(idParamSchema), DeliveryController.update as any);
deliveryRoutes.delete('/:id', validateParams(idParamSchema), DeliveryController.delete as any);
