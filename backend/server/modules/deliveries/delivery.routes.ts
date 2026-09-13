import { Router } from 'express';
import { DeliveryController } from './delivery.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const deliveryRoutes = Router();

deliveryRoutes.use(authMiddleware as any);

deliveryRoutes.get('/', DeliveryController.list as any);
deliveryRoutes.get('/:id', DeliveryController.getById as any);
deliveryRoutes.post('/', DeliveryController.create as any);
deliveryRoutes.put('/:id', DeliveryController.update as any);
deliveryRoutes.delete('/:id', DeliveryController.delete as any);
