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
    <div className="bg-slate-950 text-slate-300 text-[11px] sm:text-xs py-1.5 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5">
        {/* Left Contacts */}
        <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-5">
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold text-white">{phone}</span>
          </a>

          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-orange-500" />
            <span>{email}</span>
          </a>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-4 text-slate-400">
          <Link
            href="/track-order/"
            prefetch={false}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </Link>

          <span className="text-slate-700">|</span>

          <Link
            href="/contact/"
            prefetch={false}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </Link>

          <span className="text-slate-700 hidden md:inline">|</span>

          <Link
            href="/admin/login/"
            prefetch={false}
            className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
          >
            <User className="w-3.5 h-3.5 text-orange-500" />
            <span>Admin Panel</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
