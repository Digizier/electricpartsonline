import React from 'react';
import Link from 'next/link';
import { FileText, CheckSquare, ShieldCheck, Scale } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Usman Traders - ElectricPartsOnline.com',
  description: 'Terms of sale, commercial equipment parts usage, and technical liability terms for Usman Traders / ElectricPartsOnline.com.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-black text-[#FF6A00] tracking-widest uppercase">
          Commercial Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Please review the commercial sales terms governing the purchase and supply of equipment spare parts from Usman Traders.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-orange-500" />
            <span>1. Commercial Sales & Quotations</span>
          </h2>
          <p>
            All listed prices on ElectricPartsOnline.com are stated in <strong>Pakistani Rupees (PKR / Rs.)</strong>. We reserve the right to revise catalog prices based on commercial import tariff adjustments or exchange rate fluctuations. Confirmed orders will be honored at the price agreed upon at the time of checkout or WhatsApp quotation.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <span>2. Technical Model Verification & Fitment</span>
          </h2>
          <p>
            Commercial equipment manufacturers frequently modify specifications between model production years. While Usman Traders provides extensive OEM cross-referencing, the purchaser or qualified technician is responsible for verifying equipment voltage, phase (single-phase vs. three-phase), physical measurements, and terminal fittings prior to installation.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span>3. Professional Installation Requirement</span>
          </h2>
          <p>
            Commercial food service equipment operates under high thermal and electrical loads (up to 480V and 60 Amps). All electrical components, heating elements, contactors, and gas valves must be installed by a licensed electrician, HVAC technician, or qualified commercial appliance repair professional. Usman Traders is not liable for damages caused by improper installation or unauthorized modifications.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-500" />
            <span>4. Limitation of Liability</span>
          </h2>
          <p>
            In no event shall Usman Traders or its management be held liable for secondary or consequential commercial losses (including food spoilage, restaurant downtime, lost revenue, or business interruption) resulting from parts delays, transit delays by third-party couriers, or equipment failures beyond the replacement cost of the specific purchased component.
          </p>
        </section>
      </div>
    </div>
  );
}
