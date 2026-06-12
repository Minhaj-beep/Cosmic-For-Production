'use client';

import { useEffect, useRef, useState } from 'react';
import { Zap, Award, Cpu, Layers } from 'lucide-react';

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

const pillars = [
  {
    icon: Cpu,
    title: 'Precision Engineering',
    description: 'Every frame is designed and validated through thousands of hours of real-world testing under the toughest conditions.',
  },
  {
    icon: Layers,
    title: 'Materials',
    description: 'We use the best quality of Steel and Alloy 6061 grade for our bicycles.',
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'Each Cosmic bicycle undergoes multiple meticulous quality checkpoints — from the first layup to the final finish. No shortcuts, no compromises.',
  },
  {
    icon: Zap,
    title: 'Relentless Innovation',
    description: 'With every season, our R&D team introduces pioneering design breakthroughs — setting new standards of innovation and originality.',
  },
];

export default function QualitySection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
        {/* Split header */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-20" ref={ref}>
          <div>
            <p className={`section-label mb-3 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Why Cosmic
            </p>
            <h2 className={`section-title transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              The Cosmic<br /><em className="italic">Standard</em>
            </h2>
          </div>
          <div className={`flex items-end transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="max-w-md">
              <p className="text-zinc-500 text-base leading-[1.8] mb-4">
                Since 2005, we've been redefining cycling in India. For over two decades, Cosmic has crafted premium products — proudly designed in India, built for India.
              </p>
              <p className="text-zinc-500 text-base leading-[1.8]">
                For riders who demand nothing less than perfection — in performance, in quality, and in every detail, visible or hidden. This is what sets a Cosmic apart.
              </p>
            </div>
          </div>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`bg-white p-8 group hover:bg-zinc-950 transition-all duration-500 cursor-default ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: inView ? `${i * 80}ms` : '0ms', transitionProperty: 'background-color, opacity, transform' }}
              >
                <div className="w-10 h-10 border border-zinc-100 group-hover:border-[#D61C1C] flex items-center justify-center mb-6 transition-colors duration-500">
                  <Icon className="w-4.5 h-4.5 text-zinc-600 group-hover:text-[#D61C1C] transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-zinc-900 group-hover:text-white mb-3 transition-colors duration-500">
                  {pillar.title}
                </h3>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-400 leading-[1.75] transition-colors duration-500">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats ticker strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-100 mt-px">
          {[
            { value: '20+', label: 'Years of Excellence', sub: 'Since 2005' },
            { value: '2M+', label: 'Cosmic Riders', sub: 'Across India' },
            { value: 'Multi', label: 'Quality Checkpoints', sub: 'Per bicycle' },
            { value: '100%', label: 'Designed in India', sub: 'Built for India' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`bg-zinc-950 px-8 py-8 transition-all duration-700 ${inView ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: inView ? `${(i + 6) * 80}ms` : '0ms' }}
            >
              <p className="font-display text-4xl font-semibold text-white mb-1">{stat.value}</p>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500">{stat.label}</p>
              <p className="text-xs text-zinc-700 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
