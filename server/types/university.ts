import { PaginationOptions, SortOptions } from '../utils/dbUtils.js';

export interface University {
  id: string;
  name: string;
  code: string;
  district: string;
  institutionType?: string;
  contactEmail?: string;
  contactPhone?: string;
  incubationCellName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Faculty {
  id: string;
  userId: string;
  universityId: string;
  departmentName: string;
  specialization?: string;
  designation?: string;
  labName?: string;
  createdAt: string;
  updatedAt: string;
  // Hydrated user details
  fullName?: string;
  email?: string;
  universityName?: string;
}

export interface StudentTeam {
  id: string;
  teamName: string;
  universityId: string;
  leadStudentId: string;
  facultyMentorId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  // Hydrated fields
  leadStudentName?: string;
  universityName?: string;
  memberCount?: number;
}

export interface UniversityQueryFilters extends PaginationOptions, SortOptions {
  district?: string;
  institutionType?: string;
  search?: string;
}
