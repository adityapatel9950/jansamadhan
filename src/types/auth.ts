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
  isVerified: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  organizationOrDepartment?: string;
  district?: string;
  designation?: string;
}
