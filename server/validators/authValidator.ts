import { RegisterDTO, LoginDTO, UserRole } from '../types/user.js';

const VALID_ROLES: UserRole[] = [
  'CITIZEN',
  'GOVERNMENT',
  'UNIVERSITY',
  'STUDENT',
  'FACULTY',
  'INDUSTRY',
  'ADMIN',
];

export const validateRegisterInput = (data: Partial<RegisterDTO>): { isValid: boolean; error?: string } => {
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    return { isValid: false, error: 'A valid email address is required.' };
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters.' };
  }
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  if (!data.role || !VALID_ROLES.includes(data.role as UserRole)) {
    return { isValid: false, error: `Role must be one of: ${VALID_ROLES.join(', ')}` };
  }
  return { isValid: true };
};

export const validateLoginInput = (data: Partial<LoginDTO>): { isValid: boolean; error?: string } => {
  if (!data.email || typeof data.email !== 'string') {
    return { isValid: false, error: 'Email is required.' };
  }
  if (!data.password || typeof data.password !== 'string') {
    return { isValid: false, error: 'Password is required.' };
  }
  return { isValid: true };
};
