'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Tag, Wrench, Cog, Star, Users, Briefcase,
  MapPin, Search, Image, Settings, ChevronDown, ChevronRight, LogOut, X,
  ShoppingBag
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    label: 'Products', icon: Package,
    children: [
      { label: 'All Products', href: '/admin/dashboard/products' },
      { label: 'Categories', href: '/admin/dashboard/categories' },
      { label: 'Featured', href: '/admin/dashboard/featured' },
    ],
  },
  { label: 'Accessories', href: '/admin/dashboard/accessories', icon: ShoppingBag },
  { label: 'Spare Parts', href: '/admin/dashboard/spare-parts', icon: Wrench },
  { label: 'Dealer Enquiries', href: '/admin/dashboard/dealer-enquiries', icon: Briefcase },
  {
    label: 'Careers', icon: Users,
    children: [
      { label: 'Vacancies', href: '/admin/dashboard/vacancies' },
      { label: 'Applications', href: '/admin/dashboard/applications' },
    ],
  },
  { label: 'Store Locator', href: '/admin/dashboard/stores', icon: MapPin },
  { label: 'SEO', href: '/admin/dashboard/seo', icon: Search },
  // { label: 'Media', href: '/admin/dashboard/media', icon: Image },
  { label: 'Site Settings', href: '/admin/dashboard/settings', icon: Settings },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string[]>([]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const hasActiveChild = (item: NavItem) => item.children?.some((c) => isActive(c.href));

  const toggleExpand = (label: string) => {
    setExpanded((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
  };

  const isExpanded = (item: NavItem) =>
    expanded.includes(item.label) || (hasActiveChild(item) ?? false);

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-zinc-950 border-r border-zinc-800/60 z-40
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-800/60 flex-shrink-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <img src="/cosmic.png" alt="Cosmic" className="h-7 w-auto brightness-0 invert" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500">Admin</span>
          </Link>
          <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600 px-2 mb-3">Navigation</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.children) {
                const active = hasActiveChild(item);
                const open = isExpanded(item);
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${active ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {open ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
                    </button>
                    {open && (
                      <ul className="ml-7 mt-0.5 space-y-0.5 border-l border-zinc-800 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={`block px-2 py-2 text-xs rounded-sm transition-colors ${isActive(child.href) ? 'text-white font-semibold' : 'text-zinc-500 hover:text-zinc-200'}`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    href={item.href!}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${isActive(item.href!) ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + logout */}
        <div className="border-t border-zinc-800/60 p-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#D61C1C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 transition-colors rounded-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
