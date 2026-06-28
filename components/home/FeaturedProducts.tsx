'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts, type PublicProduct } from '@/lib/api/products';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ProductCard({ product, index, inView }: { product: PublicProduct; index: number; inView: boolean }) {
  const slug = product.sku.toLowerCase();
  const categoryName = product.categories?.name ?? product.subcategory;
  const price = product.offer_price ?? product.price;
  const originalPrice = product.offer_price ? product.price : null;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block"
      style={{ animationDelay: `${index * 60}ms` }}
    >
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
        {product.new_arrival && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#D61C1C] text-white text-[10px] font-semibold tracking-[0.15em] uppercase">
            New
          </div>
        )}
        {product.bestseller && !product.new_arrival && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-zinc-900 text-white text-[10px] font-semibold tracking-[0.15em] uppercase">
            Best Seller
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

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<PublicProduct[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    getFeaturedProducts(4).then(({ data }) => setFeatured(data));
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-zinc-50">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-12 md:mb-16" ref={ref}>
          <div>
            <p className={`section-label mb-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Hand-Picked
            </p>
            <h2 className={`section-title transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Featured Bikes
            </h2>
          </div>
          <Link
            href="/products"
            className={`hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-all duration-500 group ${inView ? 'opacity-100' : 'opacity-0'}`}
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {featured.map((product, i) => (
            <div
              key={product.id}
              className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: inView ? `${(i + 2) * 80}ms` : '0ms' }}
            >
              <ProductCard product={product} index={i} inView={inView} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/products" className="cosmic-btn-outline-dark">
            View All Bikes
          </Link>
        </div>
      </div>
    </section>
  );
}
