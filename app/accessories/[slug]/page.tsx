'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Check, ArrowRight } from 'lucide-react';
import { accessories } from '@/lib/mock-data';

export default function AccessoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const acc = accessories.find((a) => a.slug === slug);

  if (!acc) return notFound();

  const related = accessories.filter((a) => a.id !== acc.id && a.category === acc.category).slice(0, 3);

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/accessories" className="hover:text-zinc-700 transition-colors">Accessories</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-700">{acc.name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
            <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{acc.categoryName}</p>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-zinc-900">{acc.name}</h1>
              {acc.badge && (
                <span className={`px-2.5 py-1 text-xs font-medium tracking-wider uppercase flex-shrink-0 ${acc.badge === 'Sale' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-white'}`}>
                  {acc.badge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl font-semibold">₹{acc.price.toLocaleString()}</span>
              {acc.originalPrice && (
                <span className="text-lg text-zinc-400 line-through">₹{acc.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="text-zinc-600 leading-relaxed mb-6">{acc.description}</p>

            {/* Specs */}
            <div className="bg-zinc-50 p-5 mb-6">
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-500 mb-3">Specifications</p>
              <div className="space-y-2">
                {Object.entries(acc.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-zinc-500 capitalize">{key}</span>
                    <span className="font-medium text-zinc-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 cosmic-btn-primary justify-center">
                Request Quote <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/contact" className="flex-1 cosmic-btn-outline-dark justify-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-zinc-100 pt-12">
            <h2 className="font-display text-2xl font-semibold text-zinc-900 mb-8">More in {acc.categoryName}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/accessories/${item.slug}`} className="group product-card-hover">
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-50 mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                  <p className="text-sm text-zinc-500">₹{item.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
