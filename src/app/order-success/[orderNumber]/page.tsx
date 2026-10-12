'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Crown, CheckCircle2, Truck, ArrowRight, Mail, MapPin } from 'lucide-react';
import { Order } from '@/types';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F2DC8B', '#FFFFFF', '#C5A059'],
      });
    } catch {}

    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderNumber) loadOrder();
  }, [orderNumber]);

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Crown & Success Icon */}
        <div className="w-20 h-20 rounded-full bg-obsidian-900 border-2 border-gold-500/50 shadow-gold-glow-lg flex items-center justify-center text-gold-400 mx-auto mb-6 animate-scaleIn">
          <Crown className="w-10 h-10" />
        </div>

        <span className="text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold block mb-2">
          Atelier Acquisition Confirmed
        </span>

        <h1
          className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-widest font-bold"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Thank You For Your Patronage
        </h1>

        <p className="text-xs sm:text-sm text-ivory-300 max-w-lg mx-auto mt-3 font-light leading-relaxed">
          Your bespoke order has been registered under sovereign reference{' '}
          <strong className="text-gold-400 font-bold">{orderNumber}</strong>. Master tailors have been notified and crafting has initiated.
        </p>

        {/* Confirmation Details Card */}
        {order && (
          <div className="mt-12 bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 sm:p-8 text-left shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-500/20 gap-4">
              <div>
                <p className="text-[11px] text-gold-500 uppercase tracking-widest">Order Reference</p>
                <p className="font-serif text-lg font-bold text-ivory-100">{order.orderNumber}</p>
              </div>

              <div>
                <p className="text-[11px] text-gold-500 uppercase tracking-widest">Payment Settlement</p>
                <p className="text-xs text-ivory-200">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery (Pending Handover)' : 'Razorpay Verified Paid'}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-gold-500 uppercase tracking-widest">Estimated Courier Arrival</p>
                <p className="text-xs font-bold text-gold-300">
                  {order.estimatedDelivery || '3-5 Business Days (White Glove Express)'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-serif text-xs uppercase tracking-widest font-bold text-gold-400">
                Atelier Pieces Ordered
              </h4>
              <div className="divide-y divide-obsidian-800">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded bg-obsidian-950 overflow-hidden shrink-0 border border-gold-500/20">
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-ivory-100">{item.productName}</p>
                        <p className="text-[10px] text-ivory-400">
                          {item.size} &bull; {item.color} &bull; Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gold-400">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Residence */}
            <div className="border-t border-gold-500/20 pt-4 flex items-start gap-3 text-xs text-ivory-400">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-ivory-200 font-semibold uppercase tracking-wider">
                  Delivery Destination
                </p>
                <p className="text-[11px] mt-0.5">
                  {order.shippingAddress.fullName} &bull; {order.shippingAddress.addressLine1},{' '}
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            </div>

            {/* Email Notification Notice */}
            <div className="bg-obsidian-950 border border-gold-500/20 rounded p-4 flex items-center gap-3 text-xs text-gold-300">
              <Mail className="w-5 h-5 text-gold-400 shrink-0" />
              <span>
                A luxury confirmation dispatch receipt has been sent to <strong>{order.customerEmail}</strong>.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/track?order=${orderNumber}`}
            className="w-full sm:w-auto px-8 py-4 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          >
            <Truck className="w-4 h-4" />
            <span>Track Royal Consignment</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-obsidian-900 hover:bg-obsidian-850 text-ivory-200 border border-gold-500/40 font-serif font-semibold text-xs uppercase tracking-[0.25em] rounded transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Atelier Exploration</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
