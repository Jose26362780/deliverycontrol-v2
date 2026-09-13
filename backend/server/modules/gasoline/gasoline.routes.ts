import { Router } from 'express';
import { GasolineController } from './gasoline.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const gasolineRoutes = Router();

gasolineRoutes.use(authMiddleware as any);

gasolineRoutes.get('/', GasolineController.list as any);
gasolineRoutes.get('/:id', GasolineController.getById as any);
gasolineRoutes.post('/', GasolineController.create as any);
gasolineRoutes.put('/:id', GasolineController.update as any);
gasolineRoutes.delete('/:id', GasolineController.delete as any);
