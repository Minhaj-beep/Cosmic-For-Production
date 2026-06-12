'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, MessageSquare, Loader as Loader2 } from 'lucide-react';
import { getDealerEnquiries, updateDealerEnquiry, type DealerEnquiry } from '@/lib/api/dealer-enquiries';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import AdminToast from '@/components/admin/AdminToast';

type Status = DealerEnquiry['status'];
const STATUS_OPTIONS: Status[] = ['new', 'in_progress', 'resolved'];
const statusLabel = (s: Status) => s === 'in_progress' ? 'In Progress' : s === 'new' ? 'New' : 'Resolved';
const statusVariant = (s: Status) => s === 'new' ? 'blue' : s === 'in_progress' ? 'yellow' : 'green';

export default function DealerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<DealerEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<DealerEnquiry | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getDealerEnquiries();
    setEnquiries(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = enquiries.filter((e) => {
    const match = e.name.toLowerCase().includes(search.toLowerCase()) || e.company.toLowerCase().includes(search.toLowerCase()) || e.city.toLowerCase().includes(search.toLowerCase());
    return match && (filterStatus === 'all' || e.status === filterStatus);
  });

  async function updateStatus(id: string, status: Status) {
    await updateDealerEnquiry(id, { status });
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, status } : e));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
    setToast({ msg: 'Status updated.', type: 'success' });
  }

  async function saveNote(id: string) {
    setSaving(true);
    await updateDealerEnquiry(id, { notes: note });
    setSaving(false);
    setEnquiries((prev) => prev.map((e) => e.id === id ? { ...e, notes: note } : e));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, notes: note } : prev);
    setToast({ msg: 'Note saved.', type: 'success' });
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Dealer Enquiries</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{enquiries.filter((e) => e.status === 'new').length} new, {enquiries.length} total</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input type="text" placeholder="Search enquiries…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 w-64" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Name / Company', 'Location', 'Contact', 'Received', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-zinc-400">No enquiries found.</td></tr>
              ) : filtered.map((enq) => (
                <tr key={enq.id} className={`hover:bg-zinc-50/50 ${enq.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-zinc-900">{enq.name}</p>
                    <p className="text-xs text-zinc-400">{enq.company}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600">{enq.city}, {enq.state}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-zinc-600">{enq.phone}</p>
                    <p className="text-xs text-zinc-400">{enq.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">{new Date(enq.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3.5">
                    <select value={enq.status} onChange={(e) => updateStatus(enq.id, e.target.value as Status)} className="text-xs border border-zinc-200 bg-white px-2 py-1 outline-none focus:border-zinc-400">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setSelected(enq); setNote(enq.notes); }} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-2.5 py-1.5 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Enquiry Details" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-100 p-4">
              {[['Name', selected.name], ['Company', selected.company], ['Email', selected.email], ['Phone', selected.phone], ['City', selected.city], ['State', selected.state]].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-0.5">{label}</p>
                  <p className="text-sm text-zinc-800">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Message</p>
              <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-100 p-4">{selected.message}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Status</p>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${selected.status === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}>
                    {statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Internal Notes</p>
              <textarea className="admin-input min-h-[80px] resize-y" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add internal notes…" />
              <div className="flex justify-end mt-2">
                <button onClick={() => saveNote(selected.id)} disabled={saving} className="px-4 py-2 text-xs bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors flex items-center gap-1.5 disabled:opacity-60">
                  <MessageSquare className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save Note'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
