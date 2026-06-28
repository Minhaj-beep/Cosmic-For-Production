import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import CareersClient from './CareersClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/careers');
  return {
    title: seo?.title ?? 'Careers | Cosmic Bikes',
    description: seo?.description ?? 'Join the Cosmic Bikes team. Explore open positions in engineering, design, sales and more.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function CareersPage() {
  return <CareersClient />;
}
