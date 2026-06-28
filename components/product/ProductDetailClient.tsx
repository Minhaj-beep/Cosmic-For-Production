'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Check, Star, X, ZoomIn, ChevronLeft } from 'lucide-react';
import { getPublicProductBySku, getRelatedProducts, type PublicProduct } from '@/lib/api/products';
import type { Database } from '@/lib/database.types';

type Variant = Database['public']['Tables']['product_variants']['Row'];
type FullProduct = PublicProduct & { product_variants?: Variant[] };

export function ProductDetailClient({ sku }: { sku: string }) {
  const [product, setProduct] = useState<FullProduct | null>(null);
  const [related, setRelated] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicProductBySku(sku).then(async ({ data }) => {
      if (!data) { setLoading(false); return; }
      setProduct(data as FullProduct);
      const { data: rel } = await getRelatedProducts(data.category_id, data.id, 3);
      setRelated(rel);
      setLoading(false);
    });
  }, [sku]);

  if (loading) {
    return (
      <div className="pt-[70px] min-h-screen bg-white">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-16">
          <div className="grid lg:grid-cols-2 gap-16 animate-pulse">
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

  if (!product) return notFound();

  return <ProductDetail product={product} related={related} />;
}

function ProductDetail({ product, related }: { product: FullProduct; related: PublicProduct[] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs'>('specs');

  const categoryName = product.categories?.name ?? product.subcategory;
  const categorySlug = product.categories?.slug ?? '';
  const price = product.offer_price ?? product.price;
  const originalPrice = product.offer_price ? product.price : null;
  const images = product.images ?? [];
  const variants = product.product_variants ?? [];
  const specs = product.specs as { key: string; value: string }[] | Record<string, string> | null;
  const specEntries: [string, string][] = !specs
    ? []
    : Array.isArray(specs)
    ? specs.map((s) => [s.key, s.value])
    : Object.entries(specs);

  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean)));
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);

  const prevImg = () => setSelectedImage((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setSelectedImage((i) => (i + 1) % images.length);

  const handleInquiry = () => {
    if (sizes.length > 0 && !selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 5000);
  };

  const badge = product.new_arrival ? 'New' : product.bestseller ? 'Best Seller' : product.offer_price ? 'Sale' : null;

  return (
    <>
      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" role="dialog" aria-modal="true" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10" aria-label="Close lightbox"><X className="w-5 h-5" /></button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10" onClick={(e) => { e.stopPropagation(); prevImg(); }} aria-label="Previous image"><ChevronLeft className="w-5 h-5" /></button>
          {images[selectedImage] && <img src={images[selectedImage]} alt={product.name} className="max-h-[85vh] max-w-[90vw] object-contain" onClick={(e) => e.stopPropagation()} />}
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10" onClick={(e) => { e.stopPropagation(); nextImg(); }} aria-label="Next image"><ChevronRight className="w-5 h-5" /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }} className={`w-2 h-2 rounded-full transition-colors ${i === selectedImage ? 'bg-white' : 'bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="pt-[70px] bg-white">
        <div className="bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-3">
            <nav className="flex items-center gap-1.5 text-[11px] text-zinc-400" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/products" className="hover:text-zinc-700 transition-colors">Bikes</Link>
              <ChevronRight className="w-3 h-3" />
              {categorySlug && <Link href={`/collections/${categorySlug}`} className="hover:text-zinc-700 transition-colors">{categoryName}</Link>}
              {categorySlug && <ChevronRight className="w-3 h-3" />}
              <span className="text-zinc-600 truncate max-w-[160px]">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-10 md:py-16">
          <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-16">
            <div className="flex gap-3">
              <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-12 overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${i === selectedImage ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'}`} aria-label={`View image ${i + 1}`}>
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                  </button>
                ))}
              </div>

              <div className="flex-1 relative group">
                <div className="relative overflow-hidden bg-zinc-50 aspect-[4/3] cursor-zoom-in" onClick={() => setLightbox(true)}>
                  {images[selectedImage] && (
                    <img src={images[selectedImage]} alt={`${product.name} — view ${selectedImage + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" style={{ objectPosition: 'center 30%' }} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><ZoomIn className="w-4 h-4 text-zinc-700" /></div>
                  {images.length > 1 && <>
                    <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white" aria-label="Previous image"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white" aria-label="Next image"><ChevronRight className="w-4 h-4" /></button>
                  </>}
                </div>
                <div className="flex gap-2 mt-2.5 md:hidden overflow-x-auto no-scrollbar">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)} className={`w-14 h-10 overflow-hidden border-2 flex-shrink-0 transition-all ${i === selectedImage ? 'border-zinc-900' : 'border-transparent opacity-50'}`}>
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-[90px] lg:self-start">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400">{categoryName}</p>
                {badge && (
                  <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase flex-shrink-0 ${badge === 'Sale' || badge === 'New' ? 'bg-[#D61C1C] text-white' : 'bg-zinc-900 text-white'}`}>
                    {badge}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-semibold text-zinc-900 leading-tight mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-zinc-900 text-zinc-900" />)}
                </div>
                <span className="text-[11px] text-zinc-400">5.0 · Be the first to review</span>
              </div>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-semibold text-zinc-900">₹{price.toLocaleString('en-IN')}</span>
                {originalPrice && (
                  <>
                    <span className="text-base text-zinc-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-semibold text-red-600">Save ₹{(originalPrice - price).toLocaleString('en-IN')}</span>
                  </>
                )}
              </div>

              <p className="text-sm text-zinc-500 leading-[1.8] mb-6">{product.description}</p>
              <div className="h-px bg-zinc-100 mb-5" />

              {colors.length > 0 && (
                <div className="mb-5">
                  <p className="label-field">Color — <span className="text-zinc-900 normal-case font-normal tracking-normal">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button key={color} onClick={() => setSelectedColor(color)} aria-pressed={selectedColor === color} className={`px-3.5 py-2 text-xs border transition-all duration-200 ${selectedColor === color ? 'border-[#D61C1C] bg-[#D61C1C] text-white' : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'}`}>{color}</button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-6">
                  <p className={`label-field ${sizeError ? 'text-red-500' : ''}`}>
                    Frame Size {selectedSize ? `— ${selectedSize}` : <span className="text-red-400 normal-case font-normal tracking-normal text-[11px]">{sizeError ? '(required)' : ''}</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }} aria-pressed={selectedSize === size} className={`min-w-[42px] h-10 px-3 text-sm border transition-all duration-200 ${selectedSize === size ? 'border-zinc-900 bg-zinc-900 text-white' : sizeError ? 'border-[#D61C1C]/40 text-zinc-600 hover:border-[#D61C1C]' : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'}`}>{size}</button>
                    ))}
                  </div>
                  {sizeError && <p className="text-xs text-red-500 mt-1.5">Please select a frame size</p>}
                </div>
              )}

              <div className="flex gap-3 mb-4">
                <button onClick={handleInquiry} className="flex-1 cosmic-btn-primary justify-center py-4">
                  {inquirySent ? (<><Check className="w-4 h-4" /> Enquiry Sent!</>) : (<>Send Enquiry <ArrowRight className="w-4 h-4" /></>)}
                </button>
                <Link href="/store-locator" className="px-5 py-4 border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all duration-300 text-[11px] font-semibold tracking-[0.15em] uppercase">
                  Find Dealer
                </Link>
              </div>

              {inquirySent && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 leading-relaxed">
                  <strong className="text-zinc-900">Thank you!</strong> Our team will reach out within 24 hours to discuss this model, pricing, and availability with you.
                </div>
              )}

              {specEntries.length > 0 && (
                <div className="mt-6 pt-5 border-t border-zinc-100">
                  <p className="label-field mb-3">Key Specifications</p>
                  <div className="space-y-2">
                    {specEntries.slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between gap-4 py-1.5 border-b border-zinc-50">
                        <span className="text-xs text-zinc-400 capitalize flex-shrink-0">{key}</span>
                        <span className="text-xs font-medium text-zinc-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {specEntries.length > 0 && (
          <div className="border-t border-zinc-100 bg-white">
            <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
              <div className="flex border-b border-zinc-100">
                <button className="px-6 py-4 text-xs font-semibold tracking-[0.15em] uppercase transition-all border-b-2 -mb-px border-zinc-900 text-zinc-900">
                  Full Specifications
                </button>
              </div>
              <div className="py-10 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100 max-w-3xl">
                  {specEntries.map(([key, value]) => (
                    <div key={key} className="bg-white px-5 py-4">
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">{key}</p>
                      <p className="text-sm font-medium text-zinc-900 leading-snug">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {related.length > 0 && (
          <section className="py-14 bg-zinc-50 border-t border-zinc-100">
            <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
              <h2 className="font-display text-2xl font-semibold text-zinc-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => {
                  const relPrice = p.offer_price ?? p.price;
                  const relOriginal = p.offer_price ? p.price : null;
                  return (
                    <Link key={p.id} href={`/products/${p.sku.toLowerCase()}`} className="group block">
                      <div className="relative overflow-hidden bg-zinc-50 aspect-[4/3]">
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05]" style={{ objectPosition: 'center 30%' }} loading="lazy" />}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-700" />
                      </div>
                      <div className="pt-4 pb-1">
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">{p.categories?.name ?? p.subcategory}</p>
                        <h3 className="font-display text-[17px] font-medium text-zinc-900 leading-tight mb-2 group-hover:text-zinc-600 transition-colors duration-300">{p.name}</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-zinc-900">₹{relPrice.toLocaleString('en-IN')}</span>
                          {relOriginal && <span className="text-xs text-zinc-400 line-through">₹{relOriginal.toLocaleString('en-IN')}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
