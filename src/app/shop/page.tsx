'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ProductCategory } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Search, RefreshCw } from 'lucide-react';

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Royal Thobes',
  'Haute Couture Abayas',
  'Embroidered Bishts',
  'Silk Caftans',
  'Velvet Evening Wear',
  'Fragrances & Accessories',
];

const COLLECTIONS = [
  'All',
  'Royal Heritage',
  'Desert Noir',
  'Velvet Mirage',
  'Golden Oasis',
];

function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(75000);

  // Read URL query params on initial mount or update
  useEffect(() => {
    const cat = searchParams.get('category');
    const col = searchParams.get('collection');
    const q = searchParams.get('search');

    if (cat) setSelectedCategory(cat);
    if (col) setSelectedCollection(col);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedCollection !== 'All') {
      result = result.filter(
        (p) => p.collection.toLowerCase() === selectedCollection.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.arabicName.includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
      );
    }

    result = result.filter((p) => p.price <= priceMax);

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, selectedCollection, searchQuery, priceMax, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSearchQuery('');
    setPriceMax(75000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedCollection !== 'All' ||
    searchQuery.trim() !== '' ||
    priceMax < 75000;

  return (
    <div className="bg-obsidian-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-2">
            The Sovereign Wardrobe
          </span>
          <h1
            className="font-serif text-3xl sm:text-5xl text-ivory-100 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Haute Couture Atelier
          </h1>
          <p className="text-xs sm:text-sm text-ivory-400 mt-3 font-light leading-relaxed">
            Curated garments handcrafted from superfine camel hair, Italian silk organza, and 200s Egyptian Giza cotton.
          </p>
        </div>

        {/* Top Control Bar: Search + Filter Toggle + Sort */}
        <div className="bg-obsidian-900/90 border border-gold-500/25 rounded-lg p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-luxury-dark">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gold-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search garments, fabrics, bishts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 pl-10 pr-8 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-ivory-500 hover:text-ivory-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-obsidian-950 border border-gold-500/40 text-gold-400 text-xs uppercase font-semibold tracking-wider rounded"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters && '&bull;'}</span>
            </button>

            {/* Results Count */}
            <span className="text-xs text-ivory-400 font-medium hidden sm:inline-block">
              Showing <strong className="text-gold-400">{filteredProducts.length}</strong> Pieces
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-ivory-500 uppercase tracking-wider hidden md:inline-block">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-obsidian-950 border border-gold-500/30 text-ivory-200 text-xs py-2 px-3 rounded focus:outline-none focus:border-gold-400 uppercase tracking-wider"
              >
                <option value="featured">Atelier Curated</option>
                <option value="newest">New Season</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Patron Acclaim</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 mb-6 text-xs animate-fadeIn">
            <span className="text-ivory-500">Active Criteria:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-obsidian-900 border border-gold-500/40 text-gold-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCollection !== 'All' && (
              <span className="bg-obsidian-900 border border-gold-500/40 text-gold-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                Collection: {selectedCollection}
                <button onClick={() => setSelectedCollection('All')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-obsidian-900 border border-gold-500/40 text-gold-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                Query: &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceMax < 75000 && (
              <span className="bg-obsidian-900 border border-gold-500/40 text-gold-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                Up to ₹{priceMax.toLocaleString('en-IN')}
                <button onClick={() => setPriceMax(75000)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:text-red-300 underline underline-offset-4 ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Filter Sidebar */}
          <div className="hidden lg:block space-y-8 bg-obsidian-900/60 border border-gold-500/20 rounded-lg p-6 h-fit sticky top-28">
            {/* Category Filter */}
            <div>
              <h3 className="font-serif text-xs uppercase tracking-[0.25em] font-bold text-gold-400 mb-4 border-b border-gold-500/15 pb-2">
                Garment Category
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-gold-500/20 text-gold-300 font-bold border-l-2 border-gold-500'
                        : 'text-ivory-400 hover:text-ivory-100'
                    }`}
                  >
                    <span>{cat}</span>
                    {cat !== 'All' && (
                      <span className="text-[10px] text-ivory-600">
                        ({products.filter((p) => p.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Filter */}
            <div>
              <h3 className="font-serif text-xs uppercase tracking-[0.25em] font-bold text-gold-400 mb-4 border-b border-gold-500/15 pb-2">
                Atelier Collection
              </h3>
              <div className="space-y-1.5">
                {COLLECTIONS.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-between ${
                      selectedCollection === col
                        ? 'bg-gold-500/20 text-gold-300 font-bold border-l-2 border-gold-500'
                        : 'text-ivory-400 hover:text-ivory-100'
                    }`}
                  >
                    <span>{col}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <h3 className="font-serif text-xs uppercase tracking-[0.25em] font-bold text-gold-400 mb-4 border-b border-gold-500/15 pb-2">
                Price Ceiling
              </h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="10000"
                  max="75000"
                  step="2500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-ivory-400 font-medium">
                  <span>₹10,000</span>
                  <span className="text-gold-400 font-bold">₹{priceMax.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-obsidian-900 animate-pulse rounded-lg border border-gold-500/10"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 bg-obsidian-900/40 border border-gold-500/20 rounded-lg p-8">
                <div className="w-16 h-16 rounded-full bg-obsidian-850 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto mb-4">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl text-ivory-100 uppercase tracking-widest font-semibold">
                  No Atelier Creations Found
                </h3>
                <p className="text-xs text-ivory-400 max-w-md mx-auto mt-2">
                  No garments match your current selection. Please adjust your category or price range.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest rounded hover:scale-105 transition-transform"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-obsidian-950 border-r border-gold-500/30 h-full flex flex-col justify-between p-6 z-10 shadow-2xl overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gold-500/20 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif text-sm uppercase tracking-widest text-ivory-100 font-bold">
                    Filter Catalogue
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-ivory-400 hover:text-gold-400 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left text-xs py-2 px-2.5 rounded ${
                          selectedCategory === cat
                            ? 'bg-gold-500/20 text-gold-300 font-bold border-l-2 border-gold-500'
                            : 'text-ivory-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Collections */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 mb-3">
                    Collections
                  </h4>
                  <div className="space-y-1">
                    {COLLECTIONS.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelectedCollection(col)}
                        className={`w-full text-left text-xs py-2 px-2.5 rounded ${
                          selectedCollection === col
                            ? 'bg-gold-500/20 text-gold-300 font-bold border-l-2 border-gold-500'
                            : 'text-ivory-400'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-bold text-gold-400 mb-3">
                    Price Ceiling: ₹{priceMax.toLocaleString('en-IN')}
                  </h4>
                  <input
                    type="range"
                    min="10000"
                    max="75000"
                    step="2500"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-gold-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gold-500/20 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-obsidian-700 text-ivory-400 text-xs uppercase tracking-wider rounded"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-gold-400">
          <p className="font-serif text-xs uppercase tracking-widest">
            Loading Atelier Collections...
          </p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
