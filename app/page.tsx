import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import NewArrivals from '@/components/home/NewArrivals';
import QualitySection from '@/components/home/QualitySection';
import CtaBanner from '@/components/home/CtaBanner';
import { getSeoByRoute } from '@/lib/api/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByRoute('/');
  return {
    title: seo?.title ?? 'Cosmic Bikes — Engineered for Elevation',
    description: seo?.description ?? 'Cosmic crafts premium performance bicycles for road, mountain, gravel, and urban riding. Experience the pinnacle of cycling engineering.',
    keywords: seo?.keywords,
    openGraph: seo?.og_image ? { images: [seo.og_image] } : undefined,
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NewArrivals />
      <QualitySection />
      <CtaBanner />
    </>
  );
}

// import HeroSection from '@/components/home/HeroSection';
// import CategoryHighlights from '@/components/home/CategoryHighlights';
// import FeaturedProducts from '@/components/home/FeaturedProducts';
// import NewArrivals from '@/components/home/NewArrivals';
// import BrandStory from '@/components/home/BrandStory';
// import QualitySection from '@/components/home/QualitySection';
// import Testimonials from '@/components/home/Testimonials';
// import CtaBanner from '@/components/home/CtaBanner';

// export default function HomePage() {
//   return (
//     <>
//       <HeroSection />
//       <CategoryHighlights />
//       <FeaturedProducts />
//       <NewArrivals />
//       <BrandStory />
//       <QualitySection />
//       <Testimonials />
//       <CtaBanner />
//     </>
//   );
// }
