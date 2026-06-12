'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Briefcase, Users, MapPin, ArrowRight, TriangleAlert as AlertTriangle, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminBadge from '@/components/admin/AdminBadge';

interface DashboardData {
  totalProducts: number;
  newEnquiries: number;
  activeVacancies: number;
  newApplications: number;
  activeDealers: number;
  totalDealers: number;
  lowStockProducts: { id: string; name: string; stock: string }[];
  recentEnquiries: { id: string; name: string; company: string; city: string; state: string; created_at: string; status: string }[];
  recentApplications: { id: string; name: string; email: string; applied_at: string; status: string; vacancies: { title: string } | null }[];
}

const emptyData: DashboardData = {
  totalProducts: 0, newEnquiries: 0, activeVacancies: 0, newApplications: 0,
  activeDealers: 0, totalDealers: 0, lowStockProducts: [], recentEnquiries: [], recentApplications: [],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [products, enquiries, vacancies, applications, dealers] = await Promise.all([
        supabase.from('products').select('id, name, stock').returns<{ id: string; name: string; stock: string }[]>(),
        supabase.from('dealer_enquiries').select('id, name, company, city, state, created_at, status').order('created_at', { ascending: false }).limit(5).returns<DashboardData['recentEnquiries']>(),
        supabase.from('vacancies').select('id, status').returns<{ id: string; status: string }[]>(),
        supabase.from('applications').select('id, name, email, applied_at, status, vacancies(title)').order('applied_at', { ascending: false }).limit(4).returns<DashboardData['recentApplications']>(),
        supabase.from('dealers').select('id, status').returns<{ id: string; status: string }[]>(),
      ]);

      const prods = products.data ?? [];
      const enqs = enquiries.data ?? [];
      const vacs = vacancies.data ?? [];
      const apps = applications.data ?? [];
      const dlrs = dealers.data ?? [];

      setData({
        totalProducts: prods.length,
        newEnquiries: enqs.filter((e) => e.status === 'new').length,
        activeVacancies: vacs.filter((v) => v.status === 'active').length,
        newApplications: apps.filter((a) => a.status === 'new').length,
        activeDealers: dlrs.filter((d) => d.status === 'active').length,
        totalDealers: dlrs.length,
        lowStockProducts: prods.filter((p) => p.stock === 'low_stock' || p.stock === 'out_of_stock').slice(0, 5).map((p) => ({ id: p.id, name: p.name, stock: p.stock })),
        recentEnquiries: enqs.slice(0, 3),
        recentApplications: apps,
      });
      setLoading(false);
    }
    load();
  }, []);

  const stats = [
    { label: 'Total Products', value: data.totalProducts, sub: 'In catalog', icon: Package, color: 'bg-blue-50 text-blue-600', href: '/admin/dashboard/products' },
    { label: 'Dealer Enquiries', value: data.newEnquiries, sub: 'Awaiting response', icon: Briefcase, color: 'bg-amber-50 text-amber-600', href: '/admin/dashboard/dealer-enquiries' },
    { label: 'Open Vacancies', value: data.activeVacancies, sub: `${data.newApplications} new applications`, icon: Users, color: 'bg-green-50 text-green-600', href: '/admin/dashboard/vacancies' },
    { label: 'Active Dealers', value: data.activeDealers, sub: `${data.totalDealers} total stores`, icon: MapPin, color: 'bg-zinc-100 text-zinc-600', href: '/admin/dashboard/stores' },
  ];

  const statusVariant = (s: string) => s === 'new' ? 'blue' : s === 'in_progress' ? 'yellow' : 'green';
  const statusLabel = (s: string) => s === 'in_progress' ? 'In Progress' : s === 'new' ? 'New' : 'Resolved';
  const appVariant = (s: string): 'green' | 'red' | 'blue' | 'orange' | 'zinc' => {
    const map: Record<string, 'green' | 'red' | 'blue' | 'orange' | 'zinc'> = { hired: 'green', rejected: 'red', shortlisted: 'blue', interviewed: 'orange', new: 'zinc' };
    return map[s] ?? 'zinc';
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Welcome back</h2>
          <p className="text-sm text-zinc-400 mt-0.5">Here's what's happening with Cosmic today.</p>
        </div>
        <span className="text-xs text-zinc-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="bg-white border border-zinc-200 p-5 hover:border-zinc-400 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-zinc-900 mb-1">{s.value}</p>
              <p className="text-xs font-medium text-zinc-500">{s.label}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{s.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <h3 className="text-sm font-semibold text-zinc-900">Recent Dealer Enquiries</h3>
            <Link href="/admin/dashboard/dealer-enquiries" className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentEnquiries.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-zinc-400">No enquiries yet.</div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {data.recentEnquiries.map((enq) => (
                <div key={enq.id} className="flex items-start justify-between px-5 py-4 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{enq.name}</p>
                    <p className="text-xs text-zinc-400 truncate">{enq.company} · {enq.city}, {enq.state}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{new Date(enq.created_at).toLocaleDateString('en-IN')}</p>
                  </div>
                  <AdminBadge variant={statusVariant(enq.status) as 'blue' | 'yellow' | 'green'}>{statusLabel(enq.status)}</AdminBadge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-zinc-200">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-zinc-900">Stock Alerts</h3>
            </div>
            {data.lowStockProducts.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-400">All products are well stocked.</div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {data.lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between px-4 py-3">
                    <p className="text-xs text-zinc-700 truncate pr-2">{p.name}</p>
                    <AdminBadge variant={p.stock === 'out_of_stock' ? 'red' : 'yellow'}>
                      {p.stock === 'out_of_stock' ? 'Out' : 'Low'}
                    </AdminBadge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200">
            <div className="px-4 py-3 border-b border-zinc-100">
              <h3 className="text-sm font-semibold text-zinc-900">Quick Actions</h3>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: 'Add New Product', href: '/admin/dashboard/products' },
                { label: 'Add Store Location', href: '/admin/dashboard/stores' },
                { label: 'Post New Vacancy', href: '/admin/dashboard/vacancies' },
                { label: 'Update SEO Metadata', href: '/admin/dashboard/seo' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center justify-between px-3 py-2.5 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                  {item.label}
                  <ArrowRight className="w-3 h-3 text-zinc-300" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <h3 className="text-sm font-semibold text-zinc-900">Recent Job Applications</h3>
          <Link href="/admin/dashboard/applications" className="text-xs text-zinc-400 hover:text-zinc-700 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {data.recentApplications.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-400">No applications yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-50 bg-zinc-50">
                  {['Applicant', 'Position', 'Applied', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-zinc-900">{app.name}</p>
                      <p className="text-xs text-zinc-400">{app.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-zinc-600">{app.vacancies?.title ?? '—'}</td>
                    <td className="px-5 py-3.5 text-xs text-zinc-400">{new Date(app.applied_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <AdminBadge variant={appVariant(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </AdminBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
