'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Category, Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Layers, Package, Tag, ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  products?: Product[];
  isLoading?: boolean;
}

export function CategoryGrid({
  categories,
  products = [],
  isLoading = false,
}: CategoryGridProps) {
  const displayCategories = categories.length > 0 ? categories : [];
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (catId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCatId(catId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCatId(null);
    }, 180);
  };

  return (
    <section id="shop-by-category" className="py-10 sm:py-16 bg-white scroll-mt-20 relative overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 hidden sm:block">
              Hover over any category to preview subcategories and popular replacement parts
            </p>
          </div>

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
            {displayCategories.map((cat, idx) => {
              const isRightCol = idx % 4 >= 2;
              const subcategories = cat.subcategories || [];
              const categoryProducts = products
                .filter((p) => p.category_id === cat.id)
                .slice(0, 3);
              const isHovered = hoveredCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="relative group/card"
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Category Main Card Link */}
                  <Link
                    href={`/products/?category=${cat.id}`}
                    prefetch={false}
                    className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-400 transition-all duration-200 h-full"
                  >
                    {/* Category Image Box */}
                    <div className="relative w-full pt-[75%] bg-white p-4 overflow-hidden">
                      <img
                        src={cat.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'}
                        alt={cat.name}
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover/card:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Bottom Action Button */}
                    <div className="p-3.5 sm:p-4 bg-slate-900 group-hover/card:bg-[#FF6A00] transition-colors flex items-center justify-between text-white">
                      <span className="font-black text-xs sm:text-sm md:text-base truncate">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/card:translate-x-1.5 transition-transform flex-shrink-0 ml-1.5" />
                    </div>
                  </Link>

                  {/* Desktop Hover Dropdown Menu */}
                  {isHovered && (
                    <div
                      onMouseEnter={() => handleMouseEnter(cat.id)}
                      onMouseLeave={handleMouseLeave}
                      className={`hidden lg:block absolute top-[calc(100%+6px)] z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-orange-200/90 p-4 transition-all duration-200 animate-in fade-in zoom-in-95 ${
                        isRightCol ? 'right-0' : 'left-0'
                      }`}
                    >
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-orange-100 text-[#FF6A00] flex items-center justify-center font-bold text-xs">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <h4 className="text-sm font-black text-slate-900 truncate">
                            {cat.name}
                          </h4>
                        </div>
                        <Link
                          href={`/products/?category=${cat.id}`}
                          prefetch={false}
                          className="text-[11px] font-extrabold text-[#FF6A00] hover:text-orange-700 flex items-center gap-0.5"
                        >
                          <span>View All</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* 1. Sub-Categories Section */}
                      {subcategories.length > 0 && (
                        <div className="mt-2.5">
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#FF6A00]" />
                            <span>Sub-Categories ({subcategories.length})</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                            {subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/products/?category=${cat.id}&sub=${sub.id}`}
                                prefetch={false}
                                className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#FF6A00] border border-slate-200 hover:border-orange-300 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. Popular Replacement Parts Section */}
                      {categoryProducts.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Package className="w-3 h-3 text-[#FF6A00]" />
                            <span>Popular Parts</span>
                          </div>
                          <div className="space-y-1.5">
                            {categoryProducts.map((prod) => (
                              <Link
                                key={prod.id}
                                href={`/product/?slug=${prod.slug}`}
                                prefetch={false}
                                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-orange-50/70 group/item transition-colors border border-transparent hover:border-orange-200"
                              >
                                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={prod.thumbnail_url || prod.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&q=80'}
                                    alt={prod.name}
                                    className="w-full h-full object-contain"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-slate-900 group-hover/item:text-[#FF6A00] truncate transition-colors">
                                    {prod.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono truncate">
                                    Part #: {prod.part_number}
                                  </div>
                                </div>
                                <div className="text-xs font-black text-slate-950 flex-shrink-0">
                                  {formatCurrency(prod.price)}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fallback description if no subcategories or products yet */}
                      {subcategories.length === 0 && categoryProducts.length === 0 && (
                        <div className="py-2 text-center text-xs text-slate-500">
                          OEM replacement parts and direct components for {cat.name}.
                        </div>
                      )}

                      {/* Bottom Button */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <Link
                          href={`/products/?category=${cat.id}`}
                          prefetch={false}
                          className="w-full py-2 bg-slate-900 hover:bg-[#FF6A00] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>Explore All {cat.name}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
