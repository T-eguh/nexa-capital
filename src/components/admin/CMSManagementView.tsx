import React, { useState, useEffect } from 'react';
import { FileText, Save, Eye, Sparkles } from 'lucide-react';

export const CMSManagementView: React.FC = () => {
  const [cms, setCms] = useState<any>({
    heroTitle: 'Platform Investasi Saham Modern & Dividen Harian',
    heroSubtitle: 'Investasi saham terpercaya dengan imbal hasil teratur, transparansi penuh, dan komisi referral multi-tier.',
    bannerText: '🔥 PROMO EVENT: Dapatkan Bonus Cashback hingga Rp 50.000 untuk deposit di atas Rp 1.000.000!',
    bannerActive: true,
    contactEmail: 'support@nexainvest.id',
    contactPhone: '+62 812-9900-1122',
    termsOfService: 'Ketentuan layanan penggunaan Nexa Capital. Harap gunakan akun dengan bijak dan ikuti seluruh syarat dan ketentuan investasi.',
    privacyPolicy: 'Kebijakan privasi Nexa Capital menjamin keamanan data pribadi, nomor HP, dan informasi transaksi Anda terlindungi dengan enkripsi 256-bit.'
  });
  const [saving, setSaving] = useState(false);

  const fetchCMS = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCms(data.cms);
      }
    } catch (err) {
      console.error('Gagal memuat CMS:', err);
    }
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cms)
      });
      const data = await res.json();
      if (data.success) {
        alert('Konten CMS Landing Page berhasil disimpan!');
      }
    } catch (err) {
      console.error('Gagal menyimpan CMS:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Sistem CMS & Editor Konten Landing Page</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur judul hero, banner promo, syarat & ketentuan, kebijakan privasi, serta kontak resmi platform.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan CMS</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Hero & Banner Section */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bagian Hero & Banner Pengumuman</span>
          </h3>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Judul Utama (Hero Title)</label>
            <input
              type="text"
              value={cms.heroTitle}
              onChange={(e) => setCms({ ...cms, heroTitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Sub-Judul Hero</label>
            <textarea
              rows={3}
              value={cms.heroSubtitle}
              onChange={(e) => setCms({ ...cms, heroSubtitle: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Teks Banner Promo Pengumuman</label>
            <input
              type="text"
              value={cms.bannerText}
              onChange={(e) => setCms({ ...cms, bannerText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Contact & Legal Section */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Informasi Kontak & Dokumen Legal</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Email Dukungan</label>
              <input
                type="email"
                value={cms.contactEmail}
                onChange={(e) => setCms({ ...cms, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Telepon / Whatsapp</label>
              <input
                type="text"
                value={cms.contactPhone}
                onChange={(e) => setCms({ ...cms, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Syarat & Ketentuan (Terms of Service)</label>
            <textarea
              rows={3}
              value={cms.termsOfService}
              onChange={(e) => setCms({ ...cms, termsOfService: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Kebijakan Privasi (Privacy Policy)</label>
            <textarea
              rows={3}
              value={cms.privacyPolicy}
              onChange={(e) => setCms({ ...cms, privacyPolicy: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
