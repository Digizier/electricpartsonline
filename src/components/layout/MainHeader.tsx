'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';

interface MainHeaderProps {
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export function MainHeader({ onToggleMobileNav, isMobileNavOpen }: MainHeaderProps) {
  const router = useRouter();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products/?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Button + Logo (Centered above Category Column on Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 lg:w-60 xl:w-64 lg:justify-center flex-shrink-0">
            <button
              type="button"
              onClick={onToggleMobileNav}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Logo />
          </div>

          {/* Center Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden md:flex items-center relative"
          >
            <input
              type="text"
              placeholder="Search for parts, brands, model numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 placeholder-slate-400 pl-4 pr-12 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6A00] shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#FF6A00] hover:bg-orange-600 text-white rounded-md flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Shopping Cart Widget */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 px-3.5 py-2 rounded-xl transition-colors text-left"
              aria-label="View Shopping Cart"
            >
              <div className="relative text-[#FF6A00]">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-2 bg-[#FF6A00] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-slate-900">
                  {itemCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-xs font-extrabold text-white">Cart</span>
                <span className="text-[11px] font-bold text-orange-400">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center relative">
            <input
              type="text"
              placeholder="Search parts, brands, model numbers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-slate-900 placeholder-slate-400 pl-3 pr-10 py-2 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#FF6A00] text-white rounded-md flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
