import { departmentRepository } from '../repositories/departmentRepository.js';
import { Department } from '../types/department.js';

export class DepartmentService {
  async getAllDepartments(): Promise<Department[]> {
    return departmentRepository.findAll();
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    return departmentRepository.findById(id);
  }
}

export const departmentService = new DepartmentService();
