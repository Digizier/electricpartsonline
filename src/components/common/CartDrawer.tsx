'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { buildCartWhatsAppLink } from '@/lib/whatsapp';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, MessageCircle } from 'lucide-react';

export function CartDrawer() {
  const {
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
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    setIsApplying(true);
    await applyCouponCode(couponInput);
    setIsApplying(false);
    setCouponInput('');
  };

  const whatsappCheckoutUrl = buildCartWhatsAppLink(
    items,
    total,
    undefined,
    undefined,
    settings.general.whatsapp
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h2 className="font-extrabold text-lg">Shopping Cart ({itemCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-orange-50/80 p-3.5 border-b border-orange-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>
                {freeShippingRemaining > 0 ? (
                  <>Add <span className="text-[#FF6A00] font-black">{formatCurrency(freeShippingRemaining)}</span> for FREE Shipping</>
                ) : (
                  <span className="text-emerald-700 font-black">🎉 You have qualified for FREE Shipping!</span>
                )}
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Your cart is empty</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  Browse our catalog of commercial replacement parts and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 bg-[#FF6A00] text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="py-4 flex gap-3 sm:gap-4 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-lg border border-slate-200 p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&q=80'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Part #: <span className="font-semibold text-slate-700">{item.part_number}</span>
                      </p>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id!, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product_id!, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product_id!)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code: {appliedCoupon.code} (-{formatCurrency(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-red-600 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. PARTS10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{couponError}</p>
                )}
              </div>

              {/* Subtotal Calculations */}
              <div className="space-y-1.5 text-xs sm:text-sm pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-800">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-[#FF6A00]">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={whatsappCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Order via WhatsApp</span>
                </a>

                <Link
                  href="/cart/"
                  prefetch={false}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg shadow transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
