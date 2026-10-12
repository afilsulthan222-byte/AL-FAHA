'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Boxes,
  Mail,
  Shield,
  ArrowLeft,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-gold-400">
        <div className="flex flex-col items-center gap-3">
          <Shield className="w-8 h-8 animate-pulse text-gold-400" />
          <p className="font-serif text-xs uppercase tracking-widest">
            Verifying Royal Admin Authorization...
          </p>
        </div>
      </div>
    );
  }

  const NAV_ITEMS = [
    { label: 'Executive Metrics', href: '/admin', icon: LayoutDashboard },
    { label: 'Couture Products', href: '/admin/products', icon: Shirt },
    { label: 'Orders & Dispatch', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { label: 'Email Notifications', href: '/admin/notifications', icon: Mail },
  ];

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 flex flex-col">
      {/* Admin Top Navigation */}
      <div className="bg-obsidian-900 border-b border-gold-500/25 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-gold-gradient text-obsidian-950 font-bold">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-ivory-100 uppercase tracking-widest block">
                AL FAHA Atelier Console
              </span>
              <span className="text-[10px] text-gold-400 uppercase tracking-widest">
                Admin: {user?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian-950 hover:bg-obsidian-850 text-ivory-300 hover:text-gold-300 border border-gold-500/30 text-xs rounded uppercase tracking-wider transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="bg-obsidian-900/60 border-b border-gold-500/15 px-4 sm:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-4 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
                    : 'text-ivory-400 hover:text-gold-300 hover:bg-obsidian-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}
