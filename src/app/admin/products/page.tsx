'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, getCategories, getBrands, saveBrand, saveProduct, deleteProduct } from '@/lib/db';
import { Product, Category, Brand } from '@/types';
import { formatCurrency, slugify } from '@/lib/utils';
import { MultipleImageCompressorUpload } from '@/components/admin/MultipleImageCompressorUpload';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Plus, Search, Edit2, Trash2, X, Check, Package, CheckCircle2, FileText, Layers, Settings2, Sliders, ListPlus, Tag } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick brand creation
  const [showQuickAddBrand, setShowQuickAddBrand] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState('');

  // Modal sub-tabs & item inputs
  const [modalTab, setModalTab] = useState<'general' | 'details' | 'specs' | 'manuals' | 'variants'>('general');
  const [newBullet, setNewBullet] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newCompat, setNewCompat] = useState('');
  const [newManualTitle, setNewManualTitle] = useState('');
  const [newManualUrl, setNewManualUrl] = useState('');
  const [newManualSize, setNewManualSize] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [sizePriceInput, setSizePriceInput] = useState('');

  function flattenSubTree(subs?: any[], prefix = '', currentLevel = 2): { id: string; name: string; path: string; level: number }[] {
    if (!subs) return [];
    const list: { id: string; name: string; path: string; level: number }[] = [];
    for (const s of subs) {
      const currentPath = prefix ? `${prefix} > ${s.name}` : s.name;
      list.push({ id: s.id, name: s.name, path: currentPath, level: currentLevel });
      if (s.children && s.children.length > 0) {
        list.push(...flattenSubTree(s.children, currentPath, currentLevel + 1));
      }
    }
    return list;
  }

  const loadData = async () => {
    const [prods, cats, brs] = await Promise.all([getProducts(), getCategories(), getBrands()]);
    setProducts(prods);
    setCategories(cats);
    setBrands(brs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('epo_products_updated', loadData);
    return () => window.removeEventListener('epo_products_updated', loadData);
  }, []);

  const handleQuickCreateBrand = async () => {
    if (!customBrandInput.trim()) return;
    const brandName = customBrandInput.trim();
    try {
      const newBrand = await saveBrand({
        name: brandName,
        slug: slugify(brandName),
        is_active: true,
      });
      const updatedBrands = await getBrands();
      setBrands(updatedBrands);
      setEditingProduct((prev) => (prev ? { ...prev, brand_id: newBrand.id } : null));
      setCustomBrandInput('');
      setShowQuickAddBrand(false);
      setNotification(`Brand "${brandName}" created and selected!`);
      setTimeout(() => setNotification(null), 3500);
    } catch (e) {
      console.error('Quick brand creation error:', e);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.part_number.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || p.category_id === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      slug: '',
      part_number: '',
      oem_number: '',
      price: 0,
      msrp: 0,
      discount_percent: 0,
      stock_quantity: 10,
      description: '',
      details_bullets: [
        'Commercial grade high-nickel alloy stainless steel construction',
        'Direct OEM replacement fitting for commercial food equipment',
        'Factory load tested and verified for long service life'
      ],
      images: [],
      specifications: {
        'Part Number': '',
        'Voltage': '208V / 240V',
        'Material': 'Stainless Steel',
        'Application': 'Commercial Equipment Replacement',
      },
      compatibility: ['Commercial Kitchen Equipment', 'Universal OEM Fitting'],
      manuals: [
        { title: 'Technical Specification Sheet', url: 'https://example.com/spec-sheet.pdf', file_size: '1.8 MB' }
      ],
      enable_details_bullets: true,
      enable_specs_compat: true,
      enable_manuals: true,
      enable_variants_reviews: true,
      has_colors: false,
      color_options: ['Stainless Steel', 'Industrial Black'],
      has_sizes: false,
      size_options: ['Standard', 'Heavy Duty'],
      show_reviews: false,
      is_featured: false,
      is_bestseller: false,
      is_new_arrival: true,
      is_top_rated: false,
      is_active: true,
    });
    setModalTab('general');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({
      ...p,
      enable_details_bullets: p.enable_details_bullets !== undefined ? p.enable_details_bullets : true,
      enable_specs_compat: p.enable_specs_compat !== undefined ? p.enable_specs_compat : true,
      enable_manuals: p.enable_manuals !== undefined ? p.enable_manuals : true,
      enable_variants_reviews: p.enable_variants_reviews !== undefined ? p.enable_variants_reviews : true,
      details_bullets: p.details_bullets || [],
      specifications: p.specifications || {},
      compatibility: p.compatibility || [],
      manuals: p.manuals || [],
      color_options: p.color_options || [],
      size_options: p.size_options || [],
      has_colors: !!p.has_colors,
      has_sizes: !!p.has_sizes,
      show_reviews: !!p.show_reviews,
    });
    setModalTab('general');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      showNotice(`Product "${deleteTarget.name}" permanently deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      showNotice('Failed to delete product: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.part_number) return;
    setIsSaving(true);

    try {
      const slug = editingProduct.slug || slugify(editingProduct.name);
      await saveProduct({
        ...editingProduct,
        slug,
      });

      showNotice('Product saved and synced to database successfully!');
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      showNotice('Failed to save product: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Product Inventory</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage commercial parts catalog, stock levels, WebP media, and technical fitment
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by part name, part #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table (Desktop) */}
      <div className="hidden md:block bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Part</th>
              <th className="py-3 px-4">Part Number</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 flex items-center gap-3">
                  <img
                    src={p.thumbnail_url || p.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&q=80'}
                    alt={p.name}
                    className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-slate-800"
                  />
                  <div>
                    <div className="font-extrabold text-white line-clamp-1">{p.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{p.slug}</div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                  {p.part_number}
                </td>
                <td className="py-3.5 px-4 font-extrabold text-white">
                  {formatCurrency(p.price)}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-bold ${p.stock_quantity <= 10 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {p.stock_quantity} units
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      p.is_active
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(p)}
                    className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950 rounded-lg border border-red-900 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card-Based Products List */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex gap-3 items-center">
              <img
                src={p.thumbnail_url || p.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&q=80'}
                alt={p.name}
                className="w-14 h-14 object-contain bg-white rounded-xl p-1.5 border border-slate-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-white text-sm truncate">{p.name}</div>
                <div className="text-xs font-mono font-bold text-orange-400 mt-0.5">Part #: {p.part_number}</div>
                <div className="text-xs font-black text-white mt-1">{formatCurrency(p.price)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Stock: {p.stock_quantity} units</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 bg-slate-850 text-white rounded-lg border border-slate-700 font-bold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(p)}
                  className="px-3 py-1.5 bg-red-950 text-red-400 rounded-lg border border-red-900 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-6 sm:my-8 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {editingProduct.id ? `Edit Product: ${editingProduct.name || 'Commercial Part'}` : 'Add New Commercial Equipment Part'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Fully customize specifications, compatibility, manuals, color/size variations, and images
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Navigation (No ugly horizontal scrollbar track) */}
            <div className="flex border-b border-slate-800 bg-slate-950/80 overflow-x-auto px-4 gap-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'general', label: 'General & Pricing', icon: Package },
                { id: 'details', label: 'Details & Bullets', icon: ListPlus },
                { id: 'specs', label: 'Specs & Compatibility', icon: Sliders },
                { id: 'manuals', label: 'Manuals & PDFs', icon: FileText },
                { id: 'variants', label: 'Variants & Reviews', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = modalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                      active
                        ? 'border-[#FF6A00] text-[#FF6A00] bg-slate-900'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              {/* TAB 1: General & Pricing */}
              {modalTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Part Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 208V 4500W Fryer Heating Element"
                        value={editingProduct.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Part Number (SKU) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. HTR-4500-208"
                        value={editingProduct.part_number || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, part_number: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">OEM Equivalent Number</label>
                      <input
                        type="text"
                        placeholder="e.g. OEM-HAT-4500"
                        value={editingProduct.oem_number || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, oem_number: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Price (PKR / Rs.) *</label>
                      <input
                        type="number"
                        step="1"
                        required
                        placeholder="9000"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Original MSRP (PKR / Rs.)</label>
                      <input
                        type="number"
                        step="1"
                        placeholder="10600"
                        value={editingProduct.msrp || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, msrp: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Equipment Category *</label>
                      <select
                        value={editingProduct.category_id || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value, subcategory_id: '' })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      >
                        <option value="">Select Equipment Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Subcategory / Nested Item</label>
                      <select
                        value={editingProduct.subcategory_id || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, subcategory_id: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        disabled={!editingProduct.category_id}
                      >
                        <option value="">General (No subcategory)</option>
                        {editingProduct.category_id &&
                          flattenSubTree(categories.find(c => c.id === editingProduct.category_id)?.subcategories).map((item) => (
                            <option key={item.id} value={item.id}>
                              {'— '.repeat(item.level - 2)}{item.path} (Level {item.level})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        placeholder="25"
                        value={editingProduct.stock_quantity ?? 10}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-300">Brand</label>
                        <button
                          type="button"
                          onClick={() => setShowQuickAddBrand(!showQuickAddBrand)}
                          className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{showQuickAddBrand ? 'Choose from list' : '+ Custom Brand'}</span>
                        </button>
                      </div>

                      {!showQuickAddBrand ? (
                        <select
                          value={editingProduct.brand_id || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, brand_id: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                        >
                          <option value="">Select Brand</option>
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Type new brand name..."
                            value={customBrandInput}
                            onChange={(e) => setCustomBrandInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleQuickCreateBrand();
                              }
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleQuickCreateBrand}
                            disabled={!customBrandInput.trim()}
                            className="px-3 py-2 bg-[#FF6A00] hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition-colors whitespace-nowrap shadow-sm"
                          >
                            Add & Select
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* WebP Compressed Multiple Images Upload & Gallery */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Product Images (Multi-upload with WebP Auto-Compression & Primary Cover Selector)
                    </label>
                    <MultipleImageCompressorUpload
                      images={editingProduct.images || (editingProduct.thumbnail_url ? [editingProduct.thumbnail_url] : [])}
                      thumbnailUrl={editingProduct.thumbnail_url}
                      onImagesChange={(images, primaryUrl) => {
                        setEditingProduct({
                          ...editingProduct,
                          images,
                          thumbnail_url: primaryUrl,
                        });
                      }}
                    />
                  </div>

                  {/* Status Checkboxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_bestseller || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_bestseller: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span>Best Seller</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_new_arrival || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_new_arrival: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span>New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_top_rated || false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_top_rated: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span>Top Rated</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.is_active !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span>Published</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: Details & Bullets */}
              {modalTab === 'details' && (
                <div className="space-y-5">
                  {/* Master Section Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Details & Feature Highlights Section</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${editingProduct.enable_details_bullets !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {editingProduct.enable_details_bullets !== false ? 'Active on Storefront' : 'Hidden on Storefront'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Controls whether technical overview and bullet highlights appear on the product page.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.enable_details_bullets !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, enable_details_bullets: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Technical Overview / Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Detailed part description and commercial equipment application..."
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300">
                        Feature Bullets (Shown with orange checkmarks on product page)
                      </label>
                      <span className="text-[11px] text-slate-500">
                        {(editingProduct.details_bullets || []).length} bullets
                      </span>
                    </div>

                    {/* Bullet List */}
                    <div className="space-y-2">
                      {(editingProduct.details_bullets || []).map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <Check className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...(editingProduct.details_bullets || [])];
                              updated[idx] = e.target.value;
                              setEditingProduct({ ...editingProduct, details_bullets: updated });
                            }}
                            className="flex-1 bg-transparent text-white text-xs focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.details_bullets || []).filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, details_bullets: updated });
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Bullet Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add new feature highlight bullet..."
                        value={newBullet}
                        onChange={(e) => setNewBullet(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newBullet.trim()) {
                              const updated = [...(editingProduct.details_bullets || []), newBullet.trim()];
                              setEditingProduct({ ...editingProduct, details_bullets: updated });
                              setNewBullet('');
                            }
                          }
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newBullet.trim()) {
                            const updated = [...(editingProduct.details_bullets || []), newBullet.trim()];
                            setEditingProduct({ ...editingProduct, details_bullets: updated });
                            setNewBullet('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Specs & Compatibility */}
              {modalTab === 'specs' && (
                <div className="space-y-6">
                  {/* Master Section Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Specifications & Compatibility Section</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${editingProduct.enable_specs_compat !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {editingProduct.enable_specs_compat !== false ? 'Active on Storefront' : 'Hidden on Storefront'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Controls whether technical specifications table and model compatibility list appear on the product page.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.enable_specs_compat !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, enable_specs_compat: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Specifications Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">
                        Technical Specifications (Key-Value Table)
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {Object.keys(editingProduct.specifications || {}).length} specifications
                      </span>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {Object.entries(editingProduct.specifications || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <input
                            type="text"
                            value={key}
                            readOnly
                            className="w-1/3 bg-slate-900 border border-slate-800 text-slate-300 font-bold px-2 py-1 rounded text-xs"
                          />
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const updated = { ...(editingProduct.specifications || {}) };
                              updated[key] = e.target.value;
                              setEditingProduct({ ...editingProduct, specifications: updated });
                            }}
                            className="flex-1 bg-slate-900/50 border border-slate-800 text-white px-2 py-1 rounded text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...(editingProduct.specifications || {}) };
                              delete updated[key];
                              setEditingProduct({ ...editingProduct, specifications: updated });
                            }}
                            className="p-1 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Spec Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Spec Name (e.g. Voltage)"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 208V)"
                        value={newSpecVal}
                        onChange={(e) => setNewSpecVal(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSpecKey.trim()) {
                            const updated = { ...(editingProduct.specifications || {}) };
                            updated[newSpecKey.trim()] = newSpecVal.trim() || 'Standard';
                            setEditingProduct({ ...editingProduct, specifications: updated });
                            setNewSpecKey('');
                            setNewSpecVal('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Spec Row</span>
                      </button>
                    </div>
                  </div>

                  {/* Compatibility Section */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200">
                        Compatible Equipment Models
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {(editingProduct.compatibility || []).length} models
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(editingProduct.compatibility || []).map((model, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg text-xs font-semibold"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{model}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.compatibility || []).filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, compatibility: updated });
                            }}
                            className="text-slate-500 hover:text-red-400 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add compatible model (e.g. Hatco Toast-Qwik, Pitco 35C+)..."
                        value={newCompat}
                        onChange={(e) => setNewCompat(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newCompat.trim()) {
                              const updated = [...(editingProduct.compatibility || []), newCompat.trim()];
                              setEditingProduct({ ...editingProduct, compatibility: updated });
                              setNewCompat('');
                            }
                          }
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCompat.trim()) {
                            const updated = [...(editingProduct.compatibility || []), newCompat.trim()];
                            setEditingProduct({ ...editingProduct, compatibility: updated });
                            setNewCompat('');
                          }
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Model</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Manuals & Downloads */}
              {modalTab === 'manuals' && (
                <div className="space-y-4">
                  {/* Master Section Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Manuals & Downloads Section</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${editingProduct.enable_manuals !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {editingProduct.enable_manuals !== false ? 'Active on Storefront' : 'Hidden on Storefront'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Controls whether PDF manuals, schematics, and download links appear on the product page.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.enable_manuals !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, enable_manuals: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">
                        Manuals, Schematics & Specification Sheets
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Links to PDF diagrams, technical bulletins, and installation manuals
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {(editingProduct.manuals || []).length} manuals
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {(editingProduct.manuals || []).map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-orange-400" />
                          <div>
                            <div className="text-xs font-bold text-white">{m.title}</div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{m.url}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {m.file_size && (
                            <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-bold">
                              {m.file_size}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProduct.manuals || []).filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, manuals: updated });
                            }}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Manual Form */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                    <span className="text-xs font-bold text-slate-300 block">Add Manual Document</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Document Title (e.g. Wiring Diagram)"
                        value={newManualTitle}
                        onChange={(e) => setNewManualTitle(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Download URL (https://...)"
                        value={newManualUrl}
                        onChange={(e) => setNewManualUrl(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="File Size (e.g. 1.2 MB)"
                        value={newManualSize}
                        onChange={(e) => setNewManualSize(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (newManualTitle.trim()) {
                          const updated = [
                            ...(editingProduct.manuals || []),
                            {
                              title: newManualTitle.trim(),
                              url: newManualUrl.trim() || 'https://example.com/manual.pdf',
                              file_size: newManualSize.trim() || '1.0 MB',
                            },
                          ];
                          setEditingProduct({ ...editingProduct, manuals: updated });
                          setNewManualTitle('');
                          setNewManualUrl('');
                          setNewManualSize('');
                        }
                      }}
                      className="px-4 py-1.5 bg-[#FF6A00] hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Manual Document</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: Variants & Reviews */}
              {modalTab === 'variants' && (
                <div className="space-y-5">
                  {/* Master Section Toggle */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Variants & Customer Reviews Section</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${editingProduct.enable_variants_reviews !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {editingProduct.enable_variants_reviews !== false ? 'Active on Storefront' : 'Hidden on Storefront'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Master toggle to show or hide color/size options and customer reviews section on the product page.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingProduct.enable_variants_reviews !== false}
                        onChange={(e) => setEditingProduct({ ...editingProduct, enable_variants_reviews: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {/* Color Options Customization */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Color / Finish Variations</span>
                        <span className="text-[11px] text-slate-400">
                          Enable interactive color swatches/options on storefront product page
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.has_colors || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, has_colors: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6A00]"></div>
                      </label>
                    </div>

                    {editingProduct.has_colors && (
                      <div className="pt-2 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {(editingProduct.color_options || []).map((col, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold"
                            >
                              <span>{col}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingProduct.color_options || []).filter((_, i) => i !== idx);
                                  setEditingProduct({ ...editingProduct, color_options: updated });
                                }}
                                className="text-slate-400 hover:text-red-400"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add color (e.g. Stainless Steel, Black, Brass)..."
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (colorInput.trim()) {
                                  const updated = [...(editingProduct.color_options || []), colorInput.trim()];
                                  setEditingProduct({ ...editingProduct, color_options: updated });
                                  setColorInput('');
                                }
                              }
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 text-white px-3 py-1.5 rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (colorInput.trim()) {
                                const updated = [...(editingProduct.color_options || []), colorInput.trim()];
                                setEditingProduct({ ...editingProduct, color_options: updated });
                                setColorInput('');
                              }
                            }}
                            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                          >
                            + Add Color
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Size Options Customization with Real-Time Pricing */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Size / Dimension Variations</span>
                        <span className="text-[11px] text-slate-400">
                          Enable interactive size buttons with custom real-time pricing on storefront product page
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.has_sizes || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, has_sizes: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6A00]"></div>
                      </label>
                    </div>

                    {editingProduct.has_sizes && (
                      <div className="pt-2 space-y-3">
                        {/* Configured Sizes List */}
                        <div className="space-y-2">
                          {((editingProduct.size_options || []) as any[]).map((sz, idx) => {
                            const szObj = typeof sz === 'string' ? { name: sz, price: editingProduct.price || 0 } : sz;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{szObj.name}</span>
                                  <span className="bg-orange-500/20 text-orange-400 font-extrabold px-2 py-0.5 rounded border border-orange-500/30">
                                    Rs. {Number(szObj.price || editingProduct.price || 0).toLocaleString('en-PK')}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = ((editingProduct.size_options || []) as any[]).filter((_, i) => i !== idx);
                                    setEditingProduct({ ...editingProduct, size_options: updated });
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-400 rounded transition-colors"
                                  title="Remove size variation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Size Variant Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                          <div className="sm:col-span-6">
                            <input
                              type="text"
                              placeholder="Size Name (e.g. Standard 15.5-Inch, Extended 18-Inch)..."
                              value={sizeInput}
                              onChange={(e) => setSizeInput(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-4">
                            <input
                              type="number"
                              placeholder={`Price in Rs. (default: ${editingProduct.price || 0})`}
                              value={sizePriceInput}
                              onChange={(e) => setSizePriceInput(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (!sizeInput.trim()) return;
                                const customP = parseFloat(sizePriceInput) || editingProduct.price || 0;
                                const current = ((editingProduct.size_options || []) as any[]).map((s) =>
                                  typeof s === 'string' ? { name: s, price: editingProduct.price || 0 } : s
                                );
                                setEditingProduct({
                                  ...editingProduct,
                                  size_options: [...current, { name: sizeInput.trim(), price: customP }],
                                });
                                setSizeInput('');
                                setSizePriceInput('');
                              }}
                              className="w-full h-full min-h-[36px] bg-[#FF6A00] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reviews Tab ON / OFF Toggle */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Show Reviews Tab on Product Page
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          When turned OFF (default), reviews tab is completely hidden from the storefront product page tabs.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.show_reviews || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, show_reviews: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF6A00]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  * All changes save directly to cloud database with real-time sync
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow flex items-center gap-2 disabled:opacity-50 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSaving ? 'Saving Product...' : 'Save Product'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Commercial Equipment Part"
        itemName={deleteTarget ? `${deleteTarget.name} (Part #${deleteTarget.part_number})` : ''}
        message="Are you sure you want to delete this commercial equipment part? This will permanently remove it from your live database, catalog, and search indexes."
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
