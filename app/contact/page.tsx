import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import ContactClient from './ContactClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/contact');
  return {
    title: seo?.title ?? 'Contact Us | Cosmic Bikes',
    description: seo?.description ?? 'Get in touch with the Cosmic Bikes team for product enquiries, dealer information, and support.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
