'use client';

import React, { useState } from 'react';
import { getOrders } from '@/lib/db';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Search, Truck, Clock, CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    const cleanQ = query.trim().toLowerCase();

    try {
      const allOrders = await getOrders();
      const found = allOrders.find(
        (o) =>
          o.order_number.toLowerCase() === cleanQ ||
          o.order_number.toLowerCase() === `#${cleanQ}` ||
          o.customer_phone.includes(cleanQ)
      );
      setOrder(found || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'Order received & logged' },
    { key: 'processing', label: 'Processing', desc: 'Parts picked & inspected' },
    { key: 'shipped', label: 'Shipped', desc: 'Dispatched with courier' },
    { key: 'delivered', label: 'Delivered', desc: 'Arrived at commercial location' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'pending') return 0;
    if (status === 'confirmed' || status === 'processing') return 1;
    if (status === 'dispatched' || status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Enter your Order Number (e.g. <strong className="text-slate-800">#10048</strong>) or mobile number to view real-time dispatch progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-10">
        <div className="relative flex-1">
          <input
            type="text"
            required
            placeholder="Enter Order # or phone (e.g. #10048)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] font-medium shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-sm rounded-2xl shadow transition-colors flex items-center gap-1.5 flex-shrink-0"
        >
          <span>{loading ? 'Checking...' : 'Track'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Result Display */}
      {searched && (
        <div>
          {order ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-3">
                <div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Order Status</span>
                  <div className="text-2xl font-black text-slate-950 mt-0.5">{order.order_number}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Customer: <strong className="text-slate-800">{order.customer_name}</strong> • Total: <strong className="text-slate-900">{formatCurrency(order.total_amount)}</strong>
                  </div>
                </div>
                <div className="self-start sm:self-auto">
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${
                          isDone
                            ? 'bg-[#FF6A00] text-white shadow-md shadow-orange-500/20'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className={`text-xs font-extrabold ${isCurrent ? 'text-[#FF6A00]' : 'text-slate-800'}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Review */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                  Ordered Replacement Components
                </h4>
                <div className="divide-y divide-slate-200 text-xs">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800">{i.quantity}x {i.name}</span>
                        <div className="text-[11px] text-slate-400">Part #: {i.part_number}</div>
                      </div>
                      <span className="font-black text-slate-900">{formatCurrency(i.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
              <Package className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-900">No order found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't locate an order with number "{query}". Please double check your order slip or WhatsApp us for instant verification.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
