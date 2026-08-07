import React, { useState, useEffect } from 'react';
import { LifeBuoy, Send, CheckCircle2, Clock, MessageSquare, Shield } from 'lucide-react';

export const SupportTicketView: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch('/api/admin/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
        if (data.tickets.length > 0 && !selectedTicket) {
          setSelectedTicket(data.tickets[0]);
        }
      }
    } catch (err) {
      console.error('Gagal memuat tiket:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText('');
        fetchTickets();
        setSelectedTicket(data.ticket);
      }
    } catch (err) {
      console.error('Gagal membalas tiket:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white flex items-center space-x-2">
            <LifeBuoy className="w-5 h-5 text-amber-400" />
            <span>Meja Bantuan & Tiket Support Customer Service</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tanggapi pertanyaan, keluhan, dan bantuan verifikasi dari investor secara langsung.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs h-[600px]">
        {/* Ticket List */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 overflow-y-auto space-y-3">
          <h3 className="font-bold text-white border-b border-slate-800 pb-2">Daftar Tiket Masuk</h3>
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                selectedTicket?.id === t.id
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate">{t.userName}</span>
                <span className="text-[10px] text-amber-400 font-mono">{t.id}</span>
              </div>
              <p className="text-slate-300 font-semibold line-clamp-1">{t.subject}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>{t.category}</span>
                <span className="text-emerald-400 font-bold">{t.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Thread */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          {selectedTicket ? (
            <>
              <div className="space-y-4 overflow-y-auto pr-2 max-h-[480px]">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{selectedTicket.subject}</h3>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {selectedTicket.priority} PRIORITY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Oleh <span className="text-white font-semibold">{selectedTicket.userName}</span> ({selectedTicket.userEmail})
                  </p>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {selectedTicket.replies?.map((rep: any) => (
                    <div
                      key={rep.id}
                      className={`p-3.5 rounded-2xl max-w-md ${
                        rep.sender === 'STAFF'
                          ? 'ml-auto bg-amber-500/10 border border-amber-500/30 text-amber-100'
                          : 'bg-slate-950 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="text-[10px] font-bold text-slate-400 mb-1">{rep.senderName} ({rep.sender})</p>
                      <p className="text-xs">{rep.message}</p>
                      <p className="text-[9px] text-slate-500 mt-1 text-right">
                        {new Date(rep.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReply} className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  required
                  placeholder="Tuliskan balasan customer service resmi admin..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
              <LifeBuoy className="w-10 h-10 stroke-1" />
              <p>Pilih tiket bantuan untuk meninjau dan membalas pesan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
