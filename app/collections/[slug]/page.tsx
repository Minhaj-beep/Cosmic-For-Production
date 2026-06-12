import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, products } from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) return {};
  return { title: cat.name };
}

export default function CollectionPage({ params }: Props) {
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  const catProducts = products.filter((p) => p.category === params.slug);

  return (
    <>
      {/* Hero */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-10 w-full">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80">{cat.name}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-none">
              {cat.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-zinc-500">{catProducts.length} models in {cat.name}</p>
            <Link href="/products" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
              All Products →
            </Link>
          </div>

          {catProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {catProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  categoryName={product.categoryName}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.images[0]}
                  shortDescription={product.shortDescription}
                  badge={product.badge}
                  isNew={product.isNew}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 mb-4">No products in this category yet.</p>
              <Link href="/products" className="cosmic-btn-outline-dark">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
