import { PaginationOptions } from '../utils/dbUtils.js';

export type NotificationType =
  | 'CHALLENGE_STATUS'
  | 'PROPOSAL_REVIEW'
  | 'ASSIGNMENT'
  | 'MILESTONE_ALERT'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  performedByUserId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationQueryFilters extends PaginationOptions {
  userId: string;
  isRead?: boolean;
}
