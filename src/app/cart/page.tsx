'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    freeShippingProgress,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [giftNote, setGiftNote] = useState('');

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = await applyCoupon(couponCode.trim());
    setCouponStatus({ text: res.message, ok: res.success });
    if (res.success) setCouponCode('');
  };

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
            Order Review
          </span>
          <h1
            className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Your Haute Bag
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-24 bg-obsidian-900/40 border border-gold-500/20 rounded-lg p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-obsidian-850 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg text-ivory-100 uppercase tracking-widest font-semibold">
              Your Haute Bag is Empty
            </h3>
            <p className="text-xs text-ivory-400 mt-2 max-w-xs mx-auto">
              Select exquisite garments from our royal collections to proceed with white glove delivery.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block px-8 py-3 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest rounded hover:scale-105 transition-transform"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free delivery bar */}
              <div className="bg-obsidian-900 border border-gold-500/20 rounded p-4 text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-ivory-200 font-medium">
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-gold-400 font-bold">
                        Complimentary White Glove Royal Delivery Unlocked
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-gold-400">₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')}</strong> more for Complimentary Delivery
                      </span>
                    )}
                  </span>
                  <span className="text-gold-500 font-bold">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-obsidian-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gold-gradient h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Table / List */}
              <div className="bg-obsidian-900/60 border border-gold-500/20 rounded-lg divide-y divide-obsidian-800 overflow-hidden">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-28 bg-obsidian-950 rounded overflow-hidden shrink-0 border border-gold-500/20">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gold-500 uppercase tracking-widest block mb-0.5">
                          {item.product.category}
                        </span>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-serif text-base font-semibold text-ivory-100 hover:text-gold-300 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-xs text-ivory-400 mt-1 space-x-3">
                          <span>Size: <strong className="text-ivory-200">{item.selectedSize}</strong></span>
                          <span>Color: <strong className="text-gold-400">{item.selectedColor}</strong></span>
                        </div>
                        <p className="font-serif text-sm font-bold text-gold-400 mt-2">
                          ₹{item.product.price.toLocaleString('en-IN')} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8">
                      {/* Quantity */}
                      <div className="flex items-center border border-gold-500/30 rounded bg-obsidian-950">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.selectedSize,
                              item.selectedColor,
                              item.quantity - 1
                            )
                          }
                          className="px-2.5 py-1 text-ivory-400 hover:text-gold-400 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-ivory-100">
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
                          className="px-2.5 py-1 text-ivory-400 hover:text-gold-400 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <div className="text-right">
                        <p className="font-serif text-base font-bold text-gold-400">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.selectedSize, item.selectedColor)
                        }
                        className="text-ivory-500 hover:text-red-400 p-2 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gift Note Box */}
              <div className="bg-obsidian-900/60 border border-gold-500/20 rounded-lg p-6">
                <h4 className="font-serif text-xs uppercase tracking-widest font-bold text-gold-400 mb-2">
                  Complimentary Bespoke Gift Inscription
                </h4>
                <p className="text-xs text-ivory-400 mb-3">
                  Have a personal message calligraphed on gold-embossed vellum paper inside the presentation chest.
                </p>
                <textarea
                  rows={2}
                  placeholder="Enter message for the recipient (optional)..."
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full bg-obsidian-950 border border-gold-500/30 rounded p-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            {/* Order Summary Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 shadow-2xl space-y-6">
                <h3 className="font-serif text-base uppercase tracking-widest font-bold text-ivory-100 border-b border-gold-500/20 pb-3">
                  Investment Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleCouponSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-gold-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Privilege Code (ROYAL10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 pl-8 pr-3 text-xs text-ivory-100 placeholder-ivory-500 uppercase focus:outline-none focus:border-gold-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 bg-obsidian-850 border border-gold-500/40 text-gold-300 text-xs font-semibold rounded hover:bg-gold-500 hover:text-obsidian-950 transition-colors uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-gold-500/10 border border-gold-500/30 rounded px-3 py-1.5 text-xs text-gold-300">
                      <span className="flex items-center gap-1.5 font-bold">
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

                  {couponStatus && (
                    <p
                      className={`text-[11px] ${
                        couponStatus.ok ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {couponStatus.text}
                    </p>
                  )}
                </form>

                {/* Numbers */}
                <div className="space-y-3 text-xs text-ivory-300 pt-2 border-t border-gold-500/15">
                  <div className="flex justify-between">
                    <span>Atelier Subtotal</span>
                    <span className="font-semibold text-ivory-100">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Privilege Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>White Glove Courier Delivery</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-gold-400 font-semibold">COMPLIMENTARY</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-gold-500/30 text-base font-bold">
                    <span className="font-serif uppercase text-ivory-100">Total Investment</span>
                    <span className="font-serif text-2xl text-gold-400">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow hover:shadow-gold-glow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Proceed to Sovereign Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-ivory-400">
                  <ShieldCheck className="w-4 h-4 text-gold-500" />
                  <span>Razorpay Secured &bull; Cash on Delivery Supported</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
