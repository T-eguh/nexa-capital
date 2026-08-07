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
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PRODUCTS,
  INITIAL_USER_INVESTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_DOWNLINES,
  INITIAL_TESTIMONIALS,
} from '../data/initialData';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

interface AppContextType {
  // User state
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
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
  toggleProductStatus: (id: string) => void;
  topUpUserBalanceAdmin: (amount: number) => void;
  triggerConfetti: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persisted state initializers
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
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(() => {
    const saved = localStorage.getItem('nexainvest_user_investments');
    return saved ? JSON.parse(saved) : INITIAL_USER_INVESTMENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('nexainvest_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [downlines, setDownlines] = useState<DownlineUser[]>(() => {
    const saved = localStorage.getItem('nexainvest_downlines');
    return saved ? JSON.parse(saved) : INITIAL_DOWNLINES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('nexainvest_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('nexainvest_is_logged_in');
    return savedAuth === 'true';
  });

  // Helper to determine VIP level based on totalInvested
  const calculateVipLevel = (totalInvested: number): VipLevel => {
    if (totalInvested >= 2000000) return 'VIP 3';
    if (totalInvested >= 500000) return 'VIP 2';
    if (totalInvested >= 100000) return 'VIP 1';
    return 'VIP 0';
  };

  // Sync Auth State
  useEffect(() => {
    localStorage.setItem('nexainvest_is_logged_in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const login = (emailOrPhone: string, pass: string) => {
    if (!emailOrPhone.trim() || !pass.trim()) {
      return { success: false, message: 'Harap isi semua kolom login.' };
    }
    setIsAdminMode(false);
    setIsLoggedIn(true);
    addNotification(`Selamat datang kembali, ${user.name}!`, 'success');
    triggerConfetti();
    return { success: true, message: 'Berhasil masuk ke akun Anda.' };
  };

  const loginAdmin = (username: string, pass: string) => {
    if (!username.trim() || !pass.trim()) {
      return { success: false, message: 'Harap masukkan Username & Password Admin.' };
    }

    const cleanUser = username.trim().toLowerCase();
    if (
      (cleanUser === 'admin@nexainvest.id' || cleanUser === 'admin') &&
      (pass === 'admin123' || pass === 'admin')
    ) {
      setIsAdminMode(true);
      setIsLoggedIn(true);
      addNotification('Selamat datang, Administrator System!', 'success');
      triggerConfetti();
      return { success: true, message: 'Akses Admin Berhasil Diberikan.' };
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
    if (!data.name || !data.email || !data.phone || !data.password) {
      return { success: false, message: 'Harap lengkapi seluruh formulir pendaftaran.' };
    }

    // Create new registered user with 0 initial balance (No Rp 50k bonus)
    const newRefCode = `NX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
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

    setUser(newUser);
    setIsAdminMode(false);
    setIsLoggedIn(true);

    triggerConfetti();
    addNotification(`Pendaftaran akun berhasil! Silakan lakukan deposit untuk mulai berinvestasi.`, 'success');
    return { success: true, message: 'Pendaftaran akun berhasil!' };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
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

    // Check VIP Requirements for 1H or 3H products
    if (product.durationDays === 3 && user.vipLevel === 'VIP 0') {
      return {
        success: false,
        message: 'Produk durasi 3 Hari hanya dapat dibeli oleh Akun VIP 1 ke atas (Total investasi min Rp 100.000).',
      };
    }
    if (product.durationDays === 1 && (user.vipLevel === 'VIP 0' || user.vipLevel === 'VIP 1')) {
      return {
        success: false,
        message: 'Produk durasi 1 Hari hanya dapat dibeli oleh Akun VIP 2 ke atas (Total investasi min Rp 500.000).',
      };
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
      id: `tx-${Date.now()}`,
      userId: user.id,
      type: 'PRODUCT_PURCHASE',
      amount: product.price,
      status: 'SUCCESS',
      note: `Pembelian ${product.name} (${product.durationDays} Hari)`,
      date: now.toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    // 3-LEVEL REFERRAL COMMISSION SYSTEM (Requires Admin Approval)
    // Level 1: 32% (50k * 32% = 16k)
    // Level 2: 2% (50k * 2% = 1k)
    // Level 3: 1% (50k * 1% = 500)
    const commissionLvl1 = Math.round(product.price * 0.32);
    const commissionLvl2 = Math.round(product.price * 0.02);
    const commissionLvl3 = Math.round(product.price * 0.01);

    const refTxLvl1: Transaction = {
      id: `tx-ref-l1-${Date.now()}`,
      userId: user.id,
      type: 'REFERRAL_COMMISSION',
      amount: commissionLvl1,
      status: 'PENDING',
      note: `Komisi Referral Lvl 1 (32%) dari pembelian ${product.name}`,
      date: new Date().toISOString(),
      referralLevel: 1,
    };

    const refTxLvl2: Transaction = {
      id: `tx-ref-l2-${Date.now() + 1}`,
      userId: user.id,
      type: 'REFERRAL_COMMISSION',
      amount: commissionLvl2,
      status: 'PENDING',
      note: `Komisi Referral Lvl 2 (2%) dari pembelian ${product.name}`,
      date: new Date().toISOString(),
      referralLevel: 2,
    };

    const refTxLvl3: Transaction = {
      id: `tx-ref-l3-${Date.now() + 2}`,
      userId: user.id,
      type: 'REFERRAL_COMMISSION',
      amount: commissionLvl3,
      status: 'PENDING',
      note: `Komisi Referral Lvl 3 (1%) dari pembelian ${product.name}`,
      date: new Date().toISOString(),
      referralLevel: 3,
    };

    setTransactions((prev) => [refTxLvl1, refTxLvl2, refTxLvl3, ...prev]);

    triggerConfetti();
    addNotification(`Berhasil membeli ${product.name}! Profit akan otomatis berjalan.`, 'success');
    return { success: true, message: `Berhasil membeli ${product.name}` };
  };

  // Claim single investment daily profit
  const claimDailyProfit = (investmentId: string) => {
    const inv = userInvestments.find((i) => i.id === investmentId);
    if (!inv || inv.status !== 'ACTIVE') return;

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

    if (inv.isLockable35H || inv.totalDays >= 35) {
      // 35H Duration Products: Profit goes to Saldo Profit (Locked until 35 days finish)
      if (isFinished) {
        // Investment completed! Mature payout: Modal + All Profit transferred to Saldo Penarikan
        const totalPayout = inv.amountInvested + updatedEarned;
        setUser((prev) => ({
          ...prev,
          saldoProfit: Math.max(0, prev.saldoProfit - inv.profitEarned),
          saldoPenarikan: prev.saldoPenarikan + totalPayout,
          balance: prev.saldoPenarikan + totalPayout,
          totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
        }));

        const maturityTx: Transaction = {
          id: `tx-mat-${Date.now()}`,
          userId: user.id,
          type: 'MATURITY_PAYOUT',
          amount: totalPayout,
          status: 'SUCCESS',
          note: `Pencairan Modal + Profit 35H (${inv.productName}) ke Saldo Penarikan`,
          date: new Date().toISOString(),
        };
        setTransactions((prev) => [maturityTx, ...prev]);
        triggerConfetti();
        addNotification(`Investasi 35H Selesai! Modal Rp ${inv.amountInvested.toLocaleString('id-ID')} + Profit Rp ${updatedEarned.toLocaleString('id-ID')} berhasil dicairkan ke Saldo Penarikan!`, 'success');
      } else {
        // Daily profit added to Saldo Profit
        setUser((prev) => ({
          ...prev,
          saldoProfit: prev.saldoProfit + dailyProfitAmount,
          totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
        }));

        const profitTx: Transaction = {
          id: `tx-p-${Date.now()}`,
          userId: user.id,
          type: 'DAILY_PROFIT',
          amount: dailyProfitAmount,
          status: 'SUCCESS',
          note: `Profit harian 35H ${inv.productName} (Hari ke-${updatedDays}) -> Saldo Profit`,
          date: new Date().toISOString(),
        };
        setTransactions((prev) => [profitTx, ...prev]);
        addNotification(`Profit Rp ${dailyProfitAmount.toLocaleString('id-ID')} masuk ke Saldo Profit (Dapat ditarik setelah 35H)!`, 'info');
      }
    } else {
      // 1H & 3H Duration Products: Profit goes directly to Saldo Penarikan (Withdrawable immediately)
      setUser((prev) => ({
        ...prev,
        saldoPenarikan: prev.saldoPenarikan + dailyProfitAmount,
        balance: prev.saldoPenarikan + dailyProfitAmount,
        totalProfitEarned: prev.totalProfitEarned + dailyProfitAmount,
      }));

      const profitTx: Transaction = {
        id: `tx-p-${Date.now()}`,
        userId: user.id,
        type: 'DAILY_PROFIT',
        amount: dailyProfitAmount,
        status: 'SUCCESS',
        note: `Profit harian Fast Yield ${inv.productName} -> Saldo Penarikan`,
        date: new Date().toISOString(),
      };

      setTransactions((prev) => [profitTx, ...prev]);
      addNotification(`Profit Rp ${dailyProfitAmount.toLocaleString('id-ID')} masuk ke Saldo Penarikan & Siap Ditarik!`, 'success');
    }
  };

  // Claim all daily profits at once
  const claimAllDailyProfits = () => {
    const activeInvs = userInvestments.filter((i) => i.status === 'ACTIVE');
    if (activeInvs.length === 0) {
      addNotification('Tidak ada investasi aktif yang dapat diklaim profitnya.', 'info');
      return;
    }

    activeInvs.forEach((inv) => {
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
      id: `tx-dep-${Date.now()}`,
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
    if (user.lastWithdrawalDate === todayStr) {
      return {
        success: false,
        message: 'Penarikan hanya dapat dilakukan 1 kali dalam sehari. Harap coba lagi esok hari.',
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
      id: `tx-wd-${Date.now()}`,
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
      id: `tx-reward-${Date.now()}`,
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
    setProducts((prev) => [newProd, ...prev]);
    addNotification(`Produk ${product.name} berhasil ditambahkan ke katalog.`, 'success');
  };

  const updateProduct = (product: InvestmentProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    addNotification(`Produk ${product.name} berhasil diperbarui.`, 'success');
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
      )
    );
  };

  const topUpUserBalanceAdmin = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      saldoPenarikan: prev.saldoPenarikan + amount,
      balance: prev.saldoPenarikan + amount,
    }));
    const tx: Transaction = {
      id: `tx-topup-${Date.now()}`,
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
