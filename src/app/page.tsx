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
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '@/lib/mockData';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);

  useEffect(() => {
    getProducts().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });
    getCategories().then((data) => {
      if (data && data.length > 0) setCategories(data);
    });
    getBrands().then((data) => {
      if (data && data.length > 0) setBrands(data);
    });

    const handleUpdate = () => {
      getProducts().then(setProducts);
      getCategories().then(setCategories);
    };
    window.addEventListener('epo_products_updated', handleUpdate);
    window.addEventListener('epo_categories_updated', handleUpdate);
    return () => {
      window.removeEventListener('epo_products_updated', handleUpdate);
      window.removeEventListener('epo_categories_updated', handleUpdate);
    };
  }, []);

  return (
    <main>
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Shop By Category Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Featured Products Tabs */}
      <FeaturedTabs products={products} />

      {/* 4. Shop By Brand */}
      <BrandShowcase brands={brands} />

      {/* 5. Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Need Help Finding The Right Part? Banner */}
      <FitmentBanner />
    </main>
  );
}
