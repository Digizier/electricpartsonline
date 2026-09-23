'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoryGrid({ categories, isLoading = false }: CategoryGridProps) {
  const displayCategories = categories.length > 0 ? categories : [];

  return (
    <section id="shop-by-category" className="py-10 sm:py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference mockup */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Shop By Category
          </h2>

          <Link
            href="/products/"
            prefetch={false}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#FF6A00] hover:text-orange-700 transition-colors whitespace-nowrap flex-shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8-Card Responsive Skeleton or Real Data Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
              >
                <div className="relative w-full pt-[75%] bg-slate-200/70" />
                <div className="p-3.5 sm:p-4 bg-slate-200 flex items-center justify-between">
                  <div className="h-4 bg-slate-300 rounded w-28" />
                  <div className="w-5 h-5 bg-slate-300 rounded-full flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-500">No active categories found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/?category=${cat.id}`}
                prefetch={false}
                className="group flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200"
              >
                {/* Category Image Box */}
                <div className="relative w-full pt-[75%] bg-white p-4 overflow-hidden">
                  <img
                    src={cat.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Bottom Action Button */}
                <div className="p-3.5 sm:p-4 bg-slate-900 group-hover:bg-[#FF6A00] transition-colors flex items-center justify-between text-white">
                  <span className="font-black text-xs sm:text-sm md:text-base truncate">
                    {cat.name}
                  </span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1.5 transition-transform flex-shrink-0 ml-1.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
