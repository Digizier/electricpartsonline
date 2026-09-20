'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getBrands, saveBrand, deleteBrand } from '@/lib/db';
import { Brand } from '@/types';
import { slugify } from '@/lib/utils';
import { ImageCompressorUpload } from '@/components/admin/ImageCompressorUpload';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  CheckCircle2,
  Award,
  ExternalLink,
} from 'lucide-react';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<Brand> | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadBrands = async () => {
    const data = await getBrands();
    setBrands(data);
  };

  useEffect(() => {
    loadBrands();
    window.addEventListener('epo_brands_updated', loadBrands);
    return () => window.removeEventListener('epo_brands_updated', loadBrands);
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q)
    );
  }, [brands, searchQuery]);

  const handleOpenAdd = () => {
    setEditingBrand({
      name: '',
      slug: '',
      logo_url: '',
      is_featured: false,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand({ ...brand });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name?.trim()) return;

    setIsSaving(true);
    try {
      const slug = editingBrand.slug || slugify(editingBrand.name);
      await saveBrand({
        ...editingBrand,
        name: editingBrand.name.trim(),
        slug,
      });

      showNotice(
        editingBrand.id ? 'Brand updated successfully!' : 'New brand created successfully!'
      );
      setIsModalOpen(false);
      setEditingBrand(null);
      await loadBrands();
    } catch (err: any) {
      console.error('Save brand error:', err);
      showNotice('Failed to save brand.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;
    try {
      await deleteBrand(id);
      showNotice(`Brand "${name}" removed.`);
      await loadBrands();
    } catch (err) {
      console.error('Delete brand error:', err);
      showNotice('Failed to delete brand.');
    }
  };

  const handleToggleFeatured = async (brand: Brand) => {
    try {
      await saveBrand({
        ...brand,
        is_featured: !brand.is_featured,
      });
      showNotice(`Brand "${brand.name}" ${!brand.is_featured ? 'marked as Featured' : 'unfeatured'}.`);
      await loadBrands();
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  };

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto pb-12">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
              <Award className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Brand Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage manufacturer brands, partner logos, and storefront brand filtering.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Brand</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search brands by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold px-2">
          <span>Total Brands: <strong className="text-white">{brands.length}</strong></span>
          <span>•</span>
          <span>Featured: <strong className="text-orange-400">{brands.filter(b => b.is_featured).length}</strong></span>
        </div>
      </div>

      {/* Brands Grid */}
      {filteredBrands.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Tag className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-bold text-sm text-slate-300">No brands found</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery ? 'Try clearing your search query.' : 'Click "+ Add Brand" to create your first brand.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col justify-between group"
            >
              {/* Card Header & Logo */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    onClick={() => handleToggleFeatured(brand)}
                    className={`cursor-pointer inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-colors ${
                      brand.is_featured
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title="Click to toggle featured status"
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {brand.is_featured ? 'Featured' : 'Standard'}
                  </span>

                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      brand.is_active !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {brand.is_active !== false ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <div className="w-full h-24 bg-white rounded-xl p-2.5 flex items-center justify-center border border-slate-800 mb-3 shadow-inner">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Tag className="w-6 h-6 mb-1 text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Logo</span>
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-white text-sm truncate">{brand.name}</h3>
                <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                  slug: {brand.slug}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={`/products/?brand=${brand.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-orange-400 p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
                  title="View Products in Storefront"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(brand)}
                    className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(brand.id, brand.name)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950 rounded-lg border border-red-900/60 transition-colors"
                    title="Delete Brand"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {isModalOpen && editingBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-white text-base">
                  {editingBrand.id ? 'Edit Brand' : 'Add New Brand'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siemens, Schneider Electric, Philips"
                  value={editingBrand.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingBrand((prev) => ({
                      ...prev,
                      name,
                      slug: !prev?.id ? slugify(name) : prev.slug,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  placeholder="e.g. siemens"
                  value={editingBrand.slug || ''}
                  onChange={(e) =>
                    setEditingBrand((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
                />
              </div>

              {/* Logo Upload with WebP Compressor */}
              <div className="pt-1">
                <ImageCompressorUpload
                  folder="brands"
                  label="Brand Logo (Auto-Compressed WebP)"
                  existingUrl={editingBrand.logo_url}
                  onImageUploaded={(url) =>
                    setEditingBrand((prev) => ({ ...prev, logo_url: url }))
                  }
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBrand.is_featured || false}
                    onChange={(e) =>
                      setEditingBrand((prev) => ({ ...prev, is_featured: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-orange-500 bg-slate-950 border-slate-700 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-300">Featured Brand</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingBrand.is_active !== false}
                    onChange={(e) =>
                      setEditingBrand((prev) => ({ ...prev, is_active: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-orange-500 bg-slate-950 border-slate-700 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-300">Active (Visible in Store)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow transition-colors"
                >
                  {isSaving ? 'Saving...' : editingBrand.id ? 'Update Brand' : 'Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
