'use client';

import React, { useState } from 'react';
import { buildInquiryWhatsAppLink } from '@/lib/whatsapp';
import { getSupabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { X, Wrench, MessageCircle, Send, CheckCircle } from 'lucide-react';

interface FitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export function FitmentModal({ isOpen, onClose, productName }: FitmentModalProps) {
  const { settings } = useCart();
  const [modelNumber, setModelNumber] = useState('');
  const [equipmentBrand, setEquipmentBrand] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWhatsAppInquiry = () => {
    if (!modelNumber.trim()) {
      alert('Please enter your equipment model number first.');
      return;
    }
    const link = buildInquiryWhatsAppLink(
      modelNumber,
      equipmentBrand,
      productName,
      settings.general.whatsapp
    );
    window.open(link, '_blank');
    onClose();
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelNumber || !phone) return;
    setIsSubmitting(true);

    try {
      const supabase = getSupabase();
      await supabase.from('inquiries').insert({
        model_number: modelNumber,
        equipment_brand: equipmentBrand,
        customer_name: customerName,
        contact_phone: phone,
        notes: `${productName ? `Inquiring for: ${productName}. ` : ''}${notes}`,
        status: 'new',
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Inquiry error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Part Compatibility Check</h3>
              <p className="text-xs text-slate-400">Our technicians will confirm exact fitment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-3 animate-bounce" />
              <h4 className="text-lg font-bold text-slate-900">Inquiry Received!</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Our parts specialist is reviewing your equipment specs and will reach out via WhatsApp/phone shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              {productName && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-slate-700">
                  Checking compatibility for: <span className="font-bold text-slate-900">{productName}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Equipment Brand <span className="text-slate-400 font-normal">(e.g. Hatco, Pitco)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brand name"
                    value={equipmentBrand}
                    onChange={(e) => setEquipmentBrand(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Model Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FRS-208, 35C+"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Customer / Business Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0321-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  rows={2}
                  placeholder="Mention equipment voltage, phase, or specific symptoms..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Ask on WhatsApp</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg shadow transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
