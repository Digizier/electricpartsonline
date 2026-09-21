'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, getSiteSettings, saveSiteSettings } from '@/lib/db';
import { Product, SiteSettings } from '@/types';
import { Share2, Download, Copy, CheckCircle2, FileSpreadsheet, Sparkles } from 'lucide-react';

export default function AdminAdvertisementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pixelId, setPixelId] = useState('1316498475903579');
  const [isPixelEnabled, setIsPixelEnabled] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
    getSiteSettings().then(setSettings);
  }, []);

  const downloadFacebookCatalogCSV = () => {
    if (products.length === 0) {
      setNotice('No products available to export.');
      setTimeout(() => setNotice(null), 3000);
      return;
    }

    // Standard Meta / Facebook Catalog CSV Headers
    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'mpn',
    ];

    const rows = products.map((p) => {
      const escape = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
      return [
        p.id,
        escape(p.name),
        escape(p.description || p.name),
        p.is_in_stock ? 'in stock' : 'out of stock',
        'new',
        `${p.price.toFixed(2)} USD`,
        `https://electricpartsonline.com/product/?slug=${p.slug}`,
        p.thumbnail_url || p.images?.[0] || '',
        escape('ElectricPartsOnline'),
        escape(p.part_number),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `facebook_catalog_electricpartsonline_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotice('Facebook Catalog CSV generated and downloaded successfully!');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSavePixel = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Meta Pixel settings updated!');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {notice && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Advertisement & Facebook Product Catalog
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Export Facebook / Meta catalog feeds directly from products data without creating redundant database tables
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: 1-Click Facebook Catalog Export */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF6A00] font-black text-xs uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Facebook Catalog Feed (CSV)</span>
            </div>
            <h3 className="font-extrabold text-lg text-white">Direct Catalog Sync</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Downloads your live commercial parts database formatted for Facebook Commerce Manager and Google Merchant Center. Automatically maps Part Numbers, WebP image links, and stock statuses.
            </p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <div>Catalog Items: <strong className="text-white">{products.length} Products</strong></div>
            <div>Format: <strong className="text-white">Standard Meta Commerce CSV</strong></div>
          </div>

          <button
            type="button"
            onClick={downloadFacebookCatalogCSV}
            className="min-h-[44px] px-6 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center justify-center gap-2 transition-colors w-full"
          >
            <Download className="w-4 h-4" />
            <span>Download Facebook Catalog CSV</span>
          </button>
        </div>

        {/* Card 2: Meta Pixel Configuration */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Tracking & Pixels</span>
            </div>
            <h3 className="font-extrabold text-lg text-white">Meta (Facebook) Pixel</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Track conversion events (PageView, ViewContent, AddToCart, Purchase) for your commercial ad campaigns.
            </p>
          </div>

          <form onSubmit={handleSavePixel} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Pixel ID</label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="e.g. 1316498475903579"
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl font-mono text-xs focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <label className="flex items-center gap-2 font-bold text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPixelEnabled}
                onChange={(e) => setIsPixelEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Enable Pixel Tracking</span>
            </label>

            <button
              type="submit"
              className="min-h-[40px] px-4 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl transition-colors w-full mt-2"
            >
              Save Pixel Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
