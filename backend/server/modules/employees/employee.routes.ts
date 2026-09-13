import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

export const employeeRoutes = Router();

employeeRoutes.use(authMiddleware as any);

employeeRoutes.get('/', EmployeeController.list as any);
employeeRoutes.get('/:id', EmployeeController.getById as any);
employeeRoutes.post('/', EmployeeController.create as any);
employeeRoutes.put('/:id', EmployeeController.update as any);
employeeRoutes.delete('/:id', EmployeeController.delete as any);
