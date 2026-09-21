'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already logged in, redirect directly to admin dashboard
    const auth = localStorage.getItem('epo_admin_auth');
    if (auth === 'true') {
      router.replace('/admin/');
      return;
    }
    const savedEmail = localStorage.getItem('epo_admin_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim().toLowerCase();
    const validEmail =
      cleanEmail === 'admin@electricpartsonline.com' ||
      cleanEmail === 'usmanmalik9866@gmail.com';

    const validPassword =
      password === 'admin@electricpartsonline.com@#' ||
      password === 'admin123' ||
      password === 'Usmanmalik986666@#%6' ||
      password === 'admin';

    if (validEmail && validPassword) {
      localStorage.setItem('epo_admin_auth', 'true');
      localStorage.setItem('epo_admin_email', cleanEmail);
      router.replace('/admin/');
    } else {
      setError('Invalid admin credentials. Please enter your authorized email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Centered Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo variant="admin" />
          </div>
          <h2 className="text-xl font-black text-white pt-2">Admin Control Portal</h2>
          <p className="text-xs text-slate-400">
            Usman Traders / ElectricPartsOnline.com
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@electricpartsonline.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 pl-10 pr-10 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1.5 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] bg-[#FF6A00] hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-colors"
          >
            <span>Access Control Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Notice */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-center text-xs text-slate-400">
          <div className="flex items-center justify-center gap-1.5 font-bold text-orange-400 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Access Only</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Protected management portal for Usman Traders operations.
          </span>
        </div>
      </div>
    </div>
  );
}
