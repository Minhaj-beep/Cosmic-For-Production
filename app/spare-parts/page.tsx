'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ChevronDown } from 'lucide-react';
import { spareParts } from '@/lib/mock-data';

const partCategories = ['All', 'Forks', 'Groupsets', 'Wheels', 'Suspension', 'Drivetrain', 'Tires'];

export default function SparePartsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    let result = [...spareParts];
    if (category !== 'All') {
      result = result.filter((p) => p.categoryName === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.compatibility.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, category]);

  return (
    <>
      <section className="pt-32 pb-10 bg-zinc-900">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-3">Keep Rolling</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-white">Spare Parts</h1>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, or compatibility..."
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
            <p className="text-sm text-zinc-400 md:ml-auto">{filtered.length} parts</p>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8">
            {partCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium border whitespace-nowrap transition-colors ${category === cat ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((part) => (
                <Link key={part.id} href={`/spare-parts/${part.slug}`} className="group border border-zinc-100 hover:border-zinc-300 transition-colors p-4">
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-50 mb-4">
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ objectPosition: 'center 30%' }}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs text-zinc-400">{part.categoryName}</p>
                    <p className="text-xs font-mono text-zinc-400">{part.sku}</p>
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900 mb-1.5 group-hover:text-zinc-600 transition-colors">{part.name}</h3>
                  <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{part.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">₹{part.price.toLocaleString()}</span>
                    <span className="text-xs text-zinc-400 text-right max-w-[140px] line-clamp-1">{part.compatibility}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-zinc-400">No parts found matching your search.</p>
              <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-3 text-sm text-zinc-600 underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
