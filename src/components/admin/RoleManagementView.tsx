import React, { useState } from 'react';
import { Shield, Check, Lock, ShieldAlert, Save } from 'lucide-react';

export const RoleManagementView: React.FC = () => {
  const roles = [
    { name: 'SUPER_ADMIN', label: 'Super Administrator', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { name: 'ADMIN', label: 'System Admin', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { name: 'MODERATOR', label: 'Moderator Konten', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { name: 'FINANCE', label: 'Staf Keuangan', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { name: 'SUPPORT', label: 'Tim Dukungan CS', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { name: 'EDITOR', label: 'Editor Konten CMS', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { name: 'USER', label: 'Pengguna / Investor', color: 'text-slate-300 bg-slate-800 border-slate-700' },
  ];

  const permissions = [
    { code: 'users:read', name: 'Melihat Daftar Pengguna', category: 'Pengguna' },
    { code: 'users:write', name: 'Mengedit / Membuat Pengguna', category: 'Pengguna' },
    { code: 'users:delete', name: 'Menghapus Akun Pengguna', category: 'Pengguna' },
    { code: 'deposits:approve', name: 'Menyetujui Deposit', category: 'Keuangan' },
    { code: 'withdrawals:approve', name: 'Menyetujui Penarikan', category: 'Keuangan' },
    { code: 'products:manage', name: 'Mengelola Paket Saham', category: 'Produk' },
    { code: 'cms:edit', name: 'Mengubah Konten Landing Page', category: 'CMS' },
    { code: 'system:settings', name: 'Mengubah Pengaturan Sistem', category: 'Sistem' },
  ];

  const [matrix, setMatrix] = useState<Record<string, string[]>>({
    SUPER_ADMIN: permissions.map((p) => p.code),
    ADMIN: ['users:read', 'users:write', 'deposits:approve', 'withdrawals:approve', 'products:manage'],
    MODERATOR: ['users:read', 'cms:edit'],
    FINANCE: ['deposits:approve', 'withdrawals:approve'],
    SUPPORT: ['users:read'],
    EDITOR: ['cms:edit'],
    USER: [],
  });

  const togglePermission = (role: string, permCode: string) => {
    if (role === 'SUPER_ADMIN') return; // Super admin always has all
    const current = matrix[role] || [];
    const has = current.includes(permCode);
    const updated = has ? current.filter((c) => c !== permCode) : [...current, permCode];
    setMatrix({ ...matrix, [role]: updated });
  };

  const handleSave = () => {
    alert('Matriks Hak Akses RBAC berhasil diperbarui dan disinkronkan ke server!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Matriks Peran & Hak Akses (RBAC System)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur izin operasi granular untuk setiap tingkat administrator dan pengguna platform.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan RBAC</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 min-w-[200px]">Izin Operasi</th>
                {roles.map((r) => (
                  <th key={r.name} className="p-4 text-center min-w-[120px]">
                    <span className={`px-2 py-1 rounded-md border text-[10px] font-bold ${r.color}`}>
                      {r.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {permissions.map((p) => (
                <tr key={p.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{p.code}</p>
                  </td>
                  {roles.map((r) => {
                    const isChecked = (matrix[r.name] || []).includes(p.code);
                    const isSuper = r.name === 'SUPER_ADMIN';
                    return (
                      <td key={r.name} className="p-4 text-center">
                        <button
                          type="button"
                          disabled={isSuper}
                          onClick={() => togglePermission(r.name, p.code)}
                          className={`w-6 h-6 rounded-lg inline-flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-slate-950 border border-slate-800 text-slate-600 hover:border-slate-700'
                          } ${isSuper ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
