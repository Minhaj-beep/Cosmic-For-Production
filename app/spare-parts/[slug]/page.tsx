import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import { getPublicSparePartBySku } from '@/lib/api/spare-parts';
import SparePartDetailClient from './SparePartDetailClient';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ data: part }, seo] = await Promise.all([
    getPublicSparePartBySku(params.slug),
    getSeoByRoute(`/spare-parts/${params.slug}`),
  ]);
  if (!part) return {};
  return {
    title: seo?.title ?? `${part.name} | Cosmic Bikes`,
    description: seo?.description ?? part.description,
    keywords: seo?.keywords,
    openGraph: seo?.og_image
      ? { images: [seo.og_image] }
      : part.image
      ? { images: [part.image] }
      : undefined,
  };
}

export default function SparePartDetailPage({ params }: Props) {
  return <SparePartDetailClient />;
}
