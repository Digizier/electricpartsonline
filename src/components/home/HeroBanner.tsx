'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getHeroSlides } from '@/lib/db';
import { HeroSlide } from '@/types';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSlides();
    window.addEventListener('epo_hero_updated', loadSlides);
    return () => window.removeEventListener('epo_hero_updated', loadSlides);
  }, [loadSlides]);

  // Auto-rotation every 3 seconds (3000ms) unless paused by hover or touch interaction
  useEffect(() => {
    if (slides.length <= 1 || isPaused || isLoading) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, isLoading]);

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

  // 1. Flash Loading Shimmer Skeleton (shown while fetching real Supabase slides)
  if (isLoading && slides.length === 0) {
    return (
      <div className="w-full relative overflow-hidden bg-slate-950 aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[1920/600] min-h-[190px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px]">
        <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Loading Banners...</span>
          </div>
        </div>
      </div>
    );
  }

  // If no slides exist at all
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative bg-slate-950">
      {/* 100% Full-Width Responsive Banner Carousel */}
      <section
        className="relative w-full overflow-hidden select-none bg-slate-950 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Promotional Hero Banners"
      >
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] lg:aspect-[1920/600] min-h-[190px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[420px]">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const linkHref = slide.cta_link && slide.cta_link.trim() ? slide.cta_link : '/products/';
            const buttonText = slide.cta_text && slide.cta_text.trim() ? slide.cta_text : 'Shop Now';

            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Full-image Clickable Link */}
                <Link
                  href={linkHref}
                  prefetch={false}
                  className="block w-full h-full relative cursor-pointer"
                  tabIndex={isActive ? 0 : -1}
                >
                  <img
                    src={slide.image_url}
                    alt={slide.title || 'Usman Traders Commercial Parts'}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle edge gradient for seamless blending */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                </Link>

                {/* Visible Prominent CTA Button on the Banner */}
                <div className="absolute bottom-4 sm:bottom-7 md:bottom-8 lg:bottom-10 left-4 sm:left-8 md:left-12 lg:left-16 z-20 pointer-events-auto">
                  <Link
                    href={linkHref}
                    prefetch={false}
                    className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-black text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-7 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-2xl shadow-black/60 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-0.5 border border-white/20"
                  >
                    <span>{buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Link>
                </div>
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
    </div>
  );
}
