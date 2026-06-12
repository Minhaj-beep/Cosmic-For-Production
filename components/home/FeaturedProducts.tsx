'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';

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

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const { ref, inView } = useInView();

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
              <ProductCard
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
