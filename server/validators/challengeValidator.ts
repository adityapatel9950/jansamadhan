import { CreateChallengeDTO, UpdateChallengeDTO, ChallengeStatus, ChallengePriority } from '../types/challenge.js';

export const VALID_STATUSES: ChallengeStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'PILOT',
  'RESOLVED',
  'CLOSED',
  'ACCEPTED',
];

export const VALID_PRIORITIES: ChallengePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const VALID_CATEGORIES = [
  'Education',
  'Healthcare',
  'Agriculture',
  'Water',
  'Sanitation',
  'Environment',
  'Energy',
  'Urban Infrastructure',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Other',
];

export const validateCreateChallengeInput = (
  data: Partial<CreateChallengeDTO>
): { isValid: boolean; error?: string } => {
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 5) {
    return { isValid: false, error: 'Problem title must be at least 5 characters long.' };
  }
  if (data.title.trim().length > 300) {
    return { isValid: false, error: 'Problem title must not exceed 300 characters.' };
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 20) {
    return { isValid: false, error: 'Detailed description must be at least 20 characters long.' };
  }
  if (!data.category || typeof data.category !== 'string') {
    return { isValid: false, error: 'A valid problem category is required.' };
  }
  if (!data.district || typeof data.district !== 'string' || data.district.trim().length === 0) {
    return { isValid: false, error: 'Jharkhand District is required.' };
  }

  if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
    return { isValid: false, error: `Problem severity must be one of: ${VALID_PRIORITIES.join(', ')}` };
  }

  if (data.latitude !== undefined && data.latitude !== null) {
    const lat = Number(data.latitude);
    if (isNaN(lat) || lat < 21.0 || lat > 26.0) {
      return { isValid: false, error: 'Latitude must be a valid coordinate within Jharkhand region (21.0 - 26.0° N).' };
    }
  }

  if (data.longitude !== undefined && data.longitude !== null) {
    const lng = Number(data.longitude);
    if (isNaN(lng) || lng < 83.0 || lng > 88.5) {
      return { isValid: false, error: 'Longitude must be a valid coordinate within Jharkhand region (83.0 - 88.5° E).' };
    }
  }

  if (data.impactedPopulationEstimate !== undefined && data.impactedPopulationEstimate !== null) {
    const pop = Number(data.impactedPopulationEstimate);
    if (isNaN(pop) || pop < 0) {
      return { isValid: false, error: 'Estimated people affected must be a non-negative number.' };
    }
  }

  return { isValid: true };
};

export const validateUpdateChallengeInput = (
  data: Partial<UpdateChallengeDTO>
): { isValid: boolean; error?: string } => {
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length < 5) {
      return { isValid: false, error: 'Problem title must be at least 5 characters long.' };
    }
  }
  if (data.description !== undefined) {
    if (typeof data.description !== 'string' || data.description.trim().length < 20) {
      return { isValid: false, error: 'Detailed description must be at least 20 characters long.' };
    }
  }
  if (data.priority && !VALID_PRIORITIES.includes(data.priority)) {
    return { isValid: false, error: `Problem severity must be one of: ${VALID_PRIORITIES.join(', ')}` };
  }
  return { isValid: true };
};

export const validateStatusUpdate = (
  status: unknown
): { isValid: boolean; error?: string } => {
  if (!status || typeof status !== 'string' || !VALID_STATUSES.includes(status as ChallengeStatus)) {
    return { isValid: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` };
  }
  return { isValid: true };
};
