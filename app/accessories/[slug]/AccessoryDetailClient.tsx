'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getPublicAccessoryBySku, getPublicAccessories, type Accessory } from '@/lib/api/accessories';

export default function AccessoryDetailClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const [acc, setAcc] = useState<Accessory | null>(null);
  const [related, setRelated] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPublicAccessoryBySku(slug).then(async ({ data }) => {
      if (!data) { setLoading(false); return; }
      setAcc(data);
      const { data: rel } = await getPublicAccessories({ category: data.category });
      setRelated(rel.filter((a) => a.id !== data.id).slice(0, 3));
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 bg-white min-h-screen">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16 animate-pulse">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-[4/3] bg-zinc-100" />
            <div className="space-y-4">
              <div className="h-4 bg-zinc-100 rounded w-1/4" />
              <div className="h-8 bg-zinc-100 rounded w-3/4" />
              <div className="h-6 bg-zinc-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!acc) return notFound();

  return (
    <div className="pt-20 bg-white min-h-screen">
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
          <div className="aspect-[4/3] overflow-hidden bg-zinc-50">
            {acc.image && <img src={acc.image} alt={acc.name} className="w-full h-full object-cover" />}
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{acc.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-zinc-900 mb-4">{acc.name}</h1>

            <p className="text-2xl font-semibold mb-5">₹{acc.price.toLocaleString()}</p>
            <p className="text-zinc-600 leading-relaxed mb-6">{acc.description}</p>

            <div className="bg-zinc-50 p-5 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">SKU</span>
                <span className="font-mono font-medium text-zinc-900">{acc.sku}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Availability</span>
                <span className={`font-medium ${acc.stock_qty > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {acc.stock_qty > 0 ? `In Stock (${acc.stock_qty})` : 'Out of Stock'}
                </span>
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

        {related.length > 0 && (
          <div className="mt-16 border-t border-zinc-100 pt-12">
            <h2 className="font-display text-2xl font-semibold text-zinc-900 mb-8">More in {acc.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/accessories/${item.sku.toLowerCase()}`} className="group product-card-hover">
                  <div className="aspect-[4/3] overflow-hidden bg-zinc-50 mb-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
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
