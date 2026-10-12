import React from 'react';
import Link from 'next/link';
import { AlFahaLogo } from '@/components/ui/AlFahaLogo';
import { ShieldCheck, Sparkles, MapPin, Phone, Mail, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian-950 border-t border-gold-500/25 text-ivory-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-gold-500/15">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-obsidian-900 border border-gold-500/30 rounded-lg text-gold-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-ivory-100 uppercase tracking-widest text-sm font-semibold">
                Haute Couture Standard
              </h4>
              <p className="text-xs text-ivory-400 mt-1 leading-relaxed">
                Woven from pure 200s Giza cotton, Italian silk organza, and 24k Japanese Kasab bullion gold thread.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-obsidian-900 border border-gold-500/30 rounded-lg text-gold-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-ivory-100 uppercase tracking-widest text-sm font-semibold">
                Bespoke Tailoring
              </h4>
              <p className="text-xs text-ivory-400 mt-1 leading-relaxed">
                Made-to-measure personalization and custom sizing directly overseen by our Dubai and Milanese master tailors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-obsidian-900 border border-gold-500/30 rounded-lg text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-ivory-100 uppercase tracking-widest text-sm font-semibold">
                Sovereign Delivery
              </h4>
              <p className="text-xs text-ivory-400 mt-1 leading-relaxed">
                Delivered in tamper-proof lacquered wooden presentation chests with White Glove courier service.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-obsidian-900 border border-gold-500/30 rounded-lg text-gold-400 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-ivory-100 uppercase tracking-widest text-sm font-semibold">
                Private Concierge
              </h4>
              <p className="text-xs text-ivory-400 mt-1 leading-relaxed">
                Dedicated sartorial advisors available 24/7 for styling, custom sizing, and private showings.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-gold-500/15">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <AlFahaLogo size="lg" />
            <p className="text-xs text-ivory-400 leading-relaxed max-w-sm mt-3">
              AL FAHA redefines contemporary Arabian luxury. We unite centuries of Middle Eastern heritage craftsmanship with modern haute couture sensibilities, catering to dignitaries, royal patrons, and discerning connoisseurs worldwide.
            </p>
            <div className="pt-2 text-xs text-gold-400/90 space-y-1.5 font-sans">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>Private Salons: Dubai &bull; Mumbai &bull; London</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>concierge@alfaha.com</span>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h5 className="font-serif text-gold-400 text-xs tracking-[0.25em] uppercase font-bold mb-4">
              Couture Lines
            </h5>
            <ul className="space-y-2.5 text-xs text-ivory-400">
              <li>
                <Link href="/shop?category=Royal+Thobes" className="hover:text-gold-300 transition-colors">
                  Royal Thobes (ثياب ملكية)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Haute+Couture+Abayas" className="hover:text-gold-300 transition-colors">
                  Haute Abayas (عبايات فاخرة)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Embroidered+Bishts" className="hover:text-gold-300 transition-colors">
                  Kasab Bishts (بشوت مطرزة)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Silk+Caftans" className="hover:text-gold-300 transition-colors">
                  Silk Caftans (قفاطين حرير)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Velvet+Evening+Wear" className="hover:text-gold-300 transition-colors">
                  Velvet Evening Robes
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Fragrances+%26+Accessories" className="hover:text-gold-300 transition-colors">
                  Aged Cambodi Oud & Jewels
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Client Care */}
          <div>
            <h5 className="font-serif text-gold-400 text-xs tracking-[0.25em] uppercase font-bold mb-4">
              Patron Services
            </h5>
            <ul className="space-y-2.5 text-xs text-ivory-400">
              <li>
                <Link href="/track" className="hover:text-gold-300 transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gold-300 transition-colors">
                  Bespoke Sizing Guide
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-gold-300 transition-colors">
                  Private Patron Portal
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-gold-300 transition-colors">
                  White Glove Delivery & COD
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold-300 transition-colors">
                  Atelier Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Salons & Hours */}
          <div>
            <h5 className="font-serif text-gold-400 text-xs tracking-[0.25em] uppercase font-bold mb-4">
              Atelier Salons
            </h5>
            <div className="space-y-3 text-xs text-ivory-400">
              <div>
                <p className="text-ivory-200 font-medium">Dubai Flagship</p>
                <p className="text-[11px] text-ivory-500">Fashion Avenue, Dubai Mall</p>
              </div>
              <div>
                <p className="text-ivory-200 font-medium">Mumbai Atelier</p>
                <p className="text-[11px] text-ivory-500">Colaba Causeway, Mumbai</p>
              </div>
              <div>
                <p className="text-ivory-200 font-medium">London Salon</p>
                <p className="text-[11px] text-ivory-500">New Bond Street, Mayfair</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Payments */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory-500">
          <p>
            &copy; {new Date().getFullYear()} AL FAHA Couture. All Royal Rights Reserved. Authentic Handcrafted Luxury.
          </p>

          <div className="flex items-center gap-3 text-[11px] text-gold-500/80 font-medium uppercase tracking-wider">
            <span className="px-2.5 py-1 bg-obsidian-900 border border-gold-500/30 rounded">
              INR Pricing (₹)
            </span>
            <span className="px-2.5 py-1 bg-obsidian-900 border border-gold-500/30 rounded">
              Razorpay Secured
            </span>
            <span className="px-2.5 py-1 bg-obsidian-900 border border-gold-500/30 rounded">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
