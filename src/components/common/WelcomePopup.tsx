'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { X, MessageCircle, Sparkles } from 'lucide-react';
import { cleanPhone } from '@/lib/whatsapp';

export function WelcomePopup() {
  const { settings } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!settings.popup.enabled) return;
    const dismissed = sessionStorage.getItem('epo_popup_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [settings.popup.enabled]);

  useEffect(() => {
    const handleForceOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('epo_test_popup', handleForceOpen);
    return () => window.removeEventListener('epo_test_popup', handleForceOpen);
  }, []);

  if (!isOpen || !settings.popup.enabled) return null;

  const handleDismiss = () => {
    sessionStorage.setItem('epo_popup_dismissed', 'true');
    setIsOpen(false);
  };

  const phone = cleanPhone(settings.popup.whatsappNumber || settings.general.whatsapp);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hello Usman Traders! I am browsing electricpartsonline.com and need assistance finding commercial parts.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm w-full p-4">
      <div className="relative bg-slate-900 text-white rounded-2xl shadow-2xl border border-orange-500/30 p-5 overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Dismiss popup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-orange-400 font-extrabold text-xs tracking-wider uppercase mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Quick Assistance</span>
        </div>

        <h4 className="font-extrabold text-base text-white">
          {settings.popup.headline || 'Need Help Finding The Right Part?'}
        </h4>

        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          {settings.popup.subheadline ||
            'Send a photo or model number of your equipment directly to our WhatsApp support team.'}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="flex-1 min-h-[40px] flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
          <button
            onClick={handleDismiss}
            className="px-3 min-h-[40px] text-xs font-semibold text-slate-400 hover:text-white"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
