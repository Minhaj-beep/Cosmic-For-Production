import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import AccessoriesClient from './AccessoriesClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/accessories');
  return {
    title: seo?.title ?? 'Accessories | Cosmic Bikes',
    description: seo?.description ?? 'Gear up with Cosmic Bikes accessories — helmets, lights, bags, locks and more.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function AccessoriesPage() {
  return <AccessoriesClient />;
}
