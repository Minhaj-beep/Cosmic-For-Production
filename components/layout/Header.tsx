'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { categories } from '@/lib/mock-data';

const navLinks = [
  { label: 'Products', href: '/collections', mega: true },
  { label: 'Accessories', href: '/accessories', mega: false },
  { label: 'Spare Parts', href: '/spare-parts', mega: false },
  { label: 'About', href: '/about', mega: false },
];

const moreLinks = [
  { label: 'Store Locator', href: '/store-locator' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const headerBg = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
    : isHome
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]';

  const isLight = scrolled || !isHome;

  const openMega = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimerRef.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10">
          <div className="flex items-center justify-between h-16 md:h-[70px]">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group">
              <div className={`relative transition-all duration-300 ${isLight ? 'h-9' : 'h-9'}`} style={{ width: 'auto' }}>
                <Image
                  src="/cosmic.png"
                  alt="Cosmic Bikes"
                  width={120}
                  height={36}
                  className={`h-9 w-auto object-contain transition-all duration-300 ${isLight ? 'brightness-0' : 'brightness-0 invert'}`}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((link) =>
                link.mega ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={openMega}
                    onMouseLeave={closeMega}
                  >
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-sm text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                        isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-white/85 hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Mega Menu */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[660px] bg-white border border-zinc-100 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 ${
                        megaOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
                      }`}
                      onMouseEnter={openMega}
                      onMouseLeave={closeMega}
                    >
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-zinc-100 rotate-45" />

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400">Collections</p>
                          <Link href="/collections" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
                            All Collections <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/collections/${cat.slug}`}
                              className="group flex items-center gap-3 p-3 rounded hover:bg-zinc-50 transition-colors"
                            >
                              <div className="w-14 h-10 overflow-hidden rounded-sm flex-shrink-0 bg-zinc-100">
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  style={{ objectPosition: 'center 30%' }}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium text-zinc-900 leading-tight">{cat.name}</p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">{cat.count} models</p>
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-3 gap-3">
                          {[
                            // { label: 'New Arrivals', href: '#', color: 'text-emerald-600' },
                            // { label: 'Best Sellers', href: '#', color: 'text-zinc-900' },
                            // { label: 'Sale', href: '#', color: 'text-red-600' },
                            { label: 'New Arrivals', href: '/products?filter=new', color: 'text-emerald-600' },
                            { label: 'Best Sellers', href: '/products?filter=bestseller', color: 'text-zinc-900' },
                            { label: 'Sale', href: '/products?filter=sale', color: 'text-red-600' },
                          ].map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className={`text-[12px] font-semibold tracking-wide ${item.color} hover:opacity-70 transition-opacity`}
                            >
                              {item.label} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                      isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-white/85 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* <button
                // onClick={() => setSearchOpen(true)}
                className={`hidden md:flex p-2.5 rounded-sm transition-colors duration-200 ${isLight ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100' : 'text-white/80 hover:text-white'}`}
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button> */}

              <Link
                href="/store-locator"
                className={`hidden lg:inline-flex items-center px-5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase border transition-all duration-300 ${
                  isLight
                    ? 'border-[#D61C1C] text-[#D61C1C] hover:bg-[#D61C1C] hover:text-white'
                    : 'border-white/70 text-white hover:bg-[#D61C1C] hover:border-[#D61C1C]'
                }`}
              >
                Store Locator
              </Link>

              <button
                className={`lg:hidden p-2.5 transition-colors ${isLight ? 'text-zinc-900' : 'text-white'}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ====== Search Overlay ====== */}
      <div
        className={`fixed inset-0 z-[100] bg-white flex flex-col transition-all duration-400 ${
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Search"
        aria-modal="true"
      >
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 w-full">
          <div className="flex items-center justify-between h-[70px]">
            <Link href="/" className="flex items-center">
              <Image src="/cosmic.png" alt="Cosmic Bikes" width={100} height={30} className="h-8 w-auto object-contain brightness-0" />
            </Link>
            <button onClick={() => setSearchOpen(false)} className="p-2.5 text-zinc-500 hover:text-zinc-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 border-b-2 border-[#D61C1C] py-3">
            <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search bikes, accessories, parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xl md:text-3xl font-light outline-none placeholder-zinc-300 text-zinc-900 bg-transparent"
              onKeyDown={(e) => { if (e.key === 'Escape') setSearchOpen(false); }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-zinc-900">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400 mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Road Bikes', 'Mountain Bikes', 'Carbon Frame', 'Gravel Bikes', 'Electric Bikes', 'Helmets', 'Accessories'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 border border-zinc-200 text-sm text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-400 mb-4">Quick Links</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="group flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Mobile Menu ====== */}
      <div
        className={`fixed inset-0 z-[60] bg-zinc-950 text-white transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Mobile menu"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 h-16">
            <Link href="/" className="flex items-center">
              <Image src="/cosmic.png" alt="Cosmic Bikes" width={100} height={30} className="h-8 w-auto object-contain brightness-0 invert" />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2.5" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-6">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-600 mb-4">Collections</p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/collections/${cat.slug}`}
                    className="group relative overflow-hidden aspect-[3/2] bg-zinc-900"
                  >
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-50 group-active:opacity-60 transition-opacity" style={{ objectPosition: 'center 30%' }} />
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="text-xs font-semibold text-white">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <nav className="space-y-0 border-t border-zinc-800">
                {[...navLinks.filter(l => !l.mega), ...moreLinks].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-4 border-b border-zinc-800/60 text-base font-medium text-zinc-200 hover:text-white transition-colors"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="px-5 py-6 border-t border-zinc-800">
            <Link
              href="/store-locator"
              className="block w-full text-center py-4 border border-white/30 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white hover:text-zinc-900 transition-all duration-300"
            >
              Store Locator
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
