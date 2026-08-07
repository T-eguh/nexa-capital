import { Router, Request, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

export interface ReportItem {
  id: string;
  title: string;
  category: 'REVENUE' | 'INVESTMENT' | 'WALLET' | 'TRANSACTION' | 'REFERRAL' | 'REWARD' | 'USER' | 'SYSTEM';
  rangeType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  startDate: string;
  endDate: string;
  summary: {
    totalVolume: number;
    totalTransactions: number;
    successRate: number;
    netGrowth: number;
  };
  generatedBy: string;
  createdAt: string;
}

export const reportStore: ReportItem[] = [
  {
    id: 'rep-001',
    title: 'Laporan Keuangan & Pendapatan Bulanan - Juni 2026',
    category: 'REVENUE',
    rangeType: 'MONTHLY',
    startDate: '2026-06-01',
    endDate: '2026-06-30',
    summary: {
      totalVolume: 1250000000,
      totalTransactions: 342,
      successRate: 98.5,
      netGrowth: 18.2,
    },
    generatedBy: 'SYSTEM_CRON',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rep-002',
    title: 'Laporan Performa Portfolio Fast Yield - Q2 2026',
    category: 'INVESTMENT',
    rangeType: 'QUARTERLY',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    summary: {
      totalVolume: 3400000000,
      totalTransactions: 890,
      successRate: 99.1,
      netGrowth: 24.5,
    },
    generatedBy: 'FINANCE_ADMIN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// GET /api/reports
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    reports: reportStore,
  });
});

// POST /api/reports/generate
router.post('/generate', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, rangeType, startDate, endDate } = req.body;

  if (!category || !rangeType) {
    return res.status(400).json({ success: false, message: 'Kategori dan rentang waktu laporan wajib diisi.' });
  }

  const user = db.findUserById(req.user!.userId);
  const reportTitle = title || `Laporan ${category} (${rangeType}) - ${new Date().toLocaleDateString('id-ID')}`;

  const newReport: ReportItem = {
    id: `rep-${Date.now()}`,
    title: reportTitle,
    category: category as any,
    rangeType: rangeType as any,
    startDate: startDate || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    endDate: endDate || new Date().toISOString().split('T')[0],
    summary: {
      totalVolume: Math.floor(500000000 + Math.random() * 1500000000),
      totalTransactions: Math.floor(150 + Math.random() * 500),
      successRate: Number((95 + Math.random() * 4.9).toFixed(1)),
      netGrowth: Number((10 + Math.random() * 15).toFixed(1)),
    },
    generatedBy: user?.fullName || 'SYSTEM',
    createdAt: new Date().toISOString(),
  };

  reportStore.unshift(newReport);

  return res.status(201).json({
    success: true,
    message: 'Laporan eksekutif berhasil dibuat.',
    report: newReport,
  });
});

export default router;
