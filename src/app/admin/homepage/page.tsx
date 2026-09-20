'use client';

import React, { useState, useEffect } from 'react';
import { getHeroSlides, saveHeroSlide } from '@/lib/db';
import { HeroSlide } from '@/types';
import { ImageCompressorUpload } from '@/components/admin/ImageCompressorUpload';
import { Sliders, Plus, Edit2, CheckCircle2, Check, X } from 'lucide-react';

export default function AdminHomepageBuilderPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide>>({
    title: 'Quality Commercial Equipment Parts',
    subtitle: 'Electrical | Plumbing | Hardware | Kitchen Equipment Parts',
    badge_text: 'YOUR TRUSTED SOURCE FOR',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&q=80',
    cta_text: 'Shop Parts',
    cta_link: '/products/',
    sort_order: 1,
    is_active: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    getHeroSlides().then((res) => {
      if (res && res.length > 0) {
        setSlides(res);
        setEditingSlide(res[0]);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveHeroSlide(editingSlide);
      setNotice('Hero banner updated and synced successfully!');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Error saving slide: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {notice && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Homepage Hero Banner Builder
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize the storefront primary hero presentation, promotion badge, and CTA links
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Top Badge Text</label>
            <input
              type="text"
              required
              placeholder="YOUR TRUSTED SOURCE FOR"
              value={editingSlide.badge_text || ''}
              onChange={(e) => setEditingSlide({ ...editingSlide, badge_text: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Hero Main Heading</label>
            <input
              type="text"
              required
              placeholder="Quality Commercial Equipment Parts"
              value={editingSlide.title || ''}
              onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 font-extrabold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Subtitle / Equipment Categories</label>
            <input
              type="text"
              required
              placeholder="Electrical | Plumbing | Hardware | Kitchen Equipment Parts"
              value={editingSlide.subtitle || ''}
              onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Primary Button Text</label>
              <input
                type="text"
                required
                value={editingSlide.cta_text || 'Shop Parts'}
                onChange={(e) => setEditingSlide({ ...editingSlide, cta_text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Button Destination URL</label>
              <input
                type="text"
                required
                value={editingSlide.cta_link || '/products/'}
                onChange={(e) => setEditingSlide({ ...editingSlide, cta_link: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-mono"
              />
            </div>
          </div>

          <ImageCompressorUpload
            label="Background Commercial Banner Photo (WebP Compressed)"
            existingUrl={editingSlide.image_url}
            onImageUploaded={(url) => setEditingSlide({ ...editingSlide, image_url: url })}
            folder="banners"
          />

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-[44px] px-6 bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Banner'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
