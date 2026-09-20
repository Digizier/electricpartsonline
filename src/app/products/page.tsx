'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, getCategories, getBrands } from '@/lib/db';
import { Product, Category, Brand, Subcategory } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/lib/mockData';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';

function getSubcategoryAndDescendantIds(subId: string, categories: Category[]): Set<string> {
  const result = new Set<string>([subId]);

  function collectAll(item: Subcategory) {
    result.add(item.id);
    if (item.children) {
      for (const child of item.children) {
        collectAll(child);
      }
    }
  }

  function search(items?: Subcategory[]): boolean {
    if (!items) return false;
    for (const item of items) {
      if (item.id === subId) {
        collectAll(item);
        return true;
      }
      if (item.children && search(item.children)) {
        return true;
      }
    }
    return false;
  }

  for (const cat of categories) {
    if (search(cat.subcategories)) break;
  }
  return result;
}

function SidebarSubItem({
  sub,
  selectedSub,
  onSelectSub,
  counts,
  level = 1,
}: {
  sub: Subcategory;
  selectedSub: string;
  onSelectSub: (id: string) => void;
  counts: Record<string, number>;
  level?: number;
}) {
  const isSelected = selectedSub === sub.id;
  const hasChildren = sub.children && sub.children.length > 0;
  const count = counts[sub.id] || 0;

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => onSelectSub(isSelected ? '' : sub.id)}
        className={`w-full text-left px-2 py-1.5 rounded text-[11px] font-medium transition-colors flex items-center justify-between gap-1.5 ${
          isSelected
            ? 'text-[#FF6A00] font-black bg-orange-50 border border-orange-200 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <span className="truncate">{sub.name}</span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 transition-colors ${
            isSelected
              ? 'bg-[#FF6A00] text-white'
              : count > 0
                ? 'bg-orange-100 text-[#FF6A00]'
                : 'text-slate-400'
          }`}
        >
          ({count})
        </span>
      </button>

      {hasChildren && (
        <div className="pl-2.5 border-l border-slate-200 ml-2 space-y-0.5 mt-0.5">
          {sub.children!.map((child) => (
            <SidebarSubItem
              key={child.id}
              sub={child}
              selectedSub={selectedSub}
              onSelectSub={onSelectSub}
              counts={counts}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSub = searchParams.get('sub') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);

  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [selectedSub, setSelectedSub] = useState<string>(initialSub);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      getProducts().then((p) => p?.length && setProducts(p));
      getCategories().then((c) => c?.length && setCategories(c));
      getBrands().then((b) => b?.length && setBrands(b));
    };

    refreshData();
    window.addEventListener('epo_products_updated', refreshData);
    window.addEventListener('epo_brands_updated', refreshData);
    return () => {
      window.removeEventListener('epo_products_updated', refreshData);
      window.removeEventListener('epo_brands_updated', refreshData);
    };
  }, []);

  useEffect(() => {
    if (initialCategory) setSelectedCat(initialCategory);
    if (initialSub) setSelectedSub(initialSub);
    if (initialBrand) setSelectedBrand(initialBrand);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialSub, initialBrand, initialSearch]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCat);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCat) {
      list = list.filter((p) => p.category_id === selectedCat);
    }
    if (selectedSub) {
      const allowedSubs = getSubcategoryAndDescendantIds(selectedSub, categories);
      list = list.filter((p) => p.subcategory_id && allowedSubs.has(p.subcategory_id));
    }
    if (selectedBrand) {
      const matchedBrand = brands.find(b => b.id === selectedBrand || b.slug === selectedBrand);
      list = list.filter((p) =>
        p.brand_id === selectedBrand ||
        (matchedBrand && (p.brand_id === matchedBrand.id || p.brand_id === matchedBrand.name))
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.part_number.toLowerCase().includes(q) ||
          (p.oem_number && p.oem_number.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'bestseller') {
      list.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCat, selectedSub, selectedBrand, searchQuery, sortBy, categories]);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset pagination to page 1 whenever any filter criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat, selectedSub, selectedBrand, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const subcategoryProductCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    function compute(subs?: Subcategory[]) {
      if (!subs) return;
      for (const sub of subs) {
        const allowed = getSubcategoryAndDescendantIds(sub.id, categories);
        counts[sub.id] = products.filter(
          (p) => p.subcategory_id && allowed.has(p.subcategory_id)
        ).length;
        if (sub.children) compute(sub.children);
      }
    }
    for (const cat of categories) {
      compute(cat.subcategories);
    }
    return counts;
  }, [products, categories]);

  const resetFilters = () => {
    setSelectedCat('');
    setSelectedSub('');
    setSelectedBrand('');
    setSearchQuery('');
    setSortBy('featured');
  };

  const FilterSidebar = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          Equipment Categories
        </h4>
        <div className="space-y-1.5 text-xs max-h-none">
          <button
            type="button"
            onClick={() => {
              setSelectedCat('');
              setSelectedSub('');
            }}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold transition-colors ${
              !selectedCat ? 'bg-[#FF6A00] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((c) => (
            <div key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedCat(c.id);
                  setSelectedSub('');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                  selectedCat === c.id ? 'bg-[#FF6A00] text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[11px] opacity-75">
                  ({products.filter((p) => p.category_id === c.id).length})
                </span>
              </button>

              {/* Subcategories (Visible when parent category selected) */}
              {selectedCat === c.id && c.subcategories && c.subcategories.length > 0 && (
                <div className="pl-3 space-y-1 mt-1 border-l-2 border-orange-200 ml-2">
                  {c.subcategories.map((sub) => (
                    <SidebarSubItem
                      key={sub.id}
                      sub={sub}
                      selectedSub={selectedSub}
                      onSelectSub={setSelectedSub}
                      counts={subcategoryProductCounts}
                      level={1}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="border-t border-slate-200 pt-5">
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
          Filter by Brand
        </h4>
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedBrand('')}
            className={`w-full text-left px-3 py-1.5 rounded-lg font-medium transition-colors ${
              !selectedBrand ? 'text-[#FF6A00] font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => {
            const bCount = products.filter(
              (p) => p.brand_id === b.id || p.brand_id === b.slug || p.brand_id === b.name
            ).length;
            const isSelected = selectedBrand === b.id || selectedBrand === b.slug;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBrand(isSelected ? '' : b.id)}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'text-[#FF6A00] font-extrabold bg-orange-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{b.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#FF6A00] text-white'
                      : bCount > 0
                        ? 'bg-orange-100 text-[#FF6A00]'
                        : 'text-slate-400'
                  }`}
                >
                  ({bCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Filter Action */}
      {(selectedCat || selectedSub || selectedBrand || searchQuery) && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title & Count Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : 'Commercial Equipment Parts'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> parts in catalog
          </p>
        </div>

        {/* Controls: Sorting + Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden min-h-[40px] px-4 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({[selectedCat, selectedBrand, searchQuery].filter(Boolean).length})</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 focus:outline-none"
            >
              <option value="featured">Featured Parts</option>
              <option value="bestseller">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar (1 Col) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sticky top-24">
            {FilterSidebar}
          </div>
        </aside>

        {/* Product Cards Grid (3 Cols) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8">
              <div className="w-14 h-14 rounded-full bg-orange-100 text-[#FF6A00] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">No parts found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No replacement parts match your selected filters or search query. Try broadening your criteria.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-[#FF6A00] text-white font-bold text-xs rounded-xl shadow"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Numbered Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-slate-500 font-medium order-2 sm:order-1">
                    Showing <span className="font-bold text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–
                    <span className="font-bold text-slate-800">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}</span> of{' '}
                    <span className="font-bold text-slate-800">{filteredProducts.length}</span> parts
                  </p>

                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    {/* Previous Button */}
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      &larr; Prev
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-extrabold transition-all ${
                          currentPage === pageNum
                            ? 'bg-[#FF6A00] text-white shadow-sm shadow-orange-500/30'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2 font-black text-sm">
                <SlidersHorizontal className="w-4 h-4 text-orange-400" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {FilterSidebar}
            </div>

            {/* Mobile Sticky Action Button */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full min-h-[44px] bg-[#FF6A00] text-white font-extrabold text-xs rounded-xl shadow"
              >
                Done ({filteredProducts.length} Products)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>}>
      <ProductsCatalog />
    </Suspense>
  );
}
