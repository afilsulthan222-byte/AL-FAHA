'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  Ruler,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  X,
  Crown,
} from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ui/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // UI state
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'fabric' | 'shipping' | 'care' | null>('fabric');
  const [addedNotice, setAddedNotice] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes[0] || 'Standard');
          setSelectedColor(data.product.colors[0]?.name || 'Standard');

          // Fetch related
          const allRes = await fetch('/api/products');
          const allData = await allRes.json();
          if (allData.success) {
            setRelatedProducts(
              allData.products.filter(
                (p: Product) => p.id !== data.product.id && p.category === data.product.category
              ).slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-gold-400 text-xs uppercase tracking-widest">
            Opening Atelier Archive...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-obsidian-950 flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl text-ivory-100 uppercase tracking-widest font-bold">
          Garment Not Found
        </h2>
        <p className="text-xs text-ivory-400 mt-2 max-w-sm">
          This piece may have been acquired or archived by our master artisans.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-6 py-3 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest rounded"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;
    setReviews([
      {
        userName: newReviewAuthor,
        rating: newReviewRating,
        comment: newReviewComment,
        date: 'Just now',
        verified: true,
      },
      ...reviews,
    ]);
    setReviewSubmitted(true);
    setNewReviewAuthor('');
    setNewReviewComment('');
  };

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-ivory-500 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-gold-400 transition-colors">
            Atelier
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gold-400 transition-colors">
            Collections
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-gold-400 transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gold-400 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Section: Gallery & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image */}
            <div className="relative aspect-[3/4] w-full bg-obsidian-900 rounded-lg overflow-hidden border border-gold-500/20 shadow-2xl">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />

              {/* Exclusive badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isExclusive && (
                  <span className="bg-obsidian-950/95 text-gold-400 border border-gold-500/50 text-xs uppercase font-bold tracking-widest px-3 py-1 rounded shadow">
                    Atelier Exclusive
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-gold-gradient text-obsidian-950 text-xs uppercase font-bold tracking-widest px-3 py-1 rounded shadow">
                    New Season Drop
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                  isFavorited
                    ? 'bg-gold-500 text-obsidian-950 shadow-gold-glow'
                    : 'bg-obsidian-950/80 text-ivory-200 hover:text-gold-400'
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-obsidian-950' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] rounded-md overflow-hidden bg-obsidian-900 border transition-all ${
                      activeImageIndex === idx
                        ? 'border-gold-400 ring-2 ring-gold-500/30'
                        : 'border-gold-500/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Arabic Monogram */}
              <div className="flex items-center justify-between text-xs text-gold-500 font-semibold tracking-[0.25em] uppercase mb-2">
                <span>{product.category} &bull; {product.collection}</span>
                <span className="font-arabic text-base text-gold-400">{product.arabicName}</span>
              </div>

              {/* Title */}
              <h1
                className="font-serif text-2xl sm:text-3xl text-ivory-100 font-bold uppercase tracking-wider leading-tight"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-ivory-300 font-light mt-2 leading-relaxed">
                {product.subtitle}
              </p>

              {/* Rating & SKU */}
              <div className="flex items-center justify-between mt-3 text-xs text-ivory-400 pt-3 border-t border-gold-500/15">
                <div className="flex items-center gap-1.5 text-gold-400">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400" />
                    ))}
                  </div>
                  <span className="font-bold text-ivory-100">{product.rating.toFixed(2)}</span>
                  <span className="text-ivory-500">({product.reviewsCount} Patrons)</span>
                </div>
                <span className="font-mono text-[11px] text-ivory-500">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-obsidian-900/90 border border-gold-500/25 rounded-lg flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-gold-400">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-ivory-500 line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-ivory-400 uppercase tracking-widest mt-1">
                  Inclusive of all luxury taxes &bull; White Glove Royal Courier
                </p>
              </div>

              {/* Stock status badge */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-semibold rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {product.stock > 0 ? `${product.stock} in Atelier` : 'Bespoke Order'}
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="text-xs font-serif uppercase tracking-widest font-bold text-gold-400 block mb-2.5">
                Artisanal Palette: <span className="text-ivory-100">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 p-1.5 rounded border transition-all ${
                      selectedColor === color.name
                        ? 'border-gold-400 bg-gold-500/15 text-gold-300'
                        : 'border-obsidian-800 bg-obsidian-900 text-ivory-400 hover:border-gold-500/30'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gold-500/40"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-medium pr-1">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Size Guide Trigger */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-serif uppercase tracking-widest font-bold text-gold-400">
                  Select Royal Cut / Size
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-200 underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Tailoring Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold border transition-all text-center ${
                      selectedSize === size
                        ? 'border-gold-400 bg-gold-gradient text-obsidian-950 font-bold shadow-gold-glow'
                        : 'border-gold-500/25 bg-obsidian-900 text-ivory-200 hover:border-gold-500/60'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-serif uppercase tracking-widest font-bold text-ivory-300">
                Quantity:
              </span>
              <div className="flex items-center border border-gold-500/30 rounded bg-obsidian-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-ivory-400 hover:text-gold-400 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-ivory-100">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-ivory-400 hover:text-gold-400 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow hover:shadow-gold-glow-lg transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Haute Bag &bull; ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-obsidian-900 hover:bg-obsidian-850 text-gold-300 border border-gold-500/40 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded transition-colors"
              >
                Instant Sovereign Checkout (Razorpay / COD)
              </button>
            </div>

            {/* Success notification alert */}
            {addedNotice && (
              <div className="p-3 bg-green-500/10 border border-green-500/40 rounded text-xs text-green-400 flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4" />
                <span>Piece gracefully placed in your Haute Bag.</span>
              </div>
            )}

            {/* Luxury Service Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gold-500/15 text-xs text-ivory-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>White Glove Courier Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Authentic Atelier Certificate</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-gold-500/20 pt-4 space-y-2">
              {/* Tab 1: Fabric & Craftsmanship */}
              <div className="border border-gold-500/20 rounded bg-obsidian-900/60 overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                  className="w-full p-3.5 text-left flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-ivory-100"
                >
                  <span>Textile Origin & Atelier Craftsmanship</span>
                  {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4 text-gold-400" /> : <ChevronDown className="w-4 h-4 text-ivory-500" />}
                </button>
                {openAccordion === 'fabric' && (
                  <div className="p-3.5 pt-0 text-xs text-ivory-400 space-y-2 border-t border-gold-500/10">
                    <p className="font-medium text-gold-300">{product.fabric}</p>
                    <p className="leading-relaxed">{product.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-ivory-300 pt-1">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tab 2: Delivery & Packaging */}
              <div className="border border-gold-500/20 rounded bg-obsidian-900/60 overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full p-3.5 text-left flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-ivory-100"
                >
                  <span>Royal Packaging & Delivery Service</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-gold-400" /> : <ChevronDown className="w-4 h-4 text-ivory-500" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-3.5 pt-0 text-xs text-ivory-400 space-y-2 border-t border-gold-500/10 leading-relaxed">
                    <p>
                      Every piece is nestled in aromatic cedar paper and placed inside our bespoke lacquered black walnut wooden presentation chest with a custom engraved brass seal.
                    </p>
                    <p>
                      <strong>Domestic Express (India):</strong> 3-5 business days via Blue Dart Apex White Glove courier. Fully insured transit with recipient signature verification.
                    </p>
                    <p>
                      <strong>Payment Options:</strong> Secured online cards/UPI/NetBanking via Razorpay, or Cash on Delivery.
                    </p>
                  </div>
                )}
              </div>

              {/* Tab 3: Garment Care */}
              <div className="border border-gold-500/20 rounded bg-obsidian-900/60 overflow-hidden">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  className="w-full p-3.5 text-left flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-ivory-100"
                >
                  <span>Atelier Care & Preservation</span>
                  {openAccordion === 'care' ? <ChevronUp className="w-4 h-4 text-gold-400" /> : <ChevronDown className="w-4 h-4 text-ivory-500" />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-3.5 pt-0 text-xs text-ivory-400 space-y-1.5 border-t border-gold-500/10">
                    {product.care.map((c, i) => (
                      <p key={i}>&bull; {c}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Size Guide Modal */}
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-obsidian-900 border border-gold-500/40 rounded-lg max-w-xl w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-ivory-400 hover:text-gold-400"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-2 text-gold-400 mb-2">
                <Crown className="w-5 h-5" />
                <h3 className="font-serif text-lg uppercase tracking-widest font-bold">
                  AL FAHA Sizing & Bespoke Guide
                </h3>
              </div>
              <p className="text-xs text-ivory-400 mb-6">
                Measurements are calibrated for classic ceremonial ease and regal vertical drape.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold-500/30 text-gold-400 font-serif uppercase tracking-wider">
                      <th className="py-2.5 px-3">Size (Gulf)</th>
                      <th className="py-2.5 px-3">Height (ft / cm)</th>
                      <th className="py-2.5 px-3">Chest (in)</th>
                      <th className="py-2.5 px-3">Sleeve Length (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-obsidian-800 text-ivory-300">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gold-300">54 (S)</td>
                      <td className="py-2.5 px-3">5&apos;4&quot; - 5&apos;6&quot; (165cm)</td>
                      <td className="py-2.5 px-3">38 - 40&quot;</td>
                      <td className="py-2.5 px-3">29.5&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gold-300">56 (M)</td>
                      <td className="py-2.5 px-3">5&apos;7&quot; - 5&apos;9&quot; (172cm)</td>
                      <td className="py-2.5 px-3">40 - 42&quot;</td>
                      <td className="py-2.5 px-3">30.5&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gold-300">58 (L)</td>
                      <td className="py-2.5 px-3">5&apos;10&quot; - 6&apos;0&quot; (180cm)</td>
                      <td className="py-2.5 px-3">42 - 44&quot;</td>
                      <td className="py-2.5 px-3">31.5&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gold-300">60 (XL)</td>
                      <td className="py-2.5 px-3">6&apos;1&quot; - 6&apos;3&quot; (188cm)</td>
                      <td className="py-2.5 px-3">44 - 46&quot;</td>
                      <td className="py-2.5 px-3">32.5&quot;</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-gold-300">Bespoke Custom</td>
                      <td className="py-2.5 px-3" colSpan={3}>
                        Master tailor consultation via WhatsApp or Atelier appointment
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-gold-500/20 text-center">
                <p className="text-xs text-ivory-400">
                  Unsure of exact proportions? Our concierge tailors will contact you upon order placement to verify sleeve and collar specifications.
                </p>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="mt-4 px-6 py-2 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest rounded"
                >
                  Confirm & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews & Testimonials Section */}
        <section className="mt-20 pt-12 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3
                  className="font-serif text-2xl uppercase tracking-widest font-bold text-ivory-100"
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  Patron Reviews & Acclaim
                </h3>
                <p className="text-xs text-ivory-400 mt-1">
                  Verified testimonials from patrons across Dubai, Abu Dhabi, Mumbai, and London.
                </p>
              </div>
            </div>

            {/* Write a Review Box */}
            <div className="bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 mb-10">
              <h4 className="font-serif text-xs uppercase tracking-widest font-bold text-gold-400 mb-3">
                Share Your Atelier Experience
              </h4>
              {reviewSubmitted ? (
                <p className="text-xs text-green-400">
                  Thank you. Your review has been added to the garment register.
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name / Title (e.g. Tariq Al-Mansoor)"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
                    />
                    <div className="flex items-center gap-2 bg-obsidian-950 border border-gold-500/30 rounded px-3 py-2 text-xs">
                      <span className="text-ivory-400">Rating:</span>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="bg-transparent text-gold-400 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value={5}>5 Stars - Flawless Haute Couture</option>
                        <option value={4}>4 Stars - Exceptional</option>
                        <option value={3}>3 Stars - Good</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the fabric feel, drape, sizing, and packaging..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-widest rounded"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-obsidian-900/60 border border-gold-500/20 rounded p-4 text-xs space-y-2 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ivory-100">{rev.userName}</span>
                      {rev.verified && (
                        <span className="text-[10px] bg-gold-500/10 text-gold-400 px-1.5 py-0.5 rounded border border-gold-500/30">
                          Verified Patron
                        </span>
                      )}
                    </div>
                    <div className="flex text-gold-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-ivory-300 italic font-serif leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}

              {/* Default Mock Review */}
              <div className="bg-obsidian-900/60 border border-gold-500/20 rounded p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ivory-100">H.E. Tariq Al-Falasi</span>
                    <span className="text-[10px] bg-gold-500/10 text-gold-400 px-1.5 py-0.5 rounded border border-gold-500/30">
                      Verified Patron
                    </span>
                  </div>
                  <div className="flex text-gold-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-gold-400" />
                    ))}
                  </div>
                </div>
                <p className="text-ivory-300 italic font-serif leading-relaxed">
                  &ldquo;The craftsmanship and drape surpassed my expectations. The Kasab gold bullion embroidery retains its brilliant sheen under ambient ballroom lighting. Unrivaled luxury packaging.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products / Curated Companions */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gold-500/20">
            <div className="text-center mb-12">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase block mb-1">
                Complementary Creations
              </span>
              <h2
                className="font-serif text-2xl sm:text-3xl text-ivory-100 uppercase tracking-widest font-bold"
                style={{ fontFamily: "'Cinzel', Georgia, serif" }}
              >
                Curated Atelier Companions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
