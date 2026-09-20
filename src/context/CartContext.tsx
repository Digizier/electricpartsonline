'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, OrderItem, Coupon, SiteSettings } from '@/types';
import { getSiteSettings, getCoupons } from '@/lib/db';
import { INITIAL_SETTINGS } from '@/lib/mockData';

interface CartContextType {
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  freeShippingProgress: number;
  freeShippingRemaining: number;
  isCartOpen: boolean;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  settings: SiteSettings;
  addToCart: (product: Product, quantity?: number, customPrice?: number, variantLabel?: string, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('epo_cart');
      if (saved) setItems(JSON.parse(saved));
      const savedCoupon = localStorage.getItem('epo_coupon');
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Cart hydration error:', e);
    }

    getSiteSettings().then(setSettings);

    const handleSettingsUpdate = () => {
      getSiteSettings().then(setSettings);
    };
    window.addEventListener('epo_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('epo_settings_updated', handleSettingsUpdate);
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('epo_cart', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('epo_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('epo_coupon');
      }
    } catch (e) {}
  }, [appliedCoupon]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  const freeThreshold = settings.shipping.freeShippingThreshold || 5000;
  const isFreeShipping = subtotal >= freeThreshold;
  const shippingFee = isFreeShipping || items.length === 0 ? 0 : (settings.shipping.flatShippingFee || 250);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const freeShippingRemaining = Math.max(0, freeThreshold - subtotal);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discountAmount = (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.discount_value);
    }
  }

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const addToCart = (
    product: Product,
    quantity = 1,
    customPrice?: number,
    variantLabel?: string,
    openDrawer = true
  ) => {
    const effectivePrice = customPrice !== undefined && customPrice > 0 ? customPrice : product.price;
    const itemId = variantLabel ? `${product.id}-${variantLabel}` : product.id;
    const itemName = variantLabel ? `${product.name} (${variantLabel})` : product.name;

    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.product_id === itemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.price,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product_id: itemId,
            name: itemName,
            part_number: product.part_number,
            price: effectivePrice,
            quantity,
            thumbnail: product.thumbnail_url || product.images?.[0] || '',
            subtotal: effectivePrice * quantity,
            variant_label: variantLabel,
          },
        ];
      }
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity,
              subtotal: item.price * quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const cleanCode = code.trim().toUpperCase();
    const coupons = await getCoupons();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.is_active);

    if (!found) {
      setCouponError('Invalid or expired coupon code');
      return false;
    }

    if (subtotal < found.min_spend) {
      setCouponError(`Minimum spend of $${found.min_spend} required for this coupon`);
      return false;
    }

    setAppliedCoupon(found);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingFee,
        discountAmount,
        total,
        freeShippingProgress,
        freeShippingRemaining,
        isCartOpen,
        appliedCoupon,
        couponError,
        settings,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setIsCartOpen,
        applyCouponCode,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
