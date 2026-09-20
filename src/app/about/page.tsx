import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Wrench, Building2, CheckCircle2, Phone, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'About Us | Usman Traders - ElectricPartsOnline.com',
  description: 'Learn about Usman Traders, Pakistan’s leading supplier of commercial electrical, plumbing, hardware, and commercial kitchen replacement parts.',
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-black text-[#FF6A00] tracking-widest uppercase">
          Authorized Commercial Parts Supplier
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          About Usman Traders
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Delivering factory-tested commercial kitchen equipment parts, heavy-duty electrical components, plumbing fittings, and industrial hardware across Pakistan.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">100% Genuine OEM Fit</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every heating element, thermostat, contactor, and valve is engineered to match factory equipment specifications.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">Nationwide Fast Dispatch</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Commercial equipment breakdowns cost businesses money. We dispatch replacement parts same-day via premier couriers and cargo.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-lg">Technical Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our experienced technicians verify model numbers, voltage ratings, and dimensions to ensure zero wrong orders.
          </p>
        </div>
      </div>

      {/* Main Story Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-[#FF6A00]" />
            <span>Our Mission & Commercial Expertise</span>
          </h2>
          <p>
            Established as a dedicated supplier in Lahore, Pakistan, <strong>Usman Traders (electricpartsonline.com)</strong> was founded with a clear objective: to provide commercial restaurants, bakeries, hotels, fast-food chains, industrial facilities, and maintenance contractors with fast, direct access to genuine equipment spare parts.
          </p>
          <p>
            Commercial kitchens operate in intense, high-heat, high-demand environments. When a deep fryer element fails on a busy Friday evening, or a commercial ice machine compressor control board stops working, waiting weeks for imported parts is not an option. We maintain a large localized inventory of ready-to-ship parts.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-xl font-extrabold text-slate-950">Comprehensive Parts Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Commercial Fryer Parts:</strong> Elements (208V/240V/380V), high-limit thermostats, drain valves, nickel baskets.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Ice Machine & Refrigeration:</strong> Control boards, water circulation pumps, evaporators, fan motors.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Heavy Duty Electricals:</strong> 2-Pole & 3-Pole 40A/60A contactors, power relays, solid-state relays, fuses.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Commercial Gas & Hardware:</strong> Safety gas valves, thermocouples, pilot burners, stainless equipment legs.</span>
            </div>
          </div>
        </div>

        {/* Counter Pickup Callout */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-extrabold text-lg sm:text-xl">Warehouse Counter Pickup in Lahore</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Bring your faulty part or equipment model plate to our physical counter at Shop #19, Block N, Gulberg 2, Lahore for immediate matching.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a
              href="https://wa.me/923218888872"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Support</span>
            </a>
            <Link
              href="/contact/"
              prefetch={false}
              className="px-5 py-2.5 bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
