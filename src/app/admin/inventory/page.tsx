'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Minus, AlertTriangle, Boxes, Check, Save } from 'lucide-react';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminInventoryPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
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
    }
    load();
  }, []);

  const handleStockChange = async (id: string, newStock: number) => {
    if (newStock < 0) return;
    setUpdatingId(id);
    const jwt = token || localStorage.getItem('alfaha_jwt_token');

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="font-serif text-2xl font-bold uppercase tracking-widest text-ivory-100"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Inventory & Stock Management
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Monitor and adjust available atelier stock across thobes, abayas, bishts, and fragrances.
        </p>
      </div>

      <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gold-500/20 text-gold-400 font-serif uppercase tracking-wider bg-obsidian-950/60">
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-center">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-ivory-300">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-obsidian-850/50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 border border-gold-500/20 bg-obsidian-950">
                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-ivory-100">{prod.name}</p>
                      <p className="font-arabic text-xs text-gold-400/90">{prod.arabicName}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-ivory-400">{prod.sku}</td>

                  <td className="py-3 px-4 text-ivory-300">{prod.category}</td>

                  <td className="py-3 px-4 font-serif font-bold text-gold-400">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4">
                    {prod.stock <= 5 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Critical: {prod.stock} Pieces</span>
                      </span>
                    ) : prod.stock <= 10 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low: {prod.stock} Pieces</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1 w-fit">
                        <Check className="w-3 h-3" />
                        <span>Available: {prod.stock} Pieces</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-obsidian-950 border border-gold-500/30 rounded p-1">
                      <button
                        onClick={() => handleStockChange(prod.id, prod.stock - 1)}
                        className="px-2 py-1 text-ivory-400 hover:text-gold-400 font-bold transition-colors"
                        title="Reduce Stock"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono font-bold text-ivory-100 min-w-[2.5rem]">
                        {updatingId === prod.id ? '...' : prod.stock}
                      </span>
                      <button
                        onClick={() => handleStockChange(prod.id, prod.stock + 1)}
                        className="px-2 py-1 text-ivory-400 hover:text-gold-400 font-bold transition-colors"
                        title="Increase Stock"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
