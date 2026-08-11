import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Check,
  Calendar,
  Users,
  Camera,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Star,
  Send,
  X,
  Award,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Testimonial } from '../types';

export const TestimonialsView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const { user, testimonials, submitTestimonial, transactions } = useApp();

  // Filters state
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | '7days'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua jenis');
  const [isGroupExpanded, setIsGroupExpanded] = useState<boolean>(true);

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [previewTestimonial, setPreviewTestimonial] = useState<Testimonial | null>(null);

  // Upload Form state
  const [amount, setAmount] = useState<string>('150000');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const approvedTestimonials = testimonials.filter((t) => t.status === 'APPROVED');
  const myTestimonials = testimonials.filter((t) => t.userId === user.id);
  const latestWithdrawal = transactions.find((t) => t.type === 'WITHDRAWAL' && t.status === 'APPROVED');

  // Sample screenshot presets for user quick selection
  const sampleScreenshots = [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=500&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmittedMessage('');

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 30000) {
      setErrorMsg('Harap masukkan nominal penarikan yang valid (minimal Rp 30.000).');
      return;
    }

    if (!comment.trim() || comment.length < 3) {
      setErrorMsg('Harap tuliskan ulasan/testimoni singkat.');
      return;
    }

    const res = submitTestimonial({
      withdrawalAmount: numAmount,
      rating,
      comment,
      proofImageUrl: proofUrl || sampleScreenshots[0],
    });

    if (res.success) {
      setSubmittedMessage('Bukti penarikan berhasil dikirim! Bonus Rp 2.000 - Rp 5.000 akan dicairkan setelah peninjauan Admin.');
      setComment('');
      setProofUrl('');
      setTimeout(() => {
        setShowUploadModal(false);
        setSubmittedMessage('');
      }, 2500);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Filtered feed
  const filteredList = approvedTestimonials.filter((item) => {
    if (categoryFilter !== 'Semua jenis') {
      if (item.typeCategory && item.typeCategory !== categoryFilter) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-16 max-w-3xl mx-auto">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Galeri Cair
              </h1>
              <p className="text-[11px] text-slate-400">Bukti penarikan member</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="w-10 h-10 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          title="Unggah Bukti Penarikan"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* 2. AKTIVITAS PENCAIRAN Stat Cards Section */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-2 text-[11px] font-black uppercase text-slate-400 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>AKTIVITAS PENCAIRAN</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: Total Bukti */}
          <div className="bg-[#10192d] border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-0.5">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">200</span>
            <span className="text-[11px] text-slate-400 font-medium">Total bukti</span>
          </div>

          {/* Card 2: Hari Ini */}
          <div className="bg-[#10192d] border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">61</span>
            <span className="text-[11px] text-slate-400 font-medium">Hari ini</span>
          </div>

          {/* Card 3: Member */}
          <div className="bg-[#10192d] border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-1 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-0.5">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">143</span>
            <span className="text-[11px] text-slate-400 font-medium">Member</span>
          </div>
        </div>
      </div>

      {/* 3. Action Banner Box: Bagikan bukti cairmu */}
      <div className="bg-[#0b1b1f] border border-dashed border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Bagikan bukti cairmu</h3>
            <p className="text-xs text-slate-400">Unggah screenshot penarikan</p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs rounded-xl transition-all active:scale-95 shrink-0"
        >
          Unggah
        </button>
      </div>

      {/* 4. Filter Pills Row 1 (Counts & Timeframe) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setTimeFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            timeFilter === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
              : 'bg-[#10192d] border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>Semua</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-950/30 text-[10px]">200</span>
        </button>

        <button
          onClick={() => setTimeFilter('today')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            timeFilter === 'today'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
              : 'bg-[#10192d] border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>Hari ini</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-950/30 text-[10px]">61</span>
        </button>

        <button
          onClick={() => setTimeFilter('7days')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 ${
            timeFilter === '7days'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
              : 'bg-[#10192d] border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>7 hari</span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-950/30 text-[10px]">200</span>
        </button>
      </div>

      {/* 5. Filter Pills Row 2 (Type categories: Semua jenis, Setoran, Penarikan, Modal) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['Semua jenis', 'Setoran', 'Penarikan', 'Modal'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              categoryFilter === cat
                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-extrabold'
                : 'bg-[#0e1626] border border-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 6. Feed List Grouped By Date */}
      <div className="space-y-3">
        {/* Date Header Accordion */}
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-300">
            <span className="uppercase tracking-wider">SENIN, 10 AGU</span>
          </div>

          <button
            onClick={() => setIsGroupExpanded(!isGroupExpanded)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-200 font-bold"
          >
            <span>60</span>
            {isGroupExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Withdrawal Proof Card List */}
        {isGroupExpanded && (
          <div className="space-y-2.5">
            {filteredList.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setPreviewTestimonial(item)}
                className="bg-[#0f172a] hover:bg-[#131f38] border border-slate-800/90 rounded-2xl p-3 transition-all flex items-center justify-between gap-3.5 cursor-pointer group shadow-sm"
              >
                {/* Left: Square Thumbnail Image */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                  {item.proofImageUrl ? (
                    <img
                      src={item.proofImageUrl}
                      alt="Bukti Penarikan"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Middle: Phone Number & Comment */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-white tracking-tight font-mono">
                    {item.userPhone || `+62 *** ${item.userId.slice(-4)}`}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                    {item.comment}
                  </p>
                  <span className="text-[10px] text-emerald-400/90 font-bold block mt-1">
                    Nominal: Rp {item.withdrawalAmount.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Right: Timestamp & Verified Check Icon */}
                <div className="flex flex-col items-end justify-between h-14 shrink-0">
                  <span className="text-xs text-slate-400 font-mono font-medium">
                    {item.timeStr || new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Full Proof Image Detail Modal ("Ketuk lihat") */}
      {previewTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0d1527] border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative space-y-4 p-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-emerald-400 font-bold block">Bukti Pencairan Berhasil</span>
                <h3 className="font-extrabold text-base font-mono">
                  {previewTestimonial.userPhone || `+62 *** ${previewTestimonial.userId.slice(-4)}`}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTestimonial(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image Preview Container */}
            <div className="rounded-2xl overflow-hidden border border-slate-700 max-h-80 bg-slate-900 flex items-center justify-center">
              {previewTestimonial.proofImageUrl ? (
                <img
                  src={previewTestimonial.proofImageUrl}
                  alt="Bukti Penarikan Full"
                  className="w-full max-h-80 object-contain"
                />
              ) : (
                <div className="p-8 text-center text-slate-500">Bukti Gambar Tidak Tersedia</div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">Nominal Penarikan:</span>
                <span className="font-black text-emerald-400 text-sm">
                  Rp {previewTestimonial.withdrawalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Rating Member:</span>
                  <div className="flex text-amber-400">
                    {[...Array(previewTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-200 italic mt-1">"{previewTestimonial.comment}"</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Terverifikasi Admin Panel
                </span>
                <span>
                  Bonus +Rp {(previewTestimonial.rewardAmount || 5000).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setPreviewTestimonial(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-xs transition-all"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}

      {/* 8. Upload Proof Modal / Drawer */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-5 text-white space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Unggah Bukti Penarikan</h3>
                  <p className="text-[11px] text-slate-400">Dapatkan bonus saldo Rp 2.000 - Rp 5.000</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Nominal Penarikan */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Contoh: 150000"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-bold text-sm text-white focus:border-emerald-500 outline-none"
                />
                {latestWithdrawal && (
                  <span className="text-[10px] text-emerald-400 font-medium block">
                    WD Terakhir Anda: Rp {latestWithdrawal.amount.toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">Rating Kepuasan</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-2.5 rounded-xl transition-all ${
                        s <= rating ? 'bg-amber-400 text-slate-950 scale-105 font-bold' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Ulasan Singkat</label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Contoh: Bukti penarikan mendarat di DANA/BCA kurang dari 5 menit! Mantap amanah."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Screenshot URL or Sample Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 block">Link/Pilih Gambar Bukti Penarikan</label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://... (Kosongkan jika menggunakan contoh)"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500 outline-none"
                />

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block">Pilih Contoh Screenshot Cepat:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleScreenshots.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProofUrl(url)}
                        className={`h-14 rounded-xl overflow-hidden border transition-all ${
                          proofUrl === url ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105' : 'border-slate-700 opacity-70'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submittedMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>KIRIM BUKTI UNTUK REVIEW ADMIN</span>
              </button>
            </form>

            {/* My Submissions */}
            {myTestimonials.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-slate-300">Status Testimoni Anda:</h4>
                <div className="space-y-1.5">
                  {myTestimonials.map((mt) => (
                    <div
                      key={mt.id}
                      className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white block">Rp {mt.withdrawalAmount.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-slate-400">{mt.comment}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          mt.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : mt.status === 'REJECTED'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {mt.status === 'APPROVED' ? `TERVERIFIKASI (+Rp ${(mt.rewardAmount || 5000).toLocaleString('id-ID')})` : mt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
