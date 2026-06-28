import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import { getPublicAccessoryBySku } from '@/lib/api/accessories';
import AccessoryDetailClient from './AccessoryDetailClient';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ data: acc }, seo] = await Promise.all([
    getPublicAccessoryBySku(params.slug),
    getSeoByRoute(`/accessories/${params.slug}`),
  ]);
  if (!acc) return {};
  return {
    title: seo?.title ?? `${acc.name} | Cosmic Bikes`,
    description: seo?.description ?? acc.description,
    keywords: seo?.keywords,
    openGraph: seo?.og_image
      ? { images: [seo.og_image] }
      : acc.image
      ? { images: [acc.image] }
      : undefined,
  };
}

export default function AccessoryDetailPage({ params }: Props) {
  return <AccessoryDetailClient />;
}
