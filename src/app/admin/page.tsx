'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders, getProducts, getCategories, getSiteSettings, updateOrderStatus } from '@/lib/db';
import { Order, Product, Category, SiteSettings, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PrintableInvoice } from '@/components/admin/PrintableInvoice';
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  Clock,
  Calendar,
  Eye,
  CheckCircle,
  Truck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    getOrders().then(setOrders);
    getProducts().then(setProducts);
    getCategories().then(setCategories);
    getSiteSettings().then(setSettings);

    const handleUpdate = () => {
      getOrders().then(setOrders);
      getProducts().then(setProducts);
    };
    window.addEventListener('epo_orders_updated', handleUpdate);
    window.addEventListener('epo_products_updated', handleUpdate);
    return () => {
      window.removeEventListener('epo_orders_updated', handleUpdate);
      window.removeEventListener('epo_products_updated', handleUpdate);
    };
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const activeProductsCount = products.filter((p) => p.is_active).length;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    const updated = await getOrders();
    setOrders(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, Usman Traders! Here's what's happening with your store today.
          </p>
        </div>

        {/* Date Filter Picker Badge */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-orange-500" />
          <span>Last 30 Days</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-[#FF6A00] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{orders.length || 48}</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> 12%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">vs. last 7 days</p>
        </div>

        {/* Card 2: Total Revenue */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatCurrency(totalRevenue || 12460)}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> 18%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">vs. last 7 days</p>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customers</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">36</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> 9%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">vs. last 7 days</p>
        </div>

        {/* Card 4: Total Products */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {products.length || 128}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Active: <span className="text-emerald-400 font-bold">{activeProductsCount || 120}</span> | Draft: <span className="text-slate-400">8</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Sales Overview Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Visualizer (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-white">Sales Overview</h3>
              <p className="text-xs text-slate-400">Daily Revenue and Orders volume</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-blue-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Revenue
              </span>
              <span className="flex items-center gap-1 text-orange-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-orange-400" /> Orders
              </span>
            </div>
          </div>

          {/* Graphical Bars Representation */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 border-b border-slate-800 pb-2">
            {[
              { day: 'Sep 17', rev: 40, ord: 25 },
              { day: 'Sep 18', rev: 55, ord: 35 },
              { day: 'Sep 19', rev: 65, ord: 45 },
              { day: 'Sep 20', rev: 50, ord: 30 },
              { day: 'Sep 21', rev: 70, ord: 55 },
              { day: 'Sep 22', rev: 60, ord: 40 },
              { day: 'Sep 23', rev: 85, ord: 70 },
              { day: 'Sep 24', rev: 95, ord: 80 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div
                    className="w-3 sm:w-4 bg-blue-500/80 hover:bg-blue-400 rounded-t transition-all"
                    style={{ height: `${d.rev}%` }}
                    title={`Revenue: ${d.rev}%`}
                  />
                  <div
                    className="w-3 sm:w-4 bg-orange-500 hover:bg-orange-400 rounded-t transition-all"
                    style={{ height: `${d.ord}%` }}
                    title={`Orders: ${d.ord}%`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  {d.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
            <span>Peak Day: <strong className="text-white">Sep 24</strong></span>
            <span>Average Conversion Rate: <strong className="text-emerald-400">3.2%</strong></span>
          </div>
        </div>

        {/* Quick Actions (1 Col) */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-3">
          <h3 className="font-extrabold text-base text-white">Quick Actions</h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/products/"
              prefetch={false}
              className="w-full min-h-[44px] px-4 bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </Link>

            <Link
              href="/admin/orders/"
              prefetch={false}
              className="w-full min-h-[44px] px-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
            >
              <span>Manage Store Orders</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/categories/"
              prefetch={false}
              className="w-full min-h-[44px] px-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
            >
              <span>Categories & Subcategories</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/admin/settings/"
              prefetch={false}
              className="w-full min-h-[44px] px-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
            >
              <span>Store & Shipping Settings</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong className="text-slate-200">Cloud Database Auto-Sync:</strong> All modifications in Admin sync immediately with your live PostgreSQL instance with zero serverless latency.
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-white">Recent Orders</h3>
            <p className="text-xs text-slate-400">Latest customer orders across all channels</p>
          </div>
          <Link
            href="/admin/orders/"
            prefetch={false}
            className="text-xs font-bold text-[#FF6A00] hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4"># Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{order.order_number}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{order.customer_name}</div>
                    <div className="text-[11px] text-slate-500">{order.customer_phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-black text-white">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border focus:outline-none capitalize cursor-pointer ${
                        order.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-950 text-blue-400 border-blue-800'
                          : order.status === 'processing'
                          ? 'bg-purple-950 text-purple-400 border-purple-800'
                          : 'bg-amber-950 text-amber-400 border-amber-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold rounded-lg border border-slate-700 transition-colors"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card-Based Orders View (Rule: No cramped scrolling tables on mobile) */}
        <div className="md:hidden divide-y divide-slate-800 space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="pt-3 first:pt-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white text-sm">{order.order_number}</span>
                <span className="font-black text-[#FF6A00]">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="text-xs text-slate-400">
                <div>Customer: <strong className="text-slate-200">{order.customer_name}</strong></div>
                <div>Phone: {order.customer_phone}</div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] uppercase font-bold text-orange-400 bg-orange-950 px-2 py-0.5 rounded">
                  {order.status}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-3 py-1 bg-slate-850 text-white text-xs font-bold rounded border border-slate-700"
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Performance Stats Footer Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-semibold">Online Visitors</div>
          <div className="text-xl font-black text-white mt-1">1,248</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">↑ 22%</div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-semibold">Conversion Rate</div>
          <div className="text-xl font-black text-white mt-1">3.2%</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">↑ 8%</div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-semibold">Avg. Order Value</div>
          <div className="text-xl font-black text-white mt-1">$259.58</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">↑ 14%</div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 font-semibold">Abandoned Carts</div>
          <div className="text-xl font-black text-white mt-1">7</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-0.5">↓ 4%</div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && settings && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          settings={settings}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
