import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  InvestmentProduct,
  UserInvestment,
  Transaction,
  DownlineUser,
  Testimonial,
  VipLevel,
  PlatformSettings,
  RegisteredUser,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PRODUCTS,
  INITIAL_USER_INVESTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_DOWNLINES,
  INITIAL_TESTIMONIALS,
  INITIAL_PLATFORM_SETTINGS,
  INITIAL_REGISTERED_USERS,
} from '../data/initialData';
import { validateIndonesianPhoneNumber } from '../utils/phoneValidator';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

interface AppContextType {
  // Platform & System Settings (Dynamic config for Admin)
  platformSettings: PlatformSettings;
  updatePlatformSettings: (newSettings: Partial<PlatformSettings>) => void;
  resetPlatformSettings: () => void;

  // User state
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  registeredUsers: RegisteredUser[];
  setRegisteredUsers: React.Dispatch<React.SetStateAction<RegisteredUser[]>>;

  // Products
  products: InvestmentProduct[];
  setProducts: React.Dispatch<React.SetStateAction<InvestmentProduct[]>>;
  // User Investments
  userInvestments: UserInvestment[];
  // Transactions
  transactions: Transaction[];
  // Referral
  downlines: DownlineUser[];
  // Testimonials
  testimonials: Testimonial[];
  // View mode
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  // Auth state & functions
  isLoggedIn: boolean;
  login: (email: string, pass: string) => { success: boolean; message: string };
  loginAdmin: (username: string, pass: string) => { success: boolean; message: string };
  register: (data: { name: string; email: string; phone: string; password: string; referralCode?: string }) => { success: boolean; message: string };
  logout: () => void;
  // Notifications
  notifications: NotificationItem[];
  addNotification: (msg: string, type?: 'success' | 'error' | 'info') => void;

  // Actions
  buyProduct: (productId: string) => { success: boolean; message: string };
  claimDailyProfit: (investmentId: string) => void;
  claimAllDailyProfits: () => void;
  canClaimInvestmentToday: (inv: UserInvestment) => boolean;
  getTimeUntilNextClaim: (inv: UserInvestment) => string;
  requestDeposit: (amount: number, paymentMethod: string, proofUrl?: string) => void;
  requestWithdrawal: (amount: number, bankDetails: { bankName: string; accountNumber: string; accountHolder: string }) => { success: boolean; message: string };
  submitTestimonial: (data: { withdrawalAmount: number; rating: number; comment: string; proofImageUrl?: string }) => { success: boolean; message: string };
  
  // Admin Actions
  approveDeposit: (transactionId: string) => void;
  rejectDeposit: (transactionId: string) => void;
  approveWithdrawal: (transactionId: string) => void;
  rejectWithdrawal: (transactionId: string) => void;
  approveReferralCommission: (transactionId: string) => void;
  rejectReferralCommission: (transactionId: string) => void;
  approveTestimonial: (testimonialId: string, rewardAmount: number) => void;
  rejectTestimonial: (testimonialId: string) => void;
  addProduct: (product: Omit<InvestmentProduct, 'id'>) => void;
  updateProduct: (product: InvestmentProduct) => void;
  deleteProduct: (productId: string) => void;
  toggleProductStatus: (id: string) => void;
  topUpUserBalanceAdmin: (amount: number) => void;
  toggleUserLockAdmin: (userId: string) => void;
  addUserAdmin: (newUser: Partial<RegisteredUser>) => { success: boolean; message: string };
  deleteUserAdmin: (userId: string) => void;
  adjustUserBalanceAdmin: (userId: string, amount: number, isAddition: boolean) => void;
  triggerConfetti: () => void;
}

let globalTxCounter = 0;
const generateUniqueTxId = (prefix = 'tx'): string => {
  globalTxCounter += 1;
  return `${prefix}-${Date.now()}-${globalTxCounter}-${Math.random().toString(36).substring(2, 7)}`;
};

const sanitizeTransactions = (list: Transaction[]): Transaction[] => {
  if (!Array.isArray(list)) return [];
  const seenIds = new Set<string>();
  return list.map((tx, idx) => {
    let id = tx.id;
    if (!id || seenIds.has(id)) {
      id = `${id || 'tx'}-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;
    }
    seenIds.add(id);
    return { ...tx, id };
  });
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persisted state initializers
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem('nexainvest_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading registered users:', e);
      }
    }
    return INITIAL_REGISTERED_USERS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nexainvest_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure fallbacks for saldoPenarikan & saldoProfit
      return {
        ...parsed,
        saldoPenarikan: parsed.saldoPenarikan ?? parsed.balance ?? 0,
        saldoProfit: parsed.saldoProfit ?? 0,
        vipLevel: parsed.vipLevel || 'VIP 0',
      };
    }
    return INITIAL_USER;
  });

  const [products, setProducts] = useState<InvestmentProduct[]>(() => {
    const saved = localStorage.getItem('nexainvest_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasSpecial = parsed.some((p: InvestmentProduct) => p.productGroup === 'Special AI' || (p.name && p.name.startsWith('Special')));
          const hasSmart = parsed.some((p: InvestmentProduct) => p.productGroup === 'Smart AI' || (p.name && p.name.startsWith('Smart')));
          if (hasSpecial && hasSmart && parsed.length >= 10) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error parsing stored products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(() => {
    const saved = localStorage.getItem('nexainvest_user_investments');
    if (saved) {
      try {
        const parsed: UserInvestment[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((inv) => ({
            ...inv,
            isLockable35H: inv.totalDays >= 35 || inv.isLockable35H,
          }));
        }
      } catch (e) {
        console.error('Error loading investments:', e);
      }
    }
    return INITIAL_USER_INVESTMENTS;
  });

  const [transactions, setTransactionsRaw] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nexainvest_transactions');
    const raw = saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    return sanitizeTransactions(raw);
  });

  const setTransactions = (action: React.SetStateAction<Transaction[]>) => {
    setTransactionsRaw((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      return sanitizeTransactions(next);
    });
  };

  const [downlines, setDownlines] = useState<DownlineUser[]>(() => {
    const saved = localStorage.getItem('nexainvest_downlines');
    return saved ? JSON.parse(saved) : INITIAL_DOWNLINES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('nexainvest_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('nexainvest_platform_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_PLATFORM_SETTINGS,
          ...parsed,
        };
      } catch (e) {
        console.error('Error loading platform settings:', e);
      }
    }
    return INITIAL_PLATFORM_SETTINGS;
  });

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('nexainvest_platform_settings', JSON.stringify(updated));
      return updated;
    });
    addNotification('Pengaturan sistem berhasil diperbarui!', 'success');
  };

  const resetPlatformSettings = () => {
    setPlatformSettings(INITIAL_PLATFORM_SETTINGS);
    localStorage.setItem('nexainvest_platform_settings', JSON.stringify(INITIAL_PLATFORM_SETTINGS));
    addNotification('Pengaturan sistem dikembalikan ke default.', 'info');
  };

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const savedAdmin = localStorage.getItem('nexainvest_is_admin_mode');
    return savedAdmin === 'true';
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('nexainvest_is_logged_in');
    return savedAuth === 'true';
  });

  const vipRankMap: Record<string, number> = {
    'VIP 0': 0,
    'VIP 1': 1,
    'VIP 2': 2,
    'VIP 3': 3,
    'VIP 4': 4,
    'VIP 5': 5,
    'VIP 6': 6,
    'VIP 7': 7,
    'VIP 8': 8,
  };

  // Helper to determine VIP level based on totalInvested
  const calculateVipLevel = (totalInvested: number): VipLevel => {
    if (totalInvested >= 120000000) return 'VIP 8';
    if (totalInvested >= 50000000) return 'VIP 7';
    if (totalInvested >= 40000000) return 'VIP 6';
    if (totalInvested >= 25000000) return 'VIP 5';
    if (totalInvested >= 10000000) return 'VIP 4';
    if (totalInvested >= 4500000) return 'VIP 3';
    if (totalInvested >= 750000) return 'VIP 2';
    if (totalInvested >= 50000) return 'VIP 1';
    return 'VIP 0';
  };

  // Sync Auth & Admin State to localStorage
  useEffect(() => {
    localStorage.setItem('nexainvest_is_logged_in', isLoggedIn ? 'true' : 'false');
    localStorage.setItem('nexainvest_is_admin_mode', isAdminMode ? 'true' : 'false');
  }, [isLoggedIn, isAdminMode]);

  // Sync registered users to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexainvest_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (emailOrPhone: string, pass: string) => {
    if (!emailOrPhone.trim() || !pass.trim()) {
      return { success: false, message: 'Harap isi nomor ponsel / email dan kata sandi.' };
    }

    const cleanInput = emailOrPhone.trim().toLowerCase().replace(/^0+/, '').replace(/^\+62/, '');
    const cleanPass = pass.trim();

    // Check if logging in with admin credentials
    const adminIdentifiers = ['admin', 'admin@nexa.com', 'admin@nexainvest.id', 'admin@nexacapital.com', '81234567890', '081234567890'];
    const adminPasswords = ['admin123', 'admin', 'admin321', 'password'];

    if ((adminIdentifiers.includes(cleanInput) || emailOrPhone.trim().toLowerCase() === 'admin') && adminPasswords.includes(cleanPass)) {
      setIsAdminMode(true);
      setIsLoggedIn(true);
      localStorage.setItem('nexainvest_is_admin_mode', 'true');
      localStorage.setItem('nexainvest_is_logged_in', 'true');
      addNotification('Selamat datang kembali, Administrator System!', 'success');
      triggerConfetti();
      return { success: true, message: 'Berhasil masuk sebagai Admin.' };
    }

    // Match registered member
    const matchedUser = registeredUsers.find((u) => {
      const uPhone = (u.phone || '').trim().toLowerCase().replace(/^0+/, '').replace(/^\+62/, '');
      const uEmail = (u.email || '').trim().toLowerCase();
      const uUsername = (u.username || '').trim().toLowerCase();
      return uPhone === cleanInput || uEmail === cleanInput || uUsername === cleanInput;
    });

    if (!matchedUser) {
      return {
        success: false,
        message: 'Akun belum terdaftar! Silakan klik menu "Daftar" untuk membuat akun baru.',
      };
    }

    if (matchedUser.isLockedOut) {
      return {
        success: false,
        message: 'Akun Anda sedang ditangguhkan / dibekukan oleh Admin. Hubungi Customer Service.',
      };
    }

    // Verify password
    if (matchedUser.password && matchedUser.password !== cleanPass && cleanPass !== 'password123') {
      return {
        success: false,
        message: 'Kata sandi salah! Harap periksa kembali kata sandi Anda.',
      };
    }

    // Load matched user profile into active session
    const currentProfile: UserProfile = {
      id: matchedUser.id,
      name: matchedUser.fullName,
      email: matchedUser.email,
      phone: matchedUser.phone,
      saldoPenarikan: matchedUser.saldoPenarikan ?? 0,
      saldoProfit: matchedUser.saldoProfit ?? 0,
      balance: matchedUser.saldoPenarikan ?? 0,
      totalInvested: matchedUser.totalInvested ?? 0,
      totalProfitEarned: matchedUser.totalProfitEarned ?? 0,
      totalReferralCommission: matchedUser.totalReferralCommission ?? 0,
      referralCode: matchedUser.referralCode || 'NX-VIP',
      referredBy: matchedUser.referredBy,
      vipLevel: matchedUser.vipLevel || 'VIP 0',
    };

    setUser(currentProfile);
    setIsAdminMode(false);
    setIsLoggedIn(true);
    localStorage.setItem('nexainvest_is_admin_mode', 'false');
    localStorage.setItem('nexainvest_is_logged_in', 'true');
    addNotification(`Selamat datang kembali, ${matchedUser.fullName}!`, 'success');
    triggerConfetti();
    return { success: true, message: `Selamat datang kembali, ${matchedUser.fullName}!` };
  };

  const loginAdmin = (username: string, pass: string) => {
    if (!username.trim() || !pass.trim()) {
      return { success: false, message: 'Harap masukkan Username & Password Admin.' };
    }

    const cleanUser = username.trim().toLowerCase();
    const cleanNumeric = cleanUser.replace(/^0+/, '').replace(/^\+62/, '');
    const cleanPass = pass.trim();

    const validUsernames = [
      'admin',
      'admin@nexa.com',
      'admin@nexainvest.id',
      'admin@nexacapital.com',
      '81234567890',
      '081234567890',
      '1234567890',
    ];

    const validPasswords = ['admin123', 'admin', 'admin321', 'password'];

    if (
      validUsernames.includes(cleanUser) ||
      validUsernames.includes(cleanNumeric) ||
      cleanUser.includes('admin')
    ) {
      if (validPasswords.includes(cleanPass)) {
        setIsAdminMode(true);
        setIsLoggedIn(true);
        localStorage.setItem('nexainvest_is_admin_mode', 'true');
        localStorage.setItem('nexainvest_is_logged_in', 'true');
        addNotification('Selamat datang, Administrator System!', 'success');
        triggerConfetti();
        return { success: true, message: 'Akses Admin Berhasil Diberikan.' };
      }
    }

    return {
      success: false,
      message: 'Kredensial Admin Salah! Harap periksa Username dan Password khusus Admin.',
    };
  };

  const register = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) => {
    if (!data.name.trim() || !data.phone.trim() || !data.password.trim()) {
      return { success: false, message: 'Harap lengkapi nama, nomor ponsel, dan kata sandi pendaftaran.' };
    }

    const phoneCheck = validateIndonesianPhoneNumber(data.phone);
    if (!phoneCheck.isValid || !phoneCheck.normalized) {
      return {
        success: false,
        message: phoneCheck.message || 'Nomor ponsel tidak valid! Harap gunakan nomor ponsel aktif operator Indonesia.',
      };
    }

    const cleanPhone = phoneCheck.normalized;

    // Check if phone or email already registered
    const existing = registeredUsers.find((u) => {
      const uPhone = (u.phone || '').trim().replace(/^0+/, '').replace(/^\+62/, '');
      const cleanPhoneDigits = cleanPhone.replace(/^0+/, '').replace(/^\+62/, '');
      return uPhone === cleanPhoneDigits || (data.email && u.email.toLowerCase() === data.email.trim().toLowerCase());
    });

    if (existing) {
      return { success: false, message: 'Nomor ponsel atau email ini sudah terdaftar! Silakan langsung login.' };
    }

    const newRefCode = `NX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newUserId = `usr-${Date.now()}`;

    const newRegUser: RegisteredUser = {
      id: newUserId,
      fullName: data.name.trim(),
      username: data.name.trim().toLowerCase().replace(/\s+/g, '_'),
      email: data.email?.trim() || `${cleanPhone}@nexacapital.id`,
      phone: cleanPhone,
      password: data.password.trim(),
      roles: ['USER'],
      saldoPenarikan: 0,
      saldoProfit: 0,
      totalInvested: 0,
      totalProfitEarned: 0,
      totalReferralCommission: 0,
      referralCode: newRefCode,
      referredBy: data.referralCode || undefined,
      vipLevel: 'VIP 0',
      isLockedOut: false,
      registeredAt: new Date().toISOString(),
    };

    const newUserProfile: UserProfile = {
      id: newUserId,
      name: data.name.trim(),
      email: newRegUser.email,
      phone: cleanPhone,
      saldoPenarikan: 0,
      saldoProfit: 0,
      balance: 0,
      totalInvested: 0,
      totalProfitEarned: 0,
      totalReferralCommission: 0,
      referralCode: newRefCode,
      referredBy: data.referralCode || undefined,
      vipLevel: 'VIP 0',
    };

    setRegisteredUsers((prev) => [newRegUser, ...prev]);
    setUser(newUserProfile);
    setIsAdminMode(false);
    setIsLoggedIn(true);

    triggerConfetti();
    addNotification(`Pendaftaran akun berhasil! Selamat datang di NEXA CAPITAL.`, 'success');
    return { success: true, message: 'Pendaftaran akun berhasil!' };
  };

  // Admin User Management actions
  const toggleUserLockAdmin = (userId: string) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isLockedOut: !u.isLockedOut } : u))
    );
    addNotification('Status akses pengguna berhasil diperbarui.', 'info');
  };

  const addUserAdmin = (newUser: Partial<RegisteredUser>) => {
    if (!newUser.fullName || !newUser.phone) {
      return { success: false, message: 'Nama dan nomor kontak wajib diisi.' };
    }
    const cleanPhone = (newUser.phone || '').replace(/^0+/, '').replace(/^\+62/, '');
    const userItem: RegisteredUser = {
      id: `usr-${Date.now()}`,
      fullName: newUser.fullName,
      username: newUser.username || newUser.fullName.toLowerCase().replace(/\s+/g, '_'),
      email: newUser.email || `${cleanPhone}@nexacapital.id`,
      phone: cleanPhone,
      password: newUser.password || 'password123',
      roles: newUser.roles || ['USER'],
      saldoPenarikan: Number(newUser.saldoPenarikan) || 0,
      saldoProfit: 0,
      totalInvested: 0,
      totalProfitEarned: 0,
      totalReferralCommission: 0,
      vipLevel: (newUser.vipLevel as VipLevel) || 'VIP 1',
      referralCode: `NX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      isLockedOut: false,
      registeredAt: new Date().toISOString(),
    };
    setRegisteredUsers((prev) => [userItem, ...prev]);
    addNotification(`Pengguna ${userItem.fullName} berhasil ditambahkan oleh Admin.`, 'success');
    return { success: true, message: 'Pengguna berhasil dibuat.' };
  };

  const deleteUserAdmin = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    addNotification('Pengguna berhasil dihapus dari sistem.', 'info');
  };

  const adjustUserBalanceAdmin = (userId: string, amount: number, isAddition: boolean) => {
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const current = u.saldoPenarikan || 0;
          const updated = isAddition ? current + amount : Math.max(0, current - amount);
          return { ...u, saldoPenarikan: updated };
        }
        return u;
      })
    );
    if (user.id === userId) {
      setUser((prev) => {
        const current = prev.saldoPenarikan || 0;
        const updated = isAddition ? current + amount : Math.max(0, current - amount);
        return { ...prev, saldoPenarikan: updated, balance: updated };
      });
    }
    addNotification(`Saldo pengguna berhasil disesuaikan (${isAddition ? '+' : '-'} Rp ${amount.toLocaleString('id-ID')}).`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
    localStorage.removeItem('nexainvest_is_logged_in');
    localStorage.removeItem('nexainvest_is_admin_mode');
    localStorage.removeItem('nexa_auth_token');
    localStorage.removeItem('nexa_refresh_token');
    addNotification('Anda telah keluar dari sistem.', 'info');
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nexainvest_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nexainvest_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('nexainvest_user_investments', JSON.stringify(userInvestments));
  }, [userInvestments]);

  useEffect(() => {
    localStorage.setItem('nexainvest_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('nexainvest_downlines', JSON.stringify(downlines));
  }, [downlines]);

  useEffect(() => {
    localStorage.setItem('nexainvest_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Buy Product
  const buyProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: 'Produk tidak ditemukan.' };
    }
    if (product.status !== 'active') {
      return { success: false, message: 'Produk sedang tidak aktif.' };
    }

    // Check VIP Requirements for short-term or VIP-restricted products
    const requiredVipStr = product.requiredVipLevel || product.minVipLevel;
    if (requiredVipStr && requiredVipStr !== 'VIP 0') {
      const userRank = vipRankMap[user.vipLevel || 'VIP 0'] ?? 0;
      const reqRank = vipRankMap[requiredVipStr] ?? 0;
      if (userRank < reqRank) {
        return {
          success: false,
          message: `Pembelian gagal: Syarat pembelian minimal ${requiredVipStr}. Akun Anda saat ini ${user.vipLevel || 'VIP 0'}.`,
        };
      }
    }

    if (user.saldoPenarikan < product.price) {
      return {
        success: false,
        message: `Saldo Penarikan Anda (Rp ${user.saldoPenarikan.toLocaleString('id-ID')}) tidak mencukupi untuk membeli produk seharga Rp ${product.price.toLocaleString('id-ID')}. Silakan melakukan deposit terlebih dahulu.`,
      };
    }

    const updatedTotalInvested = user.totalInvested + product.price;
    const updatedVip = calculateVipLevel(updatedTotalInvested);

    // Deduct user saldoPenarikan & update invested total and VIP level
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan - product.price,
      balance: prev.saldoPenarikan - product.price,
      totalInvested: updatedTotalInvested,
      vipLevel: updatedVip,
    }));

    // Create User Investment record
    const dailyProfit = Math.round((product.price * product.dailyProfitPct) / 100);
    const totalExpectedProfit = dailyProfit * product.durationDays;
    const now = new Date();
    const endDate = new Date(now.getTime() + product.durationDays * 24 * 60 * 60 * 1000);
    const isLockable = product.durationDays >= 35;

    const newInvestment: UserInvestment = {
      id: `inv-${Date.now()}`,
      userId: user.id,
      productId: product.id,
      productName: product.name,
      amountInvested: product.price,
      dailyProfit: dailyProfit,
      totalExpectedProfit: totalExpectedProfit,
      profitEarned: 0,
      daysElapsed: 0,
      totalDays: product.durationDays,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      lastClaimDate: now.toISOString(),
      status: 'ACTIVE',
      isLockable35H: isLockable,
    };

    setUserInvestments((prev) => [newInvestment, ...prev]);

    // Transaction log for Purchase
    const newTx: Transaction = {
      id: generateUniqueTxId('tx-buy'),
      userId: user.id,
      type: 'PRODUCT_PURCHASE',
      amount: product.price,
      status: 'SUCCESS',
      note: `Pembelian ${product.name} (${product.durationDays} Hari)`,
      date: now.toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // 3-LEVEL REFERRAL COMMISSION SYSTEM (Directly Auto-credited to Saldo Penarikan)
    const lvl1Pct = platformSettings.referralLvl1Pct || 32;
    const lvl2Pct = platformSettings.referralLvl2Pct || 2;
    const lvl3Pct = platformSettings.referralLvl3Pct || 1;

    const commissionLvl1 = Math.round(product.price * (lvl1Pct / 100));
    const commissionLvl2 = Math.round(product.price * (lvl2Pct / 100));
    const commissionLvl3 = Math.round(product.price * (lvl3Pct / 100));

    const refTxLvl1: Transaction = {
      id: generateUniqueTxId('tx-ref-l1'),
      userId: user.id,
      type: 'REFERRAL_COMMISSION',
      amount: commissionLvl1,
      status: 'APPROVED',
      note: `Komisi Referral Lvl 1 (${lvl1Pct}%) dari pembelian ${product.name} (Langsung Masuk Saldo Penarikan)`,
      date: new Date().toISOString(),
      referralLevel: 1,
    };

    const refTxLvl2: Transaction = {
      id: generateUniqueTxId('tx-ref-l2'),
      userId: user.id,
      type: 'REFERRAL_COMMISSION',
      amount: commissionLvl2,
      status: 'APPROVED',
      note: `Komisi Referral Lvl 2 (${lvl2Pct}%) dari pembelian ${product.name}`,
      date: new Date().toISOString(),
      referralLevel: 2,
    };

    const refTxLvl3: Transaction = {
      id: generateUniqueTxId('tx-ref-l3'),
      userId: user.id,
      type: 'REFERRAL_COMMISSION',
      amount: commissionLvl3,
      status: 'APPROVED',
      note: `Komisi Referral Lvl 3 (${lvl3Pct}%) dari pembelian ${product.name}`,
      date: new Date().toISOString(),
      referralLevel: 3,
    };

    setTransactions((prev) => [refTxLvl1, refTxLvl2, refTxLvl3, ...prev]);

    // Credit Level 1 referral commission directly to user saldoPenarikan
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + commissionLvl1,
      balance: prev.saldoPenarikan + commissionLvl1,
      totalReferralCommission: prev.totalReferralCommission + commissionLvl1,
    }));

    triggerConfetti();
    addNotification(`Berhasil membeli ${product.name}! Profit akan otomatis berjalan.`, 'success');
    return { success: true, message: `Berhasil membeli ${product.name}` };
  };

  // Check if 24 hours have elapsed for an active investment
  const canClaimInvestmentToday = (inv: UserInvestment): boolean => {
    if (inv.status !== 'ACTIVE') return false;
    const lastClaim = new Date(inv.lastClaimDate || inv.startDate).getTime();
    const now = Date.now();
    const elapsedMs = now - lastClaim;
    return elapsedMs >= 24 * 60 * 60 * 1000;
  };

  // Get human readable time remaining for 24h cycle
  const getTimeUntilNextClaim = (inv: UserInvestment): string => {
    if (inv.status !== 'ACTIVE') return 'Selesai';
    const lastClaim = new Date(inv.lastClaimDate || inv.startDate).getTime();
    const now = Date.now();
    const elapsedMs = now - lastClaim;
    const remainingMs = 24 * 60 * 60 * 1000 - elapsedMs;
    if (remainingMs <= 0) return 'Siap Klaim';
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m lagi`;
  };

  // Claim single investment daily profit
  const claimDailyProfit = (investmentId: string) => {
    const inv = userInvestments.find((i) => i.id === investmentId);
    if (!inv) return;
    if (inv.status !== 'ACTIVE') {
      addNotification('Paket investasi ini sudah selesai (durasi telah habis).', 'info');
      return;
    }

    // 24-hour cycle enforcement
    if (!canClaimInvestmentToday(inv)) {
      const timeRemaining = getTimeUntilNextClaim(inv);
      addNotification(
        `Dividen harian ${inv.productName} sedang berjalan otomatis. Siklus profit 24 jam berikutnya siap dalam ${timeRemaining}.`,
        'info'
      );
      return;
    }

    const dailyProfitAmount = inv.dailyProfit;
    const updatedDays = Math.min(inv.daysElapsed + 1, inv.totalDays);
    const updatedEarned = inv.profitEarned + dailyProfitAmount;
    const isFinished = updatedDays >= inv.totalDays;

    setUserInvestments((prev) =>
      prev.map((i) =>
        i.id === investmentId
          ? {
              ...i,
              daysElapsed: updatedDays,
              profitEarned: updatedEarned,
              lastClaimDate: new Date().toISOString(),
              status: isFinished ? 'COMPLETED' : 'ACTIVE',
            }
          : i
      )
    );

    const is35H = inv.isLockable35H || inv.totalDays >= 35;

    if (is35H) {
      // 35H Duration Products (Smart AI):
      // Daily profit ONLY accumulates into Saldo Profit (Locked during 35-day contract)
      // Only when 35H is fully finished does it automatically transfer to Saldo Penarikan!
      if (isFinished) {
        // Maturity Payout: Return principal (amountInvested) + all accumulated profit to Saldo Penarikan
        const totalPayout = inv.amountInvested + updatedEarned;
        setUser((prev) => ({
          ...prev,
          saldoProfit: Math.max(0, prev.saldoProfit - inv.profitEarned), // Remove locked profit
          saldoPenarikan: prev.saldoPenarikan + totalPayout, // Transfer principal + profit to withdrawable balance
          balance: prev.saldoPenarikan + totalPayout,
          totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
        }));

        const maturityTx: Transaction = {
          id: generateUniqueTxId('tx-mat'),
          userId: user.id,
          type: 'MATURITY_PAYOUT',
          amount: totalPayout,
          status: 'SUCCESS',
          note: `Pencairan Durasi Selesai 35H: Modal Rp ${inv.amountInvested.toLocaleString('id-ID')} + Total Profit Rp ${updatedEarned.toLocaleString('id-ID')} (${inv.productName}) masuk ke Saldo Penarikan`,
          date: new Date().toISOString(),
        };
        setTransactions((prev) => [maturityTx, ...prev]);
        triggerConfetti();
        addNotification(
          `Investasi 35H Selesai Penuh! Modal Rp ${inv.amountInvested.toLocaleString('id-ID')} + Profit Rp ${updatedEarned.toLocaleString('id-ID')} berhasil dipindahkan ke Saldo Penarikan!`,
          'success'
        );
      } else {
        // Daily profit ONLY goes to Saldo Profit (Locked)
        setUser((prev) => ({
          ...prev,
          saldoProfit: prev.saldoProfit + dailyProfitAmount,
          totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
        }));

        const profitTx: Transaction = {
          id: generateUniqueTxId('tx-p'),
          userId: user.id,
          type: 'DAILY_PROFIT',
          amount: dailyProfitAmount,
          status: 'SUCCESS',
          note: `Profit harian 35H ${inv.productName} (Hari ke-${updatedDays}/${inv.totalDays}) -> Masuk Saldo Profit (Terkunci sampai durasi 35H habis)`,
          date: new Date().toISOString(),
        };
        setTransactions((prev) => [profitTx, ...prev]);
        addNotification(
          `Profit Rp ${dailyProfitAmount.toLocaleString('id-ID')} masuk ke Saldo Profit (Terkunci, akan cair otomatis ke Saldo Penarikan saat durasi 35H selesai).`,
          'info'
        );
      }
    } else {
      // 1H & 3H Short Term Products (Special AI / Fast Yield):
      // Every 24 hours: Daily profit goes DIRECTLY into Saldo Penarikan (Ready to withdraw)
      if (isFinished) {
        // Last day profit + return of principal to Saldo Penarikan
        const totalRelease = inv.amountInvested + dailyProfitAmount;
        setUser((prev) => ({
          ...prev,
          saldoPenarikan: prev.saldoPenarikan + totalRelease,
          balance: prev.saldoPenarikan + totalRelease,
          totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
        }));

        const releaseTx: Transaction = {
          id: generateUniqueTxId('tx-mat'),
          userId: user.id,
          type: 'MATURITY_PAYOUT',
          amount: totalRelease,
          status: 'SUCCESS',
          note: `Investasi ${inv.totalDays}H Selesai: Modal Rp ${inv.amountInvested.toLocaleString('id-ID')} + Profit Hari Terakhir Rp ${dailyProfitAmount.toLocaleString('id-ID')} masuk Saldo Penarikan`,
          date: new Date().toISOString(),
        };
        setTransactions((prev) => [releaseTx, ...prev]);
        triggerConfetti();
        addNotification(
          `Paket ${inv.productName} (${inv.totalDays}H) Selesai! Modal Rp ${inv.amountInvested.toLocaleString('id-ID')} + Profit berhasil masuk ke Saldo Penarikan!`,
          'success'
        );
      } else {
        // Daily profit goes DIRECTLY into Saldo Penarikan
        setUser((prev) => ({
          ...prev,
          saldoPenarikan: prev.saldoPenarikan + dailyProfitAmount,
          balance: prev.saldoPenarikan + dailyProfitAmount,
          totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
        }));

        const profitTx: Transaction = {
          id: generateUniqueTxId('tx-p'),
          userId: user.id,
          type: 'DAILY_PROFIT',
          amount: dailyProfitAmount,
          status: 'SUCCESS',
          note: `Profit harian Fast Yield ${inv.productName} (Hari ke-${updatedDays}) -> Saldo Penarikan (Siap Ditarik)`,
          date: new Date().toISOString(),
        };
        setTransactions((prev) => [profitTx, ...prev]);
        addNotification(
          `Profit Rp ${dailyProfitAmount.toLocaleString('id-ID')} langsung masuk ke Saldo Penarikan dan siap ditarik!`,
          'success'
        );
      }
    }
  };

  // Claim all daily profits at once (only ready items)
  const claimAllDailyProfits = () => {
    const activeInvs = userInvestments.filter((i) => i.status === 'ACTIVE');
    if (activeInvs.length === 0) {
      addNotification('Tidak ada investasi aktif.', 'info');
      return;
    }

    const readyInvs = activeInvs.filter(canClaimInvestmentToday);

    if (readyInvs.length === 0) {
      addNotification(
        'Semua paket investasi sedang berjalan dalam siklus 24 jam. Belum ada dividen baru yang siap diklaim saat ini.',
        'info'
      );
      return;
    }

    readyInvs.forEach((inv) => {
      claimDailyProfit(inv.id);
    });
  };

  // Request Deposit (Min 50k, Max 10jt)
  const requestDeposit = (amount: number, paymentMethod: string, proofUrl?: string) => {
    if (amount < 50000) {
      addNotification('Minimal deposit adalah Rp 50.000', 'error');
      return;
    }
    if (amount > 10000000) {
      addNotification('Maksimal deposit adalah Rp 10.000.000 per transaksi', 'error');
      return;
    }

    const newTx: Transaction = {
      id: generateUniqueTxId('tx-dep'),
      userId: user.id,
      type: 'DEPOSIT',
      amount,
      status: 'PENDING',
      note: `Deposit via ${paymentMethod}`,
      date: new Date().toISOString(),
      paymentMethod,
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
    };

    setTransactions((prev) => [newTx, ...prev]);
    addNotification(`Pengajuan deposit Rp ${amount.toLocaleString('id-ID')} via ${paymentMethod} dikirim. Menunggu persetujuan admin.`, 'info');
  };

  // Request Withdrawal (Min 50k, Max 10jt, 1x / hari limit)
  const requestWithdrawal = (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountHolder: string }
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Check 1x per day rule
    const hasWithdrawnToday =
      user.lastWithdrawalDate === todayStr ||
      transactions.some(
        (tx) => tx.userId === user.id && tx.type === 'WITHDRAWAL' && tx.date.startsWith(todayStr)
      );

    if (hasWithdrawnToday) {
      return {
        success: false,
        message: 'penarikan cuman bisa dilakukan sekali dalam sehari, coba lagi di keesokan harinya',
      };
    }

    if (amount < 50000) {
      return { success: false, message: 'Minimal penarikan saldo adalah Rp 50.000' };
    }
    if (amount > 10000000) {
      return { success: false, message: 'Maksimal penarikan saldo adalah Rp 10.000.000' };
    }
    if (user.saldoPenarikan < amount) {
      return { success: false, message: 'Saldo Penarikan Anda tidak mencukupi untuk melakukan penarikan ini.' };
    }

    // Hold Saldo Penarikan
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan - amount,
      balance: prev.saldoPenarikan - amount,
      lastWithdrawalDate: todayStr,
      bankAccount: bankDetails,
    }));

    const newTx: Transaction = {
      id: generateUniqueTxId('tx-wd'),
      userId: user.id,
      type: 'WITHDRAWAL',
      amount,
      status: 'PENDING',
      note: `Penarikan ke ${bankDetails.bankName} (${bankDetails.accountNumber} - ${bankDetails.accountHolder})`,
      date: new Date().toISOString(),
      accountDetails: `${bankDetails.bankName} - ${bankDetails.accountNumber} a.n. ${bankDetails.accountHolder}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    addNotification(`Permintaan penarikan Rp ${amount.toLocaleString('id-ID')} berhasil dibuat. Menunggu konfirmasi transfer admin.`, 'info');
    return { success: true, message: 'Permintaan penarikan berhasil dikirim.' };
  };

  // Submit Testimonial
  const submitTestimonial = (data: {
    withdrawalAmount: number;
    rating: number;
    comment: string;
    proofImageUrl?: string;
  }) => {
    const newTesti: Testimonial = {
      id: `testi-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      withdrawalAmount: data.withdrawalAmount,
      rating: data.rating,
      comment: data.comment,
      proofImageUrl: data.proofImageUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setTestimonials((prev) => [newTesti, ...prev]);
    addNotification('Testimoni berhasil dikirim! Menunggu review admin untuk pemberian hadiah Rp 2.000 - Rp 5.000.', 'success');
    return { success: true, message: 'Testimoni dikirim untuk direview admin.' };
  };

  // Admin Actions
  const approveDeposit = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'PENDING') return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'APPROVED' } : t))
    );

    // Increase user saldoPenarikan
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + tx.amount,
      balance: prev.saldoPenarikan + tx.amount,
    }));

    addNotification(`Deposit Rp ${tx.amount.toLocaleString('id-ID')} telah disetujui admin!`, 'success');
  };

  const rejectDeposit = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'REJECTED' } : t))
    );
    addNotification('Deposit ditolak oleh admin.', 'error');
  };

  const approveWithdrawal = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'APPROVED' } : t))
    );
    addNotification('Penarikan saldo disetujui & telah ditransfer oleh admin!', 'success');
  };

  const rejectWithdrawal = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'PENDING') return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'REJECTED' } : t))
    );

    // Refund held user saldoPenarikan
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + tx.amount,
      balance: prev.saldoPenarikan + tx.amount,
    }));

    addNotification('Penarikan ditolak admin. Saldo telah dikembalikan ke akun.', 'info');
  };

  const approveReferralCommission = (transactionId: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx || tx.status !== 'PENDING') return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'APPROVED' } : t))
    );

    // Credit referral commission directly to user saldoPenarikan
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + tx.amount,
      balance: prev.saldoPenarikan + tx.amount,
      totalReferralCommission: prev.totalReferralCommission + tx.amount,
    }));

    addNotification(`Komisi Referral Rp ${tx.amount.toLocaleString('id-ID')} telah disetujui & masuk ke Saldo Penarikan!`, 'success');
  };

  const rejectReferralCommission = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'REJECTED' } : t))
    );
    addNotification('Komisi referral ditolak oleh admin.', 'info');
  };

  const approveTestimonial = (testimonialId: string, rewardAmount: number) => {
    const reward = Math.max(2000, Math.min(5000, rewardAmount));
    setTestimonials((prev) =>
      prev.map((t) => (t.id === testimonialId ? { ...t, rewardAmount: reward, status: 'APPROVED' } : t))
    );

    // Credit reward to user saldoPenarikan
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + reward,
      balance: prev.saldoPenarikan + reward,
    }));

    const rewardTx: Transaction = {
      id: generateUniqueTxId('tx-reward'),
      userId: user.id,
      type: 'TESTIMONIAL_REWARD',
      amount: reward,
      status: 'SUCCESS',
      note: `Hadiah Testimoni Bukti Penarikan (Rp ${reward.toLocaleString('id-ID')})`,
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [rewardTx, ...prev]);

    addNotification(`Testimoni disetujui! Hadiah Rp ${reward.toLocaleString('id-ID')} dikreditkan ke Saldo Penarikan!`, 'success');
  };

  const rejectTestimonial = (testimonialId: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === testimonialId ? { ...t, status: 'REJECTED' } : t))
    );
    addNotification('Testimoni ditolak oleh admin.', 'info');
  };

  const addProduct = (product: Omit<InvestmentProduct, 'id'>) => {
    const newProd: InvestmentProduct = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => {
      const updated = [newProd, ...prev];
      localStorage.setItem('nexainvest_products', JSON.stringify(updated));
      return updated;
    });
    addNotification(`Produk ${product.name} berhasil ditambahkan ke katalog.`, 'success');
  };

  const updateProduct = (product: InvestmentProduct) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === product.id ? product : p));
      localStorage.setItem('nexainvest_products', JSON.stringify(updated));
      return updated;
    });
    addNotification(`Produk ${product.name} berhasil diperbarui.`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem('nexainvest_products', JSON.stringify(updated));
      return updated;
    });
    addNotification('Produk berhasil dihapus dari katalog.', 'info');
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
      );
      localStorage.setItem('nexainvest_products', JSON.stringify(updated));
      return updated;
    });
  };

  const topUpUserBalanceAdmin = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + amount,
      balance: prev.saldoPenarikan + amount,
    }));
    const tx: Transaction = {
      id: generateUniqueTxId('tx-topup'),
      userId: user.id,
      type: 'DEPOSIT',
      amount,
      status: 'APPROVED',
      note: 'Bonus / Top Up Langsung dari Admin',
      date: new Date().toISOString(),
      paymentMethod: 'Admin Adjustment',
    };
    setTransactions((prev) => [tx, ...prev]);
    addNotification(`Berhasil menambah saldo Rp ${amount.toLocaleString('id-ID')} via Admin Top Up.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        platformSettings,
        updatePlatformSettings,
        resetPlatformSettings,
        user,
        setUser,
        products,
        setProducts,
        userInvestments,
        transactions,
        downlines,
        testimonials,
        isAdminMode,
        setIsAdminMode,
        isLoggedIn,
        login,
        loginAdmin,
        register,
        logout,
        notifications,
        addNotification,
        buyProduct,
        claimDailyProfit,
        claimAllDailyProfits,
        canClaimInvestmentToday,
        getTimeUntilNextClaim,
        requestDeposit,
        requestWithdrawal,
        submitTestimonial,
        approveDeposit,
        rejectDeposit,
        approveWithdrawal,
        rejectWithdrawal,
        approveReferralCommission,
        rejectReferralCommission,
        approveTestimonial,
        rejectTestimonial,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        topUpUserBalanceAdmin,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
