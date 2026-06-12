'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Users, Loader as Loader2 } from 'lucide-react';
import { getVacancies, upsertVacancy, deleteVacancy, type Vacancy } from '@/lib/api/vacancies';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';
import Link from 'next/link';

const DEPTS = ['Design', 'Sales', 'Marketing', 'Operations', 'Engineering', 'HR', 'Finance'];

type EditState = { id?: string; title: string; department: string; location: string; experience: string; type: 'full_time' | 'part_time' | 'contract'; description: string; requirements: string[]; status: 'active' | 'closed' | 'draft' };
const empty: EditState = { title: '', department: 'Sales', location: '', experience: '', type: 'full_time', description: '', requirements: [], status: 'draft' };

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<EditState>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [reqInput, setReqInput] = useState('');

  async function load() {
    setLoading(true);
    const { data } = await getVacancies();
    setVacancies(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openEdit(v: Vacancy) {
    setEdit({ id: v.id, title: v.title, department: v.department, location: v.location, experience: v.experience, type: v.type, description: v.description, requirements: v.requirements, status: v.status });
    setModal(true);
  }

  async function handleSave() {
    if (!edit.title) { setToast({ msg: 'Job title is required.', type: 'error' }); return; }
    setSaving(true);
    const { error } = await upsertVacancy({ title: edit.title, department: edit.department, location: edit.location, experience: edit.experience, type: edit.type, description: edit.description, requirements: edit.requirements, status: edit.status }, edit.id);
    setSaving(false);
    if (error) { setToast({ msg: error.message, type: 'error' }); return; }
    setToast({ msg: edit.id ? 'Vacancy updated.' : 'Vacancy posted.', type: 'success' });
    setModal(false);
    load();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteVacancy(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setToast({ msg: 'Vacancy deleted.', type: 'success' });
    setVacancies((prev) => prev.filter((v) => v.id !== deleteId));
  }

  const addReq = () => {
    if (!reqInput.trim()) return;
    setEdit((p) => ({ ...p, requirements: [...p.requirements, reqInput.trim()] }));
    setReqInput('');
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Career Vacancies</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{vacancies.filter((v) => v.status === 'active').length} active positions</p>
        </div>
        <button onClick={() => { setEdit({ ...empty }); setModal(true); }} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors">
          <Plus className="w-4 h-4" /> Post Vacancy
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vacancies.length === 0 && <p className="text-sm text-zinc-400 col-span-3 py-12 text-center">No vacancies yet.</p>}
          {vacancies.map((v) => (
            <div key={v.id} className="bg-white border border-zinc-200 p-5 hover:border-zinc-400 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <AdminBadge variant={v.status === 'active' ? 'green' : v.status === 'draft' ? 'zinc' : 'red'}>{v.status}</AdminBadge>
                    <AdminBadge variant="zinc">{v.type === 'full_time' ? 'Full Time' : v.type === 'part_time' ? 'Part Time' : 'Contract'}</AdminBadge>
                  </div>
                  <h3 className="font-semibold text-zinc-900 leading-snug">{v.title}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{v.department} · {v.location}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-1">Experience: {v.experience}</p>
              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-4">{v.description}</p>
              <div className="flex items-center justify-between">
                <Link href="/admin/dashboard/applications" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                  <Users className="w-3.5 h-3.5" /> View applications
                </Link>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(v)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(v.id)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modal} onClose={() => setModal(false)} title={edit.id ? 'Edit Vacancy' : 'Post New Vacancy'} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="admin-label">Job Title *</label><input className="admin-input" value={edit.title} onChange={(e) => setEdit((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Product Designer" /></div>
            <div>
              <label className="admin-label">Department</label>
              <select className="admin-input" value={edit.department} onChange={(e) => setEdit((p) => ({ ...p, department: e.target.value }))}>
                {DEPTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="admin-label">Location</label><input className="admin-input" value={edit.location} onChange={(e) => setEdit((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Mumbai" /></div>
            <div><label className="admin-label">Experience</label><input className="admin-input" value={edit.experience} onChange={(e) => setEdit((p) => ({ ...p, experience: e.target.value }))} placeholder="e.g. 3–5 years" /></div>
            <div>
              <label className="admin-label">Type</label>
              <select className="admin-input" value={edit.type} onChange={(e) => setEdit((p) => ({ ...p, type: e.target.value as EditState['type'] }))}>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value as EditState['status'] }))}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="admin-label">Job Description</label>
            <textarea className="admin-input min-h-[80px] resize-y" value={edit.description} onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="admin-label mb-2 block">Requirements</label>
            {edit.requirements.map((r, i) => (
              <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-3 py-2 mb-1.5">
                <span className="text-xs text-zinc-600 flex-1">{r}</span>
                <button onClick={() => setEdit((p) => ({ ...p, requirements: p.requirements.filter((_, idx) => idx !== i) }))} className="text-zinc-300 hover:text-red-500 transition-colors text-xs">×</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input className="admin-input flex-1" placeholder="Add a requirement…" value={reqInput} onChange={(e) => setReqInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addReq()} />
              <button onClick={addReq} className="px-3 py-2 bg-zinc-900 text-white text-xs hover:bg-[#D61C1C] transition-colors flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add</button>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-zinc-200 hover:border-zinc-400 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteId} title="Delete Vacancy" message="This will remove the vacancy. Existing applications will not be affected." loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
