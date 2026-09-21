'use client';

import React, { useState, useEffect } from 'react';
import { getAllHeroSlides, saveHeroSlide, deleteHeroSlide } from '@/lib/db';
import { HeroSlide } from '@/types';
import { ImageCompressorUpload } from '@/components/admin/ImageCompressorUpload';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminHomepageBuilderPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadSlides = async () => {
    try {
      const res = await getAllHeroSlides();
      setSlides(res || []);
    } catch (e) {
      console.error('Error fetching slides:', e);
    }
  };

  useEffect(() => {
    loadSlides();
    window.addEventListener('epo_hero_updated', loadSlides);
    return () => window.removeEventListener('epo_hero_updated', loadSlides);
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingSlide({
      title: '',
      subtitle: '',
      badge_text: '',
      image_url: '',
      cta_text: 'Shop Now',
      cta_link: '/products/',
      sort_order: slides.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      await saveHeroSlide({
        ...slide,
        is_active: !slide.is_active,
      });
      showNotice(`Banner is now ${!slide.is_active ? 'active on storefront' : 'hidden'}.`);
      loadSlides();
    } catch (e) {
      console.error('Toggle active error:', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.image_url) {
      showNotice('Please upload or provide a banner image URL.');
      return;
    }

    setIsSaving(true);
    try {
      await saveHeroSlide(editingSlide);
      setIsModalOpen(false);
      setEditingSlide(null);
      showNotice('Banner saved and updated successfully!');
      loadSlides();
    } catch (err: any) {
      console.error('Save banner error:', err);
      showNotice('Error saving banner: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      await deleteHeroSlide(deleteTarget.id);
      showNotice('Banner removed successfully.');
      setDeleteTarget(null);
      loadSlides();
    } catch (e: any) {
      console.error('Delete banner error:', e);
      showNotice('Error deleting banner: ' + e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {notice && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-[#FF6A00]" />
            <span>Homepage Hero Banner Builder</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage multi-image rotating banners for the storefront header slider
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-orange-950/40 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Recommended Size & Aspect Ratio Box */}
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-slate-300">
        <Sparkles className="w-5 h-5 text-[#FF6A00] flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <div className="font-extrabold text-white">
            💡 Recommended Banner Size & Ratio:
          </div>
          <div className="text-slate-200">
            Standard Dimensions:{' '}
            <span className="font-mono font-black text-[#FF6A00] bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/30">
              1920 × 600 px
            </span>{' '}
            or{' '}
            <span className="font-mono font-black text-[#FF6A00] bg-orange-500/20 px-2 py-0.5 rounded border border-orange-500/30">
              1600 × 500 px
            </span>{' '}
            (~16:5 / 3:1 ratio).
          </div>
          <p className="text-slate-400 text-xs">
            Banners are automatically optimized to fit cleanly on both mobile phones and desktop screens. Images auto-rotate every 3 seconds on the storefront with swipe, click, and arrow controls.
          </p>
        </div>
      </div>

      {/* Banner Slides List */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Active Banner Slides ({slides.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Slides rotate automatically every 3 seconds
          </span>
        </div>

        {slides.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="font-bold text-sm text-slate-300">No Banners Configured Yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Click &ldquo;Add New Banner&rdquo; above to upload your first rotating image slide.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {slides.map((slide, index) => (
              <div
                key={slide.id || index}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
              >
                {/* Banner Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative w-36 sm:w-48 aspect-[16/6] bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex-shrink-0">
                    <img
                      src={slide.image_url}
                      alt={slide.title || `Banner ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/70 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                      #{slide.sort_order ?? index + 1}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">
                        {slide.title || `Banner Slide #${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(slide)}
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-colors flex items-center gap-1 ${
                          slide.is_active
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="Click to toggle active status"
                      >
                        {slide.is_active ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-slate-400 font-mono truncate flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-orange-400 flex-shrink-0" />
                      <span>Link: {slide.cta_link || '/products/'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>Button: <strong className="text-orange-400 font-semibold">{slide.cta_text || 'Shop Now'}</strong></span>
                      <span>•</span>
                      <span>Sort Order: {slide.sort_order ?? index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(slide)}
                    className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && editingSlide && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSaving) {
              setIsModalOpen(false);
              setEditingSlide(null);
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSlide(null);
              }}
              disabled={isSaving}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-white tracking-tight mb-1">
              {editingSlide.id ? 'Edit Hero Banner' : 'Add New Hero Banner'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Upload banner image and configure its link and display sequence
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <ImageCompressorUpload
                label="Banner Image (Recommended 1920 × 600 px)"
                existingUrl={editingSlide.image_url}
                onImageUploaded={(url) => setEditingSlide({ ...editingSlide, image_url: url })}
                folder="banners"
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Destination Click Link
                </label>
                <input
                  type="text"
                  required
                  placeholder="/products/ or /products/?category=c-fryers"
                  value={editingSlide.cta_link || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, cta_link: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-mono"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Where users land when clicking this banner
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Button Text (CTA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now, View Parts"
                    value={editingSlide.cta_text || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, cta_text: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Default: &ldquo;Shop Now&rdquo;
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Internal Label / Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fryer Parts Sale"
                    value={editingSlide.title || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Admin reference
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingSlide.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, sort_order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingSlide.is_active !== false}
                      onChange={(e) =>
                        setEditingSlide({ ...editingSlide, is_active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 bg-slate-950 border-slate-700"
                    />
                    <span className="text-xs font-bold text-slate-300">
                      Active (Show on storefront)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSlide(null);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-orange-600 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-950/50 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Banner...' : 'Save Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - No localhost alert */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Homepage Banner"
        itemName={deleteTarget?.title || `Banner (Sort: ${deleteTarget?.sort_order})`}
        message="Are you sure you want to delete this homepage hero banner? It will be immediately removed from the rotating storefront carousel."
        confirmText="Yes, Delete Banner"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
