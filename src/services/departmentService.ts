import { apiClient } from './apiClient';
import { Department } from '../types/challenge';

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    return apiClient.get<Department[]>('/departments');
  },

  async getDepartmentById(id: string): Promise<Department> {
    return apiClient.get<Department>(`/departments/${id}`);
  },
};
