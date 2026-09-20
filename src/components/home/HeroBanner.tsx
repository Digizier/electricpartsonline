'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getHeroSlides } from '@/lib/db';
import { HeroSlide } from '@/types';
import { ArrowRight, ShieldCheck, Coins, Truck, Headphones } from 'lucide-react';

export function HeroBanner() {
  const [slide, setSlide] = useState<HeroSlide | null>(null);

  const loadSlide = async () => {
    const slides = await getHeroSlides();
    if (slides && slides.length > 0) {
      const active = slides.find((s) => s.is_active) || slides[0];
      setSlide(active);
    }
  };

  useEffect(() => {
    loadSlide();
    window.addEventListener('epo_hero_updated', loadSlide);
    return () => window.removeEventListener('epo_hero_updated', loadSlide);
  }, []);

  const badgeText = slide?.badge_text || 'YOUR TRUSTED SOURCE FOR';
  const title = slide?.title || 'Quality Commercial Equipment Parts';
  const subtitle = slide?.subtitle || 'Electrical | Plumbing | Hardware | Kitchen Equipment Parts';
  const imageUrl = slide?.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80';
  const ctaText = slide?.cta_text || 'Shop Parts';
  const ctaLink = slide?.cta_link || '/products/';

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="Commercial Kitchen Parts"
          className="w-full h-full object-cover object-center opacity-25 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black tracking-wider uppercase">
              {badgeText}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight whitespace-pre-line">
              {title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-medium max-w-2xl">
              {subtitle}
            </p>

            {/* Action Buttons matching Homa Page mockup */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href={ctaLink}
                prefetch={false}
                className="min-h-[48px] px-8 py-3.5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-black text-sm sm:text-base rounded-full shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#shop-by-category"
                className="min-h-[48px] px-8 py-3.5 bg-slate-900/40 hover:bg-white/10 border-2 border-white/70 hover:border-white text-white font-extrabold text-sm sm:text-base rounded-full transition-all flex items-center justify-center"
              >
                View Categories
              </a>
            </div>
          </div>

          {/* Right Value Propositions Pillar */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-3">
            {/* Card 1: Genuine Parts */}
            <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3.5 sm:p-4 rounded-xl shadow-md flex items-center gap-3 backdrop-blur-sm border border-orange-400/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm text-white">Genuine Parts</div>
                <div className="text-[11px] text-orange-100 font-medium">100% OEM Compatibility</div>
              </div>
            </div>

            {/* Card 2: Competitive Prices (Currency-neutral Coins icon) */}
            <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3.5 sm:p-4 rounded-xl shadow-md flex items-center gap-3 backdrop-blur-sm border border-orange-400/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm text-white">Competitive Prices</div>
                <div className="text-[11px] text-orange-100 font-medium">Direct Wholesale Value</div>
              </div>
            </div>

            {/* Card 3: Fast Shipping */}
            <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3.5 sm:p-4 rounded-xl shadow-md flex items-center gap-3 backdrop-blur-sm border border-orange-400/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm text-white">Fast Shipping</div>
                <div className="text-[11px] text-orange-100 font-medium">Quick Daily Dispatch</div>
              </div>
            </div>

            {/* Card 4: Expert Support */}
            <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3.5 sm:p-4 rounded-xl shadow-md flex items-center gap-3 backdrop-blur-sm border border-orange-400/20">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-sm text-white">Expert Support</div>
                <div className="text-[11px] text-orange-100 font-medium">Dedicated Part Specialists</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

