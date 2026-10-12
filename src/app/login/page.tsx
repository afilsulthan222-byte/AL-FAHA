'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlFahaLogo } from '@/components/ui/AlFahaLogo';
import { Lock, Mail, ArrowRight, Shield, User, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (email.includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div className="bg-obsidian-950 min-h-screen text-ivory-100 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-obsidian-900 border border-gold-500/30 rounded-lg p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <AlFahaLogo size="md" />
          <h2 className="font-serif text-xl uppercase tracking-widest font-bold text-ivory-100 pt-2">
            Private Patron Sign In
          </h2>
          <p className="text-xs text-ivory-400">
            Access your orders, bespoke tailoring status, and atelier privileges.
          </p>
        </div>

        {/* Quick Demo Fill Pills for Testing */}
        <div className="p-3 bg-obsidian-950 border border-gold-500/20 rounded text-xs space-y-2">
          <p className="text-[11px] text-gold-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Instant Demo Access</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@alfaha.com', 'admin123')}
              className="flex-1 py-1.5 bg-obsidian-850 hover:bg-gold-500 hover:text-obsidian-950 text-gold-300 border border-gold-500/30 rounded text-[11px] font-semibold transition-colors"
            >
              Fill Royal Admin
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('tariq@alfaha.com', 'customer123')}
              className="flex-1 py-1.5 bg-obsidian-850 hover:bg-gold-500 hover:text-obsidian-950 text-ivory-200 border border-gold-500/30 rounded text-[11px] font-semibold transition-colors"
            >
              Fill Patron
            </button>
          </div>
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
              Confidential Email
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
              Secret Password
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
            <span>{loading ? 'Authenticating...' : 'Sign In to Atelier'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-gold-500/15 pt-4 text-center space-y-2 text-xs">
          <p className="text-ivory-400">
            Do not possess an atelier account yet?{' '}
            <Link href="/register" className="text-gold-400 hover:text-gold-200 font-bold underline underline-offset-4">
              Register Here
            </Link>
          </p>
          <Link href="/track" className="block text-[11px] text-ivory-500 hover:text-gold-400">
            Track Consignment without Signing In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
