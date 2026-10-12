import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const COLLECTIONS = [
  {
    title: 'Imperial Kasab Bishts',
    arabic: 'البشوت الملكية الفاخرة',
    subtitle: 'Pure camel hair and superfine merino with 24k Japanese gold bullion Kasab embroidery.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
    link: '/shop?category=Embroidered+Bishts',
    span: 'md:col-span-2 md:row-span-2',
    aspect: 'aspect-[4/3] md:aspect-auto md:h-full',
  },
  {
    title: 'Haute Couture Abayas',
    arabic: 'عبايات الهوت كوتور',
    subtitle: 'Italian silk organza and Swarovski jet crystals.',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Haute+Couture+Abayas',
    span: 'md:col-span-1',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Royal Qatari Thobes',
    arabic: 'ثياب الجيزة الملكية',
    subtitle: 'Extra-long staple 200s Giza cotton with crisp canvas collars.',
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Royal+Thobes',
    span: 'md:col-span-1',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Silk Damask Caftans',
    arabic: 'قفاطين الحرير الأندلسية',
    subtitle: 'Hand-knotted silk aker buttons with detachable gold belts.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Silk+Caftans',
    span: 'md:col-span-1',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Aged Cambodi Oud & Jewels',
    arabic: 'دهن العود المعتق ومجوهرات الصقر',
    subtitle: '45-year aged wild agarwood and 24k gold cufflinks.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    link: '/shop?category=Fragrances+%26+Accessories',
    span: 'md:col-span-1',
    aspect: 'aspect-[3/4]',
  },
];

export const FeaturedCollections: React.FC = () => {
  return (
    <section className="py-24 bg-obsidian-950 border-t border-gold-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
              Curated Sartorial Categories
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Haute Couture Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-400 hover:text-gold-200 font-semibold group transition-colors pb-1 border-b border-gold-500/30"
          >
            <span>View Complete Atelier</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[360px]">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.title}
              href={col.link}
              className={`group relative rounded-lg overflow-hidden border border-gold-500/20 hover:border-gold-500/60 transition-all duration-500 ${col.span}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
              </div>

              {/* Hover Golden Overlay */}
              <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <span className="font-arabic text-sm text-gold-400/90 mb-1">
                  {col.arabic}
                </span>
                <h3
                  className="font-serif text-xl sm:text-2xl text-ivory-100 uppercase tracking-wider font-bold group-hover:text-gold-300 transition-colors"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {col.title}
                </h3>
                <p className="text-xs text-ivory-300 line-clamp-2 mt-2 font-light max-w-md">
                  {col.subtitle}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400 opacity-90 group-hover:opacity-100">
                  <span>Explore Line</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
