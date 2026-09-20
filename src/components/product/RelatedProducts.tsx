'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { ProductCard } from '@/components/common/ProductCard';
import { ArrowRight } from 'lucide-react';

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const related = products.filter((p) => p.id !== currentProductId).slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-12 border-t border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Related Products
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Frequently purchased together commercial replacement components
          </p>
        </div>

        <Link
          href="/products/"
          prefetch={false}
          className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#FF6A00] hover:text-orange-700"
        >
          <span>View All Related Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
