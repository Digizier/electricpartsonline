import React from 'react';
import Link from 'next/link';
import { HelpCircle, Camera, CheckCircle2, MessageCircle, AlertCircle, Wrench } from 'lucide-react';

export const metadata = {
  title: 'Equipment Fitment Help & Part Matching | Usman Traders - ElectricPartsOnline.com',
  description: 'How to locate your commercial equipment model number and serial plate to guarantee 100% exact part fitment with Usman Traders.',
};

export default function FitmentHelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-black text-[#FF6A00] tracking-widest uppercase">
          Zero Wrong Orders Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Commercial Equipment Fitment Help
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Follow our 3-step guide to locate your machine’s data plate and have our parts specialists confirm the exact OEM replacement part.
        </p>
      </div>

      {/* 3 Step Visual Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] font-black text-base flex items-center justify-center">
            1
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Locate Data Plate</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Find the metallic identification badge or sticker attached to your fryer, oven, toaster, or ice machine chassis.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] font-black text-base flex items-center justify-center">
            2
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Take a Clear Photo</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Snap a clear phone picture showing the <strong>Model Number, Serial Number, Voltage, and Phase (1PH/3PH)</strong>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 font-black text-base flex items-center justify-center">
            3
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Send via WhatsApp</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Send the photo to <strong>0321-8888872</strong>. Our technician cross-references manufacturer schematics within minutes.
          </p>
        </div>
      </div>

      {/* Main Details */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-500" />
            <span>Where to Find Nameplates on Common Equipment</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">Commercial Deep Fryers:</span>
              <p className="text-slate-600">
                Inside the front cabinet door, or stamped on the right-hand interior wall behind the oil drain valve.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">Conveyor Toasters & Warmers:</span>
              <p className="text-slate-600">
                On the rear back panel or bottom side baseplate near where the main power cord enters.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">Commercial Ice Machines:</span>
              <p className="text-slate-600">
                Behind the front maintenance panel, adjacent to the air filter or electrical control box.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-extrabold text-slate-900 block">Electric Ranges & Griddles:</span>
              <p className="text-slate-600">
                Behind the grease drawer or underneath the front bullnose control panel ledge.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span>Why Voltage Verification Matters</span>
          </h2>
          <p>
            Commercial equipment operates across diverse industrial voltages in Pakistan. A 208V heating element installed in a 240V circuit will draw excessive current and burn out quickly; conversely, a 240V element in a 208V circuit will underheat and fail to recover fryer oil temperature properly.
          </p>
          <p>
            Always let our technicians verify the stamped wattage and voltage ratings to protect your equipment.
          </p>
        </section>
      </div>

      {/* Immediate WhatsApp Verification CTA */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-black text-lg text-emerald-950">Chat with a Parts Specialist Right Now</h4>
          <p className="text-xs sm:text-sm text-emerald-800">
            Send your equipment photo or faulty part photo to our direct WhatsApp line for instant matching.
          </p>
        </div>
        <a
          href="https://wa.me/923218888872?text=Hello%20Usman%20Traders!%20I%20need%20help%20identifying%20the%20correct%20replacement%20part%20for%20my%20commercial%20equipment."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 flex-shrink-0 transition-all"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Send Photo to 0321-8888872</span>
        </a>
      </div>
    </div>
  );
}
