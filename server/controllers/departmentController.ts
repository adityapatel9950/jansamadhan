import { Request, Response } from 'express';
import { departmentService } from '../services/departmentService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class DepartmentController {
  async getAllDepartments(_req: Request, res: Response) {
    try {
      const departments = await departmentService.getAllDepartments();
      return successResponse(res, departments);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve departments.';
      return errorResponse(res, msg, 500);
    }
  }

  async getDepartmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dept = await departmentService.getDepartmentById(id);
      if (!dept) {
        return errorResponse(res, 'Department not found', 404);
      }
      return successResponse(res, dept);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve department.';
      return errorResponse(res, msg, 500);
    }
  }
}

export const departmentController = new DepartmentController();
