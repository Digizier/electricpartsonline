'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatCurrency, getDeterministicRating } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { rating, reviewCount } = getDeterministicRating(product.slug || product.id);

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200">
      {/* Discount Badge */}
      {product.discount_percent && product.discount_percent > 0 ? (
        <span className="absolute top-3 left-3 z-10 bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          Save {product.discount_percent}%
        </span>
      ) : null}

      {/* Product Image */}
      <Link
        href={`/product/?slug=${product.slug}`}
        prefetch={false}
        className="relative block w-full pt-[80%] bg-slate-50 overflow-hidden"
      >
        <img
          src={product.thumbnail_url || product.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link
          href={`/product/?slug=${product.slug}`}
          prefetch={false}
          className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#FF6A00] transition-colors line-clamp-2 min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* Part Number */}
        <div className="mt-1 text-xs text-slate-500 font-medium">
          Part #: <span className="font-semibold text-slate-700">{product.part_number}</span>
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-extrabold text-slate-950">
            {formatCurrency(product.price)}
          </span>
          {product.msrp && product.msrp > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.msrp)}
            </span>
          )}
        </div>

        {/* Rating Stars & Reviews */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">({reviewCount})</span>
        </div>

        {/* Stock Status */}
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>In Stock</span>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-4 pt-2">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-150"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
