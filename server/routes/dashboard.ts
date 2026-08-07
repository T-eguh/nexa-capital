import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const user = db.findUserById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  const wallet = db.getWalletByUserId(userId);
  const investments = db.getInvestmentsByUserId(userId);
  const activeInvestments = investments.filter((i) => i.status === 'ACTIVE');
  const completedInvestments = investments.filter((i) => i.status === 'COMPLETED');

  const activeValue = activeInvestments.reduce((sum, i) => sum + i.amountInvested, 0);
  const todayProfit = activeInvestments.reduce((sum, i) => sum + i.dailyProfit, 0);
  const yesterdayProfit = Math.round(todayProfit * 0.95);
  const weeklyProfit = todayProfit * 7;
  const monthlyProfit = todayProfit * 30;

  const { transactions } = db.getTransactionsByUserId(userId, { limit: 100 });
  const pendingDeposits = transactions.filter((t) => t.type === 'DEPOSIT' && t.status === 'PENDING').length;
  const pendingWithdrawals = transactions.filter((t) => t.type === 'WITHDRAWAL' && t.status === 'PENDING').length;

  // Growth Chart Mock Points based on real totals
  const chartData = [
    { day: 'Sen', profit: Math.round(todayProfit * 0.4), portfolio: activeValue * 0.92 },
    { day: 'Sel', profit: Math.round(todayProfit * 0.6), portfolio: activeValue * 0.94 },
    { day: 'Rab', profit: Math.round(todayProfit * 0.75), portfolio: activeValue * 0.96 },
    { day: 'Kam', profit: Math.round(todayProfit * 0.85), portfolio: activeValue * 0.98 },
    { day: 'Jum', profit: Math.round(todayProfit * 0.92), portfolio: activeValue * 0.99 },
    { day: 'Sab', profit: Math.round(todayProfit * 0.98), portfolio: activeValue * 1.01 },
    { day: 'Ming', profit: todayProfit, portfolio: activeValue * 1.03 },
  ];

  return res.status(200).json({
    success: true,
    summary: {
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        vipLevel: user.vipLevel,
        referralCode: user.referralCode,
        avatarUrl: user.avatarUrl,
      },
      wallets: {
        mainWallet: wallet.mainWallet,
        profitWallet: wallet.profitWallet,
        referralWallet: wallet.referralWallet,
        bonusWallet: wallet.bonusWallet,
        cashbackWallet: wallet.cashbackWallet,
        totalBalance: wallet.mainWallet + wallet.profitWallet + wallet.referralWallet + wallet.bonusWallet + wallet.cashbackWallet,
      },
      profits: {
        todayProfit,
        yesterdayProfit,
        weeklyProfit,
        monthlyProfit,
        totalProfitEarned: user.totalProfitEarned,
      },
      investments: {
        totalInvested: user.totalInvested,
        activeCount: activeInvestments.length,
        completedCount: completedInvestments.length,
        activeValue,
      },
      pendings: {
        pendingDeposits,
        pendingWithdrawals,
      },
      referral: {
        totalCommission: user.totalReferralCommission,
      },
      chartData,
    },
  });
});

export default router;
