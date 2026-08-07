import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, ROLE_PERMISSIONS } from '../db';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// GET /api/profile
router.get('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.user!.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Profil pengguna tidak ditemukan.' });
  }

  const permissions = new Set<string>();
  user.roles.forEach((r) => {
    (ROLE_PERMISSIONS[r] || []).forEach((p) => permissions.add(p));
  });

  return res.status(200).json({
    success: true,
    profile: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      country: user.country,
      language: user.language,
      timezone: user.timezone,
      dateFormat: user.dateFormat,
      currency: user.currency,
      isEmailVerified: user.isEmailVerified,
      referralCode: user.referralCode,
      referredByCode: user.referredByCode,
      vipLevel: user.vipLevel,
      saldoPenarikan: user.saldoPenarikan,
      saldoProfit: user.saldoProfit,
      totalInvested: user.totalInvested,
      totalProfitEarned: user.totalProfitEarned,
      totalReferralCommission: user.totalReferralCommission,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      roles: user.roles,
      permissions: Array.from(permissions),
    },
  });
});

// PUT /api/profile
router.put('/', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { fullName, phone, country, language, timezone, dateFormat, currency } = req.body;

  const updatedUser = db.updateUser(req.user!.userId, {
    fullName: fullName || undefined,
    phone: phone || undefined,
    country: country || undefined,
    language: language || undefined,
    timezone: timezone || undefined,
    dateFormat: dateFormat || undefined,
    currency: currency || undefined,
  });

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: 'Gagal memperbarui profil pengguna.' });
  }

  return res.status(200).json({
    success: true,
    message: 'Profil berhasil diperbarui.',
    profile: updatedUser,
  });
});

// PUT /api/profile/password
router.put('/password', authenticateJwt, async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Harap lengkapi semua kolom kata sandi.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Konfirmasi kata sandi baru tidak cocok.' });
  }

  // Password Strength check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'Kata sandi baru harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, serta karakter khusus.',
    });
  }

  const user = db.findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  const isCurrentMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isCurrentMatch) {
    return res.status(400).json({ success: false, message: 'Kata sandi saat ini yang Anda masukkan salah.' });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  db.updateUser(user.id, { passwordHash: newHash });

  return res.status(200).json({
    success: true,
    message: 'Kata sandi akun Anda berhasil diperbarui!',
  });
});

// POST /api/profile/avatar
router.post('/avatar', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { avatarUrl } = req.body;

  if (!avatarUrl) {
    return res.status(400).json({ success: false, message: 'URL foto atau data gambar tidak boleh kosong.' });
  }

  const updatedUser = db.updateUser(req.user!.userId, { avatarUrl });

  return res.status(200).json({
    success: true,
    message: 'Foto profil berhasil diunggah dan diperbarui.',
    avatarUrl: updatedUser?.avatarUrl,
  });
});

// DELETE /api/profile/avatar
router.delete('/avatar', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.user!.userId);
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`;

  db.updateUser(req.user!.userId, { avatarUrl: defaultAvatar });

  return res.status(200).json({
    success: true,
    message: 'Foto profil telah dihapus dan dikembalikan ke avatar bawaan.',
    avatarUrl: defaultAvatar,
  });
});

export default router;
