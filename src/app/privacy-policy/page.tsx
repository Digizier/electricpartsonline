import React from 'react';
import Link from 'next/link';
import { Lock, EyeOff, ShieldCheck, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Usman Traders - ElectricPartsOnline.com',
  description: 'Learn how Usman Traders protects customer information, commercial transaction data, and order history.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-black text-[#FF6A00] tracking-widest uppercase">
          Data Protection & Privacy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your privacy and commercial trade details are strictly protected by Usman Traders / ElectricPartsOnline.com.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When placing an order or requesting a technical quotation on our website or through WhatsApp, we collect only the necessary details required to deliver your commercial parts:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Customer Name, Business / Restaurant Name.</li>
            <li>Contact Phone Number and WhatsApp Number.</li>
            <li>Destination Shipping Address and City.</li>
            <li>Equipment Brand & Model Number for technical fitment verification.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-orange-500" />
            <span>2. No Sharing or Selling of Data</span>
          </h2>
          <p>
            We respect your business confidentiality. Usman Traders <strong>NEVER</strong> sells, rents, trades, or shares customer phone numbers, addresses, or purchase history with third-party marketing agencies or external data brokers.
          </p>
          <p>
            Customer delivery details are provided solely to our authorized courier partners (such as TCS, Leopards, Trax) strictly for logistics fulfillment.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span>3. Order Communications</span>
          </h2>
          <p>
            Your provided phone number or WhatsApp is used exclusively for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Sending order confirmations and tracking numbers.</li>
            <li>Direct technical clarification (e.g. confirming terminal style or voltage rating before dispatch).</li>
            <li>Responding to customer support queries and warranty claims.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-500" />
            <span>4. Contact Our Privacy Officer</span>
          </h2>
          <p>
            If you have questions regarding our data protection standards or wish to request the deletion of your customer profile, you may contact our management desk at <strong>usmanmalik9866@gmail.com</strong> or call <strong>0321-8888872</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
