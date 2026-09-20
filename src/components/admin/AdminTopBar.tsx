'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, ExternalLink, User, LogOut } from 'lucide-react';

interface AdminTopBarProps {
  onToggleSidebar?: () => void;
}

export function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('epo_admin_auth');
    router.push('/admin/login/');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Mobile Toggle + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <input
            type="text"
            placeholder="Search products, orders, customers..."
            className="w-full bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 pl-9 pr-4 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <button
          type="button"
          onClick={() => alert('You have 3 unfulfilled commercial orders waiting for dispatch.')}
          className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        </button>

        {/* View Website */}
        <Link
          href="/"
          target="_blank"
          prefetch={false}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors border border-slate-700"
        >
          <span>View Website</span>
          <ExternalLink className="w-3 h-3 text-orange-400" />
        </Link>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-[#FF6A00] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            UT
          </div>
          <div className="hidden sm:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-white">Usman Traders</span>
            <span className="text-[10px] text-orange-400 font-semibold mt-0.5">Admin</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors ml-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
