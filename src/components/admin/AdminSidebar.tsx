'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { getOrders } from '@/lib/db';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingBag,
  Ticket,
  Sliders,
  Share2,
  Settings,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCount = () => {
      getOrders().then((ords) => {
        if (ords) {
          setOrderCount(ords.length);
        }
      });
    };

    updateCount();
    window.addEventListener('epo_orders_updated', updateCount);
    return () => window.removeEventListener('epo_orders_updated', updateCount);
  }, []);

  const navItems = [
    { label: 'Dashboard', href: '/admin/', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products/', icon: Package },
    { label: 'Categories & Subcategories', href: '/admin/categories/', icon: FolderTree },
    { label: 'Brands', href: '/admin/brands/', icon: Tag },
    {
      label: 'Orders',
      href: '/admin/orders/',
      icon: ShoppingBag,
      badge: orderCount !== null && orderCount > 0 ? String(orderCount) : undefined
    },
    { label: 'Homepage Banners', href: '/admin/homepage/', icon: Sliders },
    { label: 'Coupons', href: '/admin/coupons/', icon: Ticket },
    { label: 'Advertisement & Catalog', href: '/admin/advertisement/', icon: Share2 },
    { label: 'Settings', href: '/admin/settings/', icon: Settings },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800/80 w-64 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Logo variant="admin" />
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={false}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                isActive
                  ? 'bg-[#FF6A00] text-white shadow-md shadow-orange-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-orange-600' : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Promo & Storefront Shortcut */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition-colors"
        >
          <span>View Live Store</span>
          <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
        </a>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/50 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-orange-400">
            <Sparkles className="w-3 h-3" />
            <span>Usman Traders v1.0.0</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Cloudflare Edge + Cloud Engine
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent Fixed Left Panel) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 h-full">
        {content}
      </aside>

      {/* Mobile Sidebar (Slide-out Overlay) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
