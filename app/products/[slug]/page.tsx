'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Check, Star, X, ZoomIn, ChevronLeft, ChevronDown } from 'lucide-react';
import { products, accessories, spareParts } from '@/lib/mock-data';
import ProductCard from '@/components/shared/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}

function ProductDetail({ product }: { product: (typeof products)[0] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');
  const [sizeError, setSizeError] = useState(false);

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const relatedAcc = accessories.filter((a) => product.relatedAccessories.includes(a.id));
  const relatedPts = spareParts.filter((s) => product.relatedParts.includes(s.id));
  const specEntries = Object.entries(product.specs);

  const handleInquiry = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 5000);
  };

  const prevImg = () => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length);
  const nextImg = () => setSelectedImage((i) => (i + 1) % product.images.length);

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); prevImg(); }}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); nextImg(); }}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                className={`w-2 h-2 rounded-full transition-colors ${i === selectedImage ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="pt-[70px] bg-white">
        {/* Breadcrumb */}
        <div className="bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-3">
            <nav className="flex items-center gap-1.5 text-[11px] text-zinc-400" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/products" className="hover:text-zinc-700 transition-colors">Bikes</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/collections/${product.category}`} className="hover:text-zinc-700 transition-colors">{product.categoryName}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-600 truncate max-w-[160px]">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Main section */}
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-10 md:py-16">
          <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-16">

            {/* Gallery */}
            <div className="flex gap-3">
              {/* Thumbnails — desktop left sidebar */}
              <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-12 overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${i === selectedImage ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className="flex-1 relative group">
                <div
                  className="relative overflow-hidden bg-zinc-50 aspect-[4/3] cursor-zoom-in"
                  onClick={() => setLightbox(true)}
                >
                  <img
                    src={product.images[selectedImage]}
                    alt={`${product.name} — view ${selectedImage + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ objectPosition: 'center 30%' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="w-4 h-4 text-zinc-700" />
                  </div>
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImg(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImg(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile thumbnails */}
                <div className="flex gap-2 mt-2.5 md:hidden overflow-x-auto no-scrollbar">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-14 h-10 overflow-hidden border-2 flex-shrink-0 transition-all ${i === selectedImage ? 'border-zinc-900' : 'border-transparent opacity-50'}`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: 'center 30%' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Details panel */}
            <div className="lg:sticky lg:top-[90px] lg:self-start">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400">{product.categoryName}</p>
                {product.badge && (
                  <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase flex-shrink-0 ${product.badge === 'Sale' || product.badge === 'New' ? 'bg-[#D61C1C] text-white' : 'bg-zinc-900 text-white'}`}>
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-semibold text-zinc-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-3 h-3 fill-zinc-900 text-zinc-900" />)}
                </div>
                <span className="text-[11px] text-zinc-400">4.9 (24 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-semibold text-zinc-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-zinc-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm font-semibold text-red-600">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-zinc-500 leading-[1.8] mb-6">{product.description}</p>

              {/* Divider */}
              <div className="h-px bg-zinc-100 mb-5" />

              {/* Color */}
              <div className="mb-5">
                <p className="label-field">
                  Color — <span className="text-zinc-900 normal-case font-normal tracking-normal">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-pressed={selectedColor === color}
                      className={`px-3.5 py-2 text-xs border transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-[#D61C1C] bg-[#D61C1C] text-white'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <p className={`label-field ${sizeError ? 'text-red-500' : ''}`}>
                  Frame Size {selectedSize ? `— ${selectedSize}` : <span className="text-red-400 normal-case font-normal tracking-normal text-[11px]">{sizeError ? '(required)' : ''}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      aria-pressed={selectedSize === size}
                      className={`min-w-[42px] h-10 px-3 text-sm border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : sizeError
                          ? 'border-[#D61C1C]/40 text-zinc-600 hover:border-[#D61C1C]'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="text-xs text-red-500 mt-1.5">Please select a frame size</p>}
              </div>

              {/* CTAs */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleInquiry}
                  className="flex-1 cosmic-btn-primary justify-center py-4"
                >
                  {inquirySent ? (
                    <><Check className="w-4 h-4" /> Enquiry Sent!</>
                  ) : (
                    <> Send Enquiry <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <Link
                  href="/store-locator"
                  className="px-5 py-4 border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all duration-300 text-[11px] font-semibold tracking-[0.15em] uppercase"
                >
                  Find Dealer
                </Link>
              </div>

              {inquirySent && (
                <div className="p-4 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 leading-relaxed">
                  <strong className="text-zinc-900">Thank you!</strong> Our team will reach out within 24 hours to discuss this model, pricing, and availability with you.
                </div>
              )}

              {/* Quick specs */}
              <div className="mt-6 pt-5 border-t border-zinc-100">
                <p className="label-field mb-3">Key Specifications</p>
                <div className="space-y-2">
                  {specEntries.slice(0, 4).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-4 py-1.5 border-b border-zinc-50">
                      <span className="text-xs text-zinc-400 capitalize flex-shrink-0">{key}</span>
                      <span className="text-xs font-medium text-zinc-900 text-right">{value as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust row */}
              {/* <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center gap-5 text-zinc-400">
                {[
                  { icon: '🏆', text: 'Lifetime Warranty' },
                  { icon: '🔧', text: 'Expert Assembly' },
                  { icon: '📦', text: 'Free Shipping' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-1.5">
                    <span className="text-sm" aria-hidden>{item.icon}</span>
                    <span className="text-[10px] font-medium tracking-wide">{item.text}</span>
                  </div>
                ))}
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-100 bg-white">
          <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
            <div className="flex border-b border-zinc-100">
              {(['specs', 'features'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-xs font-semibold tracking-[0.15em] uppercase transition-all border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-zinc-900 text-zinc-900'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {tab === 'specs' ? 'Full Specifications' : 'Key Features'}
                </button>
              ))}
            </div>
            <div className="py-10 md:py-12">
              {activeTab === 'specs' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100 max-w-3xl">
                  {specEntries.map(([key, value]) => (
                    <div key={key} className="bg-white px-5 py-4">
                      <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1.5">{key}</p>
                      <p className="text-sm font-medium text-zinc-900 leading-snug">{value as string}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-w-xl">
                  <ul className="space-y-4">
                    {product.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 pb-4 border-b border-zinc-50 last:border-0">
                        <div className="w-5 h-5 bg-zinc-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-zinc-600 leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Accessories */}
        {relatedAcc.length > 0 && (
          <section className="py-14 bg-zinc-50 border-t border-zinc-100">
            <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-semibold text-zinc-900">Recommended Accessories</h2>
                <Link href="/accessories" className="text-xs font-semibold tracking-wide text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedAcc.map((acc) => (
                  <Link
                    key={acc.id}
                    href={`/accessories/${acc.slug}`}
                    className="group bg-white border border-zinc-100 hover:border-zinc-300 transition-all duration-300 p-4 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden mb-3 bg-zinc-50">
                      <img src={acc.image} alt={acc.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
                    </div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1">{acc.categoryName}</p>
                    <p className="text-sm font-medium text-zinc-900 mb-1 group-hover:text-zinc-600 transition-colors">{acc.name}</p>
                    <p className="text-sm font-semibold">₹{acc.price.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Spare Parts */}
        {relatedPts.length > 0 && (
          <section className="py-14 bg-white border-t border-zinc-100">
            <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl font-semibold text-zinc-900">Compatible Spare Parts</h2>
                <Link href="/spare-parts" className="text-xs font-semibold tracking-wide text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedPts.map((part) => (
                  <Link key={part.id} href={`/spare-parts/${part.slug}`} className="group border border-zinc-100 hover:border-zinc-300 p-4 transition-all duration-300 hover:shadow-md">
                    <div className="aspect-[4/3] overflow-hidden mb-3 bg-zinc-50">
                      <img src={part.image} alt={part.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" style={{ objectPosition: 'center 30%' }} />
                    </div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-1">{part.categoryName}</p>
                    <p className="text-sm font-medium text-zinc-900 mb-1">{part.name}</p>
                    <p className="text-[10px] font-mono text-zinc-400 mb-1.5">SKU: {part.sku}</p>
                    <p className="text-sm font-semibold">₹{part.price.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="py-14 bg-zinc-50 border-t border-zinc-100">
            <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
              <h2 className="font-display text-2xl font-semibold text-zinc-900 mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    categoryName={p.categoryName}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    image={p.images[0]}
                    shortDescription={p.shortDescription}
                    badge={p.badge}
                    isNew={p.isNew}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
