'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlFahaLogo } from '@/components/ui/AlFahaLogo';
import { User, Lock, Mail, Phone, ArrowRight, AlertCircle, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setErrorMsg(res.message || 'Registration failed');
    }
  };

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-obsidian-900 border border-gold-500/30 rounded-lg p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <AlFahaLogo size="md" />
          <h2 className="font-serif text-xl uppercase tracking-widest font-bold text-ivory-100 pt-2">
            Join The Royal Circle
          </h2>
          <p className="text-xs text-ivory-400">
            Create your confidential account to receive bespoke tailoring and order tracking.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/40 rounded text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gold-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fatima Al-Sayed"
                className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2.5 pl-10 pr-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
              Confidential Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@domain.com"
                className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2.5 pl-10 pr-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
              Contact Phone / WhatsApp
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gold-500 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99887 65432"
                className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2.5 pl-10 pr-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-ivory-300 uppercase tracking-wider block mb-1">
              Password (Min. 6 Characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full bg-obsidian-950 border border-gold-500/30 rounded py-2.5 pl-10 pr-3 text-xs text-ivory-100 placeholder-ivory-500 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold-gradient text-obsidian-950 font-serif font-bold text-xs uppercase tracking-[0.25em] rounded shadow-gold-glow hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Registering...' : 'Create Royal Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-gold-500/15 pt-4 text-center text-xs text-ivory-400">
          Already a registered patron?{' '}
          <Link href="/login" className="text-gold-400 hover:text-gold-200 font-bold underline underline-offset-4">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
