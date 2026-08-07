import React, { useEffect, useState } from 'react';
import { Megaphone, X, ChevronRight } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.announcements?.length > 0) {
          setAnnouncements(data.announcements);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!visible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm animate-in fade-in">
      <div className="flex items-center space-x-3 overflow-hidden mr-2">
        <div className="p-1.5 rounded-lg bg-white/10 flex-shrink-0">
          <Megaphone className="w-4 h-4 animate-bounce text-amber-300" />
        </div>
        <div className="truncate">
          <span className="font-bold mr-2 text-amber-300">{current.title}:</span>
          <span className="text-teal-50 truncate">{current.content}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {announcements.length > 1 && (
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
            className="text-[11px] font-semibold text-teal-100 hover:text-white underline flex items-center space-x-0.5"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button onClick={() => setVisible(false)} className="p-1 hover:bg-white/10 rounded-lg text-teal-100 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
