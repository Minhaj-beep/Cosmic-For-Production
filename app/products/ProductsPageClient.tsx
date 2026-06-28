'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ChevronDown } from 'lucide-react';
import { getPublicProducts, type PublicProduct } from '@/lib/api/products';
import { getPublicCategories, type Category } from '@/lib/api/categories';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
];

const PAGE_SIZE = 6;

function ProductCard({ product, index }: { product: PublicProduct; index: number }) {
  const slug = product.sku.toLowerCase();
  const categoryName = product.categories?.name ?? product.subcategory;
  const price = product.offer_price ?? product.price;
  const originalPrice = product.offer_price ? product.price : null;
  const badge = product.new_arrival ? 'New' : product.bestseller ? 'Best Seller' : null;

  return (
    <Link href={`/products/${slug}`} className="group block" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="relative overflow-hidden bg-zinc-50 aspect-[4/3]">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]"
            style={{ objectPosition: 'center 30%' }}
            loading="lazy"
          />
        )}
        {badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${badge === 'New' ? 'bg-[#D61C1C] text-white' : 'bg-zinc-900 text-white'}`}>
            {badge}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-700" />
      </div>
      <div className="pt-4 pb-1">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">{categoryName}</p>
        <h3 className="font-display text-[17px] font-medium text-zinc-900 leading-tight mb-2 group-hover:text-zinc-600 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-500 mb-3 line-clamp-1 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-zinc-900">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <>
              <span className="text-xs text-zinc-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-[10px] font-semibold" style={{ color: '#D61C1C' }}>
                {Math.round((1 - price / originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter') ?? '';

  const [allProducts, setAllProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sort, setSort] = useState(filterParam ? 'newest' : 'featured');
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async (categorySlug?: string) => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      getPublicProducts({
        categorySlug: categorySlug && categorySlug !== 'all' ? categorySlug : undefined,
        filter: filterParam || undefined,
        sort: filterParam ? 'newest' : undefined,
      }),
      getPublicCategories(),
    ]);
    setAllProducts(prods);
    setCategories(cats);
    setLoading(false);
  }, [filterParam]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { setPage(1); }, [search, selectedCategory, sort]);

  const handleCategoryChange = useCallback((slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    loadProducts(slug);
  }, [loadProducts]);

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (sort === 'price_asc') result.sort((a, b) => (a.offer_price ?? a.price) - (b.offer_price ?? b.price));
    else if (sort === 'price_desc') result.sort((a, b) => (b.offer_price ?? b.price) - (a.offer_price ?? a.price));
    else if (sort === 'newest') result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [allProducts, search, sort]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filtered.length;

  return (
    <>
      <section className="pt-32 pb-12 bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <p className="section-label text-zinc-600 mb-3">Our Range</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-[1.05]">
              All Bikes
            </h1>
            <p className="text-zinc-500 text-sm self-end mb-1 hidden md:block">
              {loading ? '...' : `${filtered.length} model${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 pb-6 border-b border-zinc-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search bikes..."
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
              {loading ? '...' : `${filtered.length} bike${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex gap-10">
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
                    </button>
                    {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.slug)}
                          className={`block text-sm w-full text-left py-1.5 transition-colors ${selectedCategory === cat.slug ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'}`}
                        >
                          {cat.name}
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
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

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] bg-zinc-100 mb-4" />
                      <div className="h-3 bg-zinc-100 rounded mb-2 w-1/3" />
                      <div className="h-4 bg-zinc-100 rounded mb-2" />
                      <div className="h-3 bg-zinc-100 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : paginated.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8">
                    {paginated.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-14 text-center">
                      <button onClick={() => setPage((p) => p + 1)} className="cosmic-btn-outline-dark group">
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
                  <p className="text-zinc-500 mb-2">No bikes found{search ? ` for "${search}"` : ''}</p>
                  <button
                    onClick={() => { setSearch(''); handleCategoryChange('all'); }}
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
