'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Truck, CheckCircle2, Clock, X, Search, Mail, ExternalLink } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('tailoring');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('Blue Dart Apex White Glove');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const jwt = token || localStorage.getItem('alfaha_jwt_token');
      const res = await fetch('/api/orders', {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      });
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const openUpdateModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingNumber(ord.trackingNumber || `BLUEDART-ROYAL-${Math.floor(10000 + Math.random() * 90000)}`);
    setCourierName(ord.courierName || 'Blue Dart Apex White Glove');
    setStatusNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);

    const jwt = token || localStorage.getItem('alfaha_jwt_token');
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber,
          courierName,
          note: statusNote,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders(orders.map((o) => (o.id === selectedOrder.id ? data.order : o)));
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="font-serif text-2xl font-bold uppercase tracking-widest text-ivory-100"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Orders & Sovereign Dispatch Management
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Monitor atelier handcrafting progress, update order status, assign courier tracking numbers, and trigger notifications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            'All',
            'confirmed',
            'tailoring',
            'dispatched',
            'out_for_delivery',
            'delivered',
            'cancelled',
          ].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded text-xs uppercase font-medium tracking-wider whitespace-nowrap transition-colors ${
                filterStatus === st
                  ? 'bg-gold-500 text-obsidian-950 font-bold'
                  : 'bg-obsidian-950 text-ivory-400 hover:text-gold-300 border border-gold-500/20'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gold-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order # or patron..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 pl-9 pr-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
          />
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gold-500/20 text-gold-400 font-serif uppercase tracking-wider bg-obsidian-950/60">
                <th className="py-3 px-4">Order # & Date</th>
                <th className="py-3 px-4">Patron & Destination</th>
                <th className="py-3 px-4">Pieces</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Atelier Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800 text-ivory-300">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-obsidian-850/50">
                  <td className="py-3 px-4">
                    <p className="font-mono font-bold text-gold-400">{ord.orderNumber}</p>
                    <p className="text-[10px] text-ivory-500 mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        dateStyle: 'medium',
                      })}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-ivory-100">{ord.customerName}</p>
                    <p className="text-[10px] text-ivory-400">{ord.customerEmail}</p>
                    <p className="text-[10px] text-ivory-500 truncate max-w-xs">
                      {ord.shippingAddress.city}, {ord.shippingAddress.state}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-ivory-200">
                      {ord.items.length} items
                    </span>
                    <p className="text-[10px] text-ivory-500 truncate max-w-xs">
                      {ord.items.map((i) => i.productName).join(', ')}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-serif font-bold text-ivory-100">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </p>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold mt-0.5 ${
                        ord.paymentStatus === 'paid'
                          ? 'text-green-400 bg-green-500/10'
                          : 'text-amber-400 bg-amber-500/10'
                      }`}
                    >
                      {ord.paymentMethod.toUpperCase()} &bull; {ord.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-300 border border-gold-500/30">
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                    {ord.trackingNumber && (
                      <p className="font-mono text-[9px] text-ivory-400 mt-1 truncate max-w-xs">
                        Trk: {ord.trackingNumber}
                      </p>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openUpdateModal(ord)}
                      className="px-3 py-1.5 bg-obsidian-950 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 font-bold uppercase tracking-wider rounded transition-colors text-[11px]"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Update Status */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-obsidian-900 border border-gold-500/40 rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-ivory-400 hover:text-gold-400"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="font-serif text-lg uppercase tracking-widest font-bold text-gold-400 mb-2 border-b border-gold-500/20 pb-2">
              Update Order Status & Consignment
            </h3>

            <p className="text-xs text-ivory-300 mb-4">
              Order Reference: <strong className="text-gold-300 font-mono">{selectedOrder.orderNumber}</strong> &bull; Patron: {selectedOrder.customerName}
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                  New Order Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full bg-obsidian-950 border border-gold-500/40 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400 uppercase tracking-wider font-semibold"
                >
                  <option value="confirmed">Confirmed (Order Accepted)</option>
                  <option value="tailoring">Tailoring (In Atelier Hand-Crafting)</option>
                  <option value="dispatched">Dispatched (Handed to Sovereign Courier)</option>
                  <option value="out_for_delivery">Out for Delivery (White Glove Courier)</option>
                  <option value="delivered">Delivered (Handed to Patron)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                  Carrier / Courier Partner
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. Blue Dart Apex White Glove"
                  className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-ivory-300 uppercase tracking-wider block mb-1">
                  Consignment Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-ROYAL-78912"
                  className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-ivory-100 font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              {newStatus === 'dispatched' && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300 text-[11px] flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-purple-400" />
                  <span>
                    Saving as <strong>Dispatched</strong> will automatically trigger a dispatch notification email with this tracking reference to {selectedOrder.customerEmail}.
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gold-500/20">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-obsidian-700 text-ivory-400 rounded uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-gold-gradient text-obsidian-950 font-bold uppercase tracking-wider rounded shadow-gold-glow hover:scale-105 transition-transform"
                >
                  {updating ? 'Updating...' : 'Save & Notify Patron'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
