import { UserRole } from './auth';

export type ChallengeStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PILOT'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ACCEPTED'; // legacy alias

export type ChallengePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export const CITIZEN_CHALLENGE_CATEGORIES = [
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
] as const;

export type ChallengeCategory = (typeof CITIZEN_CHALLENGE_CATEGORIES)[number];

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  district: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  departmentId?: string;
  departmentName?: string;
  submittedBy: string;
  submittedByUserId: string;
  submittedByName: string;
  submittedByRole: UserRole;
  verifiedBy?: string;
  verificationStatus?: VerificationStatus;
  status: ChallengeStatus;
  priority: ChallengePriority;
  locationDetails?: string;
  impactedPopulationEstimate?: number;
  contactPreference?: 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP';
  supportingImageUrl?: string;
  supportingDocumentUrl?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChallengeInput {
  title: string;
  description: string;
  category: string;
  district: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  priority?: ChallengePriority;
  impactedPopulationEstimate?: number;
  contactPreference?: 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP';
  supportingImageUrl?: string;
  supportingDocumentUrl?: string;
  status?: ChallengeStatus;
  departmentId?: string;
  departmentName?: string;
  tags?: string[];
}

export interface UpdateChallengeInput {
  title?: string;
  description?: string;
  category?: string;
  district?: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  priority?: ChallengePriority;
  impactedPopulationEstimate?: number;
  contactPreference?: 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP';
  supportingImageUrl?: string;
  supportingDocumentUrl?: string;
  tags?: string[];
}

export interface ChallengeFilterState {
  status?: string;
  category?: string;
  district?: string;
  block?: string;
  submittedBy?: string;
  submittedByUserId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  category: string;
  nodalOfficerName?: string;
  nodalOfficerEmail?: string;
  contactPhone?: string;
  description?: string;
}

export interface ChallengeStats {
  total: number;
  submitted: number;
  underReview: number;
  accepted: number;
  inProgress: number;
  resolved: number;
  byCategory: Record<string, number>;
  byDistrict: Record<string, number>;
}
