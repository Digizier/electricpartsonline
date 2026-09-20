'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/db';
import { Category, Subcategory } from '@/types';
import { Menu, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface CategoryNavProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

function MobileSubcategoryNode({
  sub,
  categoryId,
  level,
  expandedIds,
  onToggle,
  onClose,
}: {
  sub: Subcategory;
  categoryId: string;
  level: number;
  expandedIds: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose?: () => void;
}) {
  const hasChildren = sub.children && sub.children.length > 0;
  const isExpanded = !!expandedIds[sub.id];

  return (
    <div className="py-0.5">
      <div className="flex items-center justify-between rounded-lg hover:bg-slate-800/80 pr-1">
        <Link
          href={`/products/?category=${categoryId}&sub=${sub.id}`}
          prefetch={false}
          onClick={onClose}
          className="flex-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-orange-400 truncate"
        >
          {sub.name}
        </Link>
        {hasChildren && (
          <button
            type="button"
            onClick={() => onToggle(sub.id)}
            className="p-1.5 text-slate-400 hover:text-orange-400"
            aria-label={`Toggle ${sub.name}`}
          >
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-90 text-orange-400' : ''
              }`}
            />
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="pl-3 space-y-0.5 mt-0.5 border-l border-slate-700 ml-2">
          {sub.children!.map((child) => (
            <MobileSubcategoryNode
              key={child.id}
              sub={child}
              categoryId={categoryId}
              level={level + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopSubcategoryFlyoutNode({
  sub,
  categoryId,
  level = 2,
  onItemClick,
}: {
  sub: Subcategory;
  categoryId: string;
  level?: number;
  onItemClick?: () => void;
}) {
  const hasChildren = sub.children && sub.children.length > 0;

  return (
    <div className="py-0.5">
      <Link
        href={`/products/?category=${categoryId}&sub=${sub.id}`}
        prefetch={false}
        onClick={onItemClick}
        className={`flex items-center justify-between rounded-md transition-colors ${
          level === 2
            ? 'px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-orange-50 hover:text-[#FF6A00]'
            : 'px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-orange-50 hover:text-[#FF6A00]'
        }`}
      >
        <span className="truncate">{sub.name}</span>
        {hasChildren && (
          <span className="text-[10px] text-slate-400 font-mono">({sub.children!.length})</span>
        )}
      </Link>

      {hasChildren && (
        <div className="pl-3 ml-2.5 border-l border-slate-200 space-y-0.5 mt-0.5">
          {sub.children!.map((child) => (
            <DesktopSubcategoryFlyoutNode
              key={child.id}
              sub={child}
              categoryId={categoryId}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryNav({ isMobileOpen, onCloseMobile }: CategoryNavProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAllDropdownOpen, setIsAllDropdownOpen] = useState(false);
  const [activeHoverCat, setActiveHoverCat] = useState<string | null>(null);
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>({});
  const [expandedSubIds, setExpandedSubIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getCategories().then(setCategories);
    const handler = () => getCategories().then(setCategories);
    window.addEventListener('epo_categories_updated', handler);
    return () => window.removeEventListener('epo_categories_updated', handler);
  }, []);

  const toggleCat = (catId: string) => {
    setExpandedCatIds((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleSub = (subId: string) => {
    setExpandedSubIds((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden lg:block bg-slate-950 border-b border-slate-800 text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: "Shop All Categories" Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAllDropdownOpen(!isAllDropdownOpen)}
                onMouseEnter={() => setIsAllDropdownOpen(true)}
                className="flex items-center gap-2.5 bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-sm px-5 py-3 transition-colors rounded-t-sm"
              >
                <Menu className="w-4 h-4" />
                <span>Shop All Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isAllDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* All Categories Dropdown Mega Menu */}
              {isAllDropdownOpen && (
                <div
                  onMouseLeave={() => {
                    setIsAllDropdownOpen(false);
                    setActiveHoverCat(null);
                  }}
                  className="absolute left-0 top-full w-72 bg-white text-slate-800 shadow-2xl rounded-b-xl border border-slate-200 z-50 py-2"
                >
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setActiveHoverCat(cat.id)}
                      className="relative group"
                    >
                      <Link
                        href={`/products/?category=${cat.id}`}
                        prefetch={false}
                        onClick={() => setIsAllDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-orange-50 hover:text-[#FF6A00] transition-colors"
                      >
                        <span>{cat.name}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#FF6A00]" />
                        )}
                      </Link>

                      {/* Nested Subcategories & Sub-items Flyout */}
                      {activeHoverCat === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="absolute left-full top-0 w-80 bg-white text-slate-800 shadow-2xl rounded-xl border border-slate-200 z-50 py-3 px-1 max-h-[32rem] overflow-y-auto">
                          <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-2">
                            {cat.name} Subcategories
                          </div>
                          <div className="space-y-0.5">
                            {cat.subcategories.map((sub) => (
                              <DesktopSubcategoryFlyoutNode
                                key={sub.id}
                                sub={sub}
                                categoryId={cat.id}
                                level={2}
                                onItemClick={() => {
                                  setIsAllDropdownOpen(false);
                                  setActiveHoverCat(null);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Category Links */}
            <div className="flex items-center gap-1 xl:gap-2">
              {categories.slice(0, 7).map((cat) => (
                <div key={cat.id} className="relative group">
                  <Link
                    href={`/products/?category=${cat.id}`}
                    prefetch={false}
                    className="flex items-center gap-1 text-xs xl:text-sm font-bold px-3 py-3 hover:text-[#FF6A00] transition-colors text-slate-300"
                  >
                    <span>{cat.name}</span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
                    )}
                  </Link>

                  {/* Dropdown for Subcategories with Nested Sub-items */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="absolute left-0 top-full hidden group-hover:block w-80 bg-white text-slate-800 shadow-2xl rounded-b-xl border border-slate-200 z-50 py-3 px-1 max-h-[32rem] overflow-y-auto">
                      <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-2">
                        {cat.name} Taxonomy
                      </div>
                      <div className="space-y-0.5">
                        {cat.subcategories.map((sub) => (
                          <DesktopSubcategoryFlyoutNode
                            key={sub.id}
                            sub={sub}
                            categoryId={cat.id}
                            level={2}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/products/"
                prefetch={false}
                className="text-xs xl:text-sm font-bold px-3 py-3 hover:text-[#FF6A00] text-slate-300 transition-colors"
              >
                Brands
              </Link>

              <Link
                href="/contact/"
                prefetch={false}
                className="text-xs xl:text-sm font-bold px-3 py-3 hover:text-[#FF6A00] text-slate-300 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Navigation Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-slate-900 text-white shadow-2xl flex flex-col z-50">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#FF6A00]" />
                <span className="font-extrabold text-sm uppercase tracking-wider">Categories</span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 text-slate-400 hover:text-white"
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            {/* Mobile Categories Accordion with Full Recursive Drilldown */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-800/60">
              <div className="pb-3 space-y-1">
                {categories.map((cat) => {
                  const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                  const isCatExpanded = !!expandedCatIds[cat.id];

                  return (
                    <div key={cat.id} className="py-0.5">
                      <div className="flex items-center justify-between rounded-lg hover:bg-slate-800 text-slate-200 pr-1">
                        <Link
                          href={`/products/?category=${cat.id}`}
                          prefetch={false}
                          onClick={onCloseMobile}
                          className="flex-1 px-3 py-2 text-sm font-semibold text-slate-200"
                        >
                          {cat.name}
                        </Link>
                        {hasSubs && (
                          <button
                            type="button"
                            onClick={() => toggleCat(cat.id)}
                            className="p-2 text-slate-400 hover:text-orange-400"
                            aria-label={`Toggle ${cat.name} subcategories`}
                          >
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isCatExpanded ? 'rotate-90 text-orange-400' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expandable Recursive Subcategories */}
                      {hasSubs && isCatExpanded && (
                        <div className="pl-3 space-y-1 mt-1 border-l-2 border-orange-500/50 ml-3">
                          {cat.subcategories!.map((sub) => (
                            <MobileSubcategoryNode
                              key={sub.id}
                              sub={sub}
                              categoryId={cat.id}
                              level={2}
                              expandedIds={expandedSubIds}
                              onToggle={toggleSub}
                              onClose={onCloseMobile}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 space-y-1">
                <Link
                  href="/about/"
                  prefetch={false}
                  onClick={onCloseMobile}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-white font-medium"
                >
                  About Us
                </Link>
                <Link
                  href="/track-order/"
                  prefetch={false}
                  onClick={onCloseMobile}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-white font-medium"
                >
                  Track Order
                </Link>
                <Link
                  href="/fitment-help/"
                  prefetch={false}
                  onClick={onCloseMobile}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-white font-medium"
                >
                  Fitment Help
                </Link>
                <Link
                  href="/contact/"
                  prefetch={false}
                  onClick={onCloseMobile}
                  className="block px-3 py-2 text-sm text-slate-300 hover:text-white font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
