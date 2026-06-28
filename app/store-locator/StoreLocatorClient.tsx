'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Mail, Clock, X, ChevronRight } from 'lucide-react';
import { getPublicDealers, type Dealer } from '@/lib/api/dealers';

const typeConfig: Record<string, { label: string; color: string }> = {
  flagship:        { label: 'Flagship',          color: 'bg-zinc-900 text-white' },
  dealer:          { label: 'Dealer',             color: 'bg-zinc-100 text-zinc-700' },
  service_center:  { label: 'Service Center',     color: 'bg-zinc-800 text-white' },
};

export default function StoreLocatorClient() {
  const [allDealers, setAllDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('All States');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    getPublicDealers().then(({ data }) => {
      setAllDealers(data);
      setLoading(false);
    });
  }, []);

  const states = useMemo(
    () => ['All States', ...Array.from(new Set(allDealers.map((d) => d.state))).sort()],
    [allDealers]
  );

  const filtered = useMemo(() => {
    let result = [...allDealers];
    if (state !== 'All States') result = result.filter((d) => d.state === state);
    if (typeFilter !== 'All') result = result.filter((d) => d.type === typeFilter.toLowerCase().replace(' ', '_'));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.address.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allDealers, search, state, typeFilter]);

  return (
    <>
      <section className="pt-32 pb-14 bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <nav className="flex items-center gap-1.5 text-[11px] text-zinc-600 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Store Locator</span>
          </nav>
          <p className="section-label text-zinc-600 mb-3">Where to Find Us</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.05]">Store Locator</h1>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search dealer name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-zinc-400 hover:text-zinc-700" />
                </button>
              )}
            </div>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="input-field w-auto min-w-[180px] cursor-pointer"
            >
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <p className="text-sm text-zinc-400 self-center md:ml-auto">
              {loading ? '...' : `${filtered.length} location${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {['All', 'Flagship', 'Service Center', 'Dealer'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 text-xs font-medium border transition-colors ${typeFilter === t ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-zinc-100 p-5 animate-pulse">
                  <div className="h-4 bg-zinc-100 rounded mb-3 w-2/3" />
                  <div className="h-3 bg-zinc-100 rounded mb-2" />
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((dealer) => {
                const tc = typeConfig[dealer.type] ?? typeConfig.dealer;
                const isSelected = selected === dealer.id;
                return (
                  <div
                    key={dealer.id}
                    className={`border p-5 cursor-pointer transition-all duration-300 hover:shadow-md ${isSelected ? 'border-zinc-900 shadow-md' : 'border-zinc-100 hover:border-zinc-300'}`}
                    onClick={() => setSelected(isSelected ? null : dealer.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-zinc-900 leading-snug">{dealer.name}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap flex-shrink-0 ${tc.color}`}>
                        {tc.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-zinc-500 leading-relaxed">{dealer.address}{dealer.pincode ? `, ${dealer.pincode}` : ''}</p>
                      </div>
                      {dealer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <a href={`tel:${dealer.phone}`} className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors" onClick={(e) => e.stopPropagation()}>
                            {dealer.phone}
                          </a>
                        </div>
                      )}
                      {isSelected && dealer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <a href={`mailto:${dealer.email}`} className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors" onClick={(e) => e.stopPropagation()}>
                            {dealer.email}
                          </a>
                        </div>
                      )}
                      {isSelected && (
                        <p className="text-[10px] text-zinc-400 pt-1">{dealer.city}, {dealer.state}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-zinc-100">
              <MapPin className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
              <p className="text-zinc-400 mb-2">No dealers found.</p>
              <button onClick={() => { setSearch(''); setState('All States'); setTypeFilter('All'); }} className="text-sm text-zinc-600 underline hover:text-zinc-900">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-zinc-50 text-center">
        <div className="max-w-lg mx-auto px-5">
          <p className="text-zinc-500 mb-8 leading-[1.8]">Dont Worry, Did not find a Dealer Near you? Write to us on support@cosmicbicycles.com</p>
          <Link href="mailto:support@cosmicbicycles.com" className="cosmic-btn-outline-dark">Contact Now</Link>
        </div>
      </section>
    </>
  );
}
