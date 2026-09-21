'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login/' || pathname === '/admin/login';

  useEffect(() => {
    const auth = localStorage.getItem('epo_admin_auth');
    const isAuthed = auth === 'true';

    if (isLoginPage) {
      if (isAuthed) {
        // If already logged in, redirect directly to admin dashboard
        router.replace('/admin/');
      } else {
        setIsAuthenticated(false);
      }
    } else {
      if (!isAuthed) {
        // Not logged in -> redirect to login immediately
        setIsAuthenticated(false);
        router.replace('/admin/login/');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [pathname, isLoginPage, router]);

  // If on login page, render login page
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 text-white font-sans">{children}</div>;
  }

  // Show dark loading screen while verifying auth, preventing content leak
  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans p-4">
        <div className="w-8 h-8 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
          Verifying Admin Access...
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 flex font-sans">
      {/* Isolated Dedicated Admin Sidebar - Fixed */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Admin Area - Dedicated Scroll Pane */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <AdminTopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
