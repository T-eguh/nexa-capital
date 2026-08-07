import React from 'react';

interface NexaCapitalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export const NexaCapitalLogo: React.FC<NexaCapitalLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: { title: 'text-sm', sub: 'text-[9px]' },
    md: { title: 'text-lg', sub: 'text-[10px]' },
    lg: { title: 'text-2xl', sub: 'text-xs' },
    xl: { title: 'text-3xl', sub: 'text-sm' },
  };

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* 3D Geometric Metallic "N" Emblem SVG */}
      <div className={`relative shrink-0 ${iconSizes[size]} drop-shadow-md`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Silver Metal Gradients */}
            <linearGradient id="silver1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#CBD5E1" />
              <stop offset="70%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="silver2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Electric Blue Gradients */}
            <linearGradient id="blueGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            <linearGradient id="blueGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="cyanAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="60%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="100" cy="100" r="85" fill="#1E3A8A" opacity="0.25" filter="url(#glow)" />

          {/* Geometric "N" Facets matching user logo */}
          {/* Left Silver Pillar Facet A */}
          <path
            d="M35 155 L35 55 L75 95 L75 155 Z"
            fill="url(#silver1)"
          />
          {/* Left Silver Top Bevel */}
          <path
            d="M35 55 L90 25 L75 95 Z"
            fill="url(#silver2)"
          />

          {/* Main Diagonal Electric Blue Ribbon */}
          <path
            d="M35 55 L135 155 L165 155 L65 55 Z"
            fill="url(#blueGlow1)"
          />

          {/* Right Pillar Upper Wing (Cyan/Blue Facet) */}
          <path
            d="M165 25 L165 105 L125 105 Z"
            fill="url(#cyanAccent)"
          />

          {/* Right Pillar Lower Wing (Deep Blue Facet) */}
          <path
            d="M165 105 L165 155 L125 105 Z"
            fill="url(#blueGlow2)"
          />

          {/* Center Connector Bevel Shadow */}
          <path
            d="M75 95 L135 155 L125 105 Z"
            fill="url(#blueGlow2)"
            opacity="0.8"
          />

          {/* Highlight Specular Edge */}
          <path
            d="M35 55 L135 155"
            stroke="#93C5FD"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Brand Text: NEXA CAPITAL */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-1">
            <span
              className={`font-black tracking-widest leading-none ${textSizes[size].title} ${
                variant === 'dark' || true
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400'
                  : 'text-slate-900'
              }`}
              style={{ fontFamily: 'sans-serif', letterSpacing: '0.12em' }}
            >
              NEXA
            </span>
          </div>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="h-[1px] w-2 bg-blue-500/80"></span>
            <span
              className={`font-bold tracking-[0.25em] leading-none ${textSizes[size].sub} text-blue-400`}
            >
              CAPITAL
            </span>
            <span className="h-[1px] w-2 bg-blue-500/80"></span>
          </div>
        </div>
      )}
    </div>
  );
};
