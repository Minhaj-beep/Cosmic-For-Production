'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getNewArrivals, type PublicProduct } from '@/lib/api/products';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold, root: null, rootMargin: '0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function NewArrivals() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const { ref } = useInView();
  const inView = true;

  useEffect(() => {
    getNewArrivals(3)
      .then((res) => {
        console.log('API Response:', res);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('API Error:', err);
      });
  }, []);

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="py-20 md:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div>
            <p
              className={`section-label mb-3 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Just Dropped
            </p>
            <h2
              className={`section-title transition-all duration-700 delay-100 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              New<br />
              <em className="italic">Arrivals</em>
            </h2>
          </div>

          <Link
            href="/products?filter=new"
            className={`hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-all duration-500 group ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            All New Arrivals
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {products[0] && (
            <Link
              href={`/products/${products[0].sku.toLowerCase()}`}
              className={`group relative overflow-hidden bg-zinc-100 md:row-span-2 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? '200ms' : '0ms' }}
            >
              <div className="relative overflow-hidden aspect-[3/2] md:aspect-auto md:h-full md:min-h-[500px]">
                {products[0].images?.[0] && (
                  <img
                    src={products[0].images[0]}
                    alt={products[0].name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                    style={{ objectPosition: 'center 30%' }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold tracking-[0.15em] uppercase">
                    New
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:-translate-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-1">
                    {products[0].categories?.name ?? products[0].subcategory}
                  </p>

                  <h3
                    className="font-display text-2xl md:text-3xl font-semibold text-white mb-2"
                    style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
                  >
                    {products[0].name}
                  </h3>

                  <p
                    className="text-sm text-white/75 mb-4 hidden md:block line-clamp-2"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}
                  >
                    {products[0].description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-white font-semibold"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.75)' }}
                    >
                      From ₹{(products[0].offer_price ?? products[0].price).toLocaleString('en-IN')}
                    </span>

                    <div className="w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <ArrowUpRight className="w-4 h-4 text-zinc-900" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {products.slice(1, 3).map((product, i) => (
            <Link
              key={product.id}
              href={`/products/${product.sku.toLowerCase()}`}
              className={`group relative overflow-hidden bg-zinc-100 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? `${(i + 3) * 120}ms` : '0ms' }}
            >
              <div className="relative overflow-hidden aspect-[3/2]">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                    style={{ objectPosition: 'center 30%' }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-700" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold tracking-[0.15em] uppercase">
                    New
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent transform transition-transform duration-500 group-hover:-translate-y-1">
                  <p
                    className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/75 mb-0.5"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                  >
                    {product.categories?.name ?? product.subcategory}
                  </p>

                  <div className="flex items-end justify-between gap-2">
                    <h3
                      className="font-display text-lg font-semibold text-white leading-tight"
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
                    >
                      {product.name}
                    </h3>

                    <span
                      className="text-sm text-white font-semibold flex-shrink-0"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                      ₹{(product.offer_price ?? product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}