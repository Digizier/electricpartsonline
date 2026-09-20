'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { useCart } from '@/context/CartContext';
import { getBrands } from '@/lib/db';
import { Brand } from '@/types';
import { ArrowRight, MessageCircle, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { cleanPhone } from '@/lib/whatsapp';

export function Footer() {
  const { settings } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    getBrands().then((b) => {
      if (b && b.length > 0) setBrands(b.filter(x => x.is_active !== false).slice(0, 7));
    });
    const handleUpdate = () => {
      getBrands().then((b) => {
        if (b && b.length > 0) setBrands(b.filter(x => x.is_active !== false).slice(0, 7));
      });
    };
    window.addEventListener('epo_brands_updated', handleUpdate);
    return () => window.removeEventListener('epo_brands_updated', handleUpdate);
  }, []);

  const phone = settings.general.phone || '0321-8888872';
  const whatsapp = cleanPhone(settings.general.whatsapp || '0321-8888872');
  const storeEmail = settings.general.email || 'usmanmalik9866@gmail.com';
  const mapUrl = settings.general.mapUrl || 'https://maps.app.goo.gl/QA89GdbJBnTMPgou7';
  const instagramUrl = settings.general.instagramUrl || 'https://www.instagram.com/usmantraders.electric?stkn=MWNlaGlpaGwwYWFvMA==';
  const tiktokUrl = settings.general.tiktokUrl || 'https://www.tiktok.com/@usmantraders_electric?_r=1&_t=ZS-99t6QIpYkjI';
  const facebookUrl = settings.general.facebookUrl || 'https://www.facebook.com/share/18dJmrRRcu/';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800 pb-16 md:pb-0">
      {/* Main Footer Links Grid with Optimized Mobile Spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-8">
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <Logo />
            <p className="text-xs font-bold text-[#FF6A00] tracking-wider uppercase">
              Commercial Parts | Better Business
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Usman Traders — authorized commercial equipment parts distributor. Genuine heating elements, gas valves, contactors, motors, water pumps, and hardware fittings for high-volume commercial kitchens, bakeries, and restaurants.
            </p>

            <div className="space-y-1.5 pt-1 text-xs">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>{phone}</span>
              </a>

              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current flex-shrink-0" />
                <span>WhatsApp: {phone}</span>
              </a>

              <a
                href={`mailto:${storeEmail}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>{storeEmail}</span>
              </a>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors text-orange-400"
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>View Google Maps Location</span>
              </a>
            </div>
          </div>

          {/* Quick Links, Shop By Brand & Customer Service */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:contents">
            {/* Col 2: Quick Links */}
            <div className="space-y-2.5">
              <h4 className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase">Quick Links</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <Link href="/" prefetch={false} className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products/" prefetch={false} className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/about/" prefetch={false} className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact/" prefetch={false} className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/track-order/" prefetch={false} className="hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/fitment-help/" prefetch={false} className="hover:text-orange-400 transition-colors">
                    Fitment Help
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Shop By Brand */}
            <div className="space-y-2.5">
              <h4 className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase">Shop By Brand</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {brands.length > 0 ? (
                  brands.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`/products/?brand=${b.id}`}
                        prefetch={false}
                        className="hover:text-orange-400 transition-colors truncate block"
                      >
                        {b.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link href="/products/?brand=siemens" prefetch={false} className="hover:text-white">Siemens</Link></li>
                    <li><Link href="/products/?brand=schneider" prefetch={false} className="hover:text-white">Schneider</Link></li>
                    <li><Link href="/products/?brand=philips" prefetch={false} className="hover:text-white">Philips</Link></li>
                  </>
                )}
                <li className="pt-1">
                  <Link
                    href="/products/"
                    prefetch={false}
                    className="text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center gap-1"
                  >
                    <span>All Brands</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Customer Service */}
            <div className="space-y-2.5">
              <h4 className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase">Customer Service</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <Link href="/shipping-policy/" prefetch={false} className="hover:text-white transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/return-policy/" prefetch={false} className="hover:text-white transition-colors">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy/" prefetch={false} className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms/" prefetch={false} className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/contact/" prefetch={false} className="hover:text-white transition-colors">
                    Helpline & Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 4: Newsletter & Social */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase">Newsletter</h4>
            <p className="text-xs text-slate-400 leading-normal">
              Get the latest commercial equipment parts updates and technical bulletins.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/50 p-2.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 px-3 py-2 text-xs rounded-l-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="bg-[#FF6A00] hover:bg-orange-600 text-white px-3.5 py-2 rounded-r-lg flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Social Links */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-bold text-slate-300 tracking-wider uppercase block">
                Connect With Us
              </span>
              <div className="flex items-center flex-wrap gap-2.5">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                  aria-label="Instagram"
                  title="Follow on Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-black text-white border border-slate-700/80 flex items-center justify-center shadow-md hover:border-cyan-400 hover:scale-110 transition-all duration-200"
                  aria-label="TikTok"
                  title="Follow on TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.61V6.85a4.86 4.86 0 0 1-1-.16z"/>
                  </svg>
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shadow-md hover:bg-[#166fe5] hover:scale-110 transition-all duration-200"
                  aria-label="Facebook"
                  title="Follow on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-md hover:bg-[#20bd5a] hover:scale-110 transition-all duration-200"
                  aria-label="WhatsApp"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="border-t border-slate-900 bg-black/50 py-3.5 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] sm:text-xs text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} ElectricPartsOnline.com / Usman Traders. All rights reserved.
          </div>

          {/* Payment Badges (Cleaned: VISA/MasterCard removed) */}
          <div className="flex items-center flex-wrap justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-slate-400">
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">EasyPaisa</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-rose-400">JazzCash</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-blue-400">Bank Transfer</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-amber-400">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
