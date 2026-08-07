import { Router, Response } from 'express';
import { db, RoleName } from '../db';
import { authenticateJwt, requireAdmin, AuthenticatedRequest } from '../middleware';

const router = Router();

// Protect all admin routes with JWT and Admin Role requirement
router.use(authenticateJwt);
router.use(requireAdmin);

// ==========================================================
// 1. DASHBOARD OVERVIEW & ANALYTICS
// ==========================================================
router.get('/dashboard', (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getAllUsers();
    const transactions = db.getAllTransactions();
    const investments = db.getAllInvestments();

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => !u.isLockedOut).length;
    const newUsersToday = users.filter((u) => {
      const today = new Date().toISOString().split('T')[0];
      return u.createdAt.startsWith(today);
    }).length;

    // Revenue calculations
    const approvedDeposits = transactions.filter((t) => t.type === 'DEPOSIT' && (t.status === 'APPROVED' || t.status === 'SUCCESS'));
    const approvedWithdrawals = transactions.filter((t) => t.type === 'WITHDRAWAL' && (t.status === 'APPROVED' || t.status === 'SUCCESS'));
    const pendingDeposits = transactions.filter((t) => t.type === 'DEPOSIT' && t.status === 'PENDING');
    const pendingWithdrawals = transactions.filter((t) => t.type === 'WITHDRAWAL' && t.status === 'PENDING');

    const totalDepositVolume = approvedDeposits.reduce((acc, t) => acc + t.amount, 0);
    const totalWithdrawalVolume = approvedWithdrawals.reduce((acc, t) => acc + t.amount, 0);
    const netRevenue = totalDepositVolume - totalWithdrawalVolume;

    const totalInvestmentsVolume = investments.reduce((acc, i) => acc + i.amountInvested, 0);
    const activeInvestments = investments.filter((i) => i.status === 'ACTIVE');

    const pendingTickets = db.getTickets().filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsersToday,
        totalDepositVolume,
        totalWithdrawalVolume,
        netRevenue,
        pendingDepositsCount: pendingDeposits.length,
        pendingDepositsAmount: pendingDeposits.reduce((acc, t) => acc + t.amount, 0),
        pendingWithdrawalsCount: pendingWithdrawals.length,
        pendingWithdrawalsAmount: pendingWithdrawals.reduce((acc, t) => acc + t.amount, 0),
        totalInvestmentsVolume,
        activeInvestmentsCount: activeInvestments.length,
        pendingTicketsCount: pendingTickets,
      },
      charts: {
        monthlyRevenue: [
          { month: 'Jan', deposit: 12000000, withdrawal: 3000000 },
          { month: 'Feb', deposit: 18000000, withdrawal: 4500000 },
          { month: 'Mar', deposit: 25000000, withdrawal: 6000000 },
          { month: 'Apr', deposit: 32000000, withdrawal: 8500000 },
          { month: 'May', deposit: 41000000, withdrawal: 11000000 },
          { month: 'Jun', deposit: 55000000, withdrawal: 14000000 },
        ],
        userGrowth: [
          { date: '1 Aug', count: 120 },
          { date: '2 Aug', count: 145 },
          { date: '3 Aug', count: 190 },
          { date: '4 Aug', count: 240 },
          { date: '5 Aug', count: 310 },
        ]
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat data statistik admin.', error: error.message });
  }
});

// ==========================================================
// 2. USER MANAGEMENT (CRUD)
// ==========================================================
router.get('/users', (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getAllUsers();
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar pengguna.', error: error.message });
  }
});

router.post('/users', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, username, email, phone, password, roles, vipLevel } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama lengkap, username, email, dan password wajib diisi.' });
    }

    const existing = db.findUserByEmailOrUsername(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email atau username sudah terdaftar.' });
    }

    const newUser = db.createUser({
      fullName,
      username,
      email,
      phone,
      passwordHash: password, // simplified for admin creation
      roles: roles || ['USER'],
      isEmailVerified: true,
      vipLevel: vipLevel || 'VIP 1'
    });

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'CREATE_USER',
      module: 'USER',
      details: `Membuat pengguna baru: ${newUser.email} (${newUser.username})`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.status(201).json({ success: true, message: 'Pengguna baru berhasil dibuat.', user: newUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat pengguna.', error: error.message });
  }
});

router.put('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedUser = db.updateUser(id, updates);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'UPDATE_USER',
      module: 'USER',
      details: `Memperbarui data pengguna ID: ${id}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Data pengguna berhasil diperbarui.', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengguna.', error: error.message });
  }
});

router.put('/users/:id/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isLockedOut } = req.body;
    const updatedUser = db.setUserStatus(id, !!isLockedOut);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'TOGGLE_USER_STATUS',
      module: 'USER',
      details: `Mengubah status kunci pengguna ${updatedUser.username} menjadi ${isLockedOut ? 'LOCKED' : 'ACTIVE'}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: `Status pengguna berhasil diubah ke ${isLockedOut ? 'DIBEKUKAN' : 'AKTIF'}.`, user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengubah status pengguna.', error: error.message });
  }
});

router.put('/users/:id/role', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;
    const updatedUser = db.setUserRoles(id, roles);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'ASSIGN_USER_ROLE',
      module: 'ROLE',
      details: `Mengubah hak akses/role pengguna ${updatedUser.username} menjadi [${roles.join(', ')}]`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Role pengguna berhasil diperbarui.', user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengubah role pengguna.', error: error.message });
  }
});

router.delete('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteUser(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'DELETE_USER',
      module: 'USER',
      details: `Menghapus pengguna ID: ${id}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Pengguna berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.', error: error.message });
  }
});

// ==========================================================
// 3. DEPOSIT & WITHDRAWAL QUEUES
// ==========================================================
router.get('/deposits', (req: AuthenticatedRequest, res: Response) => {
  try {
    const deposits = db.getAllTransactions('DEPOSIT');
    res.json({ success: true, deposits });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar deposit.', error: error.message });
  }
});

router.put('/deposits/:id/approve', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = db.approveDeposit(id);
    if (!result.success) {
      return res.status(400).json(result);
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'APPROVE_DEPOSIT',
      module: 'DEPOSIT',
      details: `Disetujui deposit TX: ${id}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menyetujui deposit.', error: error.message });
  }
});

router.put('/deposits/:id/reject', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const result = db.rejectDeposit(id, note);
    if (!result.success) {
      return res.status(400).json(result);
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'REJECT_DEPOSIT',
      module: 'DEPOSIT',
      details: `Menolak deposit TX: ${id} [Catatan: ${note || '-'}]`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menolak deposit.', error: error.message });
  }
});

router.get('/withdrawals', (req: AuthenticatedRequest, res: Response) => {
  try {
    const withdrawals = db.getAllTransactions('WITHDRAWAL');
    res.json({ success: true, withdrawals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar penarikan.', error: error.message });
  }
});

router.put('/withdrawals/:id/approve', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = db.approveWithdrawal(id);
    if (!result.success) {
      return res.status(400).json(result);
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'APPROVE_WITHDRAWAL',
      module: 'WITHDRAWAL',
      details: `Disetujui penarikan TX: ${id}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menyetujui penarikan.', error: error.message });
  }
});

router.put('/withdrawals/:id/reject', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const result = db.rejectWithdrawal(id, note);
    if (!result.success) {
      return res.status(400).json(result);
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'REJECT_WITHDRAWAL',
      module: 'WITHDRAWAL',
      details: `Menolak penarikan TX: ${id} [Catatan: ${note || '-'}]`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menolak penarikan.', error: error.message });
  }
});

// ==========================================================
// 4. INVESTMENTS MANAGEMENT
// ==========================================================
router.get('/investments', (req: AuthenticatedRequest, res: Response) => {
  try {
    const investments = db.getAllInvestments();
    res.json({ success: true, investments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar investasi.', error: error.message });
  }
});

router.put('/investments/:id/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inv = db.updateInvestmentStatus(id, status);
    if (!inv) {
      return res.status(404).json({ success: false, message: 'Investasi tidak ditemukan.' });
    }

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'UPDATE_INVESTMENT_STATUS',
      module: 'PRODUCT',
      details: `Mengubah status investasi ${id} menjadi ${status}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Status investasi berhasil diubah.', investment: inv });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengubah status investasi.', error: error.message });
  }
});

// ==========================================================
// 5. WALLET MANAGEMENT & BALANCE ADJUSTMENT
// ==========================================================
router.get('/wallets', (req: AuthenticatedRequest, res: Response) => {
  try {
    const wallets = db.getAllWallets();
    res.json({ success: true, wallets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat daftar dompet.', error: error.message });
  }
});

router.post('/wallets/adjust', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, walletType, amount, isCredit, reason } = req.body;
    if (!userId || !walletType || !amount || typeof isCredit !== 'boolean' || !reason) {
      return res.status(400).json({ success: false, message: 'Semua parameter penyesuaian saldo wajib diisi.' });
    }

    const updatedWallet = db.adjustWalletBalance(userId, walletType, Number(amount), isCredit, reason);

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'ADJUST_WALLET_BALANCE',
      module: 'USER',
      details: `Penyesuaian saldo ${walletType} pengguna ${userId} sebesar ${isCredit ? '+' : '-'}${amount}. Alasan: ${reason}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Saldo berhasil disesuaikan.', wallet: updatedWallet });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menyesuaikan saldo dompet.', error: error.message });
  }
});

// ==========================================================
// 6. CMS & CONTENT MANAGEMENT
// ==========================================================
router.get('/cms', (req: AuthenticatedRequest, res: Response) => {
  try {
    const cms = db.getCMSContent();
    res.json({ success: true, cms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat konten CMS.', error: error.message });
  }
});

router.put('/cms', (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;
    const updatedCMS = db.updateCMSContent(updates);

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'UPDATE_CMS',
      module: 'CMS',
      details: 'Memperbarui konfigurasi konten CMS landing page.',
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Konten CMS berhasil disimpan.', cms: updatedCMS });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui CMS.', error: error.message });
  }
});

// ==========================================================
// 7. ANNOUNCEMENTS & BROADCAST NOTIFICATIONS
// ==========================================================
router.get('/announcements', (req: AuthenticatedRequest, res: Response) => {
  try {
    const announcements = db.getAnnouncements();
    res.json({ success: true, announcements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat pengumuman.', error: error.message });
  }
});

router.post('/announcements', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, category, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Judul dan isi pengumuman wajib diisi.' });
    }

    const ann = db.createAnnouncement({
      title,
      content,
      category: category || 'GENERAL',
      status: status || 'PUBLISHED',
      publishedAt: new Date().toISOString()
    });

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'CREATE_ANNOUNCEMENT',
      module: 'CMS',
      details: `Membuat pengumuman baru: ${title}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.status(201).json({ success: true, message: 'Pengumuman berhasil diterbitkan.', announcement: ann });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membuat pengumuman.', error: error.message });
  }
});

router.delete('/announcements/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteAnnouncement(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Pengumuman tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Pengumuman berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus pengumuman.', error: error.message });
  }
});

router.post('/notifications/broadcast', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, message, category } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Judul dan pesan siaran wajib diisi.' });
    }

    const users = db.getAllUsers();
    users.forEach((u) => {
      db.createNotification({
        userId: u.id,
        category: category || 'SYSTEM',
        title,
        message
      });
    });

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'BROADCAST_NOTIFICATION',
      module: 'CMS',
      details: `Mengirim notifikasi siaran ke ${users.length} pengguna: ${title}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: `Notifikasi berhasil disiarkan ke ${users.length} pengguna.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menyiarkan notifikasi.', error: error.message });
  }
});

// ==========================================================
// 8. SUPPORT TICKETS MANAGEMENT
// ==========================================================
router.get('/tickets', (req: AuthenticatedRequest, res: Response) => {
  try {
    const tickets = db.getTickets();
    res.json({ success: true, tickets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat tiket bantuan.', error: error.message });
  }
});

router.post('/tickets/:id/reply', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Pesan balasan tidak boleh kosong.' });
    }

    const ticket = db.replyTicket(id, 'STAFF', req.user?.username || 'Admin Support', message);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket bantuan tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Balasan tiket berhasil dikirim.', ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal membalas tiket.', error: error.message });
  }
});

router.put('/tickets/:id/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = db.updateTicketStatus(id, status);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket bantuan tidak ditemukan.' });
    }

    res.json({ success: true, message: `Status tiket berhasil diubah ke ${status}.`, ticket });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengubah status tiket.', error: error.message });
  }
});

// ==========================================================
// 9. AUDIT & SYSTEM LOGS
// ==========================================================
router.get('/audit-logs', (req: AuthenticatedRequest, res: Response) => {
  try {
    const auditLogs = db.getAuditLogs();
    res.json({ success: true, auditLogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat log audit.', error: error.message });
  }
});

router.get('/system-logs', (req: AuthenticatedRequest, res: Response) => {
  try {
    const systemLogs = db.getSystemLogs();
    res.json({ success: true, systemLogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat log sistem.', error: error.message });
  }
});

// ==========================================================
// 10. SYSTEM SETTINGS
// ==========================================================
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = db.getSystemSettings();
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat pengaturan sistem.', error: error.message });
  }
});

router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;
    const settings = db.updateSystemSettings(updates);

    db.addAuditLog({
      userId: req.user?.userId || 'admin',
      userEmail: req.user?.email || 'admin@nexainvest.id',
      action: 'UPDATE_SYSTEM_SETTINGS',
      module: 'SETTINGS',
      details: 'Memperbarui konfigurasi utama sistem platform.',
      ipAddress: req.ip || '127.0.0.1'
    });

    res.json({ success: true, message: 'Pengaturan sistem berhasil disimpan.', settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui pengaturan sistem.', error: error.message });
  }
});

// ==========================================================
// 11. FILE MANAGER & ASSETS
// ==========================================================
router.get('/files', (req: AuthenticatedRequest, res: Response) => {
  try {
    const files = db.getFileAssets();
    res.json({ success: true, files });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal memuat aset berkas.', error: error.message });
  }
});

router.post('/files/upload', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, url, sizeBytes, mimeType, folder } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'Nama dan URL berkas wajib diisi.' });
    }

    const file = db.addFileAsset({
      name,
      url,
      sizeBytes: sizeBytes || 250000,
      mimeType: mimeType || 'image/png',
      folder: folder || 'general',
      uploadedBy: req.user?.username || 'admin'
    });

    res.status(201).json({ success: true, message: 'Berkas berhasil diunggah.', file });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal mengunggah berkas.', error: error.message });
  }
});

router.delete('/files/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteFileAsset(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Berkas tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Berkas berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Gagal menghapus berkas.', error: error.message });
  }
});

export default router;
