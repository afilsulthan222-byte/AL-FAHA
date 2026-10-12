'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { OrderStatus } from '@/types';

const STATUS_STAGES: { status: OrderStatus; label: string; desc: string }[] = [
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    desc: 'Garment specifications & measurements verified.',
  },
  {
    status: 'tailoring',
    label: 'Atelier Tailoring',
    desc: 'Master artisans cutting, sewing, and hand-embroidering.',
  },
  {
    status: 'dispatched',
    label: 'Dispatched in Scented Chest',
    desc: 'Handed over to sovereign express courier.',
  },
  {
    status: 'out_for_delivery',
    label: 'Out for White Glove Handover',
    desc: 'Uniformed courier arriving at delivery residence today.',
  },
  {
    status: 'delivered',
    label: 'Delivered in Person',
    desc: 'Presented in signature black walnut chest.',
  },
];

function TrackContent() {
  const searchParams = useSearchParams();

  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [emailOrPhoneInput, setEmailOrPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const qOrder = searchParams.get('order');
    if (qOrder) {
      setOrderNumberInput(qOrder);
      performTracking(qOrder, '');
    }
  }, [searchParams]);

  const performTracking = async (orderNum: string, emailOrPhone: string) => {
    setLoading(true);
    setErrorMessage(null);
    setOrderResult(null);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: orderNum, emailOrPhone }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrderResult(data.order);
      } else {
        setErrorMessage(data.message || 'No order record found.');
      }
    } catch {
      setErrorMessage('Unable to connect to atelier tracking servers.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) return;
    performTracking(orderNumberInput.trim(), emailOrPhoneInput.trim());
  };

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'tailoring':
        return 1;
      case 'dispatched':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = orderResult ? getStageIndex(orderResult.orderStatus) : 0;

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
            Consignment Protocol
          </span>
          <h1
            className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-ivory-400 mt-3 font-light leading-relaxed">
            Follow every stage of your couture creation—from master tailoring in our atelier to white-glove doorstep delivery.
          </p>
        </div>

        {/* Tracking Lookup Box */}
        <div className="bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 sm:p-8 shadow-2xl mb-12">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                  Order Reference *
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 text-gold-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. ALF-2026-7842"
                    value={orderNumberInput}
                    onChange={(e) => setOrderNumberInput(e.target.value)}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2.5 pl-10 pr-3 text-xs text-ivory-100 uppercase placeholder-ivory-500 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                  Patron Email or Mobile (Optional)
                </label>
                <input
                  type="text"
                  placeholder="tariq@alfaha.com or phone"
                  value={emailOrPhoneInput}
                  onChange={(e) => setEmailOrPhoneInput(e.target.value)}
                  className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2.5 px-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-ivory-400">
                <span className="text-[11px] text-ivory-500">Quick Demo Records:</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrderNumberInput('ALF-2026-7842');
                    performTracking('ALF-2026-7842', '');
                  }}
                  className="text-gold-400 hover:text-gold-200 underline font-mono text-[11px]"
                >
                  ALF-2026-7842
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrderNumberInput('ALF-2026-8910');
                    performTracking('ALF-2026-8910', '');
                  }}
                  className="text-gold-400 hover:text-gold-200 underline font-mono text-[11px]"
                >
                  ALF-2026-8910
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.2em] rounded shadow-gold-glow hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Locating Record...' : 'Track Consignment'}</span>
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/40 rounded text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Order Tracking Result */}
        {orderResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Courier & Status Summary Banner */}
            <div className="bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] text-gold-500 uppercase tracking-widest font-bold block mb-1">
                  Active Consignment
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory-100">
                  {orderResult.orderNumber}
                </h3>
                <p className="text-xs text-ivory-400 mt-1">
                  Patron: <strong className="text-ivory-200">{orderResult.customerName}</strong> &bull; Destination: {orderResult.shippingAddress?.city}, {orderResult.shippingAddress?.country}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="bg-obsidian-950 border border-gold-500/20 rounded p-3 text-right">
                  <p className="text-[10px] text-ivory-500 uppercase tracking-wider">Courier Carrier</p>
                  <p className="font-bold text-gold-400">{orderResult.courierName || 'Royal Express'}</p>
                </div>

                <div className="bg-obsidian-950 border border-gold-500/20 rounded p-3 text-right">
                  <p className="text-[10px] text-ivory-500 uppercase tracking-wider">Tracking Consignment</p>
                  <p className="font-mono font-bold text-ivory-100">{orderResult.trackingNumber || 'Pending Dispatch'}</p>
                </div>

                <div className="bg-obsidian-950 border border-gold-500/20 rounded p-3 text-right">
                  <p className="text-[10px] text-ivory-500 uppercase tracking-wider">Estimated Delivery</p>
                  <p className="font-bold text-gold-300">{orderResult.estimatedDelivery || '3-5 Business Days'}</p>
                </div>
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 sm:p-8 shadow-xl">
              <h4 className="font-serif text-xs uppercase tracking-widest font-bold text-gold-400 mb-8 border-b border-gold-500/15 pb-3">
                Sartorial Progress Timeline
              </h4>

              <div className="relative">
                {/* Horizontal progress bar for desktop */}
                <div className="hidden md:block absolute top-4 left-6 right-6 h-0.5 bg-obsidian-800 -z-0">
                  <div
                    className="h-full bg-gold-gradient transition-all duration-700"
                    style={{
                      width: `${(currentStageIndex / (STATUS_STAGES.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {STATUS_STAGES.map((stage, idx) => {
                    const isDone = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.status} className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 relative z-10">
                        {/* Dot / Icon */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                            isDone
                              ? 'bg-obsidian-950 border-gold-400 text-gold-400 shadow-gold-glow'
                              : 'bg-obsidian-950 border-obsidian-700 text-ivory-600'
                          } ${isCurrent ? 'ring-4 ring-gold-500/20 animate-pulse' : ''}`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 fill-gold-500/20" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <p
                            className={`font-serif text-xs uppercase tracking-wider font-bold ${
                              isDone ? 'text-gold-300' : 'text-ivory-500'
                            }`}
                          >
                            {stage.label}
                          </p>
                          <p className="text-[11px] text-ivory-400 mt-1 max-w-[150px]">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Historical Event Log */}
              {orderResult.timeline && orderResult.timeline.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gold-500/15">
                  <h5 className="font-serif text-xs uppercase tracking-widest font-bold text-ivory-300 mb-4">
                    Atelier Event Log
                  </h5>
                  <div className="space-y-4">
                    {orderResult.timeline.map((event: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-gold-400 mt-1.5 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-ivory-100">{event.title}</span>
                            <span className="text-[10px] text-gold-500/80 font-mono">{event.timestamp}</span>
                          </div>
                          <p className="text-ivory-400 text-[11px] mt-0.5">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Creations in this Order */}
            <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl">
              <h4 className="font-serif text-xs uppercase tracking-widest font-bold text-gold-400 mb-4 border-b border-gold-500/15 pb-2">
                Garments in this Consignment
              </h4>
              <div className="divide-y divide-obsidian-800">
                {orderResult.items?.map((item: any, i: number) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded bg-obsidian-950 overflow-hidden shrink-0 border border-gold-500/20">
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-ivory-100">{item.productName}</p>
                        <p className="text-[10px] text-ivory-400">
                          Size: {item.size} &bull; Color: {item.color} &bull; Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gold-400">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-gold-400">
          <p className="font-serif text-xs uppercase tracking-widest">
            Connecting to Live Consignment Network...
          </p>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
