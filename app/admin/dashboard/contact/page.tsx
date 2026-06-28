'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Loader as Loader2, MessageSquare } from 'lucide-react';
import { getContactSubmissions, updateContactSubmission, deleteContactSubmission, type ContactSubmission } from '@/lib/api/contact-submissions';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';

type Status = ContactSubmission['status'];
const STATUS_OPTIONS: Status[] = ['new', 'read', 'replied'];
const statusLabel = (s: Status) => s === 'new' ? 'New' : s === 'read' ? 'Read' : 'Replied';
const statusVariant = (s: Status): 'blue' | 'yellow' | 'green' => s === 'new' ? 'blue' : s === 'read' ? 'yellow' : 'green';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getContactSubmissions();
    setSubmissions(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = submissions.filter((s) => {
    const match =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase());
    return match && (filterStatus === 'all' || s.status === filterStatus);
  });

  async function updateStatus(id: string, status: Status) {
    await updateContactSubmission(id, { status });
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
    setToast({ msg: 'Status updated.', type: 'success' });
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteContactSubmission(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setToast({ msg: 'Submission deleted.', type: 'success' });
    setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
    if (selected?.id === deleteId) setSelected(null);
  }

  const handleView = (sub: ContactSubmission) => {
    setSelected(sub);
    if (sub.status === 'new') updateStatus(sub.id, 'read');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Contact Submissions</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            {submissions.filter((s) => s.status === 'new').length} new, {submissions.length} total
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email, or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 w-72"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Name', 'Email', 'Subject', 'Received', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-zinc-400">No submissions found.</td>
                </tr>
              ) : filtered.map((sub) => (
                <tr key={sub.id} className={`hover:bg-zinc-50/50 ${sub.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-zinc-900">{sub.name}</p>
                    {sub.phone && <p className="text-xs text-zinc-400">{sub.phone}</p>}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-600">{sub.email}</td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600 max-w-[200px]">
                    <p className="truncate">{sub.subject || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400 whitespace-nowrap">
                    {new Date(sub.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={sub.status}
                      onChange={(e) => updateStatus(sub.id, e.target.value as Status)}
                      className="text-xs border border-zinc-200 bg-white px-2 py-1 outline-none focus:border-zinc-400"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleView(sub)}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-2.5 py-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        onClick={() => setDeleteId(sub.id)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Contact Submission" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-100 p-4">
              {[
                ['Name', selected.name],
                ['Email', selected.email],
                ['Phone', selected.phone || '—'],
                ['Subject', selected.subject || '—'],
                ['Received', new Date(selected.created_at).toLocaleString('en-IN')],
                ['Status', statusLabel(selected.status)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-0.5">{label}</p>
                  <p className="text-sm text-zinc-800">{value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Message</p>
              <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-100 p-4 whitespace-pre-wrap">{selected.message}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Update Status</p>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${selected.status === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                  >
                    {statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex gap-2">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your enquiry')}`}
                className="flex items-center gap-1.5 px-4 py-2 text-xs bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Reply via Email
              </a>
              <button
                onClick={() => setDeleteId(selected.id)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs border border-zinc-200 text-zinc-600 hover:border-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Submission"
        message="This will permanently delete the contact submission."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
