'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    eyebrow: 'Engineered for Elevation',
    headline: ['Adventure & Performance', 'Mountain/Adult Bicycles'],
    subheadline: '',
    cta1: { label: 'Explore MTB Bikes', href: '#' },
    cta2: { label: '', href: '#' },
    image: 'https://cdn.shopify.com/s/files/1/0744/1494/8504/files/ADULT_BICYCLE_-_WEBSITE.png?v=1780723791',
    stat: { value: '6.4kg', label: 'Frame Weight' },
  },
  {
    id: 2,
    eyebrow: 'Grow with Cosmic Kids Bicycle  ',
    headline: ['Everyday Joy', 'Kids Bicycles'],
    subheadline: 'Safe, Stylish, and Built for Growing Riders.  ',
    cta1: { label: 'Discover Kids’ Bicycles ', href: '#' },
    cta2: { label: 'Terra Elite', href: '#' },
    image: 'https://cdn.shopify.com/s/files/1/0744/1494/8504/files/markup_content___com.whatsapp.w4b.provider.media_item_c3231b11-270a-4d16-b915-dc343f408cc3_2.jpg?v=1780725492',
    stat: { value: '140mm', label: 'Travel' },
  },
  {
    id: 3,
    eyebrow: 'Start the Journey ',
    headline: ['First Wheels', 'Children’s Tricycles'],
    subheadline: 'BIS Certified, Designed for Balance, Safety, and Smiles.',
    cta1: { label: 'Discover Toddlers', href: '#' },
    cta2: { label: 'Venture Gravel', href: '#' },
    image: 'https://cdn.shopify.com/s/files/1/0744/1494/8504/files/markup_content___com.whatsapp.w4b.provider.media_item_f6c3d2f3-de98-41ca-af0f-64ccfb0cb3d1_2.jpg?v=1780725492',
    stat: { value: '45c', label: 'Tire Clearance' },
  },
];

const DURATION = 7000;
const TRANSITION = 800;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = useCallback(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
    }, 50);
  }, []);

  const goTo = useCallback((index: number) => {
    if (transitioning || index === current) return;
    setTransitioning(true);
    setContentVisible(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setTimeout(() => {
      setPrev(current);
      setCurrent(index);
      setTransitioning(false);
      setTimeout(() => {
        setContentVisible(true);
        setPrev(null);
        startProgress();
      }, 100);
    }, TRANSITION);
  }, [current, transitioning, startProgress]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    startProgress();
    timerRef.current = setTimeout(() => next(), DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, next, startProgress]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-zinc-950 flex flex-col md:block md:h-screen md:min-h-[600px] md:max-h-[1080px]"
      aria-label="Featured collections"
    >
      {/* Background images — layered for crossfade */}
      {/* Mobile: fixed-height image block; Desktop: absolute fill */}
      <div className="relative w-full aspect-[4/3] md:aspect-auto md:absolute md:inset-0">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity: i === current ? 1 : i === prev ? 0 : 0,
              transitionDuration: `${TRANSITION}ms`,
              transitionTimingFunction: 'ease-in-out',
            }}
            aria-hidden="true"
          >
            <img
              src={s.image}
              alt={s.headline.join(' ')}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 35%', transform: i === current ? 'scale(1.03)' : 'scale(1)', transition: `transform ${DURATION}ms ease-out` }}
            />
            <div className="absolute inset-0 hero-overlay md:block" />
            <div className="absolute inset-0 hero-overlay-left" />
          </div>
        ))}

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '120px',
          }}
        />

        {/* Right side controls — positioned inside image block on mobile */}
        <div className="absolute right-4 md:right-6 lg:right-10 bottom-4 md:bottom-28 flex flex-col items-end gap-4 md:gap-5">
          <div className="flex items-center gap-2 text-white/40">
            <span className="font-display text-lg font-semibold text-white">
              {String(current + 1).padStart(2, '0')}
            </span>
            <span className="text-xs">/</span>
            <span className="text-xs">{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-[2px] overflow-hidden group"
                style={{ width: i === current ? '48px' : '24px', transition: 'width 0.4s ease', background: 'rgba(255,255,255,0.2)' }}
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === current && (
                  <span
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${progress}%`, transition: 'none', backgroundColor: '#D61C1C' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content — below image on mobile, overlaid at bottom on desktop */}
      <div className="relative md:absolute md:inset-0 md:h-full max-w-screen-xl mx-auto px-6 lg:px-10 flex flex-col justify-end py-8 md:pb-28 md:py-0 bg-zinc-950 md:bg-transparent">
        {/* Eyebrow */}
        <div
          className="mb-5 transition-all duration-500"
          style={{ opacity: contentVisible ? 1 : 0, transform: contentVisible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <span className="inline-flex items-center gap-3 mb-2">
            <span className="w-6 h-px bg-[#D61C1C]/80" />
            <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#D61C1C]">
              Sky Is The Limit
            </span>
          </span>
          <br />
          <span className="inline-flex items-center gap-3">
            <span className="w-6 h-px bg-white/50" />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/60">
              {slide.eyebrow}
            </span>
          </span>
        </div>

        {/* Headline */}
        <div
          className="mb-6 transition-all duration-600"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: contentVisible ? '80ms' : '0ms',
          }}
        >
          <h1 className="font-display font-semibold text-white leading-none" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}>
            {slide.headline[0]}
            <br />
            <em className="not-italic" style={{ WebkitTextStroke: '1.5px rgba(214,28,28,0.85)', color: 'transparent' }}>
              {slide.headline[1]}
            </em>
          </h1>
        </div>

        {/* Sub + CTA row */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <div
            className="max-w-sm transition-all duration-600"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: contentVisible ? '160ms' : '0ms',
            }}
          >
            <p className="text-sm md:text-base text-white/70 font-light leading-relaxed mb-7">
              {slide.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={slide.cta1.href} className="cosmic-btn-primary group" style={{ backgroundColor: '#D61C1C' }}>
                {slide.cta1.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div
            className="hidden md:block transition-all duration-600"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: contentVisible ? '240ms' : '0ms',
            }}
          />
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-6 flex-col items-center gap-2">
        <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/60 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-white/30">Scroll</span>
      </div>
    </section>
  );
}
