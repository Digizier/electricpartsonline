'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Brand, Category } from '@/types';
import { formatCurrency, getDeterministicRating } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { buildProductWhatsAppLink } from '@/lib/whatsapp';
import { Star, ShoppingCart, MessageCircle, Truck, ShieldCheck, Headphones, Plus, Minus, Zap } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  brand?: Brand | null;
  category?: Category | null;
}

export function ProductInfo({ product, brand, category }: ProductInfoProps) {
  const { addToCart, settings } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.color_options?.[0] || '');

  const normalizedSizes: { name: string; price: number }[] = useMemo(() => {
    if (!product.size_options || product.size_options.length === 0) return [];
    return product.size_options.map((sz: any) => {
      if (typeof sz === 'string') {
        return { name: sz, price: product.price };
      }
      return {
        name: sz.name,
        price: sz.price !== undefined && Number(sz.price) > 0 ? Number(sz.price) : product.price,
      };
    });
  }, [product.size_options, product.price]);

  const [selectedSize, setSelectedSize] = useState(normalizedSizes[0]?.name || '');
  const { rating, reviewCount } = getDeterministicRating(product.slug || product.id);

  const activeSizeObj = normalizedSizes.find((s) => s.name === selectedSize) || normalizedSizes[0];
  const activePrice =
    product.enable_variants_reviews !== false && product.has_sizes && activeSizeObj?.price
      ? activeSizeObj.price
      : product.price;

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const variantDetails: string[] = [];
  if (product.has_colors && (selectedColor || product.color_options?.[0])) {
    variantDetails.push(selectedColor || product.color_options![0]);
  }
  if (product.has_sizes && (selectedSize || normalizedSizes[0]?.name)) {
    variantDetails.push(selectedSize || normalizedSizes[0]?.name);
  }
  const variantLabel = variantDetails.length > 0 ? variantDetails.join(' - ') : undefined;
  const fullVariantName = variantLabel ? `${product.name} (${variantLabel})` : product.name;

  const router = useRouter();

  const handleBuyNow = () => {
    addToCart(
      { ...product, price: activePrice },
      quantity,
      activePrice,
      variantLabel,
      false // do not open drawer
    );
    router.push('/cart/');
  };

  const whatsappOrderUrl = buildProductWhatsAppLink(
    { ...product, name: fullVariantName, price: activePrice },
    quantity,
    settings.general.whatsapp
  );

  return (
    <div className="flex flex-col space-y-5">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <Link href="/" prefetch={false} className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>&gt;</span>
        {category ? (
          <>
            <Link
              href={`/products/?category=${category.id}`}
              prefetch={false}
              className="hover:text-slate-900 transition-colors"
            >
              {category.name}
            </Link>
            <span>&gt;</span>
          </>
        ) : null}
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
          {product.name}
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          {product.oem_number ? `Commercial OEM Replacement • ${product.oem_number}` : 'Commercial Replacement Equipment Part'}
        </p>
      </div>

      {/* Ratings & Reviews - Only shown if enabled by admin */}
      {product.enable_variants_reviews !== false && product.show_reviews ? (
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="font-extrabold text-slate-800 ml-1">{rating}</span>
            <span className="text-slate-500">({reviewCount} Reviews)</span>
          </div>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => alert('Thank you! Reviews are verified after purchase.')}
            className="font-bold text-[#FF6A00] hover:underline"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Guaranteed OEM Commercial Specification</span>
          </span>
        </div>
      )}

      {/* Part Number, Brand, Availability */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-slate-500 font-medium">Part Number:</span>
          <div className="font-extrabold text-slate-900 text-sm mt-0.5">{product.part_number}</div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Brand:</span>
          <div className="font-extrabold text-[#FF6A00] text-sm mt-0.5">
            {brand?.name || 'OEM Standard'}
          </div>
        </div>
        <div>
          <span className="text-slate-500 font-medium">Availability:</span>
          <div className="font-extrabold text-emerald-600 text-sm mt-0.5">
            ✓ In Stock ({product.stock_quantity}+ available)
          </div>
        </div>
      </div>

      {/* Pricing & Discount - Dynamically Updated with Quantity */}
      <div className="flex items-baseline flex-wrap gap-2.5 pt-1">
        <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          {formatCurrency(activePrice * quantity)}
        </span>
        {quantity > 1 && (
          <span className="text-xs sm:text-sm text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
            ({formatCurrency(activePrice)} each)
          </span>
        )}
        {product.discount_percent && product.discount_percent > 0 && (
          <span className="bg-orange-100 text-[#FF6A00] text-xs font-black px-2.5 py-1 rounded-full border border-orange-200">
            Save {product.discount_percent}%
          </span>
        )}
        {product.msrp && product.msrp > activePrice && (
          <span className="text-sm text-slate-400 line-through font-semibold">
            {formatCurrency(product.msrp * quantity)}
          </span>
        )}
      </div>

      {/* Color Variant Selector (if enabled by admin) */}
      {product.enable_variants_reviews !== false && product.has_colors && product.color_options && product.color_options.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold text-slate-700">
            Color / Finish: <span className="text-[#FF6A00] font-extrabold">{selectedColor || product.color_options[0]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.color_options.map((color) => {
              const active = (selectedColor || product.color_options![0]) === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    active
                      ? 'border-[#FF6A00] bg-orange-50 text-[#FF6A00] shadow-sm ring-1 ring-orange-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Variant Selector (if enabled by admin) */}
      {product.enable_variants_reviews !== false && product.has_sizes && normalizedSizes.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-bold text-slate-700">
            Size / Specification: <span className="text-[#FF6A00] font-extrabold">{selectedSize || normalizedSizes[0]?.name}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {normalizedSizes.map((sizeObj) => {
              const active = (selectedSize || normalizedSizes[0]?.name) === sizeObj.name;
              return (
                <button
                  key={sizeObj.name}
                  type="button"
                  onClick={() => setSelectedSize(sizeObj.name)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    active
                      ? 'border-[#FF6A00] bg-orange-50 text-[#FF6A00] shadow-sm ring-1 ring-orange-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{sizeObj.name}</span>
                  {sizeObj.price && sizeObj.price !== product.price ? (
                    <span className="ml-1.5 text-[11px] font-extrabold text-orange-600">
                      ({formatCurrency(sizeObj.price)})
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector & Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Quantity:</span>
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-sm font-extrabold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dual Primary Action Buttons + Buy Now */}
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Add to Cart */}
            <button
              type="button"
              onClick={() => {
                addToCart(
                  { ...product, price: activePrice },
                  quantity,
                  activePrice,
                  variantLabel,
                  true
                );
              }}
              className="min-h-[48px] px-5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-orange-400" />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now - Direct to Checkout */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="min-h-[48px] px-5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-5 h-5 fill-current text-yellow-300" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Order on WhatsApp */}
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[46px] px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-slate-200 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-600">
          <Truck className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-slate-800">Fast Shipping</div>
            <div className="text-[11px] text-slate-400">Ships in 1-2 business days</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-slate-600">
          <ShieldCheck className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-slate-800">Original Parts</div>
            <div className="text-[11px] text-slate-400">100% Genuine & Compatible</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-slate-600">
          <Headphones className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <div className="font-bold text-slate-800">Expert Support</div>
            <div className="text-[11px] text-slate-400">Direct technical help</div>
          </div>
        </div>
      </div>
    </div>
  );
}
