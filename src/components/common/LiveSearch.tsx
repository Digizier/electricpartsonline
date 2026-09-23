'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts, getCategories, getBrands } from '@/lib/db';
import { Product, Category, Brand } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Search, X, Package, Tag, Layers, ArrowRight, Loader2 } from 'lucide-react';

interface LiveSearchProps {
  placeholder?: string;
  isMobile?: boolean;
}

export function LiveSearch({
  placeholder = 'Search for parts, brands, model numbers...',
  isMobile = false,
}: LiveSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy load search dataset once on first interaction
  const loadSearchData = async () => {
    if (isDataLoaded) return;
    try {
      const [prods, cats, brs] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands(),
      ]);
      setAllProducts(prods || []);
      setAllCategories(cats || []);
      setAllBrands(brs || []);
      setIsDataLoaded(true);
    } catch (e) {
      console.warn('Error pre-loading search dataset:', e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Forgiving / Fuzzy tokenized search matching
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) {
      return { products: [], brands: [], categories: [], totalCount: 0 };
    }

    const tokens = trimmed.split(/\s+/).filter(Boolean);

    // 1. Match Products
    const matchedProducts = allProducts.filter((p) => {
      const searchableText = `${p.name} ${p.part_number} ${p.oem_number || ''} ${p.description || ''} ${
        p.compatibility?.join(' ') || ''
      }`.toLowerCase();
      return tokens.every((token) => searchableText.includes(token));
    });

    // 2. Match Brands
    const matchedBrands = allBrands.filter((b) => {
      const searchableText = `${b.name} ${b.slug || ''}`.toLowerCase();
      return tokens.every((token) => searchableText.includes(token));
    });

    // 3. Match Categories & Subcategories
    const matchedCategories: { id: string; name: string; isSub?: boolean; parentName?: string; subId?: string }[] = [];
    allCategories.forEach((cat) => {
      const catText = `${cat.name} ${cat.description || ''}`.toLowerCase();
      if (tokens.every((token) => catText.includes(token))) {
        matchedCategories.push({ id: cat.id, name: cat.name });
      }

      // Check subcategories
      if (cat.subcategories && cat.subcategories.length > 0) {
        cat.subcategories.forEach((sub) => {
          const subText = `${sub.name} ${sub.description || ''}`.toLowerCase();
          if (tokens.every((token) => subText.includes(token))) {
            matchedCategories.push({
              id: cat.id,
              name: sub.name,
              isSub: true,
              parentName: cat.name,
              subId: sub.id,
            });
          }
        });
      }
    });

    const totalCount =
      matchedProducts.length + matchedBrands.length + matchedCategories.length;

    return {
      products: matchedProducts.slice(0, 5),
      brands: matchedBrands.slice(0, 3),
      categories: matchedCategories.slice(0, 4),
      totalCount,
    };
  }, [query, allProducts, allBrands, allCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/products/?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectResult = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onFocus={() => {
            loadSearchData();
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          className={`w-full bg-white text-slate-900 placeholder-slate-400 pl-4 pr-16 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6A00] shadow-inner transition-all ${
            isMobile ? 'py-2 text-xs' : 'py-2.5 text-sm'
          } ${isOpen ? 'ring-2 ring-[#FF6A00] rounded-b-none' : ''}`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-12 text-slate-400 hover:text-slate-600 p-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="submit"
          className={`absolute right-1 top-1 bottom-1 px-3 sm:px-4 bg-[#FF6A00] hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition-colors ${
            isMobile ? 'px-2.5' : 'px-4'
          }`}
          aria-label="Search"
        >
          <Search className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      </form>

      {/* Floating Live Predictive Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full bg-white text-slate-900 border border-slate-200 border-t-0 rounded-b-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-150">
          {searchResults.totalCount === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                No matching parts found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try checking the part number, model, or searching for broader terms like fryer, valve, timer, or motor.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-3">
              {/* 1. Matching Products Section */}
              {searchResults.products.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>Products ({searchResults.products.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {searchResults.products.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectResult(`/product/?slug=${prod.slug}`)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/70 cursor-pointer transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="w-11 h-11 bg-white border border-slate-200 rounded-lg p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              prod.thumbnail_url ||
                              prod.images?.[0] ||
                              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&q=80'
                            }
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>

                        {/* Title & Part # */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#FF6A00] truncate transition-colors">
                            {prod.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            Part #: <span className="font-bold text-slate-700">{prod.part_number}</span>
                            {prod.oem_number && <span> • OEM: {prod.oem_number}</span>}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-xs sm:text-sm font-black text-slate-950 flex-shrink-0">
                          {formatCurrency(prod.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Matching Brands Section */}
              {searchResults.brands.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="px-3 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>Brands ({searchResults.brands.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {searchResults.brands.map((brand) => (
                      <div
                        key={brand.id}
                        onClick={() => handleSelectResult(`/products/?brand=${brand.id}`)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50/70 cursor-pointer transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:border-orange-300">
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF6A00] transition-colors">
                            {brand.name}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF6A00] group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Matching Categories Section */}
              {searchResults.categories.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="px-3 py-1 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#FF6A00]" />
                    <span>Categories ({searchResults.categories.length})</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {searchResults.categories.map((cat, idx) => {
                      const linkUrl = cat.isSub
                        ? `/products/?category=${cat.id}&sub=${cat.subId}`
                        : `/products/?category=${cat.id}`;

                      return (
                        <div
                          key={`${cat.id}-${cat.subId || idx}`}
                          onClick={() => handleSelectResult(linkUrl)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-orange-50/70 cursor-pointer transition-colors group"
                        >
                          <div className="text-xs sm:text-sm text-slate-800 group-hover:text-[#FF6A00] transition-colors font-medium">
                            {cat.isSub ? (
                              <span>
                                <span className="text-slate-400 font-normal">{cat.parentName} &gt; </span>
                                <strong className="font-extrabold text-slate-900 group-hover:text-[#FF6A00]">
                                  {cat.name}
                                </strong>
                              </span>
                            ) : (
                              <strong className="font-extrabold text-slate-900 group-hover:text-[#FF6A00]">
                                {cat.name}
                              </strong>
                            )}
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF6A00] group-hover:translate-x-1 transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer View All Results */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2 bg-[#FF6A00] hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>View all matching parts for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
