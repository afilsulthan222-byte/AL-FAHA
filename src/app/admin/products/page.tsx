'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, X, Check, Shirt, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES: ProductCategory[] = [
  'Royal Thobes',
  'Haute Couture Abayas',
  'Embroidered Bishts',
  'Silk Caftans',
  'Velvet Evening Wear',
  'Fragrances & Accessories',
];

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    subtitle: '',
    description: '',
    category: 'Embroidered Bishts' as ProductCategory,
    collection: 'Royal Heritage' as 'Royal Heritage' | 'Desert Noir' | 'Velvet Mirage' | 'Golden Oasis',
    price: 35000,
    compareAtPrice: 42000,
    stock: 10,
    sku: '',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
    fabric: 'Pure Superfine Wool & Kasab Gold Embroidery',
    sizes: '54, 56, 58, 60, Bespoke',
    colors: 'Obsidian Black & Gold, Desert Sand',
    isFeatured: true,
    isExclusive: true,
    isNew: false,
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      arabicName: '',
      subtitle: '',
      description: '',
      category: 'Embroidered Bishts',
      collection: 'Royal Heritage',
      price: 35000,
      compareAtPrice: 42000,
      stock: 10,
      sku: `ALF-${Date.now().toString().slice(-4)}`,
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
      fabric: 'Pure Superfine Wool & Kasab Gold Embroidery',
      sizes: '54, 56, 58, 60, Bespoke',
      colors: 'Obsidian Black & Gold, Desert Sand',
      isFeatured: true,
      isExclusive: true,
      isNew: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      arabicName: p.arabicName,
      subtitle: p.subtitle,
      description: p.description,
      category: p.category,
      collection: p.collection,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      stock: p.stock,
      sku: p.sku,
      imageUrl: p.images[0] || '',
      fabric: p.fabric,
      sizes: p.sizes.join(', '),
      colors: p.colors.map((c) => c.name).join(', '),
      isFeatured: !!p.isFeatured,
      isExclusive: !!p.isExclusive,
      isNew: !!p.isNew,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this piece from the atelier catalog?')) return;
    const jwt = token || localStorage.getItem('alfaha_jwt_token');
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    });
    const data = await res.json();
    if (data.success) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jwt = token || localStorage.getItem('alfaha_jwt_token');

    const payload = {
      name: formData.name,
      arabicName: formData.arabicName || 'تصميم كوتور فاخر',
      subtitle: formData.subtitle,
      description: formData.description,
      category: formData.category,
      collection: formData.collection,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice) || undefined,
      stock: Number(formData.stock),
      sku: formData.sku || `ALF-${Date.now().toString().slice(-4)}`,
      fabric: formData.fabric,
      images: [formData.imageUrl],
      sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((c) => ({ name: c.trim(), hex: '#D4AF37' })).filter((c) => c.name),
      care: ['Professional dry clean only', 'Keep in cedar garment bag'],
      details: ['Handcrafted in Dubai & Milan', 'AL FAHA Atelier Certificate of Authenticity'],
      isFeatured: formData.isFeatured,
      isExclusive: formData.isExclusive,
      isNew: formData.isNew,
    };

    if (editingProduct) {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? data.product : p)));
        setModalOpen(false);
      }
    } else {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProducts([data.product, ...products]);
        setModalOpen(false);
      }
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-serif text-2xl font-bold uppercase tracking-widest text-ivory-100"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Couture Product Catalog ({products.length})
          </h1>
          <p className="text-xs text-ivory-400 mt-1">
            Manage royal garments, pricing in INR, textile specifications, and inventory.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-gold-gradient text-obsidian-950 font-bold text-xs uppercase tracking-wider rounded shadow-gold-glow hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-gold-500 shrink-0" />
        <input
          type="text"
          placeholder="Search by garment title, category, or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-ivory-500 hover:text-ivory-200">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gold-500/20 text-gold-400 font-serif uppercase tracking-wider bg-obsidian-950/60">
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (INR)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-ivory-300">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-obsidian-850/50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded overflow-hidden shrink-0 border border-gold-500/20 bg-obsidian-950">
                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-ivory-100">{prod.name}</p>
                      <p className="font-arabic text-xs text-gold-400/90">{prod.arabicName}</p>
                      <p className="font-mono text-[10px] text-ivory-500">{prod.sku}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-ivory-300">{prod.category}</td>

                  <td className="py-3 px-4 font-serif font-bold text-gold-400">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.stock <= 5
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-green-500/10 text-green-400 border border-green-500/30'
                      }`}
                    >
                      {prod.stock} Pieces
                    </span>
                  </td>

                  <td className="py-3 px-4 space-x-1">
                    {prod.isExclusive && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        Exclusive
                      </span>
                    )}
                    {prod.isNew && (
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        New
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-1.5 text-ivory-300 hover:text-gold-400 rounded transition-colors"
                      title="Edit Piece"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 text-ivory-300 hover:text-red-400 rounded transition-colors"
                      title="Delete Piece"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add / Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-obsidian-900 border border-gold-500/40 rounded-lg max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-ivory-400 hover:text-gold-400"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-lg uppercase tracking-widest font-bold text-gold-400 mb-6 border-b border-gold-500/20 pb-3">
              {editingProduct ? 'Edit Atelier Creation' : 'Register New Couture Piece'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Bisht in Camel Wool"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Arabic Calligraphy Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.arabicName}
                    onChange={(e) => setFormData({ ...formData, arabicName: e.target.value })}
                    placeholder="بشت ملكي فاخر"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 font-arabic text-sm focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Collection *
                  </label>
                  <select
                    value={formData.collection}
                    onChange={(e: any) => setFormData({ ...formData, collection: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  >
                    <option value="Royal Heritage">Royal Heritage</option>
                    <option value="Desert Noir">Desert Noir</option>
                    <option value="Velvet Mirage">Velvet Mirage</option>
                    <option value="Golden Oasis">Golden Oasis</option>
                  </select>
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Compare-At Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, compareAtPrice: Number(e.target.value) })
                    }
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Initial Stock Count *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    SKU Identifier
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    High-Resolution Editorial Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Textile & Fabric Origin
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Available Sizing (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                    Artisanal Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-gold-500"
                  />
                  <span>Featured Masterpiece</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isExclusive}
                    onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
                    className="accent-gold-500"
                  />
                  <span>Atelier Exclusive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-gold-500"
                  />
                  <span>New Season Drop</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gold-500/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-obsidian-700 text-ivory-400 rounded uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gold-gradient text-obsidian-950 font-bold uppercase tracking-wider rounded shadow-gold-glow hover:scale-105 transition-transform"
                >
                  Save Piece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
