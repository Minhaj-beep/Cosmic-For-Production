'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, CircleAlert as AlertCircle, Loader as Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function AdminLoginPage() {
  const { login, user, loading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/admin/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg"
          alt="Cosmic Bicycles"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <img src="/cosmic.png" alt="Cosmic" className="h-9 w-auto brightness-0 invert" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#D61C1C] mb-3">Sky Is The Limit</p>
            <h2 className="font-display text-4xl font-semibold text-white leading-tight mb-4">
              Admin Control<br />Centre
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Manage your products, dealers, content, and operations from one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <img src="/cosmic.png" alt="Cosmic" className="h-8 w-auto" />
          </div>

          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 mb-2">Admin Portal</p>
          <h1 className="font-display text-3xl font-semibold text-zinc-900 mb-1">Sign in</h1>
          <p className="text-sm text-zinc-400 mb-8">Use your admin credentials to continue.</p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cosmicbicycles.com"
                className="w-full px-4 py-3 border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-zinc-200 bg-zinc-50 text-zinc-900 text-sm outline-none focus:border-zinc-900 focus:bg-white transition-colors pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[#D61C1C]" />
                <span className="text-xs text-zinc-500">Remember me</span>
              </label>
              <Link href="/admin/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 text-sm font-semibold tracking-wide hover:bg-[#D61C1C] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign in to Dashboard'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-300 mt-10">
            Contact your administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
