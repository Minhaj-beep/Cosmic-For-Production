'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, ChevronDown, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { products, categories } from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
];

const PAGE_SIZE = 6;

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'all') result = result.filter((p) => p.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
    }
    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return result;
  }, [search, selectedCategory, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filtered.length;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  return (
    <>
      {/* Page header */}
      <section className="pt-32 pb-12 bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <p className="section-label text-zinc-600 mb-3">Our Range</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-[1.05]">
              All Bikes
            </h1>
            <p className="text-zinc-500 text-sm self-end mb-1 hidden md:block">
              {filtered.length} model{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-6 border-b border-zinc-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search bikes..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-10"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-zinc-400 hover:text-zinc-700" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none input-field pr-10 cursor-pointer w-auto"
              >
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>

            <p className="text-sm text-zinc-400 md:ml-auto hidden md:block">
              {filtered.length} bike{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex gap-10">
            {/* Sidebar */}
            <aside className="hidden lg:block w-44 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <p className="label-field mb-3">Category</p>
                  <div className="space-y-0.5">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`block text-sm w-full text-left py-1.5 transition-colors ${selectedCategory === 'all' ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
                    >
                      All Bikes
                      <span className="ml-1 text-xs text-zinc-400">({products.length})</span>
                    </button>
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category === cat.slug).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.slug)}
                          className={`block text-sm w-full text-left py-1.5 transition-colors ${selectedCategory === cat.slug ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
                        >
                          {cat.name}
                          <span className="ml-1 text-xs text-zinc-400">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile category pills */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-4 py-1.5 text-xs font-semibold border whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600'}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-4 py-1.5 text-xs font-semibold border whitespace-nowrap transition-all ${selectedCategory === cat.slug ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-200 text-zinc-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {paginated.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
                    {paginated.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        slug={product.slug}
                        categoryName={product.categoryName}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.images[0]}
                        shortDescription={product.shortDescription}
                        badge={product.badge}
                        isNew={product.isNew}
                        index={i}
                      />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-14 text-center">
                      <button
                        onClick={() => setPage((p) => p + 1)}
                        className="cosmic-btn-outline-dark group"
                      >
                        Load More
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-zinc-400 mt-3">
                        Showing {paginated.length} of {filtered.length}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24 border border-zinc-100">
                  <Search className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                  <p className="text-zinc-500 mb-2">No bikes found for "{search}"</p>
                  <button
                    onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                    className="text-sm text-zinc-600 underline hover:text-zinc-900"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
