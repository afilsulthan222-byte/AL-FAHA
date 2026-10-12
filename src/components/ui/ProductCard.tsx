'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [quickSizeModal, setQuickSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const isFavorited = isInWishlist(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length > 1 && !quickSizeModal) {
      setQuickSizeModal(true);
      return;
    }
    addToCart(product, selectedSize, product.colors[0]?.name || 'Standard', 1);
    setQuickSizeModal(false);
  };

  return (
    <div
      className="group relative flex flex-col bg-obsidian-950/80 border border-gold-500/15 rounded-lg overflow-hidden hover:border-gold-500/40 hover:shadow-gold-glow transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setQuickSizeModal(false);
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-obsidian-900">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              isHovered && secondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} - Alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-all duration-700 absolute inset-0 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isExclusive && (
            <span className="bg-obsidian-950/90 text-gold-400 border border-gold-500/40 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow">
              Atelier Exclusive
            </span>
          )}
          {product.isNew && (
            <span className="bg-gold-gradient text-obsidian-950 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded shadow">
              New Season
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            isFavorited
              ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
              : 'bg-obsidian-950/70 text-ivory-300 hover:text-gold-400 hover:bg-obsidian-900'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-obsidian-950' : ''}`} />
        </button>

        {/* Bottom hover quick-actions */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2 bg-obsidian-950/90 hover:bg-obsidian-900 text-ivory-200 border border-gold-500/30 text-[11px] uppercase tracking-wider font-semibold rounded backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              <span>Quick View</span>
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 bg-gold-gradient text-obsidian-950 text-[11px] uppercase tracking-wider font-bold rounded shadow-gold-glow flex items-center justify-center gap-1.5 transition-transform hover:scale-105"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>

        {/* Quick Size Selection Overlay */}
        {quickSizeModal && (
          <div
            className="absolute inset-0 bg-obsidian-950/95 backdrop-blur-md p-4 flex flex-col justify-center items-center text-center z-20 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-serif uppercase tracking-widest text-gold-300 mb-3 font-semibold">
              Select Size for Royal Cut
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs mb-4">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-[11px] py-2 px-1 rounded border transition-colors ${
                    selectedSize === sz
                      ? 'border-gold-400 bg-gold-500/20 text-gold-300 font-bold'
                      : 'border-obsidian-700 bg-obsidian-900 text-ivory-300 hover:border-gold-500/40'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
            <div className="flex gap-2 w-full max-w-xs">
              <button
                onClick={() => setQuickSizeModal(false)}
                className="flex-1 py-1.5 text-[11px] text-ivory-400 border border-obsidian-700 rounded hover:text-ivory-200"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAdd}
                className="flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-gold-gradient text-obsidian-950 rounded"
              >
                Confirm Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Arabic Subtitle */}
          <div className="flex items-center justify-between text-[11px] text-gold-500/80 mb-1">
            <span className="uppercase tracking-widest">{product.category}</span>
            <span className="font-arabic text-xs text-gold-400/90">{product.arabicName}</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3
              className="font-serif text-sm text-ivory-100 group-hover:text-gold-300 transition-colors font-semibold line-clamp-1"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Fabric snippet */}
          <p className="text-[11px] text-ivory-400 line-clamp-1 mt-1 font-light">
            {product.fabric}
          </p>
        </div>

        {/* Pricing & Stock Status */}
        <div className="mt-4 pt-3 border-t border-gold-500/15 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-base font-bold text-gold-400">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-ivory-500 line-through">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Stock or Rating indicator */}
          <div className="flex items-center gap-1 text-[11px] text-gold-500">
            <Star className="w-3 h-3 fill-gold-500" />
            <span className="font-semibold text-ivory-200">{product.rating.toFixed(1)}</span>
            <span className="text-ivory-500 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
