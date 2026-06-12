import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SiteShell from '@/components/layout/SiteShell';

export const metadata: Metadata = {
  title: {
    default: 'Cosmic Bikes — Engineered for Elevation',
    template: '%s | Cosmic Bikes',
  },
  description: 'Cosmic crafts premium performance bicycles for road, mountain, gravel, and urban riding. Experience the pinnacle of cycling engineering.',
  icons: {
    icon: '/cosmic.png',
    shortcut: '/cosmic.png',
    apple: '/cosmic.png',
  },
  openGraph: {
    siteName: 'Cosmic Bikes',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
