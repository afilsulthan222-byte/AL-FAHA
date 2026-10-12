'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
            Personal Atelier Registry
          </span>
          <h1
            className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Saved Haute Creations ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-obsidian-900/40 border border-gold-500/20 rounded-lg p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-obsidian-850 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-widest font-semibold">
              Your Atelier Wishlist is Empty
            </h3>
            <p className="text-xs text-ivory-400 mt-2 max-w-xs mx-auto">
              Save your cherished pieces while browsing our collections of royal thobes, haute abayas, and Kasab bishts.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block px-8 py-3 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest rounded hover:scale-105 transition-transform"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-obsidian-900/80 border border-gold-500/20 rounded-lg overflow-hidden flex flex-col justify-between hover:border-gold-500/50 transition-all"
              >
                <div className="relative aspect-[3/4] bg-obsidian-950">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-obsidian-950/80 text-ivory-300 hover:text-red-400 rounded-full transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-gold-500 uppercase tracking-widest block mb-1">
                      {product.category}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-serif text-sm font-semibold text-ivory-100 hover:text-gold-300 line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="font-serif text-base font-bold text-gold-400 mt-2">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(
                        product,
                        product.sizes[0] || 'Standard',
                        product.colors[0]?.name || 'Standard',
                        1
                      )
                    }
                    className="mt-4 w-full py-2.5 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Haute Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
