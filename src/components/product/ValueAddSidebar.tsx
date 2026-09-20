'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Truck, RotateCcw, Lock, Headphones, MessageCircle } from 'lucide-react';
import { FitmentModal } from '@/components/common/FitmentModal';
import { cleanPhone } from '@/lib/whatsapp';

interface ValueAddSidebarProps {
  productName?: string;
}

export function ValueAddSidebar({ productName }: ValueAddSidebarProps) {
  const { settings } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const whatsapp = cleanPhone(settings.general.whatsapp || '0321-8888872');

  const freeThreshold = settings.shipping.freeShippingThreshold || 300;

  return (
    <>
      <div className="space-y-4">
        {/* Assurances Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Free Shipping</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                On commercial orders over ${freeThreshold}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">30-Day Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Hassle free return policy on unused parts
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Secure Payment</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                100% safe checkout & verified bank/COD options
              </p>
            </div>
          </div>
        </div>

        {/* Need Help Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 text-[#FF6A00] flex items-center justify-center mx-auto mb-3">
            <Headphones className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold">Need Help?</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Not sure if this part fits your model? Send us your serial/model plate photo.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full min-h-[40px] px-4 bg-[#FF6A00] hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Verify Fitment
            </button>

            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                `Hello Usman Traders! Can you confirm if part ${productName || ''} fits my commercial unit?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[40px] px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <FitmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
      />
    </>
  );
}
