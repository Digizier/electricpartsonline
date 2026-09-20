'use client';

import React, { useState, useEffect } from 'react';
import { getAllCoupons, saveCoupon, deleteCoupon } from '@/lib/db';
import { Coupon } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Ticket, Plus, Trash2, Edit2, CheckCircle2, X, Tag } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadCoupons = async () => {
    const data = await getAllCoupons();
    setCoupons(data);
  };

  useEffect(() => {
    loadCoupons();
    window.addEventListener('epo_coupons_updated', loadCoupons);
    return () => window.removeEventListener('epo_coupons_updated', loadCoupons);
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingCoupon({
      code: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_spend: 1000,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon({ ...c });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await saveCoupon({
        ...coupon,
        is_active: !coupon.is_active,
      });
      showNotice(`Coupon ${coupon.code} is now ${!coupon.is_active ? 'active' : 'inactive'}.`);
      loadCoupons();
    } catch (e) {
      console.error('Toggle coupon error:', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code?.trim()) return;

    setIsSaving(true);
    try {
      await saveCoupon({
        ...editingCoupon,
        code: editingCoupon.code.trim().toUpperCase(),
        discount_value: Number(editingCoupon.discount_value) || 0,
        min_spend: Number(editingCoupon.min_spend) || 0,
      });
      showNotice(editingCoupon.id ? 'Coupon updated successfully!' : 'Coupon created successfully!');
      setIsModalOpen(false);
      setEditingCoupon(null);
      loadCoupons();
    } catch (err: any) {
      console.error('Save coupon error:', err);
      showNotice('Failed to save coupon.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      await deleteCoupon(id);
      showNotice(`Coupon "${code}" removed.`);
      loadCoupons();
    } catch (err) {
      console.error('Delete coupon error:', err);
      showNotice('Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
              <Ticket className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Coupon Codes & Discounts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create percentage and fixed PKR discount vouchers for commercial promotions
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`bg-slate-950 border rounded-2xl p-5 shadow-sm space-y-3 transition-all ${
              c.is_active !== false ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-lg text-orange-400 bg-orange-950/60 border border-orange-800/60 px-3 py-1 rounded-xl tracking-wider">
                {c.code}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleToggleActive(c)}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                    c.is_active !== false
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  title="Click to toggle active status"
                >
                  {c.is_active !== false ? 'Active' : 'Disabled'}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800"
                  title="Edit Coupon"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(c.id, c.code)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 border border-slate-800"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Discount Value:</span>
                <strong className="text-white font-extrabold">
                  {c.discount_type === 'percentage'
                    ? `${c.discount_value}% OFF`
                    : `Rs. ${c.discount_value.toLocaleString()} OFF`}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Minimum Spend:</span>
                <strong className="text-white font-extrabold">
                  {c.min_spend > 0 ? formatCurrency(c.min_spend) : 'No Minimum'}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-orange-500" />
                <h3 className="font-extrabold text-base text-white">
                  {editingCoupon.id ? `Edit Coupon: ${editingCoupon.code}` : 'Create Coupon Voucher'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COMMERCIAL10"
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3.5 py-2.5 rounded-xl uppercase font-mono font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discount_type || 'percentage'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl focus:outline-none focus:border-orange-500 font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs. / PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Value ({editingCoupon.discount_type === 'percentage' ? '%' : 'Rs.'})
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.discount_value ?? 10}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_value: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Minimum Order Spend (Rs. / PKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000"
                  value={editingCoupon.min_spend ?? 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, min_spend: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.is_active !== false}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-slate-950 border-slate-700 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-slate-300">Coupon Active (Redeemable at Checkout)</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-750 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#FF6A00] hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-extrabold transition-colors shadow"
                >
                  {isSaving ? 'Saving...' : editingCoupon.id ? 'Update Coupon' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

