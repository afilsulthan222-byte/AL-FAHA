'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  Sparkles,
  Lock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();

  // Address form
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    giftNote: '',
  });

  // Shipping & Payment selection
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'white_glove'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const whiteGloveExtra = shippingMethod === 'white_glove' ? 500 : 0;
  const finalTotal = total + whiteGloveExtra;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      setErrorMessage('Please complete all required residence and contact fields.');
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Handle Payment
      if (paymentMethod === 'razorpay') {
        // Initiate Razorpay Order from backend
        const orderRes = await fetch('/api/payments/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            receipt: `rcpt_${Date.now()}`,
          }),
        });

        const orderData = await orderRes.json();
        if (!orderData.success) {
          throw new Error(orderData.message || 'Payment initiation failed');
        }

        const { id: razorpayOrderId, key: razorpayKey, isSandboxSimulated } = orderData.order;

        // Check if Razorpay script is available in window
        if (typeof window !== 'undefined' && window.Razorpay && !isSandboxSimulated) {
          const options = {
            key: razorpayKey,
            amount: Math.round(finalTotal * 100),
            currency: 'INR',
            name: 'AL FAHA Haute Couture',
            description: `Order settlement (${cart.length} creations)`,
            image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200&auto=format&fit=crop',
            order_id: razorpayOrderId,
            handler: async function (response: any) {
              await verifyAndCompleteOrder({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
            },
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#D4AF37',
            },
            modal: {
              ondismiss: function () {
                setProcessing(false);
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        } else {
          // Instant Sandbox Verification mode
          await verifyAndCompleteOrder({
            razorpayOrderId,
            razorpayPaymentId: `pay_sim_${Date.now()}`,
            razorpaySignature: 'simulated_signature_valid',
          });
          return;
        }
      } else {
        // Cash on Delivery direct order
        await createOrderRecord({
          paymentMethod: 'cod',
          paymentStatus: 'pending',
        });
      }
    } catch (err: any) {
      console.error('Order placement error:', err);
      setErrorMessage(err.message || 'Failed to process transaction. Please try again.');
      setProcessing(false);
    }
  };

  const verifyAndCompleteOrder = async ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    // Verify signature on server
    const verifyRes = await fetch('/api/payments/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      throw new Error('Payment cryptographic signature verification failed.');
    }

    await createOrderRecord({
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId,
      razorpayPaymentId,
    });
  };

  const createOrderRecord = async (paymentDetails: {
    paymentMethod: 'razorpay' | 'cod';
    paymentStatus: 'paid' | 'pending';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  }) => {
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      arabicName: item.product.arabicName,
      image: item.product.images[0],
      size: item.selectedSize,
      color: item.selectedColor,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
    }));

    const token = typeof window !== 'undefined' ? localStorage.getItem('alfaha_jwt_token') : null;

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
        items: orderItems,
        subtotal,
        shippingFee: shippingFee + whiteGloveExtra,
        discount,
        couponCode: appliedCoupon?.code,
        total: finalTotal,
        paymentMethod: paymentDetails.paymentMethod,
        paymentStatus: paymentDetails.paymentStatus,
        razorpayOrderId: paymentDetails.razorpayOrderId,
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        giftNote: formData.giftNote,
      }),
    });

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Could not record order');
    }

    clearCart();
    router.push(`/order-success/${data.order.orderNumber}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-obsidian-950 flex flex-col items-center justify-center text-center p-6 text-ivory-100">
        <h2 className="font-serif text-2xl uppercase tracking-widest font-bold">
          Your Haute Bag is Empty
        </h2>
        <p className="text-xs text-ivory-400 mt-2 max-w-sm">
          Select pieces from our royal collections to complete checkout.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-8 py-3.5 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-widest rounded"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Sovereign Gateway</span>
          </div>
          <h1
            className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
            style={{ fontFamily: "'Cinzel', Georgia, serif" }}
          >
            Sovereign Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/40 rounded-lg max-w-4xl mx-auto text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details, Shipping & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Patron & Residence Details */}
            <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl space-y-4">
              <h3 className="font-serif text-sm uppercase tracking-widest font-bold text-gold-400 border-b border-gold-500/15 pb-2">
                1. Patron Contact & Delivery Residence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sheikh Tariq Al-Mansoor"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Phone (with WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98201 54321"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Confidential Email (for Order & Dispatch Tracking) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="patron@domain.com"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Street Address & Suite / Villa *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="Villa 14, Royal Palm Residences"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Landmark / Locality (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Altamount Road, Cumballa Hill"
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Postal / PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2 px-3 text-xs text-ivory-100 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full bg-obsidian-950/60 border border-gold-500/20 rounded py-2 px-3 text-xs text-ivory-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 2. White Glove Delivery Preference */}
            <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl space-y-4">
              <h3 className="font-serif text-sm uppercase tracking-widest font-bold text-gold-400 border-b border-gold-500/15 pb-2">
                2. Shipping & Courier Tier
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-gold-400 bg-gold-500/10'
                      : 'border-obsidian-800 bg-obsidian-950 hover:border-gold-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-ivory-100">
                        Blue Dart Apex Sovereign Express (3-5 Days)
                      </p>
                      <p className="text-[11px] text-ivory-400 mt-0.5">
                        Insured tamper-evident security courier with direct recipient OTP handover.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gold-400 shrink-0">
                    {shippingFee === 0 ? 'COMPLIMENTARY' : `₹${shippingFee}`}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('white_glove')}
                  className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    shippingMethod === 'white_glove'
                      ? 'border-gold-400 bg-gold-500/10'
                      : 'border-obsidian-800 bg-obsidian-950 hover:border-gold-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-ivory-100">
                        White Glove Royal Courier & Walnut Keepsake Chest (+₹500)
                      </p>
                      <p className="text-[11px] text-ivory-400 mt-0.5">
                        Hand-delivered by uniformed courier in our bespoke lacquered black walnut chest with engraved brass seal.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gold-400 shrink-0">
                    ₹{shippingFee + 500}
                  </span>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-obsidian-900 border border-gold-500/20 rounded-lg p-6 shadow-xl space-y-4">
              <h3 className="font-serif text-sm uppercase tracking-widest font-bold text-gold-400 border-b border-gold-500/15 pb-2">
                3. Payment Method (INR Pricing)
              </h3>

              <div className="space-y-3">
                {/* Razorpay Online */}
                <label
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-gold-400 bg-gold-500/10'
                      : 'border-obsidian-800 bg-obsidian-950 hover:border-gold-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-ivory-100 flex items-center gap-2">
                        <span>Razorpay Secured Online Payment</span>
                        <span className="text-[10px] bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded font-mono">
                          Recommended
                        </span>
                      </p>
                      <p className="text-[11px] text-ivory-400 mt-0.5">
                        Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), NetBanking & Sovereign Wallets.
                      </p>
                    </div>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      paymentMethod === 'razorpay' ? 'text-gold-400' : 'text-obsidian-800'
                    }`}
                  />
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-gold-400 bg-gold-500/10'
                      : 'border-obsidian-800 bg-obsidian-950 hover:border-gold-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-bold text-ivory-100">
                        Cash on Delivery (Doorstep Settlement)
                      </p>
                      <p className="text-[11px] text-ivory-400 mt-0.5">
                        Pay via Cash or doorstep UPI upon in-person handover. Verification SMS sent upon order placement.
                      </p>
                    </div>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      paymentMethod === 'cod' ? 'text-gold-400' : 'text-obsidian-800'
                    }`}
                  />
                </label>
              </div>

              {/* Security notice */}
              <div className="flex items-center gap-2 text-[11px] text-ivory-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0" />
                <span>
                  Payments encrypted with end-to-end TLS. Payment secrets are never exposed on client code.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-obsidian-900 border border-gold-500/30 rounded-lg p-6 shadow-2xl space-y-6 sticky top-28">
              <h3 className="font-serif text-sm uppercase tracking-widest font-bold text-gold-400 border-b border-gold-500/20 pb-3">
                Creations in Consignment ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h3>

              {/* Items list preview */}
              <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-obsidian-800 pr-1">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-16 rounded bg-obsidian-950 overflow-hidden shrink-0 border border-gold-500/20">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-ivory-100 line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-ivory-400">
                          {item.selectedSize} &bull; {item.selectedColor} &bull; Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gold-400 shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="border-t border-gold-500/20 pt-4 space-y-2 text-xs text-ivory-300">
                <div className="flex justify-between">
                  <span>Atelier Subtotal</span>
                  <span className="text-ivory-100 font-semibold">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Privilege Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>White Glove Delivery</span>
                  <span className="text-ivory-100">
                    {shippingFee === 0 && whiteGloveExtra === 0 ? (
                      <span className="text-gold-400 font-semibold">COMPLIMENTARY</span>
                    ) : (
                      `₹${shippingFee + whiteGloveExtra}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-gold-500/30 text-base font-bold">
                  <span className="font-serif uppercase text-ivory-100">Grand Investment</span>
                  <span className="font-serif text-2xl text-gold-400">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow hover:shadow-gold-glow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {processing ? (
                  <span>Securing Royal Order...</span>
                ) : (
                  <>
                    <span>Confirm Sovereign Order &bull; ₹{finalTotal.toLocaleString('en-IN')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-ivory-500 space-y-1">
                <p>By placing this order, you authorize bespoke atelier crafting.</p>
                <p>Automated luxury confirmation dispatch email will be issued instantly.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
