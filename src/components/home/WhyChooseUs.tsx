'use client';

import React from 'react';
import { ShieldCheck, Truck, ShoppingCart, Headphones } from 'lucide-react';

export function WhyChooseUs() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Why Choose <span className="text-[#FF6A00]">ElectricPartsOnline?</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
            The dependable partner for restaurants, hotels, bakeries, and commercial equipment technicians.
          </p>
        </div>

        {/* 4 Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Quality Parts */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-orange-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6A00] flex items-center justify-center mb-4 shadow-sm border border-orange-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950">Quality Parts</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Genuine & reliable OEM-compatible replacement parts sourced directly from authorized manufacturers.
            </p>
          </div>

          {/* 2. Fast Response */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-orange-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6A00] flex items-center justify-center mb-4 shadow-sm border border-orange-100">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950">Fast Response</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Quick order processing and expedited commercial shipping to minimize your kitchen downtime.
            </p>
          </div>

          {/* 3. Easy Ordering */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-orange-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6A00] flex items-center justify-center mb-4 shadow-sm border border-orange-100">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950">Easy Ordering</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Simple part number search, 1-click WhatsApp checkout, and seamless quotation support.
            </p>
          </div>

          {/* 4. Trusted Service */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:border-orange-300 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6A00] flex items-center justify-center mb-4 shadow-sm border border-orange-100">
              <Headphones className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-950">Trusted Service</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Technical experts ready to verify fitment and assist commercial kitchens nationwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
