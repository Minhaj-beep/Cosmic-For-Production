'use client';

import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Loader as Loader2, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { getDealers, upsertDealer, deleteDealer, type Dealer } from '@/lib/api/dealers';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';

const STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'Kerala', 'West Bengal', 'Punjab', 'Uttar Pradesh', 'Haryana'];

type EditState = { id?: string; name: string; address: string; city: string; state: string; pincode: string; phone: string; email: string; type: 'dealer' | 'service_center' | 'flagship'; status: 'active' | 'inactive' };
const empty: EditState = { name: '', address: '', city: '', state: 'Maharashtra', pincode: '', phone: '', email: '', type: 'dealer', status: 'active' };

const typeVariant = (t: Dealer['type']): 'orange' | 'blue' | 'zinc' => t === 'flagship' ? 'orange' : t === 'service_center' ? 'blue' : 'zinc';

export default function StoresPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<EditState>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await getDealers();
    setDealers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = dealers.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterState === 'all' || d.state === filterState);
  });

  async function handleSave() {
    if (!edit.name || !edit.city) { setToast({ msg: 'Name and city are required.', type: 'error' }); return; }
    setSaving(true);
    const { error } = await upsertDealer({ name: edit.name, address: edit.address, city: edit.city, state: edit.state, pincode: edit.pincode, phone: edit.phone, email: edit.email, type: edit.type, status: edit.status }, edit.id);
    setSaving(false);
    if (error) { setToast({ msg: error.message, type: 'error' }); return; }
    setToast({ msg: edit.id ? 'Store updated.' : 'Store added.', type: 'success' });
    setModal(false);
    load();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteDealer(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setToast({ msg: 'Store deleted.', type: 'success' });
    setDealers((prev) => prev.filter((d) => d.id !== deleteId));
  }

  async function toggleStatus(d: Dealer) {
    const newStatus = d.status === 'active' ? 'inactive' : 'active';
    await upsertDealer({ status: newStatus }, d.id);
    setDealers((prev) => prev.map((x) => x.id === d.id ? { ...x, status: newStatus } : x));
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Store Locator</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{dealers.filter((d) => d.status === 'active').length} active locations</p>
        </div>
        <button onClick={() => { setEdit({ ...empty }); setModal(true); }} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors">
          <Plus className="w-4 h-4" /> Add Store
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input type="text" placeholder="Search stores…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 w-56" />
        </div>
        <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400">
          <option value="all">All States</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Store Name', 'Address', 'City / State', 'Contact', 'Type', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-zinc-400">No stores found.</td></tr>
              ) : filtered.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-3.5 text-sm font-medium text-zinc-900">{d.name}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400 max-w-[200px]"><p className="truncate">{d.address}</p><p className="text-zinc-300">{d.pincode}</p></td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600">{d.city}, {d.state}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-zinc-600">{d.phone}</p>
                    <p className="text-xs text-zinc-400 truncate max-w-[140px]">{d.email}</p>
                  </td>
                  <td className="px-5 py-3.5"><AdminBadge variant={typeVariant(d.type)}>{d.type === 'service_center' ? 'Service' : d.type}</AdminBadge></td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => toggleStatus(d)} className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80">
                      {d.status === 'active'
                        ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Active</span></>
                        : <><ToggleLeft className="w-5 h-5 text-zinc-400" /><span className="text-zinc-400">Inactive</span></>}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => { setEdit({ id: d.id, name: d.name, address: d.address, city: d.city, state: d.state, pincode: d.pincode, phone: d.phone, email: d.email, type: d.type, status: d.status }); setModal(true); }} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(d.id)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={edit.id ? 'Edit Store' : 'Add Store'} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="admin-label">Store Name *</label><input className="admin-input" value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} /></div>
            <div className="sm:col-span-2"><label className="admin-label">Address</label><input className="admin-input" value={edit.address} onChange={(e) => setEdit((p) => ({ ...p, address: e.target.value }))} /></div>
            <div><label className="admin-label">City *</label><input className="admin-input" value={edit.city} onChange={(e) => setEdit((p) => ({ ...p, city: e.target.value }))} /></div>
            <div>
              <label className="admin-label">State</label>
              <select className="admin-input" value={edit.state} onChange={(e) => setEdit((p) => ({ ...p, state: e.target.value }))}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="admin-label">Pin Code</label><input className="admin-input" value={edit.pincode} onChange={(e) => setEdit((p) => ({ ...p, pincode: e.target.value }))} /></div>
            <div><label className="admin-label">Phone</label><input className="admin-input" value={edit.phone} onChange={(e) => setEdit((p) => ({ ...p, phone: e.target.value }))} /></div>
            <div><label className="admin-label">Email</label><input type="email" className="admin-input" value={edit.email} onChange={(e) => setEdit((p) => ({ ...p, email: e.target.value }))} /></div>
            <div>
              <label className="admin-label">Type</label>
              <select className="admin-input" value={edit.type} onChange={(e) => setEdit((p) => ({ ...p, type: e.target.value as EditState['type'] }))}>
                <option value="dealer">Dealer</option>
                <option value="service_center">Service Center</option>
                <option value="flagship">Flagship</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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

      <ConfirmDialog open={!!deleteId} title="Delete Store" message="This will remove the store from the locator." loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
