import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/referrals
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const user = db.findUserById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  const referralCode = user.referralCode;
  const referralLink = `https://nexainvest.id/register?ref=${referralCode}`;

  // Direct referral team mock data
  const directTeam = [
    { id: 'ref-1', name: 'Anis Setiawan', email: 'anis@example.com', date: '2026-08-02', level: 'Level 1 (32%)', totalInvested: 150000, commissionEarned: 48000, status: 'Active' },
    { id: 'ref-2', name: 'Rina Wijaya', email: 'rina@example.com', date: '2026-08-03', level: 'Level 1 (32%)', totalInvested: 50000, commissionEarned: 16000, status: 'Active' },
    { id: 'ref-3', name: 'Bambang Tri', email: 'bambang@example.com', date: '2026-08-04', level: 'Level 2 (2%)', totalInvested: 100000, commissionEarned: 2000, status: 'Active' },
    { id: 'ref-4', name: 'Citra Dewi', email: 'citra@example.com', date: '2026-08-04', level: 'Level 3 (1%)', totalInvested: 100000, commissionEarned: 1000, status: 'Active' },
  ];

  const levelStats = {
    level1: { count: 2, commissionRate: '32%', totalEarned: 64000 },
    level2: { count: 1, commissionRate: '2%', totalEarned: 2000 },
    level3: { count: 1, commissionRate: '1%', totalEarned: 1000 },
  };

  const leaderboard = [
    { rank: 1, name: 'Hendra K.', totalReferrals: 142, commissionEarned: 18500000 },
    { rank: 2, name: 'Siti Rahma', totalReferrals: 98, commissionEarned: 12400000 },
    { rank: 3, name: user.fullName, totalReferrals: 4, commissionEarned: user.totalReferralCommission || 67000 },
    { rank: 4, name: 'Dedi Kurniawan', totalReferrals: 3, commissionEarned: 45000 },
    { rank: 5, name: 'Maya Putri', totalReferrals: 2, commissionEarned: 32000 },
  ];

  return res.status(200).json({
    success: true,
    referral: {
      referralCode,
      referralLink,
      totalCommission: user.totalReferralCommission || 67000,
      totalReferralsCount: directTeam.length,
      levelStats,
      directTeam,
      leaderboard,
    },
  });
});

export default router;
