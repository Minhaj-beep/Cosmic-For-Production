'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-zinc-900 mb-2">Check your inbox</h2>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              If an account exists for <span className="font-medium text-zinc-700">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <Link href="/admin/login" className="text-sm font-semibold text-zinc-900 hover:text-[#D61C1C] transition-colors">
              Return to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-400 mb-2">Admin Portal</p>
            <h1 className="font-display text-3xl font-semibold text-zinc-900 mb-1">Reset password</h1>
            <p className="text-sm text-zinc-400 mb-8">
              Enter your admin email and we'll send you a reset link.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 mb-5">
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
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 text-sm font-semibold hover:bg-[#D61C1C] transition-colors duration-300 disabled:opacity-60"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
