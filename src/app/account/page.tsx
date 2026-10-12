'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  ShoppingBag,
  Truck,
  LogOut,
  MapPin,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, isAdmin, isLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      try {
        setLoadingOrders(true);
        const jwtToken = token || localStorage.getItem('alfaha_jwt_token');
        const res = await fetch('/api/orders', {
          headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
        });
        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error('Failed to load user orders:', e);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user, token]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-gold-400">
        <p className="font-serif text-xs uppercase tracking-widest">Loading Patron Portal...</p>
      </div>
    );
  }

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'tailoring':
        return 'text-gold-400 bg-gold-500/10 border-gold-500/30';
      case 'dispatched':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'out_for_delivery':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'delivered':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-ivory-300 bg-obsidian-900 border-obsidian-700';
    }
  };

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Banner */}
        <div className="bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold-gradient text-obsidian-950 flex items-center justify-center font-bold text-2xl uppercase shadow-gold-glow">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-ivory-100">{user.name}</h1>
                <span className="bg-gold-500/20 text-gold-300 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border border-gold-500/30">
                  {user.role === 'admin' ? 'Royal Administrator' : 'Privileged Patron'}
                </span>
              </div>
              <p className="text-xs text-ivory-400 mt-1">{user.email} &bull; Member since 2026</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-5 py-2.5 bg-obsidian-950 border border-gold-500/50 text-gold-400 text-xs uppercase font-bold tracking-widest rounded hover:bg-gold-500 hover:text-obsidian-950 transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Atelier</span>
              </Link>
            )}

            <button
              onClick={() => logout()}
              className="px-5 py-2.5 bg-obsidian-950 border border-obsidian-700 text-ivory-400 hover:text-red-400 hover:border-red-500/40 text-xs uppercase font-semibold tracking-wider rounded transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="font-serif text-xl uppercase tracking-widest font-bold text-ivory-100"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                Order History & Tailoring Register
              </h2>
              <p className="text-xs text-ivory-400 mt-1">
                View status updates, consignment tracking, and invoices for your acquisitions.
              </p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-200 uppercase tracking-wider font-semibold"
            >
              <span>Explore Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center text-xs text-gold-400 bg-obsidian-900 rounded border border-gold-500/20">
              Retrieving orders from archive...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-obsidian-900/40 border border-gold-500/20 rounded-lg p-8">
              <ShoppingBag className="w-10 h-10 text-gold-500/40 mx-auto mb-3" />
              <p className="font-serif text-base font-semibold text-ivory-200">
                No Acquisitions on Record
              </p>
              <p className="text-xs text-ivory-500 mt-1">
                Your bespoke wardrobe awaits its inaugural creation.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-block px-6 py-2.5 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest rounded"
              >
                Discover Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gold-500/15 gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-base font-bold text-gold-400">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${getStatusColor(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-ivory-500 mt-1">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} &bull; Payment:{' '}
                        <strong className="text-ivory-300">
                          {ord.paymentStatus === 'paid' ? 'Razorpay Verified' : 'Cash on Delivery'}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-ivory-500 uppercase tracking-wider">Total Investment</p>
                        <p className="font-serif text-base font-bold text-ivory-100">
                          ₹{ord.total.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <Link
                        href={`/track?order=${ord.orderNumber}`}
                        className="px-4 py-2 bg-obsidian-950 border border-gold-500/40 text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 text-xs uppercase font-semibold tracking-wider rounded transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Tracking</span>
                      </Link>
                    </div>
                  </div>

                  {/* Items row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-obsidian-950/60 p-2.5 rounded border border-obsidian-800">
                        <div className="relative w-12 h-16 rounded overflow-hidden shrink-0 border border-gold-500/20 bg-obsidian-900">
                          <Image src={item.image} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-serif text-xs font-semibold text-ivory-100 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[10px] text-ivory-400 mt-0.5">
                            {item.size} &bull; {item.color}
                          </p>
                          <p className="text-[11px] font-bold text-gold-400 mt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {ord.trackingNumber && (
                    <div className="pt-2 text-xs text-gold-300 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gold-500" />
                      <span>
                        Consignment #{ord.trackingNumber} handled by {ord.courierName || 'Royal Express'}.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
