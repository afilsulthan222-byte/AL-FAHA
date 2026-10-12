'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const jwt = token || localStorage.getItem('alfaha_jwt_token');
        const res = await fetch('/api/admin/stats', {
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
        });
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="py-24 text-center text-gold-400 font-serif text-xs uppercase tracking-widest">
        Aggregating Sovereign Financial & Atelier Analytics...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-widest text-ivory-100"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Executive Atelier Overview
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Real-time financial performance, artisan tailoring queue, and inventory alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider rounded shadow-gold-glow hover:scale-105 transition-transform"
          >
            + Add New Creation
          </Link>
        </div>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-obsidian-900 border border-gold-500/25 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between text-gold-400 mb-3">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-ivory-400">
              Total Revenue
            </span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-gold-300">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Exclusively in Indian Rupees (INR)</span>
          </p>
        </div>

        <div className="bg-obsidian-900 border border-gold-500/25 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between text-gold-400 mb-3">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-ivory-400">
              Total Acquisitions
            </span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
            {stats.totalOrders}
          </p>
          <p className="text-[10px] text-ivory-500 mt-2">
            Razorpay Online & Cash on Delivery
          </p>
        </div>

        <div className="bg-obsidian-900 border border-gold-500/25 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between text-gold-400 mb-3">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-ivory-400">
              Average Order Value
            </span>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-gold-400">
            ₹{stats.avgOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-ivory-500 mt-2">Haute Couture average basket size</p>
        </div>

        <div className="bg-obsidian-900 border border-gold-500/25 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between text-gold-400 mb-3">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-ivory-400">
              Privileged Patrons
            </span>
            <Users className="w-5 h-5" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
            {stats.customersCount}
          </p>
          <p className="text-[10px] text-gold-500 mt-2">Active customer registry</p>
        </div>
      </div>

      {/* Two Column Layout: Order Pipeline & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Pipeline (2 cols) */}
        <div className="lg:col-span-2 bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gold-500/15 pb-3">
            <h3 className="font-serif text-sm uppercase tracking-widest font-bold text-gold-400">
              Atelier Order Pipeline
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-400 hover:text-gold-200 underline uppercase tracking-wider"
            >
              Manage All Orders &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-obsidian-950 p-4 rounded border border-gold-500/20 text-center">
              <span className="text-[10px] text-ivory-500 uppercase tracking-widest block mb-1">
                Confirmed
              </span>
              <span className="font-serif text-2xl font-bold text-blue-400">
                {stats.ordersByStatus.confirmed || 0}
              </span>
            </div>

            <div className="bg-obsidian-950 p-4 rounded border border-gold-500/20 text-center">
              <span className="text-[10px] text-ivory-500 uppercase tracking-widest block mb-1">
                In Tailoring
              </span>
              <span className="font-serif text-2xl font-bold text-gold-400">
                {stats.ordersByStatus.tailoring || 0}
              </span>
            </div>

            <div className="bg-obsidian-950 p-4 rounded border border-gold-500/20 text-center">
              <span className="text-[10px] text-ivory-500 uppercase tracking-widest block mb-1">
                Dispatched
              </span>
              <span className="font-serif text-2xl font-bold text-purple-400">
                {stats.ordersByStatus.dispatched || 0}
              </span>
            </div>

            <div className="bg-obsidian-950 p-4 rounded border border-gold-500/20 text-center">
              <span className="text-[10px] text-ivory-500 uppercase tracking-widest block mb-1">
                Delivered
              </span>
              <span className="font-serif text-2xl font-bold text-green-400">
                {stats.ordersByStatus.delivered || 0}
              </span>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gold-500/20 text-gold-400 font-serif uppercase tracking-wider">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Patron</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800 text-ivory-300">
                {stats.recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-obsidian-850/50">
                    <td className="py-3 px-3 font-mono font-bold text-gold-400">{ord.orderNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-ivory-100">{ord.customerName}</p>
                      <p className="text-[10px] text-ivory-500">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-3 font-serif font-bold text-ivory-100">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/30">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/admin/orders`}
                        className="text-gold-400 hover:text-gold-200 underline font-medium"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 col) */}
        <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-gold-500/15 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif text-sm uppercase tracking-widest font-bold text-gold-400">
                Low Inventory Alerts
              </h3>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs text-gold-400 hover:text-gold-200 underline uppercase tracking-wider"
            >
              Update &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {stats.lowStockProducts.map((prod: any) => (
              <div
                key={prod.id}
                className="p-3 bg-obsidian-950 border border-gold-500/15 rounded flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-serif font-semibold text-ivory-100 line-clamp-1">{prod.name}</p>
                  <p className="text-[10px] text-ivory-500 uppercase">{prod.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/40 text-red-400 text-[10px] font-bold rounded">
                    {prod.stock} Left
                  </span>
                  <p className="text-[10px] text-gold-400 mt-1">₹{prod.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue by Category */}
          <div className="pt-4 border-t border-gold-500/15">
            <h4 className="font-serif text-xs uppercase tracking-widest font-bold text-ivory-300 mb-3">
              Revenue by Category
            </h4>
            <div className="space-y-2">
              {Object.entries(stats.categoryRevenue).map(([cat, rev]: any) => (
                <div key={cat} className="flex justify-between text-xs text-ivory-400">
                  <span className="truncate pr-2">{cat}</span>
                  <span className="font-mono text-gold-400 font-bold">
                    ₹{rev.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
