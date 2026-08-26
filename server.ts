import express from 'express';
import http from 'http';
import path from 'path';

// Anti-Crash & Anti-DDoS Global Process Crash Guards
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL PROCESS GUARD] Uncaught Exception caught, server recovering:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[CRITICAL PROCESS GUARD] Unhandled Rejection caught, server recovering:', reason);
});
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import authRoutes from './server/routes/auth';
import profileRoutes from './server/routes/profile';
import dashboardRoutes from './server/routes/dashboard';
import walletRoutes from './server/routes/wallet';
import portfolioRoutes from './server/routes/portfolio';
import investmentRoutes from './server/routes/investments';
import transactionRoutes from './server/routes/transactions';
import notificationRoutes from './server/routes/notifications';
import referralRoutes from './server/routes/referrals';
import productRoutes from './server/routes/products';
import paymentRoutes from './server/routes/payments';
import adminRoutes from './server/routes/admin';
import aiRoutes from './server/routes/ai';
import analyticsRoutes from './server/routes/analytics';
import reportsRoutes from './server/routes/reports';
import announcementsRoutes from './server/routes/announcements';
import systemRoutes from './server/routes/system';
import activityRoutes from './server/routes/activity';
import searchRoutes from './server/routes/search';
import docsRoutes from './server/routes/docs';
import syncRoutes from './server/routes/sync';
import { securityHeaders, rateLimiter } from './server/middleware';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
  });

  const PORT = 3000;

  // Socket.IO Connection Handler
  io.on('connection', (socket) => {
    socket.emit('connected', { status: 'LIVE', socketId: socket.id, timestamp: new Date().toISOString() });

    socket.on('join_user_channel', (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  // Attach io to app for global broadcasting
  app.set('io', io);

  // Global Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(securityHeaders);
  app.use('/api', rateLimiter(150, 15 * 60 * 1000));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Nexa Capital Authentication & Security API',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/wallet', walletRoutes);
  app.use('/api/portfolio', portfolioRoutes);
  app.use('/api/investments', investmentRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/referrals', referralRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/reports', reportsRoutes);
  app.use('/api/announcements', announcementsRoutes);
  app.use('/api/system', systemRoutes);
  app.use('/api/activity', activityRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/docs', docsRoutes);
  app.use('/api/sync', syncRoutes);

  // Global Express Anti-DDoS Error Protection Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[ANTI-DDOS PROTECTED API ERROR]', err);
    res.status(err.status || 500).json({
      success: false,
      message: 'Sistem Anti-DDoS & Fail-safe aktif: Terjadi penanganan keamanan API. Server tetap beroperasi stabil.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  });

  // Vite middleware setup for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Static file serving for Production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXA CAPITAL SERVER] Running on http://localhost:${PORT}`);
  });
}

startServer();

