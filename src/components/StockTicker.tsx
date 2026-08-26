import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { SAMPLE_STOCK_TICKERS } from '../data/initialData';

export const StockTicker: React.FC = () => {
  const [tickers, setTickers] = useState(SAMPLE_STOCK_TICKERS);

  // Small random price fluctuation interval for realistic market feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.48) * (item.price * 0.003);
          const newPrice = Math.max(10, Math.round(item.price + delta));
          const firstPoint = item.chartData && item.chartData.length > 0 ? item.chartData[0] : item.price;
          const pct = firstPoint > 0 ? (((newPrice - firstPoint) / firstPoint) * 100).toFixed(1) : '0.0';
          const prevPoint = item.chartData && item.chartData.length >= 2 ? item.chartData[item.chartData.length - 2] : item.price;
          const isUp = newPrice >= prevPoint;
          return {
            ...item,
            price: newPrice,
            change: `${isUp ? '+' : ''}${pct}%`,
            isUp,
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 overflow-hidden relative shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-slate-800 font-semibold text-amber-400">
          <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>IHSG LIVE TICKER</span>
        </div>

        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar py-0.5 font-mono text-[11px]">
          {tickers.map((t) => (
            <div key={t.symbol} className="flex items-center space-x-1.5 shrink-0 hover:bg-slate-800/80 px-2 py-0.5 rounded transition-colors cursor-pointer">
              <span className="font-bold text-white">{t.symbol}</span>
              <span className="text-slate-300">Rp {t.price.toLocaleString('id-ID')}</span>
              <span
                className={`flex items-center text-[10px] font-semibold px-1 py-0.2 rounded ${
                  t.isUp ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'
                }`}
              >
                {t.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
