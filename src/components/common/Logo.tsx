'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'storefront' | 'light' | 'admin';
  className?: string;
}

export function Logo({ variant = 'storefront', className = '' }: LogoProps) {
  const isLight = variant === 'light';
  const isAdmin = variant === 'admin';

  return (
    <Link
      href={isAdmin ? '/admin' : '/'}
      prefetch={false}
      className={`inline-flex items-center gap-2 group transition-opacity hover:opacity-90 ${className}`}
    >
      <div className="relative flex items-center">
        {/* Exact Logo Graphic matching reference website-logo.png */}
        <img
          src={isLight ? '/logo-dark.png' : '/logo-white.png'}
          alt="ElectricPartsOnline.com - Usman Traders"
          className="h-9 sm:h-11 md:h-12 lg:h-[3.25rem] w-auto object-contain transition-transform group-hover:scale-[1.02]"
          loading="eager"
        />
        {isAdmin && (
          <span className="ml-2 text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-md font-extrabold self-center">
            ADMIN
          </span>
        )}
      </div>
    </Link>
  );
}
