'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, saveSiteSettings } from '@/lib/db';
import { SiteSettings } from '@/types';
import { INITIAL_SETTINGS } from '@/lib/mockData';
import { Settings, Save, CheckCircle2, ShieldCheck, Truck, CreditCard, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'payments' | 'popup'>('general');

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('epo_popup_dismissed');
      }
      await saveSiteSettings(settings);
      setNotice('Store settings saved and synced successfully!');
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      setNotice('Failed to save settings: ' + err.message);
      setTimeout(() => setNotice(null), 3500);
    } finally {
      setIsSaving(false);
    }
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
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Store Settings</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure business identity, dynamic shipping thresholds, payment accounts, and lead capture popup
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 rounded-xl p-1 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'general' ? 'bg-[#FF6A00] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          General Identity
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'shipping' ? 'bg-[#FF6A00] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Shipping & Delivery
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'payments' ? 'bg-[#FF6A00] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Payment Gateways
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('popup')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeTab === 'popup' ? 'bg-[#FF6A00] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Welcome Popup
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Company / Store Name</label>
                <input
                  type="text"
                  value={settings.general.storeName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, storeName: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Website Domain</label>
                <input
                  type="text"
                  value={settings.general.domain}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, domain: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Helpline Phone Number</label>
                <input
                  type="text"
                  value={settings.general.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, phone: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-bold text-orange-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.general.whatsapp}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, whatsapp: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Support Email Address</label>
                <input
                  type="email"
                  value={settings.general.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, email: e.target.value },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Physical Warehouse / Dispatch Address</label>
              <input
                type="text"
                value={settings.general.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, address: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Google Maps Location Link</label>
              <input
                type="url"
                value={settings.general.mapUrl}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, mapUrl: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-mono text-orange-400"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settings.general.announcement}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, announcement: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-semibold"
              />
            </div>

            {/* Social Media Links */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block font-bold text-slate-200 mb-3 text-sm flex items-center gap-2">
                <span>Official Social Media Accounts</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={settings.general.instagramUrl || ''}
                    placeholder="https://www.instagram.com/..."
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, instagramUrl: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">TikTok URL</label>
                  <input
                    type="url"
                    value={settings.general.tiktokUrl || ''}
                    placeholder="https://www.tiktok.com/@..."
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, tiktokUrl: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={settings.general.facebookUrl || ''}
                    placeholder="https://www.facebook.com/..."
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, facebookUrl: e.target.value },
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shipping */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Free Shipping Spend Threshold ($)</label>
                <input
                  type="number"
                  value={settings.shipping.freeShippingThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        freeShippingThreshold: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-bold"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Cart orders exceeding this value automatically qualify for Free Shipping.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Standard Flat Shipping Fee ($)</label>
                <input
                  type="number"
                  value={settings.shipping.flatShippingFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      shipping: {
                        ...settings.shipping,
                        flatShippingFee: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Delivery Policy Notice</label>
              <textarea
                rows={3}
                value={settings.shipping.deliveryPolicy}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shipping: { ...settings.shipping, deliveryPolicy: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-4 text-xs">
            {/* Meezan Bank */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm">Direct Bank Transfer (Meezan Bank)</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={settings.payments.bankTransfer.bankName || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          bankTransfer: { ...settings.payments.bankTransfer, bankName: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={settings.payments.bankTransfer.accountTitle || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          bankTransfer: { ...settings.payments.bankTransfer, accountTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">IBAN / Account Number</label>
                <input
                  type="text"
                  value={settings.payments.bankTransfer.iban || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        bankTransfer: { ...settings.payments.bankTransfer, iban: e.target.value },
                      },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* EasyPaisa & JazzCash */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-white">EasyPaisa Account</div>
                <div>
                  <label className="block text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={settings.payments.easyPaisa.accountTitle || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          easyPaisa: { ...settings.payments.easyPaisa, accountTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Account Number</label>
                  <input
                    type="text"
                    value={settings.payments.easyPaisa.accountNumber || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          easyPaisa: { ...settings.payments.easyPaisa, accountNumber: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-white">JazzCash Account</div>
                <div>
                  <label className="block text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={settings.payments.jazzCash.accountTitle || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          jazzCash: { ...settings.payments.jazzCash, accountTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Account Number</label>
                  <input
                    type="text"
                    value={settings.payments.jazzCash.accountNumber || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          jazzCash: { ...settings.payments.jazzCash, accountNumber: e.target.value },
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Welcome Popup */}
        {activeTab === 'popup' && (
          <div className="space-y-4 text-xs">
            <label className="flex items-center gap-2 font-bold text-white cursor-pointer">
              <input
                type="checkbox"
                checked={settings.popup.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    popup: { ...settings.popup, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <span>Enable Floating Welcome & WhatsApp Assistance Popup</span>
            </label>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Popup Headline</label>
              <input
                type="text"
                value={settings.popup.headline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    popup: { ...settings.popup, headline: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Popup Subheadline</label>
              <textarea
                rows={2}
                value={settings.popup.subheadline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    popup: { ...settings.popup, subheadline: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Dedicated WhatsApp Number</label>
              <input
                type="text"
                value={settings.popup.whatsappNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    popup: { ...settings.popup, whatsappNumber: e.target.value },
                  })
                }
                className="w-full bg-slate-900 border border-slate-800 text-white px-3 py-2 rounded-xl font-bold text-emerald-400"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('epo_popup_dismissed');
                    window.dispatchEvent(new Event('epo_test_popup'));
                  }
                  setNotice('Popup triggered! Check live storefront to see it in action.');
                  setTimeout(() => setNotice(null), 3500);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold text-xs rounded-xl border border-orange-500/30 flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test / Trigger Popup Now</span>
              </button>
              <span className="text-[11px] text-slate-400">
                Resets session dismissal flag and triggers the WhatsApp assistance popup immediately
              </span>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="min-h-[44px] px-6 bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
