import React, { useState } from 'react';
import { Star, MessageSquare, Send, Award, CheckCircle2, ShieldCheck, Upload, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TestimonialsView: React.FC = () => {
  const { user, testimonials, submitTestimonial, transactions } = useApp();

  const [amount, setAmount] = useState<string>('250000');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Filter approved public testimonials
  const approvedTestimonials = testimonials.filter((t) => t.status === 'APPROVED');
  // Filter current user testimonials
  const myTestimonials = testimonials.filter((t) => t.userId === user.id);

  // Latest approved withdrawal transaction for reference
  const latestWithdrawal = transactions.find((t) => t.type === 'WITHDRAWAL' && t.status === 'APPROVED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmittedMessage('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 50000) {
      setErrorMsg('Harap masukkan nominal penarikan yang valid (minimal Rp 50.000).');
      return;
    }

    if (!comment.trim() || comment.length < 10) {
      setErrorMsg('Harap tuliskan ulasan/testimoni minimal 10 karakter.');
      return;
    }

    const res = submitTestimonial({
      withdrawalAmount: numAmount,
      rating,
      comment,
      proofImageUrl: proofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    });

    if (res.success) {
      setSubmittedMessage('Testimoni berhasil dikirim! Tim Admin Panel akan mereview bukti Anda untuk mencairkan hadiah Rp 2.000 - Rp 5.000.');
      setComment('');
      setProofUrl('');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
              <Award className="w-3.5 h-3.5" />
              <span>Program Hadiah Testimoni Official</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Kirim Bukti Penarikan & Dapatkan Bonus Saldo Rp 2.000 - Rp 5.000!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Bagikan pengalaman sukses penarikan saldo Anda ke rekening bank atau E-Wallet. Setiap testimoni terverifikasi Admin Panel berhak mendapatkan bonus saldo langsung ke Saldo Penarikan!
            </p>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md text-center space-y-1 shrink-0">
            <span className="text-[10px] text-amber-300 font-bold uppercase block">Kisar Hadiah Admin</span>
            <span className="text-2xl font-black text-amber-400">Rp 2.000 - 5.000</span>
            <span className="text-[10px] text-slate-300 block">Langsung Masuk Saldo Penarikan</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Submission (1 Col) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 h-fit">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Formulir Testimoni Penarikan</h3>
              <p className="text-[11px] text-slate-400">Isi ulasan & sertakan bukti penarikan Anda</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Withdrawal Amount */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Nominal Penarikan (Rp)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 250000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-900 dark:text-white"
              />
              {latestWithdrawal && (
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Penarikan Terakhir Anda: Rp {latestWithdrawal.amount.toLocaleString('id-ID')}
                </span>
              )}
            </div>

            {/* Rating Stars */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">Rating Layanan</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-xl transition-all ${
                      star <= rating ? 'bg-amber-400 text-slate-950 scale-105' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Ulasan / Kesan Penarikan</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contoh: Penarikan Rp 250.000 sukses mendarat di BCA kurang dari 10 menit! Nexa Capital sangat terpercaya."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Proof Image URL */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Link Bukti Tangkapan Layar (Opsional)</label>
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 block">Biarkan kosong untuk menggunakan bukti ilustrasi otomatis.</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {submittedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{submittedMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>KIRIM TESTIMONI KE ADMIN</span>
            </button>
          </form>

          {/* User's Own Submitted Testimonials Status */}
          {myTestimonials.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Status Riwayat Testimoni Anda</h4>
              <div className="space-y-2">
                {myTestimonials.map((mt) => (
                  <div key={mt.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">Rp {mt.withdrawalAmount.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] text-slate-400">{new Date(mt.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        mt.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mt.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {mt.status === 'APPROVED' ? `DICAIRKAN +Rp ${(mt.rewardAmount || 5000).toLocaleString('id-ID')}` : mt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Public Testimonials Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Testimoni Bukti Penarikan Member Terverifikasi</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {approvedTestimonials.length} Ulasan Terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {approvedTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-3 relative"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.userName}</h4>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        Penarikan Sukses: Rp {t.withdrawalAmount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{t.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                {t.proofImageUrl && (
                  <div className="h-36 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                    <img src={t.proofImageUrl} alt="Bukti Penarikan" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{new Date(t.createdAt).toLocaleDateString('id-ID')}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                    Bonus Testimoni +Rp {(t.rewardAmount || 5000).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
