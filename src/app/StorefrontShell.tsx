'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { TopUtilityBar } from '@/components/layout/TopUtilityBar';
import { MainHeader } from '@/components/layout/MainHeader';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { WelcomePopup } from '@/components/common/WelcomePopup';
import { ScrollToTop } from '@/components/common/ScrollToTop';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <ScrollToTop />
      <TopUtilityBar />
      <MainHeader
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
      />
      <CategoryNav
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      <div className="flex-1">
        {children}
      </div>

      <Footer />
      <CartDrawer />
      <WelcomePopup />
    </div>
  );
}
