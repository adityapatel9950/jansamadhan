import {
  Notification,
  AuditLog,
  NotificationQueryFilters,
} from '../types/notification.js';
import { getDbPool, isDbConnected } from '../config/db.js';
import {
  buildPagination,
  handleDbError,
  PaginationResult,
} from '../utils/dbUtils.js';

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-01',
    userId: 'usr-cit-01',
    title: 'Grievance Verified by Department',
    message: 'Your reported challenge on Ormanjhi low-head irrigation has been verified and accepted for Academic R&D under SIH 2026.',
    type: 'CHALLENGE_STATUS',
    link: '/citizen/challenges',
    isRead: false,
    createdAt: '2026-02-08T14:30:00Z',
  },
  {
    id: 'notif-02',
    userId: 'usr-stu-01',
    title: 'Innovation Proposal Shortlisted',
    message: 'Your solar drip automation proposal has been approved for lab prototype build at BIT Mesra.',
    type: 'PROPOSAL_REVIEW',
    link: '/university/challenges',
    isRead: true,
    createdAt: '2026-02-09T11:00:00Z',
  },
];

const INITIAL_AUDITS: AuditLog[] = [
  {
    id: 'aud-01',
    entityType: 'CHALLENGE',
    entityId: 'ch-2026-001',
    action: 'STATUS_UPDATE_ACCEPTED',
    performedByUserId: 'usr-gov-01',
    details: { previousStatus: 'UNDER_REVIEW', newStatus: 'ACCEPTED' },
    createdAt: '2026-02-08T14:20:00Z',
  },
];

let memoryNotifications: Notification[] = [...INITIAL_NOTIFICATIONS];
let memoryAudits: AuditLog[] = [...INITIAL_AUDITS];

export class NotificationRepository {
  async getNotificationsForUser(filters: NotificationQueryFilters): Promise<PaginationResult<Notification>> {
    const { page, limit, offset } = buildPagination(filters);
    const pool = getDbPool();

    if (pool && isDbConnected()) {
      try {
        let whereClause = 'WHERE user_id = $1';
        const params: unknown[] = [filters.userId];

        if (filters.isRead !== undefined) {
          whereClause += ' AND is_read = $2';
          params.push(filters.isRead);
        }

        const countQuery = `SELECT COUNT(*) as count FROM notifications ${whereClause}`;
        const countRes = await pool.query(countQuery, params);
        const total = parseInt(countRes.rows[0]?.count || '0', 10);

        const selectQuery = `
          SELECT id, user_id, title, message, type, link, is_read, created_at
          FROM notifications
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        const res = await pool.query(selectQuery, [...params, limit, offset]);

        const items: Notification[] = res.rows.map((row) => ({
          id: row.id,
          userId: row.user_id,
          title: row.title,
          message: row.message,
          type: row.type,
          link: row.link,
          isRead: row.is_read,
          createdAt: row.created_at,
        }));

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
      } catch (err) {
        handleDbError(err, 'NotificationRepository.getNotificationsForUser');
      }
    }

    let results = memoryNotifications.filter((n) => n.userId === filters.userId);
    if (filters.isRead !== undefined) {
      results = results.filter((n) => n.isRead === filters.isRead);
    }
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = results.length;
    const items = results.slice(offset, offset + limit);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  async markAsRead(id: string): Promise<boolean> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = 'UPDATE notifications SET is_read = TRUE WHERE id = $1';
        await pool.query(query, [id]);
        return true;
      } catch (err) {
        handleDbError(err, 'NotificationRepository.markAsRead');
      }
    }
    const item = memoryNotifications.find((n) => n.id === id);
    if (item) item.isRead = true;
    return true;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = 'UPDATE notifications SET is_read = TRUE WHERE user_id = $1';
        await pool.query(query, [userId]);
        return true;
      } catch (err) {
        handleDbError(err, 'NotificationRepository.markAllAsRead');
      }
    }
    memoryNotifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    return true;
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: Notification['type'];
    link?: string;
  }): Promise<Notification> {
    const id = `notif-${Date.now()}`;
    const now = new Date().toISOString();
    const notif: Notification = {
      id,
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link,
      isRead: false,
      createdAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO notifications (id, user_id, title, message, type, link, is_read, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id, user_id, title, message, type, link, is_read, created_at
        `;
        const res = await pool.query(query, [
          notif.id,
          notif.userId,
          notif.title,
          notif.message,
          notif.type,
          notif.link || null,
          notif.isRead,
          notif.createdAt,
        ]);
        if (res.rows[0]) return res.rows[0];
      } catch (err) {
        handleDbError(err, 'NotificationRepository.createNotification');
      }
    }

    memoryNotifications.unshift(notif);
    return notif;
  }

  async logAudit(data: {
    entityType: string;
    entityId: string;
    action: string;
    performedByUserId: string;
    details?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const id = `aud-${Date.now()}`;
    const now = new Date().toISOString();
    const audit: AuditLog = {
      id,
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      performedByUserId: data.performedByUserId,
      details: data.details,
      createdAt: now,
    };

    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        const query = `
          INSERT INTO audit_logs (id, entity_type, entity_id, action, performed_by_user_id, details, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, entity_type, entity_id, action, performed_by_user_id, details, created_at
        `;
        await pool.query(query, [
          audit.id,
          audit.entityType,
          audit.entityId,
          audit.action,
          audit.performedByUserId,
          JSON.stringify(audit.details || {}),
          audit.createdAt,
        ]);
        return audit;
      } catch (err) {
        handleDbError(err, 'NotificationRepository.logAudit');
      }
    }

    memoryAudits.unshift(audit);
    return audit;
  }

  async getAuditLogs(entityType?: string, entityId?: string, limit = 20): Promise<AuditLog[]> {
    const pool = getDbPool();
    if (pool && isDbConnected()) {
      try {
        let whereClause = '';
        const params: unknown[] = [];
        if (entityType && entityId) {
          whereClause = 'WHERE entity_type = $1 AND entity_id = $2';
          params.push(entityType, entityId);
        } else if (entityType) {
          whereClause = 'WHERE entity_type = $1';
          params.push(entityType);
        }

        const query = `
          SELECT id, entity_type, entity_id, action, performed_by_user_id, details, created_at
          FROM audit_logs
          ${whereClause}
          ORDER BY created_at DESC
          LIMIT $${params.length + 1}
        `;
        const res = await pool.query(query, [...params, limit]);
        return res.rows.map((row) => ({
          id: row.id,
          entityType: row.entity_type,
          entityId: row.entity_id,
          action: row.action,
          performedByUserId: row.performed_by_user_id,
          details: row.details,
          createdAt: row.created_at,
        }));
      } catch (err) {
        handleDbError(err, 'NotificationRepository.getAuditLogs');
      }
    }

    let results = memoryAudits;
    if (entityType) results = results.filter((a) => a.entityType === entityType);
    if (entityId) results = results.filter((a) => a.entityId === entityId);
    return results.slice(0, limit);
  }
}

export const notificationRepository = new NotificationRepository();
