import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  category: 'STOCK' | 'CRYPTO' | 'COMMODITY' | 'INDEX';
}

const INITIAL_MARKET_DATA: MarketItem[] = [
  { symbol: 'BBCA', name: 'Bank Central Asia', price: 9850, change: 1.82, category: 'STOCK' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 128.4, change: 4.15, category: 'STOCK' },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 67450, change: 2.45, category: 'CRYPTO' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3480, change: -0.85, category: 'CRYPTO' },
  { symbol: 'GOLD', name: 'Gold (XAU/USD)', price: 2415.6, change: 0.92, category: 'COMMODITY' },
  { symbol: 'NASDAQ', name: 'NASDAQ 100', price: 19820, change: 1.25, category: 'INDEX' },
  { symbol: 'S&P500', name: 'S&P 500 Index', price: 5540, change: 0.78, category: 'INDEX' },
  { symbol: 'OIL', name: 'Crude Oil WTI', price: 78.2, change: -1.12, category: 'COMMODITY' },
];

export const LiveMarketTicker: React.FC<{ lang: 'ID' | 'EN' }> = ({ lang }) => {
  const [data, setData] = useState<MarketItem[]>(INITIAL_MARKET_DATA);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.48) * 0.3;
          const newChange = parseFloat((item.change + delta).toFixed(2));
          const priceFactor = 1 + delta / 100;
          const newPrice = parseFloat((item.price * priceFactor).toFixed(2));
          return {
            ...item,
            price: newPrice,
            change: newChange,
          };
        })
      );
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="market" className="py-16 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{lang === 'ID' ? 'Pasar Finansial Real-Time' : 'Live Global Markets'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {lang === 'ID' ? 'Indikator Harga & Saham Pilihan' : 'Real-Time Market Prices'}
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            <span>Update: {lastUpdated}</span>
          </div>
        </div>

        {/* Live Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {data.map((item) => (
            <div
              key={item.symbol}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-1 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">{item.symbol}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">
                  {item.category}
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-slate-200">
                {item.symbol.includes('USD') || item.symbol === 'NVDA' || item.symbol === 'GOLD' || item.symbol === 'OIL' || item.symbol === 'NASDAQ' || item.symbol === 'S&P500'
                  ? `$${item.price.toLocaleString('en-US')}`
                  : `Rp ${item.price.toLocaleString('id-ID')}`}
              </p>
              <div
                className={`flex items-center space-x-1 text-[11px] font-bold ${
                  item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {item.change >= 0 ? '+' : ''}
                  {item.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
