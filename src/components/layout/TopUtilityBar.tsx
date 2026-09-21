'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Phone, Mail, MessageCircle, Truck, HelpCircle, User } from 'lucide-react';
import { cleanPhone } from '@/lib/whatsapp';

export function TopUtilityBar() {
  const { settings } = useCart();
  const phone = settings.general.phone || '0321-8888872';
  const whatsapp = cleanPhone(settings.general.whatsapp || '0321-8888872');
  const email = settings.general.email || 'usmanmalik9866@gmail.com';

  return (
    <div className="bg-slate-950 text-slate-200 text-xs sm:text-[13px] py-2 border-b border-slate-800 tracking-normal shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Contacts */}
        <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-6">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4 text-[#FF6A00]" />
            <span className="font-bold text-white tracking-wide">{phone}</span>
          </a>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Helpline</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4 text-[#FF6A00]" />
            <span>{email}</span>
          </a>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-4 sm:gap-5 text-slate-300 text-xs sm:text-[13px]">
          <Link
            href="/track-order/"
            prefetch={false}
            className="flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <Truck className="w-4 h-4 text-orange-400" />
            <span>Track Order</span>
          </Link>

          <span className="text-slate-700">|</span>

          <Link
            href="/contact/"
            prefetch={false}
            className="flex items-center gap-1.5 font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span>Help / Support</span>
          </Link>

          <span className="text-slate-700 hidden md:inline">|</span>

          <Link
            href="/admin/login/"
            prefetch={false}
            className="hidden md:flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <User className="w-4 h-4 text-[#FF6A00]" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
