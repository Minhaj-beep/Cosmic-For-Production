'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, FileText, Loader as Loader2 } from 'lucide-react';
import { getApplications, updateApplication, type Application } from '@/lib/api/applications';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import AdminToast from '@/components/admin/AdminToast';

type AppStatus = Application['status'];
const STATUS_OPTIONS: AppStatus[] = ['new', 'shortlisted', 'interviewed', 'rejected', 'hired'];

const statusVariant = (s: AppStatus): 'zinc' | 'blue' | 'orange' | 'red' | 'green' => {
  const map: Record<AppStatus, 'zinc' | 'blue' | 'orange' | 'red' | 'green'> = {
    new: 'zinc', shortlisted: 'blue', interviewed: 'orange', rejected: 'red', hired: 'green',
  };
  return map[s];
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVacancy, setFilterVacancy] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getApplications();
    setApps(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const vacancyOptions = Array.from(new Set(apps.map((a) => a.vacancies?.title ?? '').filter(Boolean)));

  const filtered = apps.filter((a) => {
    const title = a.vacancies?.title ?? '';
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchVacancy = filterVacancy === 'all' || title === filterVacancy;
    return matchSearch && matchStatus && matchVacancy;
  });

  async function updateStatus(id: string, status: AppStatus) {
    await updateApplication(id, { status });
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
    setToast({ msg: 'Application status updated.', type: 'success' });
  }

  async function saveNote(id: string) {
    setSaving(true);
    await updateApplication(id, { notes: note });
    setSaving(false);
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, notes: note } : a));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, notes: note } : prev);
    setToast({ msg: 'Note saved.', type: 'success' });
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Candidate Applications</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{apps.filter((a) => a.status === 'new').length} new applications</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input type="text" placeholder="Search applicants…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 w-56" />
        </div>
        <select value={filterVacancy} onChange={(e) => setFilterVacancy(e.target.value)} className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400">
          <option value="all">All Positions</option>
          {vacancyOptions.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400">
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Applicant', 'Position', 'Experience', 'Applied', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm text-zinc-400">No applications found.</td></tr>
              ) : filtered.map((app) => (
                <tr key={app.id} className={`hover:bg-zinc-50/50 ${app.status === 'new' ? 'bg-blue-50/20' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-zinc-900">{app.name}</p>
                    <p className="text-xs text-zinc-400">{app.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600 max-w-[180px]"><p className="truncate">{app.vacancies?.title ?? '—'}</p></td>
                  <td className="px-5 py-3.5 text-xs text-zinc-500">{app.experience || '—'}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400">{new Date(app.applied_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3.5">
                    <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as AppStatus)} className="text-xs border border-zinc-200 bg-white px-2 py-1 outline-none focus:border-zinc-400">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => { setSelected(app); setNote(app.notes); }} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-2.5 py-1.5 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={!!selected} onClose={() => setSelected(null)} title="Application Details" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-zinc-900">{selected.name}</h3>
                <p className="text-sm text-zinc-400">{selected.vacancies?.title ?? '—'}</p>
              </div>
              <AdminBadge variant={statusVariant(selected.status)}>{selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}</AdminBadge>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 bg-zinc-50 border border-zinc-100 p-4">
              {[['Email', selected.email], ['Phone', selected.phone || '—'], ['Experience', selected.experience || '—'], ['Applied', new Date(selected.applied_at).toLocaleDateString('en-IN')]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-0.5">{l}</p>
                  <p className="text-sm text-zinc-800">{v}</p>
                </div>
              ))}
            </div>
            {selected.cover_letter && (
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Cover Letter</p>
                <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-100 p-4">{selected.cover_letter}</p>
              </div>
            )}
            {selected.resume_url ? (
              <div className="border-2 border-dashed border-zinc-200 p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-700">Resume / CV</p>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">{selected.resume_url}</p>
                </div>
                <a href={selected.resume_url} target="_blank" rel="noreferrer" className="text-xs border border-zinc-200 px-3 py-1.5 text-zinc-500 hover:border-zinc-400 transition-colors">Download</a>
              </div>
            ) : null}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button key={s} onClick={() => updateStatus(selected.id, s)} className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${selected.status === s ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Notes</p>
              <textarea className="admin-input min-h-[72px] resize-y" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add internal notes…" />
              <div className="flex justify-end mt-2">
                <button onClick={() => saveNote(selected.id)} disabled={saving} className="px-4 py-2 text-xs bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save Note'}
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
