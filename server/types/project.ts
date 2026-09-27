import { PaginationOptions, SortOptions } from '../utils/dbUtils.js';

export type ProjectStage = 'IDEATION' | 'PROTOTYPE' | 'PILOT_READY' | 'FIELD_TESTING' | 'DEPLOYED';
export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ABANDONED';
export type MilestoneStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'OVERDUE';

export interface Project {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  teamId?: string;
  universityId?: string;
  industryPartnerId?: string;
  stage: ProjectStage;
  budgetAllocated: number;
  startDate?: string;
  targetCompletionDate?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  // Joined convenience fields
  challengeTitle?: string;
  universityName?: string;
  teamName?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  roleInProject: 'LEAD' | 'DEVELOPER' | 'HARDWARE_ENG' | 'FIELD_TESTER' | 'MENTOR';
  joinedAt: string;
  userName?: string;
  userEmail?: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  dueDate?: string;
  completionDate?: string;
  status: MilestoneStatus;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolutionProposal {
  id: string;
  challengeId: string;
  proposerId: string;
  proposerRole: string;
  title: string;
  summary: string;
  technicalStack?: string;
  estimatedBudget: number;
  estimatedDurationMonths: number;
  status: 'PROPOSED' | 'UNDER_EVALUATION' | 'SHORTLISTED' | 'APPROVED' | 'REJECTED';
  reviewerFeedback?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ImpactMetric {
  id: string;
  challengeId: string;
  projectId?: string;
  metricKey: string;
  metricValue: number;
  unit: string;
  measuredDate: string;
  verifiedBy?: string;
  createdAt: string;
}

export interface ProjectQueryFilters extends PaginationOptions, SortOptions {
  challengeId?: string;
  universityId?: string;
  teamId?: string;
  stage?: ProjectStage;
  status?: ProjectStatus;
  search?: string;
}
