'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, Users, Trophy, BadgeCheck, Zap, Globe } from 'lucide-react';

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

export default function CtaBanner() {
  const { ref, inView } = useInView();

  return (
    <section className="relative overflow-hidden">
      {/* Top strip — dark with image */}
      <div className="relative bg-zinc-950 py-20 md:py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg"
            alt=""
            className="w-full h-full object-cover opacity-[0.12]"
            style={{ objectPosition: 'center 40%' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 to-zinc-950/80" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-5 lg:px-10" ref={ref}>
          <div className="max-w-2xl mx-auto text-center">
            <p className={`section-label text-zinc-600 mb-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Ready to ride?
            </p>
            <p className={`text-[11px] font-bold tracking-[0.35em] uppercase text-[#D61C1C] mb-5 transition-all duration-700 delay-75 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Sky Is The Limit
            </p>
            <h2 className={`font-display text-4xl md:text-6xl font-semibold text-white mb-6 leading-[1.05] transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Your Perfect Cosmic<br />
              <em className="italic text-zinc-400">Awaits You</em>
            </h2>
            <p className={`text-zinc-400 mb-10 text-base leading-[1.8] transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Visit your nearest Cosmic dealer or reach our team for a personal fitting consultation. We'll help you find the bike that's built for you.
            </p>
            <div className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="#" className="cosmic-btn-primary group">
              {/* <Link href="/collections" className="cosmic-btn-primary group"> */}
                Explore All Bikes
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/store-locator" className="cosmic-btn-outline">
                <MapPin className="w-4 h-4" />
                Find a Dealer
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
