'use client';

import { useState } from 'react';
import { Menu, Bell, Search, ExternalLink, ChevronDown } from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth-context';
import Link from 'next/link';

const notifications = [
  { id: 1, text: 'New dealer enquiry from Vikram Sharma', time: '5m ago', read: false },
  { id: 2, text: 'New job application for Senior Product Designer', time: '1h ago', read: false },
  { id: 3, text: 'Product "Cosmic Trail X" is low on stock', time: '3h ago', read: true },
  { id: 4, text: 'Meera Iyer accepted the offer — Digital Marketing', time: '1d ago', read: true },
];

interface Props {
  onMenuClick: () => void;
  title: string;
}

export default function AdminTopbar({ onMenuClick, title }: Props) {
  const { user } = useAdminAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-zinc-100 flex items-center justify-between px-5 lg:px-8 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-zinc-500 hover:text-zinc-900 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold text-zinc-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Visit site */}
        <Link
          href="/"
          target="_blank"
          className="hidden md:flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-700 border border-zinc-200 px-3 py-1.5 hover:border-zinc-400 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Site
        </Link>

        {/* Notifications */}
        {/* <div className="relative">
          <button
            onClick={() => setShowNotifs((p) => !p)}
            className="relative w-9 h-9 flex items-center justify-center border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D61C1C] rounded-full" />
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-zinc-200 shadow-xl z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                <span className="text-xs font-semibold text-zinc-900">Notifications</span>
                {unread > 0 && <span className="text-[10px] bg-[#D61C1C] text-white px-1.5 py-0.5 font-bold">{unread} new</span>}
              </div>
              <ul className="divide-y divide-zinc-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-zinc-50' : ''}`}>
                    <p className="text-xs text-zinc-800 leading-snug mb-1">{n.text}</p>
                    <p className="text-[10px] text-zinc-400">{n.time}</p>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowNotifs(false)}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-zinc-700 py-3 border-t border-zinc-100 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div> */}

        {/* User */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-100 ml-1">
          <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-zinc-900 leading-none">{user?.name}</p>
            <p className="text-[10px] text-zinc-400 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Close notifs overlay */}
      {showNotifs && <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />}
    </header>
  );
}
