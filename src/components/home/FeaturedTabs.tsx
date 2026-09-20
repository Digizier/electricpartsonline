'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedTabsProps {
  products: Product[];
}

export function FeaturedTabs({ products }: FeaturedTabsProps) {
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

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

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
