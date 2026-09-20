'use client';

import React from 'react';
import { Order, SiteSettings } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Printer, X } from 'lucide-react';

interface PrintableInvoiceProps {
  order: Order;
  settings: SiteSettings;
  onClose: () => void;
}

export function PrintableInvoice({ order, settings, onClose }: PrintableInvoiceProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[96vh] sm:max-h-[92vh] overflow-hidden z-10">
        {/* Sticky Header with Controls (Hidden on Print) */}
        <div className="no-print p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Commercial Invoice Slip: {order.order_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 sm:px-4 py-1.5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Close Invoice (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area (Pure White Background, Strict Typography, Scrollable) */}
        <div id="printable-invoice-area" className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950">
                ELECTRIC<span className="text-[#FF6A00]">PARTS</span>ONLINE.COM
              </h1>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                Usman Traders — Commercial Equipment Parts
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                {settings.general.address || 'Commercial Equipment Parts Market, Pakistan'}
              </p>
              <p className="text-xs text-slate-500">
                Helpline / WhatsApp: <span className="font-semibold text-slate-800">{settings.general.phone}</span>
              </p>
              <p className="text-xs text-slate-500">
                Email: <span className="font-semibold text-slate-800">{settings.general.email}</span>
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block bg-slate-100 px-3 py-1 rounded-md text-xs font-black uppercase text-slate-800 tracking-wider">
                COMMERCIAL INVOICE
              </div>
              <div className="text-lg font-black text-slate-950 mt-2">{order.order_number}</div>
              <div className="text-xs text-slate-500 mt-1">
                Date: {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Status: <span className="font-bold uppercase text-slate-800">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Billed / Shipped To:
              </span>
              <div className="font-extrabold text-sm text-slate-950">{order.customer_name}</div>
              <div className="text-slate-700 mt-1">{order.customer_phone}</div>
              {order.customer_email && <div className="text-slate-600">{order.customer_email}</div>}
              <div className="text-slate-700 mt-1 font-medium">
                {order.shipping_address.address}, {order.shipping_address.city}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Payment & Dispatch Method:
              </span>
              <div className="font-bold text-slate-800 uppercase">
                {order.payment_method === 'whatsapp' ? 'Direct WhatsApp Order' : order.payment_method.replace('_', ' ')}
              </div>
              {order.delivery_notes && (
                <div className="mt-2 text-slate-600">
                  <strong className="text-slate-700">Notes:</strong> {order.delivery_notes}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100">
                  <th className="py-2.5 px-3 font-black text-slate-900">Item Description</th>
                  <th className="py-2.5 px-3 font-black text-slate-900">Part #</th>
                  <th className="py-2.5 px-3 font-black text-slate-900 text-right">Price</th>
                  <th className="py-2.5 px-3 font-black text-slate-900 text-center">Qty</th>
                  <th className="py-2.5 px-3 font-black text-slate-900 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.part_number}</td>
                    <td className="py-3 px-3 text-right text-slate-800">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-950">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-800">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Commercial Shipping:</span>
                <span className="font-bold text-slate-800">
                  {order.shipping_fee === 0 ? 'FREE' : formatCurrency(order.shipping_fee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                <span>Grand Total:</span>
                <span className="text-[#FF6A00]">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Return Policy */}
          <div className="border-t border-slate-200 pt-4 text-[11px] text-slate-500 leading-relaxed">
            <p className="font-bold text-slate-700 mb-0.5">Warranty & Terms:</p>
            <p>
              Electrical parts and gas controls must be installed by a certified commercial technician. Please retain this slip for warranty verification. For questions, contact Usman Traders helpline at {settings.general.phone}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
