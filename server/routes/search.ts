import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';
import { depositStore, withdrawalStore } from './payments';
import { announcementStore } from './announcements';
import { SAMPLE_PRODUCTS } from './products';

const router = Router();

// GET /api/search?q=query
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();

  if (!query) {
    return res.status(200).json({
      success: true,
      results: {
        products: [],
        deposits: [],
        withdrawals: [],
        announcements: [],
      },
    });
  }

  const products = SAMPLE_PRODUCTS.filter((p) => p.name?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query));
  const deposits = depositStore.filter((d) => d.referenceNo?.toLowerCase().includes(query) || d.paymentMethodCode?.toLowerCase().includes(query));
  const withdrawals = withdrawalStore.filter((w) => w.referenceNo?.toLowerCase().includes(query) || w.bankName?.toLowerCase().includes(query));
  const announcements = announcementStore.filter((a) => a.title?.toLowerCase().includes(query) || a.content?.toLowerCase().includes(query));

  return res.status(200).json({
    success: true,
    results: {
      products,
      deposits,
      withdrawals,
      announcements,
    },
  });
});

export default router;

