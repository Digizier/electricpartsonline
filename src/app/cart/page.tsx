'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/db';
import { triggerNewOrderEmails } from '@/lib/emailClient';
import { formatCurrency } from '@/lib/utils';
import { buildCartWhatsAppLink } from '@/lib/whatsapp';
import { Order } from '@/types';
import { ShoppingBag, CheckCircle, ArrowRight, MessageCircle, Truck, CreditCard, Banknote, ShieldCheck, Smartphone, Tag, X } from 'lucide-react';

function formatPaymentTitle(method?: string): string {
  switch (method) {
    case 'cod':
      return 'Cash on Delivery / Warehouse Pickup';
    case 'easypaisa':
      return 'EasyPaisa Mobile Account';
    case 'jazzcash':
      return 'JazzCash Mobile Account';
    case 'bank_transfer':
      return 'Direct Bank Transfer (Meezan Bank)';
    case 'whatsapp':
    default:
      return 'Direct WhatsApp Order';
  }
}

export default function CartCheckoutPage() {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    settings,
    clearCart,
    updateQuantity,
    removeFromCart,
    appliedCoupon,
    couponError,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'cod' | 'bank_transfer' | 'easypaisa' | 'jazzcash'>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setIsApplyingCoupon(false);
    setCouponInput('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!customerName?.trim() || !customerPhone?.trim() || !address?.trim()) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }
    if (!customerEmail?.trim() || !customerEmail.includes('@')) {
      alert('Please provide a valid email address to receive your order receipt and tracking updates.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim(),
        shipping_address: {
          address: address.trim(),
          city: city.trim(),
          notes: notes.trim(),
        },
        items: [...items],
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        coupon_code: appliedCoupon?.code || '',
        total_amount: total,
        payment_method: paymentMethod,
        delivery_notes: notes.trim(),
      });

      setPlacedOrder(order);
      clearCart();

      // Trigger automated email notifications to client (admin) and customer
      triggerNewOrderEmails(order);

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch (err: any) {
      alert('Error submitting order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (placedOrder && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [placedOrder]);

  if (placedOrder) {
    const orderTotal = Number(placedOrder.total_amount) || 0;
    const orderItems = placedOrder.items && placedOrder.items.length > 0
      ? placedOrder.items
      : [{ name: 'Commercial Equipment Parts', part_number: 'PARTS', price: orderTotal, quantity: 1, subtotal: orderTotal }];

    const whatsappLink = buildCartWhatsAppLink(
      orderItems,
      orderTotal,
      placedOrder.customer_name,
      `${placedOrder.shipping_address?.address || ''}, ${placedOrder.shipping_address?.city || ''}`,
      settings.general.whatsapp
    );

    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Order Confirmed</span>
          <h1 className="text-3xl font-black text-slate-950 mt-1">Thank You For Your Order!</h1>
          <p className="text-sm text-slate-600 mt-2">
            Your commercial order <strong className="text-slate-950">{placedOrder.order_number}</strong> has been received and logged in our system.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-left text-xs text-slate-700 space-y-2.5">
          <div>Customer: <strong className="text-slate-900">{placedOrder.customer_name}</strong> ({placedOrder.customer_phone})</div>
          {placedOrder.customer_email && (
            <div>Confirmation Email: <strong className="text-emerald-700 font-bold">{placedOrder.customer_email}</strong> <span className="text-slate-500 text-[11px]">(Receipt sent)</span></div>
          )}
          <div>Delivery: <strong className="text-slate-900">{placedOrder.shipping_address?.address}, {placedOrder.shipping_address?.city}</strong></div>
          <div>Total: <strong className="text-emerald-700 text-base font-black">{formatCurrency(orderTotal)}</strong></div>
          <div>Payment Method: <strong className="text-slate-900 font-extrabold">{formatPaymentTitle(placedOrder.payment_method)}</strong></div>
          {orderItems.length > 0 && (
            <div className="pt-2 border-t border-slate-200 mt-2">
              <span className="font-bold text-slate-600 block mb-1">Items ({orderItems.length}):</span>
              <ul className="space-y-1 text-[11px] text-slate-800">
                {orderItems.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name} <span className="text-slate-500 font-mono">({it.part_number})</span></span>
                    <span className="font-bold">{formatCurrency(it.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Send Order via WhatsApp Now</span>
          </a>

          <Link
            href="/track-order/"
            prefetch={false}
            className="min-h-[48px] px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">
          Browse our high quality commercial parts catalog and add components to your cart.
        </p>
        <Link
          href="/products/"
          prefetch={false}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6A00] text-white font-extrabold text-xs rounded-xl shadow"
        >
          <span>Browse Parts Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-8">
        Review & Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment Form (7 Cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6A00] text-white text-xs flex items-center justify-center">1</span>
              <span>Customer & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name / Business *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmed Khan (Al-Madina Bakery)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="0321-XXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Email Address (For Order Confirmation Receipt & Updates) *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ahmed.khan@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">We will send your itemized receipt and live dispatch updates to this email address.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Shop #, Street, Plaza, Commercial Market..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="Lahore, Karachi, etc."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-slate-300 px-3 py-2 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Special courier instructions or landmark..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6A00] text-white text-xs flex items-center justify-center">2</span>
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* WhatsApp Option */}
              <label
                htmlFor="payment-method-whatsapp"
                onClick={() => setPaymentMethod('whatsapp')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'whatsapp'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-method-whatsapp"
                  name="payment"
                  value="whatsapp"
                  checked={paymentMethod === 'whatsapp'}
                  onChange={() => setPaymentMethod('whatsapp')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                    <span>Direct WhatsApp Order (Fastest Dispatch)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instantly forwards your order summary to our WhatsApp helpline ({settings.general.phone}) for immediate confirmation.
                  </p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                htmlFor="payment-method-cod"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#FF6A00] bg-orange-50/60 ring-1 ring-orange-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-method-cod"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-orange-600 focus:ring-orange-500"
                />
                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-orange-500" />
                    <span>Cash on Delivery / Warehouse Pickup</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pay upon arrival of courier or pay in cash at our warehouse counter.
                  </p>
                </div>
              </label>

              {/* EasyPaisa Mobile Wallet */}
              <label
                htmlFor="payment-method-easypaisa"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-method-easypaisa"
                  name="payment"
                  value="easypaisa"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="w-full">
                  <div className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>EasyPaisa Mobile Account</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Instant
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transfer via EasyPaisa App or mobile USSD code (*786#).
                  </p>
                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-300 text-xs space-y-1 text-slate-800">
                      <div>Account Title: <strong className="text-slate-900">{settings.payments?.easyPaisa?.accountTitle || 'Usman Traders'}</strong></div>
                      <div>Mobile / Account No: <strong className="font-mono text-emerald-700 text-sm font-bold">{settings.payments?.easyPaisa?.accountNumber || settings.general.phone || '0321-8888872'}</strong></div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Please send screenshot of payment confirmation via WhatsApp for expedited dispatch.
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {/* JazzCash Mobile Wallet */}
              <label
                htmlFor="payment-method-jazzcash"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-rose-500 bg-rose-50/60 ring-1 ring-rose-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-method-jazzcash"
                  name="payment"
                  value="jazzcash"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div className="w-full">
                  <div className="font-extrabold text-sm text-slate-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-rose-600" />
                      <span>JazzCash Mobile Account</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      Instant
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transfer directly to our verified JazzCash merchant account.
                  </p>
                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-rose-300 text-xs space-y-1 text-slate-800">
                      <div>Account Title: <strong className="text-slate-900">{settings.payments?.jazzCash?.accountTitle || 'Usman Traders'}</strong></div>
                      <div>Mobile / Account No: <strong className="font-mono text-rose-700 text-sm font-bold">{settings.payments?.jazzCash?.accountNumber || settings.general.phone || '0321-8888872'}</strong></div>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Please send screenshot of payment confirmation via WhatsApp for expedited dispatch.
                      </p>
                    </div>
                  )}
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                htmlFor="payment-method-bank"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  id="payment-method-bank"
                  name="payment"
                  value="bank_transfer"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="w-full">
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Direct Bank Transfer (Meezan Bank)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Transfer directly to our official company bank account via online banking or ATM.
                  </p>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1 text-slate-700">
                      <div>Bank: <strong className="text-slate-900">{settings.payments.bankTransfer.bankName || 'Meezan Bank'}</strong></div>
                      <div>Title: <strong className="text-slate-900">{settings.payments.bankTransfer.accountTitle || 'Usman Traders'}</strong></div>
                      <div>IBAN: <strong className="font-mono text-slate-900">{settings.payments.bankTransfer.iban || 'PK52MEZN0001010102938475'}</strong></div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Processing Order...' : `Complete Order (${formatCurrency(total)})`}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Right Column: Order Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-slate-500">{itemCount} items</span>
            </h3>

            {/* Items List */}
            <div className="divide-y divide-slate-200 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product_id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&q=80'}
                      alt={item.name}
                      className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 line-clamp-1">{item.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Part #: {item.part_number}</div>
                      <div className="text-slate-700 font-bold mt-0.5">
                        {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-950">{formatCurrency(item.subtotal)}</div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-slate-200 pt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Have a Promo / Coupon Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-mono font-black text-emerald-800">{appliedCoupon.code}</span>
                      <span className="text-slate-500 ml-1.5 font-bold">
                        ({appliedCoupon.discount_type === 'percentage' ? `${appliedCoupon.discount_value}% OFF` : `Rs. ${appliedCoupon.discount_value} OFF`})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. SALE10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-mono uppercase focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-colors whitespace-nowrap"
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-red-600 font-bold mt-1.5">{couponError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-[#FF6A00]">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
