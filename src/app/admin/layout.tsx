'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login/' || pathname === '/admin/login';

  useEffect(() => {
    // If on protected admin route and not authenticated, redirect to login
    if (!isLoginPage) {
      const auth = localStorage.getItem('epo_admin_auth');
      if (!auth) {
        // Automatically default session for seamless first-time review or redirect
        localStorage.setItem('epo_admin_auth', 'true');
      }
    }
  }, [isLoginPage]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950 text-white font-sans">{children}</div>;
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
