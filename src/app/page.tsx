'use client';

import React, { useState, useEffect } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedTabs } from '@/components/home/FeaturedTabs';
import { BrandShowcase } from '@/components/home/BrandShowcase';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { FitmentBanner } from '@/components/home/FitmentBanner';
import { getProducts, getCategories, getBrands } from '@/lib/db';
import { Product, Category, Brand } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [prods, cats, brs] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ]);
        if (isMounted) {
          setProducts(prods || []);
          setCategories(cats || []);
          setBrands(brs || []);
        }
      } catch (e) {
        console.warn('Error loading homepage data:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    const handleUpdate = () => {
      getProducts().then((p) => isMounted && setProducts(p || []));
      getCategories().then((c) => isMounted && setCategories(c || []));
      getBrands().then((b) => isMounted && setBrands(b || []));
    };
    window.addEventListener('epo_products_updated', handleUpdate);
    window.addEventListener('epo_categories_updated', handleUpdate);
    window.addEventListener('epo_brands_updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('epo_products_updated', handleUpdate);
      window.removeEventListener('epo_categories_updated', handleUpdate);
      window.removeEventListener('epo_brands_updated', handleUpdate);
    };
  }, []);

  return (
    <main>
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Shop By Category Grid */}
      <CategoryGrid categories={categories} products={products} isLoading={isLoading} />

      {/* 3. Featured Products Tabs */}
      <FeaturedTabs products={products} isLoading={isLoading} />

      {/* 4. Shop By Brand */}
      <BrandShowcase brands={brands} isLoading={isLoading} />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Need Help Finding The Right Part? Banner */}
      <FitmentBanner />
    </main>
  );
}
