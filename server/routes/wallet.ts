import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/wallet
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const wallet = db.getWalletByUserId(userId);
  const ledgers = db.getWalletLedgers(userId);

  return res.status(200).json({
    success: true,
    wallet,
    ledgers,
  });
});

// POST /api/wallet/transfer
router.post('/transfer', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const { fromWallet, toWallet, amount, note } = req.body;

  if (!fromWallet || !toWallet || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Harap tentukan dompet asal, dompet tujuan, dan jumlah nominal transfer.',
    });
  }

  if (fromWallet === toWallet) {
    return res.status(400).json({
      success: false,
      message: 'Dompet asal dan tujuan tidak boleh sama.',
    });
  }

  const result = db.transferBetweenWallets(userId, fromWallet, toWallet, Number(amount), note);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
});

export default router;
