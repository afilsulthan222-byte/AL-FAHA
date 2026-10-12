'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Truck, ShieldCheck, Clock } from 'lucide-react';

const MESSAGES = [
  {
    icon: Truck,
    text: 'Complimentary White Glove Royal Delivery Across India on Orders Above ₹10,000',
    linkText: 'Explore Atelier',
    link: '/shop',
  },
  {
    icon: Sparkles,
    text: 'New Season Unveiled: The Imperial Kasab & Desert Noir Collection',
    linkText: 'Discover Now',
    link: '/shop?collection=Royal+Heritage',
  },
  {
    icon: ShieldCheck,
    text: 'Bespoke Made-to-Measure Tailoring by Master Artisans in Dubai & Mumbai',
    linkText: 'Book Atelier',
    link: '/shop',
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = MESSAGES[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-obsidian-950 border-b border-gold-500/20 text-ivory-200 text-xs py-2 px-4 transition-all duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-gold-500/80 font-medium tracking-widest text-[11px] uppercase">
          <Clock className="w-3.5 h-3.5 text-gold-500" />
          <span>Concierge Available: +91 90000 11111</span>
        </div>

        <div className="flex-1 flex items-center justify-center gap-2 text-center overflow-hidden h-5">
          <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0 animate-pulse" />
          <span className="font-light tracking-wide text-ivory-100 truncate">
            {current.text}
          </span>
          <Link
            href={current.link}
            className="hidden sm:inline-block text-gold-400 hover:text-gold-200 underline underline-offset-4 ml-1.5 font-medium transition-colors shrink-0"
          >
            {current.linkText} &rarr;
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] tracking-widest uppercase text-ivory-400 font-medium">
          <span className="text-gold-500">INR (₹)</span>
          <span className="text-gold-500/30">|</span>
          <Link href="/track" className="hover:text-gold-300 transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};
