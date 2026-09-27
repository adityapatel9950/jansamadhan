import { UserRole } from './user.js';
import { PaginationOptions, SortOptions } from '../utils/dbUtils.js';

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
  // legacy alias compatibility
  | 'ACCEPTED';

export type ChallengePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ChallengeCategoryType =
  | 'Education'
  | 'Healthcare'
  | 'Agriculture'
  | 'Water'
  | 'Sanitation'
  | 'Environment'
  | 'Energy'
  | 'Urban Infrastructure'
  | 'Accessibility'
  | 'Public Administration'
  | 'Rural Livelihoods'
  | 'Other';

/**
 * Phase 3 Canonical Challenge Entity
 */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  category: string;
  priority: ChallengePriority;
  status: ChallengeStatus;
  district: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  submittedBy: string; // user_id
  submittedByName?: string;
  submittedByRole?: UserRole;
  submittedByUserId?: string;
  verifiedBy?: string;
  verificationStatus: VerificationStatus;
  departmentId?: string;
  departmentName?: string;
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

export interface ChallengeMedia {
  id: string;
  challengeId: string;
  mediaType: 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO';
  url: string;
  caption?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ChallengeAssignment {
  id: string;
  challengeId: string;
  assignedToEntityType: 'DEPARTMENT' | 'UNIVERSITY' | 'STUDENT_TEAM' | 'FACULTY';
  assignedToId: string;
  assignedBy: string;
  status: 'ASSIGNED' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';
  remarks?: string;
  assignedAt: string;
  updatedAt: string;
}

export interface CreateChallengeDTO {
  title: string;
  description: string;
  categoryId?: string;
  category: string;
  priority?: ChallengePriority;
  district: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  departmentId?: string;
  departmentName?: string;
  locationDetails?: string;
  impactedPopulationEstimate?: number;
  contactPreference?: 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP';
  supportingImageUrl?: string;
  supportingDocumentUrl?: string;
  status?: ChallengeStatus;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateChallengeDTO {
  title?: string;
  description?: string;
  category?: string;
  priority?: ChallengePriority;
  district?: string;
  block?: string;
  village?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  impactedPopulationEstimate?: number;
  contactPreference?: 'PHONE' | 'EMAIL' | 'PORTAL' | 'WHATSAPP';
  supportingImageUrl?: string;
  supportingDocumentUrl?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateChallengeStatusDTO {
  status: ChallengeStatus;
  verifiedBy?: string;
  verificationStatus?: VerificationStatus;
  remarks?: string;
}

export interface ChallengeQueryFilters extends PaginationOptions, SortOptions {
  status?: ChallengeStatus;
  categoryId?: string;
  category?: string;
  district?: string;
  block?: string;
  village?: string;
  verificationStatus?: VerificationStatus;
  departmentId?: string;
  submittedByUserId?: string;
  submittedBy?: string;
  search?: string;
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
