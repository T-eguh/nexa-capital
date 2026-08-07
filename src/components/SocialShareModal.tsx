import React, { useState } from 'react';
import { Share2, X, Copy, Check, Send } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title = 'Nexa Capital — Enterprise Investment Platform',
  url = typeof window !== 'undefined' ? window.location.href : 'https://nexacapital.id',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      link: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-500 hover:bg-sky-400 text-white',
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: '🌐',
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: '🐦',
      color: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700',
      link: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Bagikan Platform Nexa Capital</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Ajak kolega Anda dan bagikan tautan resmi Nexa Capital untuk mendapatkan bonus referral komisi 3-level.
        </p>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {shareLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all hover:scale-105 shadow-sm ${item.color}`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tautan Langsung</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-mono select-all"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs transition-all flex items-center space-x-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tercopy' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
