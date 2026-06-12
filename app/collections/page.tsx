import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/mock-data';

export const metadata: Metadata = { title: 'Collections' };

export default function CollectionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-zinc-900">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-4">Browse by Category</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-white leading-none">
            Collections
          </h1>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/collections/${cat.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden aspect-[3/2] bg-zinc-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: 'center 30%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-white/60 tracking-wider uppercase mb-1">{cat.count} Models</p>
                      <h2 className="font-display text-2xl font-semibold text-white">{cat.name}</h2>
                    </div>
                    <div className="w-9 h-9 border border-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-zinc-500">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-zinc-50 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h3 className="font-display text-3xl font-semibold text-zinc-900 mb-3">Not sure where to start?</h3>
          <p className="text-zinc-500 mb-8">Our team is happy to guide you to your perfect Cosmic match.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/products" className="cosmic-btn-outline-dark">View All Bikes</Link>
            <Link href="/contact" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">Contact Us →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
