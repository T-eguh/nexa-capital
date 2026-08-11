import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/cn';

interface InvestmentCalculatorProps {
  onOpenAuth: (mode: 'LOGIN' | 'REGISTER') => void;
  lang: 'ID' | 'EN';
}

export const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ onOpenAuth, lang }) => {
  const [amount, setAmount] = useState<number>(1000000);
  const [duration, setDuration] = useState<number>(30); // Days
  const [dailyRate, setDailyRate] = useState<number>(5.0); // % Daily

  const dailyProfit = Math.round((amount * dailyRate) / 100);
  const totalProfit = dailyProfit * duration;
  const totalReturn = amount + totalProfit;
  const roi = Math.round((totalProfit / amount) * 100);

  return (
    <section id="calculator" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>{lang === 'ID' ? 'Kalkulator Simulasi Investment ROI' : 'Investment ROI Calculator'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {lang === 'ID' ? 'Hitung Potensi Profit Harian Anda' : 'Calculate Your Expected Daily Dividend'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'ID'
              ? 'Gunakan simulasi interaktif di bawah ini untuk mengestimasi akumulasi dividen yang diterima setiap hari.'
              : 'Estimate your total earnings and daily payouts based on selected investment parameters.'}
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
          {/* Controls Side */}
          <div className="lg:col-span-7 space-y-6">
            {/* Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{lang === 'ID' ? 'Nominal Investasi' : 'Investment Amount'}</span>
                <span className="text-blue-400 font-mono text-sm">{formatCurrency(amount)}</span>
              </div>
              <input
                type="range"
                min={100000}
                max={50000000}
                step={100000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Rp 100.000</span>
                <span>Rp 50.000.000</span>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                {lang === 'ID' ? 'Durasi Siklus Investasi' : 'Investment Duration'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 7, 30, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDuration(days)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      duration === days
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {days} {lang === 'ID' ? 'Hari' : 'Days'}
                  </button>
                ))}
              </div>
            </div>

            {/* Return Rate Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                {lang === 'ID' ? 'Persentase Dividen Harian' : 'Daily Rate (%)'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { rate: 3.5, label: 'Starter VIP (3.5%)' },
                  { rate: 5.0, label: 'Bluechip (5.0%)' },
                  { rate: 7.5, label: 'High Yield (7.5%)' },
                ].map((item) => (
                  <button
                    key={item.rate}
                    type="button"
                    onClick={() => setDailyRate(item.rate)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      dailyRate === item.rate
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ID' ? 'Ringkasan Estimasi Profit' : 'Estimated Return Summary'}</span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ID' ? 'Dividen Harian' : 'Daily Dividend'}</span>
                  <span className="font-bold text-emerald-400 font-mono">{formatCurrency(dailyProfit)}</span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">{lang === 'ID' ? 'Total Profit' : 'Total Profit'}</span>
                  <span className="font-bold text-emerald-400 font-mono">{formatCurrency(totalProfit)}</span>
                </div>

                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">ROI (%)</span>
                  <span className="font-bold text-amber-400 font-mono">+{roi}%</span>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-slate-400">{lang === 'ID' ? 'Total Saldo + Dividen Cair:' : 'Total Payout Amount:'}</p>
                  <p className="text-2xl font-black text-white font-mono">{formatCurrency(totalReturn)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <span>{lang === 'ID' ? 'Mulai Sekarang' : 'Invest This Amount'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
