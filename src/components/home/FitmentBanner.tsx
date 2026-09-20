'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { cleanPhone } from '@/lib/whatsapp';
import { FitmentModal } from '@/components/common/FitmentModal';
import { Headphones, MessageCircle, ArrowRight } from 'lucide-react';

export function FitmentBanner() {
  const { settings } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const whatsapp = cleanPhone(settings.general.whatsapp || '0321-8888872');

  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    'Hello Usman Traders / ElectricPartsOnline! I need help identifying the right replacement part for my commercial equipment.'
  )}`;

  return (
    <>
      <section className="bg-slate-900 border-t border-slate-800 text-white relative overflow-hidden py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl">
            {/* Left Info */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-[#FF6A00] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Need Help Finding the Right Part?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Our commercial technicians are ready to verify your model number and assist you.
                </p>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="flex items-center flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="min-h-[44px] px-6 bg-[#FF6A00] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow flex items-center gap-2 transition-colors"
              >
                <span>Check Model Fitment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fitment Inquiry Modal */}
      <FitmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
