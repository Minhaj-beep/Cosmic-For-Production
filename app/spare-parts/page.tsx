import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import SparePartsClient from './SparePartsClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/spare-parts');
  return {
    title: seo?.title ?? 'Spare Parts | Cosmic Bikes',
    description: seo?.description ?? 'Find genuine Cosmic Bikes spare parts — brakes, derailleurs, wheels, saddles and more.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function SparePartsPage() {
  return <SparePartsClient />;
}
