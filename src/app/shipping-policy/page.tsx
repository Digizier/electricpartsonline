import React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin, AlertCircle, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | Usman Traders - ElectricPartsOnline.com',
  description: 'Nationwide commercial parts delivery policy across Pakistan. Dispatch timelines, courier partners, free shipping thresholds, and urgent bus cargo options.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-black text-[#FF6A00] tracking-widest uppercase">
          Nationwide Logistics & Delivery
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Shipping & Dispatch Policy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Fast, reliable commercial delivery across all major cities, industrial hubs, and towns throughout Pakistan.
        </p>
      </div>

      {/* Fast Facts Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center">
          <div className="font-black text-2xl text-slate-950">Rs. 5,000</div>
          <div className="text-xs font-bold text-orange-800 mt-1">FREE Shipping Threshold</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Orders above qualify for free standard courier</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
          <div className="font-black text-2xl text-slate-950">Rs. 250</div>
          <div className="text-xs font-bold text-slate-800 mt-1">Flat Standard Shipping</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Applies to all sub-threshold retail orders</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
          <div className="font-black text-2xl text-emerald-700">1-3 Days</div>
          <div className="text-xs font-bold text-emerald-800 mt-1">Standard Delivery Time</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Nationwide via premium courier services</div>
        </div>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span>1. Same-Day Order Processing Cut-Off</span>
          </h2>
          <p>
            Orders confirmed before <strong>4:00 PM (Pakistan Standard Time)</strong> from Monday to Saturday are packed, tested (where applicable), and handed over to our courier partner on the exact same business day.
          </p>
          <p>
            Orders placed on Sundays or gazetted public holidays are processed and dispatched on the immediate next working morning.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-500" />
            <span>2. Courier & Logistics Partners</span>
          </h2>
          <p>
            To guarantee maximum safety for delicate electrical heating coils, thermostats, and circuit boards, we partner with reliable express carriers:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>TCS Express & Leopards Courier:</strong> Standard door-to-door transit (1–2 days for major cities including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Peshawar).</li>
            <li><strong>Trax & PostEx:</strong> Cash on Delivery (COD) services to over 400+ cities and towns across Pakistan.</li>
            <li><strong>Daewoo Express Cargo / Faisal Movers:</strong> Same-day terminal-to-terminal express collection for emergency restaurant breakdowns.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span>3. Urgent / Emergency Breakdown Shipping</span>
          </h2>
          <p>
            If your restaurant fryer or bakery oven is currently down and you require a part within hours, please notify us immediately via WhatsApp at <strong>0321-8888872</strong>. We can arrange express cargo via inter-city bus terminals (Daewoo, Niazi, Faisal Movers) where you can pick up the parcel directly from the destination terminal within 6 to 12 hours.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span>4. Heavy Shock-Absorbing Packaging</span>
          </h2>
          <p>
            Commercial heating elements, thermostats with delicate capillary tubes, and electronic display boards are individually bubble-wrapped, packed with high-density foam buffers, and secured in heavy-duty corrugated cartons to withstand rough transit conditions.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>5. Direct Warehouse Pickup</span>
          </h2>
          <p>
            Customers and local technicians in Lahore are welcome to visit our warehouse counter directly at <strong>Shop #19, Block N, Gulberg 2, Lahore</strong> to collect ordered parts immediately with zero shipping fee.
          </p>
        </section>
      </div>

      {/* Support Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-sm sm:text-base">Need Tracking Details or Emergency Dispatch?</div>
          <div className="text-xs text-slate-400 mt-0.5">Contact our dispatch desk directly on WhatsApp.</div>
        </div>
        <a
          href="https://wa.me/923218888872"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Dispatch Helpline: 0321-8888872</span>
        </a>
      </div>
    </div>
  );
}
