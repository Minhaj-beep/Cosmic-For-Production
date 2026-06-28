import type { Metadata } from 'next';
import { getSeoByRoute } from '@/lib/api/seo';
import DealerEnquiryClient from './DealerEnquiryClient';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/dealer-enquiry');
  return {
    title: seo?.title ?? 'Dealer Enquiry | Cosmic Bikes',
    description: seo?.description ?? 'Interested in becoming a Cosmic Bikes dealer? Submit your enquiry and our partnerships team will be in touch.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function DealerEnquiryPage() {
  return <DealerEnquiryClient />;
}
