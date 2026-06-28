'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPublicCategories, type Category } from '@/lib/api/categories';

function useInView(threshold = 0.15) {
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

export default function CategoryHighlights() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    getPublicCategories().then(({ data }) => setCategories(data));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <div ref={ref}>
            <p className={`section-label mb-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Browse Collections
            </p>
            <h2 className={`section-title transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Find Your<br /><em className="italic">Perfect Ride</em>
            </h2>
          </div>
          <Link
            href="/collections"
            className={`hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-all duration-500 group ${inView ? 'opacity-100' : 'opacity-0'}`}
          >
            All Collections
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.slug}`}
              className={`group relative overflow-hidden bg-zinc-100 transition-all duration-700 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              } ${i === 0 ? 'row-span-2' : ''}`}
              style={{ transitionDelay: inView ? `${i * 60}ms` : '0ms' }}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'h-full min-h-[360px] md:min-h-[480px]' : 'aspect-[4/3]'}`}>
                {cat.image_url && (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.06]"
                    style={{ objectPosition: 'center 30%' }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-700" />

                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className={`font-display font-semibold text-white leading-tight ${i === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                      {cat.name}
                    </h3>
                    {i === 0 && cat.description && (
                      <p className="text-xs text-white/60 mt-1.5 leading-relaxed max-w-[180px] hidden md:block">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                    <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-white">Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/collections" className="cosmic-btn-outline-dark">
            All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
