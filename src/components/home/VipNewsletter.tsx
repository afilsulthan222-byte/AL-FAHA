'use client';

import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';

export const VipNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-obsidian-950 border-t border-gold-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-radial opacity-60" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 text-gold-400 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Private Membership Invitation</span>
        </div>

        <h2
          className="font-serif text-3xl sm:text-4xl text-ivory-100 uppercase tracking-widest font-bold"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          Enter The Royal Circle
        </h2>

        <p className="text-xs sm:text-sm text-ivory-400 max-w-xl mx-auto mt-3 font-light leading-relaxed">
          Receive confidential previews of upcoming seasonal drops, bespoke atelier trunk showings, and an exclusive <strong className="text-gold-400 font-semibold">₹2,500 privilege voucher</strong> on your inaugural couture acquisition.
        </p>

        {submitted ? (
          <div className="mt-8 p-4 bg-gold-500/10 border border-gold-500/40 rounded-lg max-w-md mx-auto text-gold-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-semibold animate-fadeIn">
            <Check className="w-4 h-4 text-green-400" />
            <span>Welcome to the Royal Circle. Your private privilege code: ROYAL10</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-gold-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                placeholder="Enter your confidential email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-900 border border-gold-500/30 rounded py-3 pl-11 pr-4 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.2em] rounded shadow-gold-glow hover:scale-105 transition-transform shrink-0"
            >
              Request Access
            </button>
          </form>
        )}

        <p className="text-[11px] text-ivory-500 mt-4">
          Strictly confidential. No spam. You may withdraw membership at any moment.
        </p>
      </div>
    </section>
  );
};
