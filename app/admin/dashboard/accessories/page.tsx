'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Loader as Loader2, Upload, X } from 'lucide-react';
import { getAccessories, upsertAccessory, deleteAccessory, uploadAccessoryImage, type Accessory } from '@/lib/api/accessories';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';

const CATS = ['LOCKS', 'AIR PUMPS', 'TOOLS', 'ADD ON ACESSORIES'];

type EditState = { id?: string; name: string; sku: string; category: string; price: number; stock_qty: number; status: 'published' | 'draft'; image: string; description: string };
const empty: EditState = { name: '', sku: '', category: 'Helmets', price: 0, stock_qty: 0, status: 'draft', image: '', description: '' };

export default function AccessoriesPage() {
  const [items, setItems] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<EditState>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const { data } = await getAccessories();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()));

  async function handleImageFile(file: File) {
    setUploading(true);
    const { url, error } = await uploadAccessoryImage(file);
    setUploading(false);
    if (error || !url) { setToast({ msg: error ?? 'Upload failed.', type: 'error' }); return; }
    setEdit((p) => ({ ...p, image: url }));
  }

  async function handleSave() {
    if (!edit.name || !edit.sku) { setToast({ msg: 'Name and SKU required.', type: 'error' }); return; }
    setSaving(true);
    const { error } = await upsertAccessory({ name: edit.name, sku: edit.sku, category: edit.category, price: edit.price, stock_qty: edit.stock_qty, status: edit.status, image: edit.image, description: edit.description }, edit.id);
    setSaving(false);
    if (error) { setToast({ msg: error.message, type: 'error' }); return; }
    setToast({ msg: edit.id ? 'Accessory updated.' : 'Accessory added.', type: 'success' });
    setModal(false);
    load();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteAccessory(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setToast({ msg: 'Accessory deleted.', type: 'success' });
    setItems((prev) => prev.filter((x) => x.id !== deleteId));
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Accessories</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{items.length} items</p>
        </div>
        <button onClick={() => { setEdit({ ...empty }); setModal(true); }} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors">
          <Plus className="w-4 h-4" /> Add Accessory
        </button>
      </div>

      <input type="text" placeholder="Search accessories…" value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input w-64 mb-5" />

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Item', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-zinc-400">No accessories found.</td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} className="w-9 h-9 object-cover bg-zinc-100 rounded" alt="" />
                      ) : (
                        <div className="w-9 h-9 bg-zinc-100 rounded flex items-center justify-center text-zinc-300">
                          <Upload className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-mono text-zinc-400">{item.sku}</td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600">{item.category}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-zinc-900">₹{item.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3.5 text-sm text-zinc-600">{item.stock_qty}</td>
                  <td className="px-5 py-3.5">
                    <AdminBadge variant={item.status === 'published' ? 'green' : 'zinc'}>{item.status}</AdminBadge>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => { setEdit({ id: item.id, name: item.name, sku: item.sku, category: item.category, price: item.price, stock_qty: item.stock_qty, status: item.status, image: item.image, description: item.description }); setModal(true); }} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={modal} onClose={() => setModal(false)} title={edit.id ? 'Edit Accessory' : 'Add Accessory'} size="md">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="admin-label">Name *</label><input className="admin-input" value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="admin-label">SKU *</label><input className="admin-input" value={edit.sku} onChange={(e) => setEdit((p) => ({ ...p, sku: e.target.value }))} /></div>
            <div>
              <label className="admin-label">Category</label>
              <select className="admin-input" value={edit.category} onChange={(e) => setEdit((p) => ({ ...p, category: e.target.value }))}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="admin-label">Price (₹)</label><input type="number" className="admin-input" value={edit.price || ''} onChange={(e) => setEdit((p) => ({ ...p, price: Number(e.target.value) }))} /></div>
            <div><label className="admin-label">Stock Qty</label><input type="number" className="admin-input" value={edit.stock_qty || ''} onChange={(e) => setEdit((p) => ({ ...p, stock_qty: Number(e.target.value) }))} /></div>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value as 'published' | 'draft' }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="admin-label">Image</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            {edit.image ? (
              <div className="relative inline-block mt-1">
                <img src={edit.image} alt="" className="w-24 h-24 object-cover rounded border border-zinc-200" />
                <button type="button" onClick={() => setEdit((p) => ({ ...p, image: '' }))} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="mt-1 w-full flex items-center justify-center gap-2 border border-dashed border-zinc-300 py-6 text-sm text-zinc-400 hover:border-zinc-500 hover:text-zinc-600 transition-colors disabled:opacity-60">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading…' : 'Click to upload image'}
              </button>
            )}
          </div>

          <div><label className="admin-label">Description</label><textarea className="admin-input resize-none" rows={3} value={edit.description} onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))} /></div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-zinc-200 hover:border-zinc-400 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || uploading} className="px-4 py-2 text-sm bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteId} title="Delete Accessory" message="This will permanently delete the accessory." loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
