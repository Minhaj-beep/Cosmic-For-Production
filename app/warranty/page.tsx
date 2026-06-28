import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import WarrantyClient from './WarrantyClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/warranty');
  return {
    title: seo?.title ?? 'Warranty & Support | Cosmic Bikes',
    description: seo?.description ?? 'Understand your Cosmic Bikes limited warranty coverage, maintenance schedules, and how to register your bicycle.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function WarrantyPage() {
  return <WarrantyClient />;
}
