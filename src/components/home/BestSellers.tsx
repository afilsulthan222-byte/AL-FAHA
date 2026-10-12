'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BestSellersProps {
  products: Product[];
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Embroidered Bishts',
  'Haute Couture Abayas',
  'Royal Thobes',
  'Silk Caftans',
  'Fragrances & Accessories',
];

export const BestSellers: React.FC<BestSellersProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'All' | ProductCategory>('All');

  const filtered = activeTab === 'All' 
    ? products 
    : products.filter((p) => p.category === activeTab);

  return (
    <section className="py-24 bg-obsidian-900 border-t border-gold-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Sovereign Essentials</span>
          </div>
          <h2
            className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            The Atelier Masterpieces
          </h2>
          <p className="text-xs sm:text-sm text-ivory-400 mt-3 font-light leading-relaxed">
            Our most revered ceremonial pieces, tailored using time-honored artisanal techniques and pristine luxury textiles.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 font-medium ${
                activeTab === cat
                  ? 'bg-gold-gradient text-obsidian-950 font-bold shadow-gold-glow'
                  : 'bg-obsidian-950 text-ivory-300 border border-gold-500/20 hover:border-gold-500/60 hover:text-gold-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-obsidian-950 hover:bg-obsidian-850 text-gold-400 border border-gold-500/40 rounded uppercase text-xs tracking-[0.25em] font-semibold transition-all hover:scale-105 shadow-luxury-dark"
          >
            <span>Discover Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
