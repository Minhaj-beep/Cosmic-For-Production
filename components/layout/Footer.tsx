'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin, ArrowRight, Check } from 'lucide-react';

const footerLinks = {
  Collections: [
    { label: 'Road Bikes', href: '/collections/road' },
    { label: 'Mountain Bikes', href: '/collections/mountain' },
    { label: 'Gravel Bikes', href: '/collections/gravel' },
    { label: 'Urban & City', href: '/collections/urban' },
    { label: 'Electric Bikes', href: '/collections/electric' },
    { label: "Kids' Bikes", href: '/collections/kids' },
  ],
  Gear: [
    { label: 'Accessories', href: '/accessories' },
    { label: 'Spare Parts', href: '/spare-parts' },
    { label: 'Helmets', href: '/accessories' },
    { label: 'Bags & Packs', href: '/accessories' },
    { label: 'Apparel', href: '/accessories' },
  ],
  Support: [
    { label: 'Warranty & Support', href: '/warranty' },
    { label: 'Store Locator', href: '/store-locator' },
    { label: 'Dealer Enquiry', href: '/dealer-enquiry' },
    { label: 'Contact Us', href: '/contact' },
    // { label: 'FAQ', href: '/warranty#faq' },
  ],
  Company: [
    { label: 'About Cosmic', href: '/about' },
    { label: 'Careers', href: '/careers' },
    // { label: 'Press & Media', href: '/about#press' },
    // { label: 'Sustainability', href: '/about#sustainability' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      {/* Newsletter */}
      <div className="border-b border-zinc-800/60">
        <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-12 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-sm">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-zinc-500 mb-2">Stay Connected</p>
              <h3 className="font-display text-2xl font-semibold text-white">
                Join the Cosmic Community
              </h3>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                New arrivals, riding stories, exclusive offers — straight to your inbox.
              </p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="text-sm">You're subscribed. Welcome to the community!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-0 min-w-0 md:min-w-[400px]">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-3.5 bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-600 text-sm outline-none focus:border-zinc-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 text-white text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0 bg-[#D61C1C] hover:bg-[#B01515]"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center mb-3">
              <img src="/cosmic.png" alt="Cosmic Bikes" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#D61C1C] mb-4">Sky Is The Limit</p>
            <p className="text-sm leading-[1.8] mb-6 text-zinc-500 max-w-[220px]">
              Crafting Premium Bicycles Since 2005
            </p>
            <div className="flex items-center gap-3.5 mb-8">
              {[
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
                { icon: Twitter, label: 'Twitter/X', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-8 h-8 border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-white hover:border-zinc-600 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white mb-5">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-zinc-500 hover:text-zinc-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="grid md:grid-cols-3 gap-5 mt-12 pt-10 border-t border-zinc-800/60">
          {[
            { icon: MapPin, label: 'Headquarters', value: 'Dheeraj Leelaa, School Road, Aynambakkam, Chennai - 600095', href: null },
            // { icon: Phone, label: 'Phone', value: '+91 22 6789 1234', href: 'tel:+912267891234' },
            { icon: Mail, label: 'Email', value: 'support@cosmicbicycles.com', href: 'mailto:support@cosmicbicycles.com' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-zinc-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-0.5">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-zinc-400 hover:text-white transition-colors">{value}</a>
                ) : (
                  <p className="text-sm text-zinc-400">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-zinc-800/60 mt-8 pt-8">
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} Cosmic Bikes Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Use', 'Warranty'].map((item) => (
              <Link
                key={item}
                href={item === 'Warranty' ? '/warranty' : '#'}
                className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
