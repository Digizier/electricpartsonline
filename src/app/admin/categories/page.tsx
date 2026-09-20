'use client';

import React, { useState, useEffect } from 'react';
import { getCategories, saveCategory, deleteCategory, saveSubcategory, deleteSubcategory } from '@/lib/db';
import { Category, Subcategory } from '@/types';
import { slugify } from '@/lib/utils';
import { ImageCompressorUpload } from '@/components/admin/ImageCompressorUpload';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Plus, Trash2, Edit2, FolderTree, X, CheckCircle2, CornerDownRight } from 'lucide-react';

function SubcategoryNode({
  sub,
  categoryId,
  level,
  onAddNested,
  onEdit,
  onDelete,
}: {
  sub: Subcategory;
  categoryId: string;
  level: number;
  onAddNested: (catId: string, parentSubId: string) => void;
  onEdit: (sub: Subcategory, catId: string) => void;
  onDelete: (sub: Subcategory, catId: string) => void;
}) {
  const hasChildren = sub.children && sub.children.length > 0;

  return (
    <div className={`space-y-2 ${level === 2 ? 'bg-slate-900 border border-slate-800/80 rounded-xl p-3' : 'bg-slate-950/60 border border-slate-800/50 rounded-lg p-2.5'}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {level > 2 && <CornerDownRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
          {level === 2 && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>}
          <span className="text-white text-xs font-bold truncate">{sub.name}</span>
          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded font-mono flex-shrink-0">
            Level {level}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(sub, categoryId)}
            className="p-1 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded border border-slate-700/60 transition-colors"
            title={`Edit ${sub.name}`}
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onAddNested(categoryId, sub.id)}
            className="text-[11px] text-orange-400 hover:text-orange-300 bg-orange-950/40 hover:bg-orange-950 px-2 py-0.5 rounded border border-orange-800/60 font-semibold flex items-center gap-1 transition-colors"
            title={`Add child nested under ${sub.name}`}
          >
            <Plus className="w-3 h-3" />
            <span>Add Nested</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(sub, categoryId)}
            className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
            title={`Delete ${sub.name}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recursive Children (Level 3, Level 4, Level 5...) */}
      {hasChildren && (
        <div className="pl-3 sm:pl-4 border-l-2 border-slate-800 space-y-2 pt-1 ml-1 sm:ml-2">
          {sub.children!.map((child) => (
            <SubcategoryNode
              key={child.id}
              sub={child}
              categoryId={categoryId}
              level={level + 1}
              onAddNested={onAddNested}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function flattenSubTree(subs?: Subcategory[], prefix = '', currentLevel = 2): { id: string; name: string; path: string; level: number }[] {
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [selectedParentSubId, setSelectedParentSubId] = useState<string | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [editingSub, setEditingSub] = useState<Partial<Subcategory> | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'category' | 'subcategory';
    id: string;
    name: string;
    categoryId?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
    window.addEventListener('epo_categories_updated', loadCategories);
    return () => window.removeEventListener('epo_categories_updated', loadCategories);
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleOpenAddCat = () => {
    setEditingCat({
      name: '',
      slug: '',
      image_url: '',
      description: '',
      sort_order: categories.length + 1,
      is_active: true,
    });
    setIsCatModalOpen(true);
  };

  const handleOpenAddSub = (catId: string, parentSubId?: string) => {
    setSelectedCatId(catId);
    setSelectedParentSubId(parentSubId || null);
    setEditingSub({
      category_id: catId,
      parent_id: parentSubId || null,
      name: '',
      slug: '',
      sort_order: 1,
      is_active: true,
    });
    setIsSubModalOpen(true);
  };

  const handleOpenEditSub = (sub: Subcategory, catId: string) => {
    setSelectedCatId(catId);
    setSelectedParentSubId(sub.parent_id || null);
    setEditingSub({ ...sub });
    setIsSubModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name) return;
    const slug = editingCat.slug || slugify(editingCat.name);
    await saveCategory({
      ...editingCat,
      slug,
    });
    showNotice(editingCat.id ? 'Category updated!' : 'Category saved successfully!');
    setIsCatModalOpen(false);
    setEditingCat(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'category') {
        await deleteCategory(deleteTarget.id);
        showNotice(`Category "${deleteTarget.name}" deleted.`);
      } else {
        await deleteSubcategory(deleteTarget.id, deleteTarget.categoryId || '');
        showNotice(`Subcategory "${deleteTarget.name}" deleted.`);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub || !editingSub.name || !selectedCatId) return;
    const slug = editingSub.slug || slugify(editingSub.name);
    await saveSubcategory({
      ...editingSub,
      category_id: selectedCatId,
      parent_id: selectedParentSubId,
      slug,
    });
    showNotice(editingSub.id ? 'Subcategory updated!' : (selectedParentSubId ? 'Nested Sub-item saved!' : 'Subcategory saved!'));
    setIsSubModalOpen(false);
    setEditingSub(null);
    setSelectedParentSubId(null);
  };

  const activeCategoryForModal = categories.find((c) => c.id === selectedCatId);

  return (
    <div className="space-y-6">
      {notice && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Categories & Subcategories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build multi-level hierarchical taxonomy: Category &gt; Subcategory &gt; Nested Sub-items
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddCat}
          className="min-h-[44px] px-5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Parent Category</span>
        </button>
      </div>

      {/* Category Tree Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&q=80'}
                  alt={cat.name}
                  className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-800 flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-white text-base">{cat.name}</h3>
                    <span className="text-[10px] bg-slate-800 text-orange-400 font-bold px-2 py-0.5 rounded uppercase">
                      Level 1
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">slug: {cat.slug}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCat(cat);
                    setIsCatModalOpen(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                  className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/40 rounded-lg border border-red-900"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subcategories Container with Multi-Level Drill-Down */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-orange-500" />
                  <span>Subcategories ({cat.subcategories?.length || 0})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddSub(cat.id)}
                  className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Subcategory</span>
                </button>
              </div>

              {/* Recursive Subcategories Tree View */}
              <div className="space-y-2 pt-1">
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub) => (
                    <SubcategoryNode
                      key={sub.id}
                      sub={sub}
                      categoryId={cat.id}
                      level={2}
                      onAddNested={(catId, parentSubId) => handleOpenAddSub(catId, parentSubId)}
                      onEdit={(subItem, catId) => handleOpenEditSub(subItem, catId)}
                      onDelete={(subItem, catId) => setDeleteTarget({ type: 'subcategory', id: subItem.id, name: subItem.name, categoryId: catId })}
                    />
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    No subcategories yet. Click "+ Add Subcategory" to create nested levels.
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isCatModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingCat.id ? 'Edit Category' : 'Add Parent Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Fryers, Beverage Equipment"
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                />
              </div>

              {/* Category Image Upload with WebP Compressor */}
              <div className="pt-1">
                <ImageCompressorUpload
                  folder="categories"
                  label="Category Image (Auto-Compressed WebP)"
                  existingUrl={editingCat.image_url}
                  onImageUploaded={(url) =>
                    setEditingCat((prev) => (prev ? { ...prev, image_url: url } : null))
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this equipment category..."
                  value={editingCat.description || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal with Multi-Level Parent Choice */}
      {isSubModalOpen && editingSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {editingSub.id ? 'Edit Subcategory' : (selectedParentSubId ? 'Add Nested Sub-Item' : 'Add Subcategory')}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Category: <span className="text-orange-400 font-bold">{activeCategoryForModal?.name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubcategory} className="space-y-4">
              {/* Parent Level Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Hierarchy Placement</label>
                <select
                  value={selectedParentSubId || ''}
                  onChange={(e) => setSelectedParentSubId(e.target.value || null)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="">Direct Subcategory under {activeCategoryForModal?.name} (Level 2)</option>
                  {flattenSubTree(activeCategoryForModal?.subcategories)
                    .filter((item) => item.id !== editingSub.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {'— '.repeat(item.level - 1)}↳ Nested inside "{item.path}" (Level {item.level + 1})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 208V Heating Elements, Gas Safety Valves..."
                  value={editingSub.name || ''}
                  onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-orange-600 text-white rounded-xl text-xs font-extrabold shadow"
                >
                  {editingSub.id ? 'Update Subcategory' : 'Save Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'category' ? 'Delete Parent Category' : 'Delete Subcategory Item'}
        itemName={deleteTarget?.name}
        message={
          deleteTarget?.type === 'category'
            ? 'Are you sure you want to delete this parent category and all its nested subcategories? Products assigned to this category will need to be re-assigned.'
            : 'Are you sure you want to delete this subcategory item and any child sub-items nested beneath it?'
        }
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
