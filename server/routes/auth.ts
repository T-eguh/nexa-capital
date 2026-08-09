import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db, RoleName, ROLE_PERMISSIONS } from '../db';
import {
  authenticateJwt,
  AuthenticatedRequest,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
} from '../middleware';
import {
  sendEmailVerificationMail,
  sendPasswordResetMail,
  sendWelcomeMail,
} from '../email';

const router = Router();

// Zod Schemas
const registerSchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  phone: z.string().min(8, 'Nomor HP minimal 8 digit'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  username: z.string().optional(),
  email: z.string().optional(),
  confirmPassword: z.string().optional(),
  referralCode: z.string().optional(),
  acceptTerms: z.boolean().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau Username harus diisi'),
  password: z.string().min(1, 'Kata sandi harus diisi'),
  rememberMe: z.boolean().optional(),
});

// Device parser helper
function parseDeviceType(ua: string): { deviceName: string; deviceType: string } {
  if (!ua) return { deviceName: 'Unknown Browser', deviceType: 'Desktop' };
  let deviceType = 'Desktop';
  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  if (/tablet/i.test(ua)) deviceType = 'Tablet';

  let browser = 'Browser';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';

  let os = 'OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Macintosh')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return {
    deviceName: `${browser} on ${os}`,
    deviceType,
  };
}

// 1. REGISTER
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const cleanPhone = validatedData.phone.replace(/[^0-9]/g, '');
    const username = (validatedData.username || `user_${cleanPhone}`).toLowerCase();
    const email = (validatedData.email || `${cleanPhone}@nexacapital.id`).toLowerCase();

    // Check duplicate Email & Username
    const existingEmail = db.findUserByEmailOrUsername(email);
    if (existingEmail && validatedData.email) {
      return res.status(400).json({
        success: false,
        message: 'Nomor HP atau Email ini sudah terdaftar. Silakan gunakan nomor/email lain atau masuk ke akun Anda.',
      });
    }

    // Hash Password
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Create User
    const newUser = db.createUser({
      fullName: validatedData.fullName,
      username,
      email,
      phone: validatedData.phone,
      passwordHash,
      referredByCode: validatedData.referralCode,
      isEmailVerified: true,
    });

    // Generate Verification Token
    const verifyToken = jwt.sign({ userId: newUser.id, type: 'VERIFY' }, JWT_SECRET, { expiresIn: '24h' });
    db.createEmailVerificationToken(newUser.id, verifyToken, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

    // Dispatch Emails
    await sendEmailVerificationMail(newUser.email, newUser.fullName, verifyToken);
    await sendWelcomeMail(newUser.email, newUser.fullName, newUser.referralCode);

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran akun berhasil! Silakan periksa inbox email Anda untuk memverifikasi akun.',
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        isEmailVerified: newUser.isEmailVerified,
        referralCode: newUser.referralCode,
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.issues[0]?.message || 'Formulir pendaftaran tidak valid',
        errors: err.issues,
      });
    }
    return res.status(500).json({ success: false, message: 'Gagal memproses pendaftaran akun.', error: err.message });
  }
});

// 2. LOGIN
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = loginSchema.parse(req.body);
    const ipAddress = (req.ip || req.socket.remoteAddress || '127.0.0.1').toString();
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const { deviceName, deviceType } = parseDeviceType(userAgent);

    const user = db.findUserByEmailOrUsername(identifier);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No HP, Email, Username, atau kata sandi tidak cocok.',
      });
    }

    // Lockout check
    if (user.isLockedOut && user.lockoutUntil) {
      const remainingMs = new Date(user.lockoutUntil).getTime() - Date.now();
      if (remainingMs > 0) {
        const minutesLeft = Math.ceil(remainingMs / 60000);
        return res.status(403).json({
          success: false,
          message: `Akun Anda sedang dikunci sementara karena 5x percobaan salah. Silakan coba lagi dalam ${minutesLeft} menit.`,
        });
      } else {
        // Reset lockout
        db.updateUser(user.id, { isLockedOut: false, failedLoginAttempts: 0, lockoutUntil: undefined });
      }
    }

    // Password verification
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      const attempts = user.failedLoginAttempts + 1;
      let isLocked = false;
      let lockUntil: string | undefined = undefined;

      if (attempts >= 5) {
        isLocked = true;
        lockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins lock
      }

      db.updateUser(user.id, {
        failedLoginAttempts: attempts,
        isLockedOut: isLocked,
        lockoutUntil: lockUntil,
      });

      db.addLoginHistory({
        userId: user.id,
        ipAddress,
        userAgent,
        location: 'Indonesia',
        deviceType,
        status: 'FAILED',
        failureReason: 'Kata sandi tidak sesuai',
      });

      return res.status(401).json({
        success: false,
        message: isLocked
          ? 'Terlalu banyak percobaan gagal! Akun Anda dikunci selama 15 menit.'
          : `Kata sandi salah. Percobaan tersisa: ${5 - attempts}`,
      });
    }

    // Success login: reset failures
    db.updateUser(user.id, {
      failedLoginAttempts: 0,
      isLockedOut: false,
      lockoutUntil: undefined,
      lastLoginAt: new Date().toISOString(),
    });

    // Create session
    const session = db.createSession({
      userId: user.id,
      token: jwt.sign({ userId: user.id, nonce: Date.now() }, JWT_SECRET),
      ipAddress,
      userAgent,
      deviceName,
      isCurrent: true,
      isValid: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActiveAt: new Date().toISOString(),
    });

    // Generate JWT Access Token (15 mins or 1h)
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        sessionId: session.id,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate Refresh Token (7 days)
    const refreshToken = jwt.sign({ userId: user.id, sessionId: session.id }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    db.createRefreshToken(user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

    // Add Login History Log
    db.addLoginHistory({
      userId: user.id,
      ipAddress,
      userAgent,
      location: 'Indonesia',
      deviceType,
      status: 'SUCCESS',
    });

    // Extract User Permissions
    const permissions = new Set<string>();
    user.roles.forEach((r) => {
      (ROLE_PERMISSIONS[r] || []).forEach((p) => permissions.add(p));
    });

    return res.status(200).json({
      success: true,
      message: `Selamat datang kembali, ${user.fullName}!`,
      token,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        country: user.country,
        language: user.language,
        timezone: user.timezone,
        currency: user.currency,
        isEmailVerified: user.isEmailVerified,
        referralCode: user.referralCode,
        vipLevel: user.vipLevel,
        saldoPenarikan: user.saldoPenarikan,
        saldoProfit: user.saldoProfit,
        roles: user.roles,
        permissions: Array.from(permissions),
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.issues[0]?.message });
    }
    return res.status(500).json({ success: false, message: 'Gagal melakukan otentikasi login.', error: err.message });
  }
});

// 3. REFRESH TOKEN
router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh Token wajib disediakan.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string; sessionId?: string };

    const storedToken = db.findRefreshToken(refreshToken);
    if (!storedToken) {
      return res.status(401).json({ success: false, message: 'Refresh Token tidak ditemukan atau telah dicabut.' });
    }

    const user = db.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    // Token Rotation
    db.revokeRefreshToken(refreshToken);

    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        sessionId: decoded.sessionId,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign({ userId: user.id, sessionId: decoded.sessionId }, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    db.createRefreshToken(user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

    return res.status(200).json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Refresh Token tidak valid atau telah kadaluarsa.' });
  }
});

// 4. LOGOUT
router.post('/logout', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.sessionId) {
    db.revokeSession(req.user.sessionId, req.user.userId);
  }
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.revokeRefreshToken(refreshToken);
  }

  return res.status(200).json({ success: true, message: 'Berhasil keluar dari akun Anda.' });
});

// 5. FORGOT PASSWORD
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Harap masukkan email Anda.' });
  }

  const user = db.findUserByEmailOrUsername(email);
  if (!user) {
    // Return positive response for privacy
    return res.status(200).json({
      success: true,
      message: 'Jika email terdaftar di sistem, tautan pemulihan kata sandi telah dikirim ke inbox Anda.',
    });
  }

  const resetToken = jwt.sign({ userId: user.id, type: 'RESET' }, JWT_SECRET, { expiresIn: '1h' });
  db.createPasswordResetToken(user.id, resetToken, new Date(Date.now() + 60 * 60 * 1000).toISOString());

  await sendPasswordResetMail(user.email, user.fullName, resetToken);

  return res.status(200).json({
    success: true,
    message: 'Tautan pemulihan kata sandi telah berhasil dikirim ke email Anda.',
  });
});

// 6. RESET PASSWORD
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Konfirmasi kata sandi tidak cocok.' });
  }

  // Password Strength Requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'Kata sandi baru harus minimal 8 karakter dan memiliki huruf besar, huruf kecil, angka, dan karakter khusus.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (decoded.type !== 'RESET') {
      return res.status(400).json({ success: false, message: 'Token tidak valid untuk pemulihan kata sandi.' });
    }

    const resetItem = db.findPasswordResetToken(token);
    if (!resetItem) {
      return res.status(400).json({ success: false, message: 'Token pemulihan telah kadaluarsa atau sudah digunakan.' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    db.updateUser(decoded.userId, { passwordHash: newPasswordHash });
    db.markPasswordResetUsed(resetItem.id);
    db.revokeAllUserRefreshTokens(decoded.userId);

    return res.status(200).json({
      success: true,
      message: 'Kata sandi berhasil diperbarui! Silakan masuk kembali dengan kata sandi baru Anda.',
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Token pemulihan tidak valid atau kadaluarsa.' });
  }
});

// 7. VERIFY EMAIL
router.get('/verify-email', (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token verifikasi tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (decoded.type !== 'VERIFY') {
      return res.status(400).json({ success: false, message: 'Token tidak valid.' });
    }

    const evItem = db.findEmailVerificationToken(token);
    if (!evItem) {
      return res.status(400).json({ success: false, message: 'Token verifikasi email kadaluarsa atau telah digunakan.' });
    }

    db.updateUser(decoded.userId, { isEmailVerified: true });
    db.markEmailVerificationUsed(evItem.id);

    return res.status(200).json({
      success: true,
      message: 'Alamat email Anda telah berhasil diverifikasi!',
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Token verifikasi email tidak valid atau kadaluarsa.' });
  }
});

// 8. RESEND VERIFICATION
router.post('/resend-verification', authenticateJwt, async (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.user!.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ success: false, message: 'Alamat email Anda sudah terverifikasi sebelumnya.' });
  }

  const verifyToken = jwt.sign({ userId: user.id, type: 'VERIFY' }, JWT_SECRET, { expiresIn: '24h' });
  db.createEmailVerificationToken(user.id, verifyToken, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

  await sendEmailVerificationMail(user.email, user.fullName, verifyToken);

  return res.status(200).json({
    success: true,
    message: 'Email verifikasi baru telah berhasil dikirimkan ke email Anda.',
  });
});

// 9. GET SESSIONS
router.get('/sessions', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const sessions = db.getUserSessions(req.user!.userId);
  return res.status(200).json({ success: true, sessions });
});

// 10. REVOKE SESSION
router.post('/sessions/revoke', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const { sessionId, revokeAllOthers } = req.body;

  if (revokeAllOthers) {
    db.revokeAllOtherSessions(req.user!.sessionId || '', req.user!.userId);
    return res.status(200).json({ success: true, message: 'Semua sesi perangkat lain berhasil dikeluarkannya.' });
  }

  if (sessionId) {
    db.revokeSession(sessionId, req.user!.userId);
    return res.status(200).json({ success: true, message: 'Sesi perangkat berhasil dihapus.' });
  }

  return res.status(400).json({ success: false, message: 'Parameter tidak valid.' });
});

// 11. SECURITY LOGS
router.get('/security-logs', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const logs = db.getLoginHistory(req.user!.userId);
  return res.status(200).json({ success: true, logs });
});

export default router;
