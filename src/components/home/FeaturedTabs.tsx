'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedTabsProps {
  products: Product[];
  isLoading?: boolean;
}

export function FeaturedTabs({ products, isLoading = false }: FeaturedTabsProps) {
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'new' | 'top'>('bestsellers');

  const filteredProducts = useMemo(() => {
    if (activeTab === 'bestsellers') {
      return products.filter((p) => p.is_bestseller).slice(0, 6);
    }
    if (activeTab === 'new') {
      return products.filter((p) => p.is_new_arrival).slice(0, 6);
    }
    return products.filter((p) => p.is_top_rated).slice(0, 6);
  }, [products, activeTab]);

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Top requested OEM replacement parts in stock and ready to ship
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs Filter Bar */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('bestsellers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-colors ${
                  activeTab === 'bestsellers'
                    ? 'bg-[#FF6A00] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-colors ${
                  activeTab === 'new'
                    ? 'bg-[#FF6A00] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Arrivals
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('top')}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-colors ${
                  activeTab === 'top'
                    ? 'bg-[#FF6A00] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Top Rated
              </button>
            </div>

            <Link
              href="/products/"
              prefetch={false}
              className="hidden sm:flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#FF6A00] hover:text-orange-700 ml-2"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards Shimmer Skeleton or Real Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 flex flex-col justify-between animate-pulse space-y-3"
              >
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="h-5 bg-slate-200 rounded w-20" />
                  <div className="w-8 h-8 rounded-lg bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-500">No active parts in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/products/"
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6A00] hover:text-orange-700"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
