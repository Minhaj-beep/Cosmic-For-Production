'use client';

import { useState, useEffect } from 'react';
import { Star, StarOff, Loader as Loader2 } from 'lucide-react';
import { getProducts, upsertProduct, type Product } from '@/lib/api/products';
import AdminToast from '@/components/admin/AdminToast';

export default function FeaturedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleFlag(id: string, flag: 'featured' | 'new_arrival' | 'bestseller', current: boolean) {
    await upsertProduct({ [flag]: !current }, id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [flag]: !current } : p));
    setToast({ msg: 'Product flags updated.', type: 'success' });
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">Featured Products</h2>
        <p className="text-sm text-zinc-400 mt-0.5">Manage homepage feature flags for all products.</p>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Product', 'Category', 'Price', 'Featured', 'New Arrival', 'Bestseller'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-zinc-400">No products found.</td></tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && <img src={p.images[0]} className="w-9 h-9 object-cover bg-zinc-100" alt="" />}
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{p.name}</p>
                        <p className="text-xs font-mono text-zinc-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600">{p.categories?.name ?? '—'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-zinc-900">₹{(p.offer_price ?? p.price).toLocaleString('en-IN')}</td>
                  {(['featured', 'new_arrival', 'bestseller'] as const).map((flag) => (
                    <td key={flag} className="px-5 py-3.5">
                      <button
                        onClick={() => toggleFlag(p.id, flag, Boolean(p[flag]))}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border transition-colors ${p[flag] ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600'}`}
                      >
                        {p[flag] ? <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> : <StarOff className="w-3.5 h-3.5" />}
                        {p[flag] ? 'On' : 'Off'}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
