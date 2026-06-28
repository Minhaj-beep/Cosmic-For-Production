import type { Metadata } from 'next';
import { getPublicProductBySku } from '@/lib/api/products';
import { getSeoByRoute } from '@/lib/api/seo';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ data: product }, seo] = await Promise.all([
    getPublicProductBySku(params.slug),
    getSeoByRoute(`/products/${params.slug}`),
  ]);
  if (!product) return {};
  return {
    title: seo?.title ?? `${product.name} | Cosmic Bikes`,
    description: seo?.description ?? product.description,
    keywords: seo?.keywords,
    openGraph: seo?.og_image
      ? { images: [seo.og_image] }
      : product.images?.[0]
      ? { images: [product.images[0]] }
      : undefined,
  };
}

export default function ProductDetailPage({ params }: Props) {
  return <ProductDetailClient sku={params.slug} />;
}
