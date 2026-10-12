import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Sparkles, CheckCircle2 } from 'lucide-react';

export const EditorialStory: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian-950 border-t border-gold-500/15 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-gold-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Editorial Image Composition */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-gold-500/30 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                alt="AL FAHA Master Tailor Atelier"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Secondary Inset Card */}
            <div className="absolute -bottom-8 -right-6 sm:-bottom-10 sm:-right-8 w-3/5 aspect-square rounded-lg overflow-hidden border-2 border-gold-500/40 shadow-2xl hidden sm:block">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
                alt="24k Gold Kasab Embroidery Detail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-obsidian-950/30" />
            </div>

            {/* Floating Royal Seal badge */}
            <div className="absolute -top-6 -left-4 bg-obsidian-900 border border-gold-500/50 rounded-lg p-4 shadow-gold-glow flex items-center gap-3">
              <div className="p-2 bg-gold-500/10 rounded border border-gold-500/30 text-gold-400">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-ivory-400 uppercase tracking-widest">Atelier Heritage</p>
                <p className="font-serif text-xs font-bold text-gold-300">Est. Dubai & Milan</p>
              </div>
            </div>
          </div>

          {/* Right: Brand Story & Values */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Atelier Philosophy</span>
            </div>

            <h2
              className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold leading-tight"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Where Ancient Arabian Sovereignty Meets{' '}
              <span className="text-transparent bg-clip-text bg-gold-gradient">
                Modern Haute Couture
              </span>
            </h2>

            <p className="text-sm text-ivory-300 leading-relaxed font-light">
              Founded on the belief that traditional ceremonial attire should command the same revered craftsmanship as European high fashion, AL FAHA stands as the sartorial standard-bearer for Gulf royalty, heads of state, and patrons of refined luxury.
            </p>

            <p className="text-sm text-ivory-400 leading-relaxed font-light">
              Every garment begins with uncompromised textile purity—ranging from 200/2 count Egyptian Giza cotton milled in Biella, Italy, to heavy silk jacquard from Lake Como. Our master embroiderers then devote up to 90 hours of painstaking Kasab thread-laying, utilizing pure Japanese gold bullion wire that retains its incandescent luster across generations.
            </p>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {[
                'Exclusive limited releases capped at 50 bespoke pieces per design worldwide',
                'Ethically sourced Egyptian cotton and cruelty-free Mulberry silk',
                'Made-to-measure tailoring with complimentary lifetime garment maintenance',
                'Packaged in signature lacquered black walnut keepsake chests'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-ivory-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Atelier Quote */}
            <div className="p-4 bg-obsidian-900 border-l-2 border-gold-500 rounded-r text-xs italic text-gold-300/90 font-serif">
              &ldquo;A true royal bisht or couture abaya is not merely worn; it is inherited. It carries the dignity, memory, and presence of those who shape history.&rdquo;
              <span className="block not-italic text-[10px] text-ivory-400 uppercase tracking-widest font-sans mt-2">
                — Master Couturier Tariq Al-Faha
              </span>
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex px-8 py-3.5 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow hover:scale-105 transition-transform"
              >
                Explore The Atelier Lines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
