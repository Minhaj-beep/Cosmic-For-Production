import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getSeoByRoute } from '@/lib/api/seo';
import ProductsPageClient from './ProductsPageClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/products');
  return {
    title: seo?.title ?? 'All Bikes | Cosmic Bikes',
    description: seo?.description ?? 'Browse the complete Cosmic Bikes range — road, mountain, gravel, urban and more.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageClient />
    </Suspense>
  );
}
