import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, ROLE_PERMISSIONS, RoleName } from './db';

export const JWT_SECRET = process.env.JWT_SECRET || 'nexa_capital_jwt_secret_key_2026_production_ready';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nexa_capital_refresh_secret_key_2026_secure';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
    roles: RoleName[];
    sessionId?: string;
  };
}

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

// Simple In-memory Rate Limiter
const rateLimitMap = new Map<string, { count: number; firstRequest: number }>();

export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record) {
      rateLimitMap.set(ip, { count: 1, firstRequest: now });
      return next();
    }

    if (now - record.firstRequest > windowMs) {
      rateLimitMap.set(ip, { count: 1, firstRequest: now });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Batas permintaan terlampaui. Harap tunggu beberapa saat sebelum mencoba kembali.',
      });
    }

    record.count += 1;
    next();
  };
};

// JWT Authentication Middleware
export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Sesi atau token autentikasi tidak ditemukan.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      username: string;
      roles: RoleName[];
      sessionId?: string;
    };

    // Verify user exists and is not locked out
    const user = db.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Pengguna tidak ditemukan dalam sistem.' });
    }

    if (user.isLockedOut && user.lockoutUntil) {
      if (new Date(user.lockoutUntil).getTime() > Date.now()) {
        return res.status(403).json({
          success: false,
          message: 'Akun Anda sedang dikunci sementara karena beberapa kali percobaan login yang gagal.',
        });
      }
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_EXPIRED',
        message: 'Sesi Anda telah kadaluarsa. Sistem akan menyegarkan token secara otomatis.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token autentikasi tidak valid.',
    });
  }
};

// Require Role Middleware
export const requireRole = (...allowedRoles: RoleName[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({ success: false, message: 'Pengguna belum terautentikasi.' });
    }

    const hasRole = req.user.roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki hak akses role yang diperlukan untuk fitur ini.',
      });
    }

    next();
  };
};

// Require Permission Middleware
export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({ success: false, message: 'Pengguna belum terautentikasi.' });
    }

    const userPermissions = new Set<string>();
    req.user.roles.forEach((role) => {
      const permissions = ROLE_PERMISSIONS[role] || [];
      permissions.forEach((p) => userPermissions.add(p));
    });

    const hasAllPermissions = requiredPermissions.every((p) => userPermissions.has(p));
    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki izin operasi yang sesuai.',
      });
    }

    next();
  };
};

// Require Admin Middleware
export const requireAdmin = requireRole('SUPER_ADMIN', 'ADMIN');
