'use client';

import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, getSiteSettings, saveOrder, deleteOrder } from '@/lib/db';
import { triggerOrderStatusEmail } from '@/lib/emailClient';
import { Order, OrderStatus, SiteSettings } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PrintableInvoice } from '@/components/admin/PrintableInvoice';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { ShoppingBag, Printer, Search, CheckCircle, Clock, Truck, Eye, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';

function renderPaymentBadge(method?: string) {
  switch (method) {
    case 'cod':
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px] font-black uppercase tracking-wider">
          Cash on Delivery
        </span>
      );
    case 'easypaisa':
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] font-black uppercase tracking-wider">
          EasyPaisa
        </span>
      );
    case 'jazzcash':
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800/80 text-[10px] font-black uppercase tracking-wider">
          JazzCash
        </span>
      );
    case 'bank_transfer':
      return (
        <span className="px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[10px] font-black uppercase tracking-wider">
          Bank Transfer
        </span>
      );
    case 'whatsapp':
    default:
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-black uppercase tracking-wider">
          WhatsApp Order
        </span>
      );
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const loadData = async () => {
    const [ord, set] = await Promise.all([getOrders(), getSiteSettings()]);
    setOrders(ord);
    setSettings(set);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('epo_orders_updated', loadData);
    return () => window.removeEventListener('epo_orders_updated', loadData);
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    await updateOrderStatus(orderId, status);
    loadData();

    if (targetOrder && targetOrder.customer_email && targetOrder.customer_email.includes('@')) {
      triggerOrderStatusEmail({ ...targetOrder, status }, status);
      showNotice(`Status updated to "${status.toUpperCase()}" & email notification sent to ${targetOrder.customer_email}`);
    } else {
      showNotice(`Status updated to "${status.toUpperCase()}"`);
    }
  };

  const handleOpenAdd = () => {
    setEditingOrder({
      order_number: `#${Math.floor(10000 + Math.random() * 90000)}`,
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      shipping_address: { address: '', city: 'Lahore' },
      total_amount: 0,
      subtotal: 0,
      shipping_fee: 0,
      discount_amount: 0,
      status: 'pending',
      payment_method: 'whatsapp',
      payment_status: 'unpaid',
      items: [
        { name: 'Commercial Equipment Parts', part_number: 'OEM-PART', price: 0, quantity: 1, subtotal: 0 }
      ],
      delivery_notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: Order) => {
    setEditingOrder({ ...order });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      showNotice(`Order ${deleteTarget.order_number} permanently deleted.`);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      console.error('Delete order error:', err);
      showNotice('Failed to delete order.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder || !editingOrder.customer_name?.trim() || !editingOrder.customer_phone?.trim()) {
      showNotice('Please provide customer name and phone number.');
      return;
    }

    setIsSaving(true);
    try {
      const prevOrder = orders.find((o) => o.id === editingOrder.id);
      await saveOrder({
        ...editingOrder,
        total_amount: Number(editingOrder.total_amount) || Number(editingOrder.subtotal) || 0,
      });

      // If status changed in modal, notify customer
      if (
        prevOrder &&
        editingOrder.status &&
        prevOrder.status !== editingOrder.status &&
        editingOrder.customer_email &&
        editingOrder.customer_email.includes('@')
      ) {
        triggerOrderStatusEmail(editingOrder as Order, editingOrder.status);
      }

      showNotice(editingOrder.id ? 'Order updated successfully!' : 'New order created!');
      setIsModalOpen(false);
      setEditingOrder(null);
      loadData();
    } catch (err: any) {
      console.error('Save order error:', err);
      showNotice('Failed to save order.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Order Manager</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track commercial equipment orders, update dispatch statuses, and print pristine A4 thermal slips
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 bg-[#FF6A00] hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Order</span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search order #, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer & Contact</th>
              <th className="py-3 px-4">Items Summary</th>
              <th className="py-3 px-4">Grand Total</th>
              <th className="py-3 px-4">Order Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-medium">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3.5 px-4 font-black text-white">{order.order_number}</td>
                <td className="py-3.5 px-4">
                  <div className="font-extrabold text-white">{order.customer_name}</div>
                  <div className="text-[11px] text-slate-400">{order.customer_phone}</div>
                  {order.customer_email && (
                    <div className="text-[10px] text-orange-400 truncate max-w-[170px] font-mono">{order.customer_email}</div>
                  )}
                  <div className="text-[10px] text-slate-500">{order.shipping_address.city}</div>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="text-xs text-slate-300 line-clamp-1 font-semibold">
                    {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-medium">Payment:</span>
                    {renderPaymentBadge(order.payment_method)}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-black text-white">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-xl capitalize cursor-pointer focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(order)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                      title="Edit Order"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                      title="Print A4 Invoice"
                    >
                      <Printer className="w-3.5 h-3.5 text-orange-400" />
                      <span>Invoice</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(order)}
                      className="p-1.5 bg-red-950/50 hover:bg-red-900/80 text-red-400 hover:text-red-200 rounded-lg border border-red-900/60 transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-white text-sm">{order.order_number}</span>
              <span className="font-extrabold text-[#FF6A00]">{formatCurrency(order.total_amount)}</span>
            </div>

            <div>
              <div className="font-bold text-white">{order.customer_name} ({order.customer_phone})</div>
              {order.customer_email && (
                <div className="text-[11px] text-orange-400 font-mono mt-0.5">{order.customer_email}</div>
              )}
              <div className="text-slate-400 mt-0.5">{order.shipping_address.address}, {order.shipping_address.city}</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-medium">Payment:</span>
                {renderPaymentBadge(order.payment_method)}
              </div>
            </div>

            <div className="p-2 bg-slate-900 rounded-xl text-slate-300">
              {order.items.map((i, idx) => (
                <div key={idx}>• {i.quantity}x {i.name}</div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-2 py-1 rounded capitalize"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(order)}
                  className="p-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700"
                  title="Edit Order"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-2.5 py-1.5 bg-[#FF6A00] text-white font-bold rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(order)}
                  className="p-1.5 bg-red-950 text-red-400 rounded-lg border border-red-900"
                  title="Delete Order"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Order Modal */}
      {isModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-6">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-white text-base">
                  {editingOrder.id ? `Edit Order: ${editingOrder.order_number}` : 'Create Manual Order'}
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

            <form onSubmit={handleSaveOrder} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Order Number *</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.order_number || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, order_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={editingOrder.status || 'pending'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as OrderStatus })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-orange-500 capitalize"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customer_name || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    value={editingOrder.customer_phone || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Email</label>
                  <input
                    type="email"
                    placeholder="customer@gmail.com"
                    value={editingOrder.customer_email || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_address?.address || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      shipping_address: { ...editingOrder.shipping_address, address: e.target.value, city: editingOrder.shipping_address?.city || 'Pakistan' }
                    })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_address?.city || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      shipping_address: { ...editingOrder.shipping_address, address: editingOrder.shipping_address?.address || '', city: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Total Amount (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={editingOrder.total_amount ?? 0}
                    onChange={(e) => setEditingOrder({ ...editingOrder, total_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Payment Gateway</label>
                  <select
                    value={editingOrder.payment_method || 'whatsapp'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, payment_method: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-orange-500 uppercase"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="easypaisa">EasyPaisa</option>
                    <option value="jazzcash">JazzCash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Payment Status</label>
                  <select
                    value={editingOrder.payment_status || 'unpaid'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, payment_status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-orange-500 uppercase"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Order Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={editingOrder.delivery_notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, delivery_notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  placeholder="Special instructions or courier booking tracking ID..."
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
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
                  {isSaving ? 'Saving...' : editingOrder.id ? 'Save Changes' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && settings && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          settings={settings}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Store Order"
        itemName={deleteTarget ? `Order ${deleteTarget.order_number} (${deleteTarget.customer_name})` : ''}
        message="Are you sure you want to delete this order? All invoice records and dispatch history for this order will be permanently deleted from the database."
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
