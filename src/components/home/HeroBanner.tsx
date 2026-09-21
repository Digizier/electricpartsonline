'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getHeroSlides } from '@/lib/db';
import { HeroSlide } from '@/types';
import { INITIAL_HERO } from '@/lib/mockData';
import { ChevronLeft, ChevronRight, ShieldCheck, Coins, Truck, Headphones } from 'lucide-react';

export function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_HERO);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const loadSlides = useCallback(async () => {
    try {
      const res = await getHeroSlides();
      if (res && res.length > 0) {
        const active = res.filter((s) => s.is_active !== false);
        setSlides(active.length > 0 ? active : res);
      }
    } catch (e) {
      console.warn('Error loading hero slides:', e);
    }
  }, []);

  useEffect(() => {
    loadSlides();
    window.addEventListener('epo_hero_updated', loadSlides);
    return () => window.removeEventListener('epo_hero_updated', loadSlides);
  }, [loadSlides]);

  // Auto-rotation every 3 seconds (3000ms) unless paused by hover or interaction
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  // Bound index safely if slides array changes
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 45) {
      // Swiped Left -> Next Slide
      goToNext();
    } else if (diff < -45) {
      // Swiped Right -> Previous Slide
      goToPrev();
    }

    touchStartXRef.current = null;
    setIsPaused(false);
  };

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <div className="bg-slate-950 pb-5">
      {/* Hero Banner Image Carousel */}
      <section
        className="relative w-full overflow-hidden select-none bg-slate-950 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Promotional Hero Banners"
      >
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[21/7] min-h-[190px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px] max-h-[520px]">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const linkHref = slide.cta_link && slide.cta_link.trim() ? slide.cta_link : '/products/';

            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Link
                  href={linkHref}
                  prefetch={false}
                  className="block w-full h-full relative"
                  tabIndex={isActive ? 0 : -1}
                >
                  <img
                    src={slide.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&q=85'}
                    alt={slide.title || 'Usman Traders Commercial Parts'}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle edge overlay for smooth integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10 pointer-events-none" />
                </Link>
              </div>
            );
          })}

          {/* Left Arrow Button */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 shadow-xl"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900/70 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-105 shadow-xl"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Bottom Pagination Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all rounded-full ${
                    idx === currentIndex
                      ? 'w-6 sm:w-7 h-2 bg-[#FF6A00]'
                      : 'w-2 h-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 Value Proposition Badges Underneath Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 sm:mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
          {/* Card 1: Genuine Parts */}
          <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3 sm:p-3.5 rounded-xl shadow flex items-center gap-2.5 sm:gap-3 border border-orange-400/30">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="leading-tight overflow-hidden">
              <div className="font-extrabold text-xs sm:text-sm text-white truncate">Genuine Parts</div>
              <div className="text-[10px] sm:text-xs text-orange-100 font-medium truncate">100% OEM Compatibility</div>
            </div>
          </div>

          {/* Card 2: Competitive Prices */}
          <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3 sm:p-3.5 rounded-xl shadow flex items-center gap-2.5 sm:gap-3 border border-orange-400/30">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div className="leading-tight overflow-hidden">
              <div className="font-extrabold text-xs sm:text-sm text-white truncate">Competitive Prices</div>
              <div className="text-[10px] sm:text-xs text-orange-100 font-medium truncate">Direct Wholesale Rates</div>
            </div>
          </div>

          {/* Card 3: Fast Shipping */}
          <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3 sm:p-3.5 rounded-xl shadow flex items-center gap-2.5 sm:gap-3 border border-orange-400/30">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="leading-tight overflow-hidden">
              <div className="font-extrabold text-xs sm:text-sm text-white truncate">Fast Shipping</div>
              <div className="text-[10px] sm:text-xs text-orange-100 font-medium truncate">Quick Daily Dispatch</div>
            </div>
          </div>

          {/* Card 4: Expert Support */}
          <div className="bg-gradient-to-r from-orange-600/90 to-amber-600/90 p-3 sm:p-3.5 rounded-xl shadow flex items-center gap-2.5 sm:gap-3 border border-orange-400/30">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/20 flex items-center justify-center text-white flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="leading-tight overflow-hidden">
              <div className="font-extrabold text-xs sm:text-sm text-white truncate">Expert Support</div>
              <div className="text-[10px] sm:text-xs text-orange-100 font-medium truncate">Dedicated Part Help</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
