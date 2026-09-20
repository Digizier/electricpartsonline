'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { Check, HelpCircle } from 'lucide-react';
import { FitmentModal } from '@/components/common/FitmentModal';

interface SpecsTabsProps {
  product: Product;
}

export function SpecsTabs({ product }: SpecsTabsProps) {
  const tabs: { id: string; label: string }[] = [];
  if (product.enable_details_bullets !== false) {
    tabs.push({ id: 'details', label: 'Product Details' });
  }
  if (product.enable_specs_compat !== false) {
    tabs.push({ id: 'specs', label: 'Specifications' });
    tabs.push({ id: 'compat', label: 'Compatibility' });
  }
  if (product.enable_manuals !== false && product.manuals && product.manuals.length > 0) {
    tabs.push({ id: 'manuals', label: 'Manuals & Downloads' });
  }
  if (product.enable_variants_reviews !== false && product.show_reviews) {
    tabs.push({ id: 'reviews', label: `Reviews (${product.review_count || 12})` });
  }

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || 'details');
  const [isFitmentModalOpen, setIsFitmentModalOpen] = useState(false);

  // If activeTab is no longer in tabs, select first available
  const currentTab = tabs.find((t) => t.id === activeTab)?.id || tabs[0]?.id;

  return (
    <>
      {tabs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  currentTab === tab.id
                    ? 'border-[#FF6A00] text-[#FF6A00] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8">
            {/* Tab 1: Product Details */}
            {currentTab === 'details' && (
              <div className={product.enable_specs_compat !== false ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "max-w-4xl space-y-6"}>
                {/* Left Column: Description & Bullet Features */}
                <div className={`${product.enable_specs_compat !== false ? "lg:col-span-1" : ""} space-y-4`}>
                  <h3 className="font-extrabold text-base text-slate-900">Product Details</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="space-y-2 pt-2 text-xs">
                    {product.details_bullets && product.details_bullets.length > 0 ? (
                      product.details_bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-700">
                          <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="font-medium leading-snug">{bullet}</span>
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>

                {/* Only display Specifications and Compatibility if enabled by admin */}
                {product.enable_specs_compat !== false && (
                  <>
                    {/* Center Column: Specifications Preview Table */}
                    <div className="lg:col-span-1">
                      <h3 className="font-extrabold text-base text-slate-900 mb-3">Specifications</h3>
                      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
                        {Object.entries(product.specifications || {}).length > 0 ? (
                          Object.entries(product.specifications || {}).map(([key, val]) => (
                            <div key={key} className="flex justify-between p-2.5 bg-slate-50/50">
                              <span className="font-semibold text-slate-500">{key}</span>
                              <span className="font-extrabold text-slate-900 text-right">{val}</span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-xs text-slate-400">Standard OEM specifications.</div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Compatibility Preview */}
                    <div className="lg:col-span-1">
                      <h3 className="font-extrabold text-base text-slate-900 mb-3">Compatible With</h3>
                      <div className="space-y-2.5 text-xs text-slate-700">
                        {product.compatibility && product.compatibility.length > 0 ? (
                          product.compatibility.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3" />
                              </div>
                              <span className="font-semibold">{item}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">Universal commercial equipment compatibility.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          {/* Tab 2: Specifications Table */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="font-extrabold text-base text-slate-900 mb-4">Technical Specifications</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-sm">
                {Object.entries(product.specifications || {}).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-2 p-3 bg-slate-50/50">
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="font-extrabold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Compatibility */}
          {activeTab === 'compat' && (
            <div className="max-w-2xl">
              <h3 className="font-extrabold text-base text-slate-900 mb-4">Compatible Equipment Models</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.compatibility?.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Manuals & Downloads */}
          {activeTab === 'manuals' && (
            <div className="text-xs sm:text-sm text-slate-600 space-y-4 max-w-2xl">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Manuals & Technical Diagrams</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official wiring schematics, installation guidelines, and OEM replacement diagrams for part #{product.part_number}.
                </p>
              </div>

              {product.manuals && product.manuals.length > 0 ? (
                <div className="space-y-2.5 pt-2">
                  {product.manuals.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-orange-50/30 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF6A00] flex items-center justify-center font-bold text-xs">
                          PDF
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{m.title}</div>
                          {m.file_size && <div className="text-[11px] text-slate-400 font-semibold">{m.file_size}</div>}
                        </div>
                      </div>
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-[#FF6A00] text-white text-xs font-extrabold rounded-lg transition-colors"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsFitmentModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Request Additional Spec Sheets
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Reviews (Only rendered if show_reviews is true) */}
          {product.show_reviews && activeTab === 'reviews' && (
            <div className="space-y-4 max-w-xl text-xs sm:text-sm">
              <h3 className="font-extrabold text-base text-slate-900">Verified Customer Reviews</h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>Commercial Kitchen Repair Tech</span>
                  <span className="text-amber-500">★★★★★</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  "Exact replacement fit for our commercial fryer. Fired right up, heat recovery is back to original factory specs. Fast dispatch from Usman Traders!"
                </p>
              </div>
            </div>
          )}

          {/* Fitment Check Callout Banner */}
          <div className="mt-8 p-4 sm:p-5 bg-orange-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF6A00] text-white flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Not sure if this part fits your equipment?
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  Send us your equipment model number and our technicians will help you find the right part.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFitmentModalOpen(true)}
              className="min-h-[40px] px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex-shrink-0"
            >
              Ask a Question
            </button>
          </div>
        </div>
      </div>
    )}

      <FitmentModal
        isOpen={isFitmentModalOpen}
        onClose={() => setIsFitmentModalOpen(false)}
        productName={product.name}
      />
    </>
  );
}
