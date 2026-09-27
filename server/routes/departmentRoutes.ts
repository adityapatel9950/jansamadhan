import { Router } from 'express';
import { departmentController } from '../controllers/departmentController.js';

const router = Router();

router.get('/', (req, res) => departmentController.getAllDepartments(req, res));
router.get('/:id', (req, res) => departmentController.getDepartmentById(req, res));

export default router;
