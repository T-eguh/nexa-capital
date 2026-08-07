import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/notifications
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const notifications = db.getNotificationsByUserId(userId);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  db.markNotificationRead(userId, id);

  return res.status(200).json({
    success: true,
    message: 'Notifikasi telah ditandai dibaca.',
  });
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;

  db.markAllNotificationsRead(userId);

  return res.status(200).json({
    success: true,
    message: 'Semua notifikasi telah ditandai dibaca.',
  });
});

export default router;
