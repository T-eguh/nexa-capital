import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/activity
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const auditLogs = db.getAuditLogs ? db.getAuditLogs() : [];

  return res.status(200).json({
    success: true,
    activityLogs: auditLogs,
  });
});

export default router;
