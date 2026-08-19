import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Shield,
  Download,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Key,
  X,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RegisteredUser } from '../../types';

export const UserManagementView: React.FC = () => {
  const {
    registeredUsers,
    toggleUserLockAdmin,
    addUserAdmin,
    deleteUserAdmin,
    adjustUserBalanceAdmin,
    addNotification,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [balanceModalUser, setBalanceModalUser] = useState<RegisteredUser | null>(null);
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState<number>(50000);
  const [isAddition, setIsAddition] = useState<boolean>(true);

  // New User Form State
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    vipLevel: 'VIP 1',
    roles: ['USER'],
    saldoPenarikan: 0,
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Nama lengkap dan nomor HP wajib diisi!');
      return;
    }
    const res = addUserAdmin(formData as any);
    if (res.success) {
      setIsAddModalOpen(false);
      setFormData({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        vipLevel: 'VIP 1',
        roles: ['USER'],
        saldoPenarikan: 0,
      });
    }
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus member ${name} secara permanen?`)) {
      deleteUserAdmin(userId);
    }
  };

  const handleAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModalUser) return;
    if (balanceAdjustAmount <= 0) {
      alert('Nominal harus lebih besar dari 0');
      return;
    }
    adjustUserBalanceAdmin(balanceModalUser.id, balanceAdjustAmount, isAddition);
    setBalanceModalUser(null);
  };

  const filteredUsers = registeredUsers.filter((u) => {
    const nameMatch = (u.fullName || '').toLowerCase().includes(search.toLowerCase());
    const emailMatch = (u.email || '').toLowerCase().includes(search.toLowerCase());
    const phoneMatch = (u.phone || '').toLowerCase().includes(search.toLowerCase());
    const roleMatch = selectedRoleFilter === 'ALL' || (u.roles || []).includes(selectedRoleFilter);
    return (nameMatch || emailMatch || phoneMatch) && roleMatch;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const exportCSV = () => {
    const headers = 'ID,Nama Lengkap,Username,Email,No Ponsel,VIP Level,Saldo Penarikan,Tgl Daftar\n';
    const rows = filteredUsers
      .map((u) => `"${u.id}","${u.fullName}","${u.username}","${u.email}","${u.phone}","${u.vipLevel}","${u.saldoPenarikan}","${u.registeredAt}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `member-nexacapital-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('Data member berhasil diekspor ke CSV!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-500" />
            <span>Manajemen Pengguna & Member</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola data seluruh akun investor aktif, verifikasi data, sesuaikan saldo, dan kelola hak akses.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Member Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau no HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-semibold"
          >
            <option value="ALL">Semua Peran (All Roles)</option>
            <option value="USER">Member / Investor</option>
            <option value="ADMIN">Administrator</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Level VIP</th>
                <th className="py-3.5 px-4">Saldo Penarikan</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada data member yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shrink-0">
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.fullName}</span>
                            {u.roles?.includes('ADMIN') && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">@{u.username || 'user'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{u.phone}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[11px]">
                        {u.vipLevel || 'VIP 0'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-emerald-400 text-sm">
                        {formatRupiah(u.saldoPenarikan || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Investasi: {formatRupiah(u.totalInvested || 0)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.isLockedOut ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" />
                          <span>Dibekukan</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3" />
                          <span>Aktif Normal</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Adjust balance */}
                        <button
                          onClick={() => setBalanceModalUser(u)}
                          title="Ubah / Tambah Saldo Member"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                        {/* Toggle lock */}
                        <button
                          onClick={() => toggleUserLockAdmin(u.id)}
                          title={u.isLockedOut ? 'Buka Kunci Akun' : 'Kunci / Bekukan Akun'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                            u.isLockedOut
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                          }`}
                        >
                          {u.isLockedOut ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {/* Delete user */}
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          title="Hapus Member"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>Tambah Member Baru</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Andi Pratama"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">No. Ponsel (WA)</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Kata Sandi</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Level VIP</label>
                  <select
                    value={formData.vipLevel}
                    onChange={(e) => setFormData({ ...formData, vipLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="VIP 0">VIP 0 (Member Baru)</option>
                    <option value="VIP 1">VIP 1</option>
                    <option value="VIP 2">VIP 2</option>
                    <option value="VIP 3">VIP 3</option>
                    <option value="VIP 4">VIP 4</option>
                    <option value="VIP 5">VIP 5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Saldo Awal (Rp)</label>
                  <input
                    type="number"
                    value={formData.saldoPenarikan}
                    onChange={(e) => setFormData({ ...formData, saldoPenarikan: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Simpan Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {balanceModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Sesuaikan Saldo Member</span>
              </h3>
              <button
                onClick={() => setBalanceModalUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">Member: <strong className="text-white">{balanceModalUser.fullName}</strong> ({balanceModalUser.phone})</div>
              <div className="text-slate-400">Saldo Saat Ini: <strong className="text-emerald-400">{formatRupiah(balanceModalUser.saldoPenarikan || 0)}</strong></div>
            </div>

            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Tipe Penyesuaian</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddition(true)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      isAddition
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    + Tambah Saldo (Topup)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddition(false)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      !isAddition
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    - Kurangi Saldo (Potong)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  required
                  value={balanceAdjustAmount}
                  onChange={(e) => setBalanceAdjustAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBalanceModalUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Terapkan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
