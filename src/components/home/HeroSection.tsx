import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Crown } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-obsidian-950">
      {/* Background Editorial Image with Luxury Dark Gradients */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2000&auto=format&fit=crop')`,
          }}
        />
        {/* Layered overlays: Vignette + Obsidian Gradient + Gold ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/80 to-obsidian-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-obsidian-950/70" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Decorative Subtle Arabesque Geometric Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
        {/* Royal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-900/90 border border-gold-500/40 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-8 backdrop-blur-md shadow-gold-glow animate-float">
          <Crown className="w-3.5 h-3.5 text-gold-400" />
          <span>Haute Couture Autumn / Winter 2026</span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </div>

        {/* Arabic Calligraphic Proverb / Subtitle */}
        <p className="font-arabic text-xl sm:text-2xl md:text-3xl text-gold-400/90 tracking-wider mb-4">
          الأناقة الأصيلة والسيادة الملكية
        </p>

        {/* Hero Headline */}
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-7xl text-ivory-100 font-bold uppercase tracking-[0.08em] leading-[1.1] max-w-4xl"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          The Sovereign Pinnacle of{' '}
          <span className="text-transparent bg-clip-text bg-gold-gradient block mt-2 drop-shadow-md">
            Arabian Sartorial Grandeur
          </span>
        </h1>

        {/* Hero Narrative */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-ivory-300 font-light max-w-2xl leading-relaxed">
          Mastercrafted in pure 200s Giza cotton, Italian silk organza, and 24k Japanese Kasab gold bullion embroidery. Worn by royalty, sovereign leaders, and discerning patrons across the globe.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow hover:shadow-gold-glow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            <span>Explore Haute Couture</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/shop?category=Embroidered+Bishts"
            className="w-full sm:w-auto px-8 py-4 bg-obsidian-900/90 hover:bg-obsidian-850 text-ivory-100 border border-gold-500/40 font-serif font-semibold text-xs uppercase tracking-[0.25em] rounded backdrop-blur-md transition-all hover:border-gold-400 flex items-center justify-center"
          >
            The Royal Bisht Atelier
          </Link>
        </div>

        {/* Luxury Highlights Bar */}
        <div className="mt-16 pt-8 border-t border-gold-500/20 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 text-left">
          <div className="border-l-2 border-gold-500/50 pl-4">
            <p className="font-serif text-lg sm:text-xl font-bold text-gold-400">100% Pure</p>
            <p className="text-[11px] text-ivory-400 uppercase tracking-widest mt-0.5">
              Giza 200s & Silk
            </p>
          </div>

          <div className="border-l-2 border-gold-500/50 pl-4">
            <p className="font-serif text-lg sm:text-xl font-bold text-gold-400">90+ Hours</p>
            <p className="text-[11px] text-ivory-400 uppercase tracking-widest mt-0.5">
              Hand-Embroidered Kasab
            </p>
          </div>

          <div className="border-l-2 border-gold-500/50 pl-4 col-span-2 sm:col-span-1">
            <p className="font-serif text-lg sm:text-xl font-bold text-gold-400">White Glove</p>
            <p className="text-[11px] text-ivory-400 uppercase tracking-widest mt-0.5">
              Complimentary Across India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
