'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getSupabase } from '@/lib/supabase';
import { cleanPhone, buildInquiryWhatsAppLink } from '@/lib/whatsapp';
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const { settings } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [model, setModel] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storePhone = settings.general.phone || '0321-8888872';
  const whatsapp = cleanPhone(settings.general.whatsapp || '0321-8888872');
  const email = settings.general.email || 'usmanmalik9866@gmail.com';
  const address = settings.general.address || 'Commercial Equipment Parts Market';
  const mapUrl = settings.general.mapUrl || 'https://maps.app.goo.gl/QA89GdbJBnTMPgou7';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);

    try {
      const supabase = getSupabase();
      await supabase.from('inquiries').insert({
        customer_name: name,
        contact_phone: phone,
        model_number: model || 'General Inquiry',
        notes: message,
        status: 'new',
      });
      setSubmitted(true);
      setName('');
      setPhone('');
      setModel('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    'Hello Usman Traders! I want to inquire about commercial equipment replacement parts.'
  )}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-black text-[#FF6A00] uppercase tracking-widest">
          Technical Support & Orders
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Contact Usman Traders
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Get in touch with our commercial equipment parts specialists for inquiries, quotations, and immediate dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Business Contacts & Map (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-black text-lg text-slate-950">Store Information</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <a
                href={`tel:${storePhone}`}
                className="flex items-start gap-3.5 text-slate-700 hover:text-slate-950 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Phone Helpline</div>
                  <div className="text-slate-600 mt-0.5">{storePhone}</div>
                </div>
              </a>

              <a
                href={directWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 text-slate-700 hover:text-slate-950 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="font-extrabold text-emerald-800">WhatsApp Instant Ordering</div>
                  <div className="text-slate-600 mt-0.5">{storePhone} (Direct Chat)</div>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-start gap-3.5 text-slate-700 hover:text-slate-950 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Email Address</div>
                  <div className="text-slate-600 mt-0.5">{email}</div>
                </div>
              </a>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 text-slate-700 hover:text-slate-950 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Warehouse Location</div>
                  <div className="text-slate-600 mt-0.5">{address}</div>
                  <div className="text-[11px] font-bold text-orange-600 mt-1">Open in Google Maps →</div>
                </div>
              </a>

              <div className="flex items-start gap-3.5 text-slate-700">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">Business Hours</div>
                  <div className="text-slate-600 mt-0.5">Mon - Sat: 9:00 AM - 9:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-black text-xl text-slate-950 mb-2">Send Us an Inquiry</h3>
          <p className="text-xs text-slate-500 mb-6">
            Provide your equipment model number or part details and our technician will respond quickly.
          </p>

          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-black text-slate-900">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you. Usman Traders parts specialist has received your request and will contact you via WhatsApp/phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full name or company"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0321-XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Equipment Brand & Model Number</label>
                <input
                  type="text"
                  placeholder="e.g. Hatco FRS-208, Manitowoc Q-Series..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Parts / Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the issue, part specifications, voltage, or quantity required..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2.5 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 min-h-[48px] bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>

                <a
                  href={directWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Interactive Google Map Section */}
      <div className="mt-12 sm:mt-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6A00] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-black text-lg sm:text-xl text-slate-950">
                Warehouse Location & Pickup Counter Map
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Shop #19, Block N, Usman Traders (Near Pepsi Cola Factory), Gulberg 2, Lahore, Pakistan
            </p>
          </div>

          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[42px] px-5 bg-slate-900 hover:bg-[#FF6A00] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <span>Get Directions on Google Maps</span>
            <span className="text-sm">↗</span>
          </a>
        </div>

        {/* Responsive Map Container */}
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100">
          <iframe
            title="Usman Traders Google Maps Location"
            src="https://maps.google.com/maps?q=SHOP+%2319+BLOCK+N,+Usman+Traders,+Block+N+Gulberg+2,+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
