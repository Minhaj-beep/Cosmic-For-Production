'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminGuard from '@/components/admin/AdminGuard';
import { usePathname } from 'next/navigation';

function getTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/dashboard/products': 'Products',
    '/admin/dashboard/categories': 'Categories',
    '/admin/dashboard/featured': 'Featured Products',
    '/admin/dashboard/accessories': 'Accessories',
    '/admin/dashboard/spare-parts': 'Spare Parts',
    '/admin/dashboard/dealer-enquiries': 'Dealer Enquiries',
    '/admin/dashboard/vacancies': 'Career Vacancies',
    '/admin/dashboard/applications': 'Applications',
    '/admin/dashboard/stores': 'Store Locator',
    '/admin/dashboard/seo': 'SEO Management',
    // '/admin/dashboard/media': 'Media Library',
    '/admin/dashboard/settings': 'Site Settings',
  };
  return map[pathname] ?? 'Admin';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex h-screen bg-zinc-50 overflow-hidden">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title={getTitle(pathname)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
