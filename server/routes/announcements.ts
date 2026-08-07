import { Router, Request, Response } from 'express';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetRole: 'ALL' | 'USER' | 'ADMIN' | 'VIP';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export const announcementStore: AnnouncementItem[] = [
  {
    id: 'ann-001',
    title: '🚀 Pembagian Dividen Saham Perbankan Q2 Telah Didistribusikan!',
    content: 'Seluruh pemegang paket dividen saham BBCA dan BMRI telah menerima pembayaran dividen harian langsung ke Profit Wallet Anda. Terima kasih atas kepercayaan Anda di Nexa Capital.',
    targetRole: 'ALL',
    priority: 'HIGH',
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ann-002',
    title: '⚡ Pemeliharaan Sistem Gateway Pembayaran Virtual Account',
    content: 'Akan dilakukan pemeliharaan rutin pada modul Virtual Account BCA pada pukul 23:00 - 01:00 WIB. Metode QRIS dan Manual Transfer tetap beroperasi normal.',
    targetRole: 'ALL',
    priority: 'NORMAL',
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// GET /api/announcements (Public / User)
router.get('/', (req: Request, res: Response) => {
  const published = announcementStore.filter((a) => a.status === 'PUBLISHED');
  return res.status(200).json({
    success: true,
    announcements: published,
  });
});

// GET /api/announcements/admin (Admin full list)
router.get('/admin', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    announcements: announcementStore,
  });
});

// POST /api/announcements (Admin create)
router.post('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { title, content, targetRole, priority, status, scheduledFor } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Judul dan isi pengumuman wajib diisi.' });
  }

  const newAnn: AnnouncementItem = {
    id: `ann-${Date.now()}`,
    title,
    content,
    targetRole: targetRole || 'ALL',
    priority: priority || 'NORMAL',
    status: status || 'PUBLISHED',
    scheduledFor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  announcementStore.unshift(newAnn);

  return res.status(201).json({
    success: true,
    message: 'Pengumuman berhasil diterbitkan.',
    announcement: newAnn,
  });
});

// PUT /api/announcements/:id (Admin update)
router.put('/:id', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const ann = announcementStore.find((a) => a.id === id);

  if (!ann) {
    return res.status(404).json({ success: false, message: 'Pengumuman tidak ditemukan.' });
  }

  const { title, content, targetRole, priority, status, scheduledFor } = req.body;
  if (title) ann.title = title;
  if (content) ann.content = content;
  if (targetRole) ann.targetRole = targetRole;
  if (priority) ann.priority = priority;
  if (status) ann.status = status;
  if (scheduledFor) ann.scheduledFor = scheduledFor;
  ann.updatedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: 'Pengumuman berhasil diperbarui.',
    announcement: ann,
  });
});

// DELETE /api/announcements/:id
router.delete('/:id', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const idx = announcementStore.findIndex((a) => a.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Pengumuman tidak ditemukan.' });
  }

  announcementStore.splice(idx, 1);

  return res.status(200).json({
    success: true,
    message: 'Pengumuman berhasil dihapus.',
  });
});

export default router;
