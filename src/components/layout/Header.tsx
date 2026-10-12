'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { AlFahaLogo } from '@/components/ui/AlFahaLogo';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { name: 'Collections', href: '/shop' },
  { name: 'Royal Thobes', href: '/shop?category=Royal+Thobes' },
  { name: 'Haute Abayas', href: '/shop?category=Haute+Couture+Abayas' },
  { name: 'Bishts & Robes', href: '/shop?category=Embroidered+Bishts' },
  { name: 'Silk Caftans', href: '/shop?category=Silk+Caftans' },
  { name: 'Oud & Jewels', href: '/shop?category=Fragrances+%26+Accessories' },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, wishlist, setIsCartOpen, subtotal } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-obsidian-950/95 backdrop-blur-md border-b border-gold-500/25 shadow-luxury-dark py-3'
            : 'bg-obsidian-950/80 backdrop-blur-sm border-b border-gold-500/15 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-ivory-200 hover:text-gold-400 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-ivory-200 hover:text-gold-400 transition-colors ml-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Left Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {NAV_LINKS.slice(0, 3).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-[13px] uppercase tracking-[0.2em] font-medium transition-all duration-300 relative py-1 ${
                      isActive
                        ? 'text-gold-400 font-semibold'
                        : 'text-ivory-300 hover:text-gold-300'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Central Brand Identity */}
            <div className="flex-1 lg:flex-initial flex justify-center">
              <AlFahaLogo size="md" />
            </div>

            {/* Desktop Right Navigation & Actions */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              <nav className="hidden xl:flex items-center space-x-7 mr-2">
                {NAV_LINKS.slice(3).map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-[13px] uppercase tracking-[0.2em] font-medium transition-all duration-300 relative py-1 ${
                        isActive
                          ? 'text-gold-400 font-semibold'
                          : 'text-ivory-300 hover:text-gold-300'
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 text-ivory-300 hover:text-gold-400 transition-colors p-2"
                aria-label="Search Haute Couture"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-ivory-300 hover:text-gold-400 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {totalWishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gold-500 text-obsidian-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                    {totalWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-ivory-300 hover:text-gold-400 transition-colors flex items-center gap-2 group"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-obsidian-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-gold-glow">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                {subtotal > 0 && (
                  <span className="hidden md:inline-block text-xs font-semibold text-gold-400">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                )}
              </button>

              {/* User Account / Menu */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full border border-gold-500/30 text-ivory-200 hover:border-gold-500 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gold-gradient text-obsidian-950 flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-obsidian-900 border border-gold-500/30 rounded-md shadow-2xl py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-gold-500/20">
                          <p className="text-xs text-gold-400 uppercase tracking-widest font-semibold">
                            {user.role === 'admin' ? 'Royal Administrator' : 'Privileged Patron'}
                          </p>
                          <p className="text-sm font-medium text-ivory-100 truncate">{user.name}</p>
                          <p className="text-xs text-ivory-400 truncate">{user.email}</p>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase text-gold-300 hover:bg-obsidian-800 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-gold-500" />
                            Admin Atelier
                          </Link>
                        )}

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase text-ivory-200 hover:bg-obsidian-800 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gold-500" />
                          My Orders & Account
                        </Link>

                        <Link
                          href="/track"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase text-ivory-200 hover:bg-obsidian-800 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-gold-500" />
                          Track Consignment
                        </Link>

                        <div className="border-t border-gold-500/20 mt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs tracking-wider uppercase text-red-400 hover:bg-obsidian-800 transition-colors text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 text-ivory-300 hover:text-gold-400 transition-colors flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium"
                    aria-label="Sign In"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="hidden sm:inline-block">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-obsidian-900 border border-gold-500/40 rounded-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-ivory-400 hover:text-gold-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-lg text-gold-300 tracking-widest uppercase mb-4">
              Search The AL FAHA Collection
            </h3>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search by garment, fabric, bisht, abaya, perfume..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-obsidian-950 border border-gold-500/50 rounded-md py-3.5 pl-12 pr-28 text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400 text-base"
              />
              <Search className="w-5 h-5 text-gold-500 absolute left-4 top-4" />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-5 bg-gold-gradient text-obsidian-950 font-semibold uppercase text-xs tracking-widest rounded transition-transform hover:scale-105"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              <span className="text-ivory-400 py-1">Popular searches:</span>
              {['Kasab Bisht', 'Giza Cotton Thobe', 'Silk Abaya', 'Cambodi Oud', 'Emerald Caftan'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => {
                      router.push(`/shop?search=${encodeURIComponent(term)}`);
                      setSearchOpen(false);
                    }}
                    className="border border-gold-500/30 hover:border-gold-400 text-ivory-300 hover:text-gold-300 px-3 py-1 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-obsidian-950 border-r border-gold-500/30 h-full flex flex-col justify-between p-6 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-gold-500/20">
                <AlFahaLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-ivory-400 hover:text-gold-400 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-6 space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-[0.2em] font-medium text-ivory-200 hover:text-gold-300 py-2 border-b border-obsidian-800"
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm uppercase tracking-[0.2em] font-medium text-gold-400 py-2 border-b border-obsidian-800"
                >
                  Track Royal Consignment
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-[0.2em] font-medium text-gold-400 py-2 border-b border-obsidian-800"
                  >
                    Admin Atelier Portal
                  </Link>
                )}
              </nav>
            </div>

            <div className="pt-6 border-t border-gold-500/20 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-ivory-400">Signed in as <span className="text-gold-400">{user.name}</span></div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 text-center bg-obsidian-850 border border-gold-500/40 text-ivory-200 rounded text-xs tracking-widest uppercase font-semibold"
                  >
                    My Royal Account
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full py-2 text-center text-red-400 text-xs tracking-widest uppercase"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-3 text-center bg-gold-gradient text-obsidian-950 rounded text-xs tracking-widest uppercase font-bold"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
