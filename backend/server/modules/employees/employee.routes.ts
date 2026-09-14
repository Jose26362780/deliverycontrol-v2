import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateParams } from '../../middlewares/validate.middleware';
import { idParamSchema } from '../../utils/validation';

export const employeeRoutes = Router();

employeeRoutes.use(authMiddleware as any);

employeeRoutes.get('/', EmployeeController.list as any);
employeeRoutes.get('/:id', validateParams(idParamSchema), EmployeeController.getById as any);
employeeRoutes.post('/', EmployeeController.create as any);
employeeRoutes.put('/:id', validateParams(idParamSchema), EmployeeController.update as any);
employeeRoutes.delete('/:id', validateParams(idParamSchema), EmployeeController.delete as any);
