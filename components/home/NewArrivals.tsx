'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { products } from '@/lib/mock-data';

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

export default function NewArrivals() {
  const newProducts = products.filter((p) => p.isNew).slice(0, 3);
  const { ref, inView } = useInView();

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-12 md:mb-16" ref={ref}>
          <div>
            <p className={`section-label mb-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Just Dropped
            </p>
            <h2 className={`section-title transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              New<br /><em className="italic">Arrivals</em>
            </h2>
          </div>
          <Link
            href="#"
            // href="/products"
            className={`hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-all duration-500 group ${inView ? 'opacity-100' : 'opacity-0'}`}
          >
            All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Hero card — first new product, spans 2 rows on md */}
          {newProducts[0] && (
            <Link
              // href={`/products/${newProducts[0].slug}`}
              href={`#`}
              className={`group relative overflow-hidden bg-zinc-100 md:row-span-2 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: inView ? '200ms' : '0ms' }}
            >
              <div className="relative overflow-hidden aspect-[3/2] md:aspect-auto md:h-full md:min-h-[500px]">
                <img
                  src={newProducts[0].images[0]}
                  alt={newProducts[0].name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold tracking-[0.15em] uppercase">
                    New
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:-translate-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-1">{newProducts[0].categoryName}</p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-2">{newProducts[0].name}</h3>
                  <p className="text-sm text-white/70 mb-4 hidden md:block">{newProducts[0].shortDescription}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">From ₹{newProducts[0].price.toLocaleString('en-IN')}</span>
                    <div className="w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <ArrowUpRight className="w-4 h-4 text-zinc-900" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Side cards */}
          {newProducts.slice(1, 3).map((product, i) => (
            <Link
              key={product.id}
              href={`#`}
              // href={`/products/${product.slug}`}
              className={`group relative overflow-hidden bg-zinc-100 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: inView ? `${(i + 3) * 120}ms` : '0ms' }}
            >
              <div className="relative overflow-hidden aspect-[3/2]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                  style={{ objectPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-semibold tracking-[0.15em] uppercase">New</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-500 group-hover:-translate-y-1">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50 mb-0.5">{product.categoryName}</p>
                  <div className="flex items-end justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-white leading-tight">{product.name}</h3>
                    <span className="text-sm text-white/80 font-medium flex-shrink-0">₹{product.price.toLocaleString('en-IN')}</span>
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
