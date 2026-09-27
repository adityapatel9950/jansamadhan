import { Router } from 'express';
import { notificationRepository } from '../repositories/notificationRepository.js';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

const router = Router();

router.get('/', authenticateJwt, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return errorResponse(res, 'Unauthorized', 401);
    const filters = {
      userId: req.user.userId,
      isRead: req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    const result = await notificationRepository.getNotificationsForUser(filters);
    return paginatedResponse(res, result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query notifications';
    return errorResponse(res, msg, 500);
  }
});

router.patch('/:id/read', authenticateJwt, async (req, res) => {
  try {
    await notificationRepository.markAsRead(req.params.id);
    return successResponse(res, { success: true }, 'Notification marked as read');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update notification';
    return errorResponse(res, msg, 500);
  }
});

router.patch('/read-all', authenticateJwt, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return errorResponse(res, 'Unauthorized', 401);
    await notificationRepository.markAllAsRead(req.user.userId);
    return successResponse(res, { success: true }, 'All notifications marked as read');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update notifications';
    return errorResponse(res, msg, 500);
  }
});

router.get('/audits', authenticateJwt, async (req, res) => {
  try {
    const entityType = req.query.entityType as string;
    const entityId = req.query.entityId as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const logs = await notificationRepository.getAuditLogs(entityType, entityId, limit);
    return successResponse(res, logs);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve audit logs';
    return errorResponse(res, msg, 500);
  }
});

export default router;
