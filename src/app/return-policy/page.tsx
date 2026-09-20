import React from 'react';
import Link from 'next/link';
import { RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Return & Exchange Policy | Usman Traders - ElectricPartsOnline.com',
  description: 'Return, exchange, and claims policy for commercial replacement parts, heating elements, thermostats, and electrical components at Usman Traders.',
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-black text-[#FF6A00] tracking-widest uppercase">
          Customer Protection & Assurance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Return & Replacement Policy
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Clear, transparent guidelines regarding product replacements, transit damages, and electrical components inspection.
        </p>
      </div>

      {/* Main Policy Content */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-orange-500" />
            <span>1. 7-Day Replacement Guarantee</span>
          </h2>
          <p>
            Usman Traders provides a <strong>7-Day Replacement Guarantee</strong> starting from the date the package is delivered by courier or collected at our warehouse counter.
          </p>
          <p>
            If you received a part that is physically defective, incorrect due to a dispatch error, or differs from the specifications ordered, we will replace the item promptly with zero additional delivery cost.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>2. Conditions for Commercial Electrical Parts</span>
          </h2>
          <p>
            Commercial equipment electrical items (including heating elements, thermostats, contactors, solenoid coils, and control boards) are sensitive to external installation factors:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Uninstalled / Unused Condition:</strong> Returns or size exchanges are accepted only if the part has <em>not been dry-fired, bent, soldered, or permanently installed into oil/water</em>.
            </li>
            <li>
              <strong>Dry-Fire Damage Exclusion:</strong> Fryer heating elements powered on without oil/liquid immersion will immediately burn out. Such operational damages caused by improper installation cannot be claimed under warranty.
            </li>
            <li>
              <strong>Voltage Compatibility:</strong> Ensure your building voltage matches the rated element (e.g. 208V single phase vs 380V three phase). Our team assists in voltage verification prior to shipping.
            </li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>3. How to Initiate a Return or Exchange</span>
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
            <li>Take clear photos or a short video showing the part, the OEM label, and the issue.</li>
            <li>Send the details along with your Order Number to our WhatsApp helpline: <strong>0321-8888872</strong>.</li>
            <li>Our technical department will review and authorize a return/exchange within 2 to 4 business hours.</li>
            <li>Pack the item safely in its original packaging and dispatch it to our Lahore warehouse address.</li>
            <li>Upon receiving and inspecting the item, your replacement will be dispatched within 24 hours.</li>
          </ol>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500" />
            <span>4. Damaged in Transit Claims</span>
          </h2>
          <p>
            If a parcel arrives with severe external damage from the courier, please take photos before opening the package and notify us within <strong>24 hours</strong> of delivery so an immediate courier compensation claim can be filed and a fresh part dispatched.
          </p>
        </section>
      </div>

      {/* WhatsApp Help CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-sm sm:text-base">Have a Question About Part Compatibility?</div>
          <div className="text-xs text-slate-400 mt-0.5">Avoid returns by having our experts verify your model before dispatch.</div>
        </div>
        <a
          href="https://wa.me/923218888872?text=Hello%20Usman%20Traders!%20I%20have%20a%20question%20regarding%20returns%20or%20part%20exchange."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-2 flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Support: 0321-8888872</span>
        </a>
      </div>
    </div>
  );
}
