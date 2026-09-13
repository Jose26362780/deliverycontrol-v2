import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const settingsRoutes = Router();

settingsRoutes.use(authMiddleware as any);

settingsRoutes.get('/split', SettingsController.getSplitConfig as any);
settingsRoutes.put('/split', SettingsController.updateSplitConfig as any);
