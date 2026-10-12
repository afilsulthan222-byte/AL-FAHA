import React from 'react';
import { db } from '@/lib/db';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { BestSellers } from '@/components/home/BestSellers';
import { EditorialStory } from '@/components/home/EditorialStory';
import { VipNewsletter } from '@/components/home/VipNewsletter';
import { Star, Quote } from 'lucide-react';

export const revalidate = 0; // dynamic

export default function HomePage() {
  const products = db.getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Collections Masonry */}
      <FeaturedCollections />

      {/* Atelier Best Sellers */}
      <BestSellers products={products} />

      {/* Editorial Story */}
      <EditorialStory />

      {/* Press & Royal Patron Acclaim */}
      <section className="py-24 bg-obsidian-900 border-t border-gold-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
              Critical Acclaim & Endorsements
            </span>
            <h2
              className="font-serif text-3xl text-ivory-100 uppercase tracking-widest font-bold"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              The Voice of Sartorial Royalty
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                source: 'Vogue Arabia Haute Couture Edit',
                quote: 'AL FAHA has achieved what few luxury houses dare: elevating the bisht and royal thobe to the upper echelons of global high fashion without diluting an ounce of cultural authenticity.',
                author: 'Fashion Editorial Director',
                stars: 5,
              },
              {
                source: 'Gulf Sartorial Gazette',
                quote: 'The 200s Egyptian Giza cotton collar architecture is unmatched in structural resilience. A masterclass in regal tailoring that outclasses Savile Row.',
                author: 'Sartorial Critic & Historian',
                stars: 5,
              },
              {
                source: 'The Middle East Luxury Review',
                quote: 'From the tamper-proof scented walnut presentation box to the 24k Japanese Kasab gold wire, the tactile experience is an absolute triumph of Arabian opulence.',
                author: 'Senior Luxury Columnist',
                stars: 5,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-obsidian-950/90 border border-gold-500/20 rounded-lg p-8 relative flex flex-col justify-between hover:border-gold-500/50 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-gold-400 mb-6">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-gold-500/20 mb-3" />
                  <p className="text-xs sm:text-sm text-ivory-200 italic font-serif leading-relaxed mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-gold-500/15 pt-4">
                  <p className="font-serif text-xs uppercase tracking-widest font-bold text-gold-300">
                    {item.source}
                  </p>
                  <p className="text-[11px] text-ivory-500 mt-0.5">{item.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIP Membership Newsletter */}
      <VipNewsletter />
    </div>
  );
}
