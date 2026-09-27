export type UserRole =
  | 'CITIZEN'
  | 'GOVERNMENT'
  | 'UNIVERSITY'
  | 'STUDENT'
  | 'FACULTY'
  | 'INDUSTRY'
  | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  organizationOrDepartment?: string;
  district?: string;
  designation?: string;
  passwordHash?: string;
  isVerified: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  district?: string;
  block?: string;
  village?: string;
  address?: string;
  avatarUrl?: string;
  bio?: string;
  organizationId?: string;
  designation?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<User, 'passwordHash'> & {
  profile?: UserProfile;
};

export interface UserQueryFilters {
  role?: UserRole;
  district?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  organizationOrDepartment?: string;
  district?: string;
  designation?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
