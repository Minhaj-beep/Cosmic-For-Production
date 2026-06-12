'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { spareParts } from '@/lib/mock-data';

export default function SparePartDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const part = spareParts.find((p) => p.slug === slug);

  if (!part) return notFound();

  const related = spareParts.filter((p) => p.id !== part.id && p.category === part.category).slice(0, 3);

  return (
    <div className="pt-20 bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/spare-parts" className="hover:text-zinc-700 transition-colors">Spare Parts</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-700">{part.name}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
            <img src={part.image} alt={part.name} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{part.categoryName}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-zinc-900 mb-4">{part.name}</h1>

            <p className="text-2xl font-semibold mb-5">₹{part.price.toLocaleString()}</p>

            <p className="text-zinc-600 leading-relaxed mb-6">{part.description}</p>

            <div className="bg-zinc-50 p-5 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">SKU</span>
                <span className="font-mono font-medium text-zinc-900">{part.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Compatibility</span>
                <span className="font-medium text-zinc-900 text-right max-w-[200px]">{part.compatibility}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Category</span>
                <span className="font-medium text-zinc-900">{part.categoryName}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 cosmic-btn-primary justify-center">
                Request Part <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/dealer-enquiry" className="flex-1 cosmic-btn-outline-dark justify-center">
                Dealer Enquiry
              </Link>
            </div>

            <p className="text-xs text-zinc-400 mt-4 text-center">
              Spare parts are available through authorized Cosmic dealers. Prices include GST.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-zinc-100 pt-12">
            <h2 className="font-display text-2xl font-semibold text-zinc-900 mb-8">Related Parts</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/spare-parts/${item.slug}`} className="group border border-zinc-100 hover:border-zinc-300 transition-colors p-4">
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-50 mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: 'center 30%' }} />
                  </div>
                  <p className="text-xs text-zinc-400 mb-0.5">{item.categoryName}</p>
                  <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                  <p className="text-sm font-semibold mt-1">₹{item.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
