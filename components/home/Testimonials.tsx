'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/mock-data';

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

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const { ref, inView } = useInView();

  const go = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
      setAnimating(false);
    }, 300);
  };

  return (
    <section className="py-20 md:py-32 bg-zinc-50">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-12 md:mb-16" ref={ref}>
          <div>
            <p className={`section-label mb-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Real Riders
            </p>
            <h2 className={`section-title transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              What They Say
            </h2>
          </div>
          {/* Desktop controls */}
          <div className={`hidden md:flex items-center gap-2 transition-all duration-700 delay-200 ${inView ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 border border-zinc-200 flex items-center justify-center hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => go(1)}
              className="w-10 h-10 border border-zinc-200 flex items-center justify-center hover:border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop: 4-column grid, always shown */}
        <div className={`hidden md:grid grid-cols-4 gap-5 transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`bg-white p-6 border border-zinc-100 flex flex-col transition-all duration-500 ${i === current ? 'border-zinc-300 shadow-lg' : 'hover:border-zinc-200'}`}
              onClick={() => setCurrent(i)}
              style={{ cursor: 'pointer' }}
            >
              <Quote className="w-6 h-6 text-zinc-200 mb-4 flex-shrink-0" />
              <p className="text-[13px] text-zinc-600 leading-[1.8] flex-1 mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="w-3 h-3 fill-zinc-900 text-zinc-900" />
                ))}
              </div>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-zinc-100">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 truncate">{t.name}</p>
                  <p className="text-[11px] text-zinc-400 truncate">{t.role}</p>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 mt-3 pt-3 border-t border-zinc-100 tracking-wide">
                {t.bike}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: single slide */}
        <div className={`md:hidden transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div
            className={`bg-white p-6 border border-zinc-100 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}
          >
            <Quote className="w-6 h-6 text-zinc-200 mb-4" />
            <p className="text-sm text-zinc-600 leading-[1.8] mb-5">"{testimonials[current].text}"</p>
            <div className="flex items-center gap-0.5 mb-4">
              {Array.from({ length: testimonials[current].rating }).map((_, s) => (
                <Star key={s} className="w-3 h-3 fill-zinc-900 text-zinc-900" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-100">
                <img src={testimonials[current].avatar} alt={testimonials[current].name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900">{testimonials[current].name}</p>
                <p className="text-[11px] text-zinc-400">{testimonials[current].role}</p>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-3 pt-3 border-t border-zinc-100">{testimonials[current].bike}</p>
          </div>

          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-0.5 transition-all duration-300 ${i === current ? 'w-8 bg-zinc-900' : 'w-4 bg-zinc-300'}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} className="w-9 h-9 border border-zinc-200 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => go(1)} className="w-9 h-9 border border-zinc-200 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
