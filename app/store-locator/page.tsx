import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import StoreLocatorClient from './StoreLocatorClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/store-locator');
  return {
    title: seo?.title ?? 'Store Locator | Cosmic Bikes',
    description: seo?.description ?? 'Find an authorised Cosmic Bikes dealer near you across India.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function StoreLocatorPage() {
  return <StoreLocatorClient />;
}
