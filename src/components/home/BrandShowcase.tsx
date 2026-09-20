'use client';

import React from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { ArrowRight } from 'lucide-react';

interface BrandShowcaseProps {
  brands: Brand[];
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  const displayBrands = brands.length > 0 ? brands : [];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Shop By Brand
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Authorized replacement components for leading commercial manufacturers
            </p>
          </div>

          <Link
            href="/products/"
            prefetch={false}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#FF6A00] hover:text-orange-700 transition-colors"
          >
            <span>View All Brands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand Logos Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {displayBrands.slice(0, 7).map((b) => (
            <Link
              key={b.id}
              href={`/products/?brand=${b.id}`}
              prefetch={false}
              className="flex items-center justify-center p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all text-center group min-h-[80px]"
            >
              <span className="text-sm font-black text-slate-800 group-hover:text-[#FF6A00] tracking-wider uppercase">
                {b.name}
              </span>
            </Link>
          ))}

          {/* "Others" Card */}
          <Link
            href="/products/"
            prefetch={false}
            className="flex items-center justify-center p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-orange-400 hover:shadow-md transition-all text-center group min-h-[80px]"
          >
            <span className="text-xs font-bold text-slate-500 group-hover:text-[#FF6A00]">
              Others
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
