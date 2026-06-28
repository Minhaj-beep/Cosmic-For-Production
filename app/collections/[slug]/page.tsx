import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPublicCategoryBySlug } from '@/lib/api/categories';
import { getPublicProducts, type PublicProduct } from '@/lib/api/products';
import { getSeoByRoute } from '@/lib/api/seo';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ data: cat }, seo] = await Promise.all([
    getPublicCategoryBySlug(params.slug),
    getSeoByRoute(`/collections/${params.slug}`),
  ]);
  if (!cat) return {};
  return {
    title: seo?.title ?? `${cat.name} | Cosmic Bikes`,
    description: seo?.description ?? cat.description,
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : cat.image_url ? { images: [cat.image_url] } : undefined,
  };
}

function ProductCard({ product }: { product: PublicProduct }) {
  const slug = product.sku.toLowerCase();
  const price = product.offer_price ?? product.price;
  const originalPrice = product.offer_price ? product.price : null;
  const badge = product.new_arrival ? 'New' : product.bestseller ? 'Best Seller' : null;

  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="relative overflow-hidden bg-zinc-50 aspect-[4/3]">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]" style={{ objectPosition: 'center 30%' }} loading="lazy" />
        )}
        {badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${badge === 'New' ? 'bg-[#D61C1C] text-white' : 'bg-zinc-900 text-white'}`}>{badge}</div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-700" />
      </div>
      <div className="pt-4 pb-1">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">{product.categories?.name ?? product.subcategory}</p>
        <h3 className="font-display text-[17px] font-medium text-zinc-900 leading-tight mb-2 group-hover:text-zinc-600 transition-colors duration-300">{product.name}</h3>
        <p className="text-sm text-zinc-500 mb-3 line-clamp-1 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-zinc-900">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && <span className="text-xs text-zinc-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>}
        </div>
      </div>
    </Link>
  );
}

export default async function CollectionPage({ params }: Props) {
  const [{ data: cat }, { data: catProducts }] = await Promise.all([
    getPublicCategoryBySlug(params.slug),
    getPublicProducts({ categorySlug: params.slug }),
  ]);

  if (!cat) notFound();

  return (
    <>
      <section className="relative h-64 md:h-80 overflow-hidden">
        {cat.image_url && (
          <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10 pb-10 w-full">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80">{cat.name}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-none">{cat.name}</h1>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-zinc-500">{catProducts.length} model{catProducts.length !== 1 ? 's' : ''} in {cat.name}</p>
            <Link href="/products" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">All Products →</Link>
          </div>

          {catProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {catProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-400 mb-4">No products in this category yet.</p>
              <Link href="/products" className="cosmic-btn-outline-dark">View All Products</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
