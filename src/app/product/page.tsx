'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts, getCategories, getBrands } from '@/lib/db';
import { Product, Category, Brand } from '@/types';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { SpecsTabs } from '@/components/product/SpecsTabs';
import { ValueAddSidebar } from '@/components/product/ValueAddSidebar';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ArrowLeft, Search } from 'lucide-react';

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '208v-4500w-fryer-heating-element';

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    async function load() {
      setLoading(true);
      const [prod, prods, cats, brs] = await Promise.all([
        getProductBySlug(slug),
        getProducts(),
        getCategories(),
        getBrands(),
      ]);
      setProduct(prod);
      setAllProducts(prods || []);
      setCategories(cats || []);
      setBrands(brs || []);
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-4" />
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-4 bg-slate-200 rounded w-4" />
          <div className="h-4 bg-slate-200 rounded w-36" />
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Left Column: Image Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full aspect-square bg-slate-200/80 rounded-2xl" />
            <div className="grid grid-cols-4 gap-3">
              <div className="aspect-square bg-slate-200 rounded-xl" />
              <div className="aspect-square bg-slate-200 rounded-xl" />
              <div className="aspect-square bg-slate-200 rounded-xl" />
              <div className="aspect-square bg-slate-200 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Info Skeleton */}
          <div className="lg:col-span-5 space-y-5">
            <div className="h-5 bg-slate-200 rounded w-24" />
            <div className="h-8 bg-slate-200 rounded w-4/5" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-10 bg-slate-200 rounded w-36 mt-4" />
            <div className="h-12 bg-slate-200 rounded-xl w-full mt-6" />
            <div className="space-y-2 pt-6 border-t border-slate-200">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Commercial Part Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested part is either discontinued or out of catalog.
        </p>
        <Link
          href="/products/"
          prefetch={false}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6A00] text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Parts Catalog</span>
        </Link>
      </div>
    );
  }

  const brand = brands.find((b) => b.id === product.brand_id);
  const category = categories.find((c) => c.id === product.category_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top 3-Column Layout: Gallery (5 Cols) + Product Info (4 Cols) + Value Sidebar (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6 xl:col-span-5">
          <ImageGallery
            images={product.images || []}
            productName={product.name}
            isInStock={product.is_in_stock}
          />
        </div>

        {/* Info & Purchase */}
        <div className="lg:col-span-6 xl:col-span-4">
          <ProductInfo
            product={product}
            brand={brand}
            category={category}
          />
        </div>

        {/* Assurances & Need Help Sticky Sidebar */}
        <div className="lg:col-span-12 xl:col-span-3">
          <ValueAddSidebar productName={product.name} />
        </div>
      </div>

      {/* Middle: Detailed Technical Specifications Tabs */}
      <div className="mt-12">
        <SpecsTabs product={product} />
      </div>

      {/* Bottom: Related Products Cross-Sell */}
      <RelatedProducts products={allProducts} currentProductId={product.id} />
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-slate-400">Loading product details...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
