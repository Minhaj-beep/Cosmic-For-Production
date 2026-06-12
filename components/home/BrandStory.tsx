'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

export default function BrandStory() {
  const { ref, inView } = useInView();

  return (
    <section className="py-0 bg-zinc-950 overflow-hidden" ref={ref}>
      <div className="grid lg:grid-cols-2 min-h-[560px]">
        {/* Image side */}
        <div
          className={`relative h-72 lg:h-auto overflow-hidden transition-all duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg"
            alt="Cosmic Story — craftsmanship"
            className={`w-full h-full object-cover transition-transform duration-[1.5s] ${inView ? 'scale-100' : 'scale-110'}`}
            style={{ objectPosition: 'center 40%', filter: 'brightness(0.6) contrast(1.1)' }}
          />
          {/* Year badge */}
          <div className="absolute bottom-6 left-6 border border-white/20 px-4 py-3">
            <p className="text-[10px] text-white/40 tracking-[0.25em] uppercase mb-0.5">Founded</p>
            <p className="font-display text-2xl font-semibold text-white">2008</p>
          </div>
        </div>

        {/* Text side */}
        <div
          className={`flex items-center px-8 md:px-14 lg:px-16 py-16 md:py-24 transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        >
          <div className="max-w-lg">
            <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-zinc-500 mb-6">
              The Cosmic Story
            </p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] mb-6">
              Born from obsession,<br />
              <em className="italic text-zinc-400">refined by precision.</em>
            </h2>
            <p className="text-zinc-400 text-base leading-[1.8] mb-4">
              Since 2008, Cosmic has pursued one singular vision: to build the finest bicycles in the world. Every frame, every component, every weld is a testament to the relentless pursuit of perfection.
            </p>
            <p className="text-zinc-500 text-sm leading-[1.8] mb-10">
              Our engineers and designers work in harmony, pushing the limits of materials science and aerodynamics to create bikes that feel alive under you — responsive, confident, and utterly exhilarating.
            </p>

            {/* Inline stats */}
            <div className="grid grid-cols-3 gap-6 mb-10 pt-8 border-t border-zinc-800">
              {[
                { value: '16+', label: 'Years' },
                { value: '50K+', label: 'Riders' },
                { value: '8', label: 'Awards' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-semibold text-white">{s.value}</p>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-zinc-600 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-white text-sm font-medium tracking-wide hover:text-zinc-300 transition-colors group"
            >
              Discover Our Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
