import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const AlFahaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.25em]',
    md: 'text-xl md:text-2xl tracking-[0.3em]',
    lg: 'text-3xl md:text-4xl tracking-[0.35em]',
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] tracking-[0.35em]',
    lg: 'text-xs tracking-[0.4em]',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group transition-transform duration-300 ${className}`}>
      {/* Distinctive Geometric Arabic Royal Cipher Emblem */}
      <div className={`relative ${emblemSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-500"
        >
          {/* Subtle Outer 8-pointed Islamic Star Geometry */}
          <rect
            x="50"
            y="6"
            width="62"
            height="62"
            transform="rotate(45 50 6)"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <rect
            x="50"
            y="6"
            width="62"
            height="62"
            transform="rotate(0 50 50)"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />

          {/* Golden Circular Seal */}
          <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="38" stroke="url(#goldGrad)" strokeWidth="1.8" />

          {/* Central Calligraphic Monogram AF (Al Faha) */}
          <path
            d="M38 68L50 26L62 68M42 56H58"
            stroke="url(#goldGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M50 36C56 36 64 34 65 42C66 48 58 50 50 50"
            stroke="url(#goldGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Royal Crown / Crescent Finial Motif */}
          <path
            d="M44 22C47 18 53 18 56 22M50 15V18"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Arabic diacritic flourish */}
          <circle cx="50" cy="74" r="2.2" fill="url(#goldGrad)" />

          <defs>
            <linearGradient id="goldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5E4A8" />
              <stop offset="0.45" stopColor="#D4AF37" />
              <stop offset="0.75" stopColor="#C5A059" />
              <stop offset="1" stopColor="#996F1D" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col text-left">
        <span
          className={`font-serif font-bold text-ivory-100 group-hover:text-gold-300 transition-colors uppercase ${titleSizes[size]}`}
          style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
        >
          AL FAHA
        </span>
        {showSubtitle && (
          <span className={`text-gold-500/90 font-medium uppercase mt-0.5 ${subtitleSizes[size]}`}>
            Haute Couture Arabia
          </span>
        )}
      </div>
    </Link>
  );
};
