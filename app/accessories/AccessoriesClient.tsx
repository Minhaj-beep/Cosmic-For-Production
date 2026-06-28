'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, ChevronDown } from 'lucide-react';
import { getPublicAccessories, getAccessoryCategories, type Accessory } from '@/lib/api/accessories';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function AccessoriesClient() {
  const [items, setItems] = useState<Accessory[]>([]);
  const [accCategories, setAccCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data }, cats] = await Promise.all([
      getPublicAccessories({ search, category, sort }),
      getAccessoryCategories(),
    ]);
    setItems(data);
    setAccCategories(cats);
    setLoading(false);
  }, [search, category, sort]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <section className="pt-32 pb-10 bg-zinc-900">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-3">Gear Up</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-white">Accessories</h1>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search accessories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 text-sm outline-none focus:border-zinc-500 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              )}
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 border border-zinc-200 text-sm outline-none bg-white cursor-pointer">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
            <p className="text-sm text-zinc-400 md:ml-auto">{loading ? '...' : `${items.length} items`}</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
            {accCategories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 text-xs font-medium border whitespace-nowrap transition-colors ${category === cat ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'}`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-zinc-100 mb-3" />
                  <div className="h-3 bg-zinc-100 rounded mb-2 w-1/2" />
                  <div className="h-4 bg-zinc-100 rounded" />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map((acc) => (
                <Link key={acc.id} href={`/accessories/${acc.sku.toLowerCase()}`} className="group product-card-hover">
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
                    {acc.image && (
                      <img src={acc.image} alt={acc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="pt-3">
                    <p className="text-xs text-zinc-400 mb-0.5">{acc.category}</p>
                    <h3 className="text-sm font-medium text-zinc-900 mb-1 group-hover:text-zinc-600 transition-colors">{acc.name}</h3>
                    <p className="text-xs text-zinc-500 mb-2 line-clamp-1">{acc.description}</p>
                    <span className="text-sm font-semibold">₹{acc.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-400">No accessories found.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-sm text-zinc-600 underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
