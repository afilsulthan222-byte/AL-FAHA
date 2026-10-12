'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponMsg(null);
    const result = await applyCoupon(couponInput.trim());
    setCouponMsg({ text: result.message, success: result.success });
    setIsApplying(false);
    if (result.success) setCouponInput('');
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-950 border-l border-gold-500/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-gold-500/20 bg-obsidian-900/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-widest font-bold">
                  Haute Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-ivory-400 hover:text-gold-400 p-1.5 transition-colors"
                aria-label="Close bag"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="mt-4 bg-obsidian-950 border border-gold-500/20 rounded p-3 text-xs">
              <div className="flex items-center justify-between text-ivory-300 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-gold-400 font-semibold">
                      Complimentary White Glove Delivery Unlocked
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-gold-400 font-bold">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for Complimentary Delivery
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-ivory-500">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full bg-obsidian-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gold-gradient h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-obsidian-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-ivory-400">
                <div className="w-16 h-16 rounded-full bg-obsidian-900 border border-gold-500/30 flex items-center justify-center text-gold-400/60 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif text-base text-ivory-200 uppercase tracking-wider">
                  Your Haute Bag is Empty
                </p>
                <p className="text-xs text-ivory-500 max-w-xs mt-1">
                  Discover our timeless collections of royal thobes, haute abayas, and 24k Kasab bishts.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-gold-gradient text-obsidian-950 font-semibold text-xs tracking-widest uppercase rounded hover:scale-105 transition-transform"
                >
                  Explore Collections
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                  className="pt-4 first:pt-0 flex gap-4"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-obsidian-900 rounded overflow-hidden shrink-0 border border-gold-500/20">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif text-sm text-ivory-100 hover:text-gold-300 font-medium line-clamp-1 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() =>
                            removeFromCart(item.productId, item.selectedSize, item.selectedColor)
                          }
                          className="text-ivory-500 hover:text-red-400 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-ivory-400 mt-1 space-x-2">
                        <span className="bg-obsidian-900 px-1.5 py-0.5 rounded border border-gold-500/20">
                          {item.selectedSize}
                        </span>
                        <span className="text-gold-500/80">{item.selectedColor}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gold-500/30 rounded bg-obsidian-900">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="p-1 text-ivory-400 hover:text-gold-400 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-ivory-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity + 1
                            )
                          }
                          className="p-1 text-ivory-400 hover:text-gold-400 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gold-400">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-gold-500/20 bg-obsidian-900/90 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gold-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. ROYAL10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full bg-obsidian-950 border border-gold-500/30 rounded text-xs py-2 pl-8 pr-3 text-ivory-100 placeholder-ivory-500 uppercase focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-3 bg-obsidian-800 border border-gold-500/40 text-gold-300 text-xs uppercase font-medium rounded hover:bg-gold-500 hover:text-obsidian-950 transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-gold-500/10 border border-gold-500/30 rounded px-2.5 py-1 text-xs text-gold-300">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      {appliedCoupon.code} (-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-ivory-400 hover:text-red-400 text-[10px] uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponMsg && (
                  <p
                    className={`text-[11px] ${
                      couponMsg.success ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </form>

              {/* Subtotal Calculation */}
              <div className="space-y-1.5 text-xs text-ivory-400">
                <div className="flex justify-between">
                  <span>Atelier Subtotal</span>
                  <span className="text-ivory-100 font-medium">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Royal Privilege Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>White Glove Delivery</span>
                  <span className="text-ivory-100">
                    {shippingFee === 0 ? (
                      <span className="text-gold-400 font-medium">COMPLIMENTARY</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-gold-500/20 text-sm font-semibold">
                  <span className="font-serif uppercase text-ivory-100">Total Investment</span>
                  <span className="font-serif text-lg text-gold-400 font-bold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 bg-gold-gradient text-obsidian-950 font-bold uppercase tracking-widest text-xs rounded shadow-gold-glow hover:shadow-gold-glow-lg flex items-center justify-center gap-2 transition-all group"
                >
                  <span>Proceed to Sovereign Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex justify-center gap-4 text-[11px] text-ivory-400 pt-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="hover:text-gold-300 underline underline-offset-4"
                  >
                    View Full Bag
                  </Link>
                  <span>&bull;</span>
                  <span className="text-gold-500">Razorpay & COD Available</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
