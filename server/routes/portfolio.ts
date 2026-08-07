import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/portfolio
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const investments = db.getInvestmentsByUserId(userId);
  const activeInvestments = investments.filter((i) => i.status === 'ACTIVE');

  const totalValue = activeInvestments.reduce((acc, curr) => acc + curr.amountInvested, 0);
  const totalTargetProfit = activeInvestments.reduce((acc, curr) => acc + curr.totalProfitTarget, 0);
  const totalEarnedProfit = activeInvestments.reduce((acc, curr) => acc + curr.profitEarned, 0);

  // Category breakdown
  const categoriesMap: Record<string, number> = {};
  activeInvestments.forEach((inv) => {
    const cat = inv.productCategory || 'Lainnya';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + inv.amountInvested;
  });

  const categories = Object.keys(categoriesMap).map((cat) => ({
    name: cat,
    value: categoriesMap[cat],
    percentage: totalValue > 0 ? Math.round((categoriesMap[cat] / totalValue) * 100) : 0,
  }));

  // Risk breakdown
  const riskMap: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
  activeInvestments.forEach((inv) => {
    riskMap[inv.riskLevel] = (riskMap[inv.riskLevel] || 0) + inv.amountInvested;
  });

  const riskDistribution = [
    { name: 'Low Risk (Bluechip)', value: riskMap.LOW, color: '#10b981' },
    { name: 'Medium Risk (Growth)', value: riskMap.MEDIUM, color: '#f59e0b' },
    { name: 'High Risk (Fast Yield)', value: riskMap.HIGH, color: '#ef4444' },
  ];

  return res.status(200).json({
    success: true,
    portfolio: {
      totalValue,
      totalTargetProfit,
      totalEarnedProfit,
      activeCount: activeInvestments.length,
      categories,
      riskDistribution,
      activeInvestments,
      allInvestments: investments,
    },
  });
});

export default router;
