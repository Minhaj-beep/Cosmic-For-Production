'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Loader as Loader2, Upload, X, Image as ImageIcon, Layers, Search } from 'lucide-react';
import { getCategories, upsertCategory, deleteCategory, uploadCategoryImage, getProductIdsForCategory, syncCategoryProducts, type Category } from '@/lib/api/categories';
import { getProducts, type Product } from '@/lib/api/products';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';

type EditState = { id?: string; name: string; description: string; status: 'active' | 'inactive'; image_url: string | null };
const empty: EditState = { name: '', description: '', status: 'active', image_url: null };

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState<EditState>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Assign Products modal state
  const [assignCategory, setAssignCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [productSearch, setProductSearch] = useState('');
  const [assignSaving, setAssignSaving] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await getCategories();
    setCats(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEdit({ ...empty }); setModal(true); };
  const openEdit = (c: Category) => {
    setEdit({ id: c.id, name: c.name, description: c.description, status: c.status, image_url: c.image_url });
    setModal(true);
  };

  async function openAssign(c: Category) {
    setAssignCategory(c);
    setProductSearch('');
    setAssignLoading(true);
    const [{ data: prods }, ids] = await Promise.all([getProducts(), getProductIdsForCategory(c.id)]);
    setAllProducts(prods);
    setAssignedIds(new Set(ids));
    setAssignLoading(false);
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadCategoryImage(file);
    setUploading(false);
    if (error || !url) { setToast({ msg: 'Image upload failed.', type: 'error' }); return; }
    setEdit((p) => ({ ...p, image_url: url }));
  }

  async function handleSave() {
    if (!edit.name) { setToast({ msg: 'Category name is required.', type: 'error' }); return; }
    setSaving(true);
    const { error } = await upsertCategory(
      { name: edit.name, description: edit.description, status: edit.status, slug: '', image_url: edit.image_url },
      edit.id,
    );
    setSaving(false);
    if (error) { setToast({ msg: error.message, type: 'error' }); return; }
    setToast({ msg: edit.id ? 'Category updated.' : 'Category created.', type: 'success' });
    setModal(false);
    load();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteCategory(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setToast({ msg: 'Category deleted.', type: 'success' });
    setCats((prev) => prev.filter((c) => c.id !== deleteId));
  }

  async function handleAssignSave() {
    if (!assignCategory) return;
    setAssignSaving(true);
    const { error } = await syncCategoryProducts(assignCategory.id, Array.from(assignedIds));
    setAssignSaving(false);
    if (error) { setToast({ msg: 'Failed to save product assignments.', type: 'error' }); return; }
    setToast({ msg: 'Products assigned successfully.', type: 'success' });
    setAssignCategory(null);
  }

  function toggleProduct(id: string) {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Categories</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{cats.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.length === 0 && (
            <p className="text-sm text-zinc-400 col-span-3 py-12 text-center">No categories yet. Add your first one.</p>
          )}
          {cats.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 hover:border-zinc-400 transition-colors group overflow-hidden">
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-zinc-100 overflow-hidden">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-zinc-300" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-zinc-900">{c.name}</h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">/{c.slug}</p>
                  </div>
                  <AdminBadge variant={c.status === 'active' ? 'green' : 'zinc'}>{c.status}</AdminBadge>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">{c.description || '—'}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => openAssign(c)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors border border-zinc-200 hover:border-zinc-400 px-2.5 py-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Assign Products
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit category modal */}
      <AdminModal open={modal} onClose={() => setModal(false)} title={edit.id ? 'Edit Category' : 'Add Category'} size="sm">
        <div className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="admin-label">Thumbnail / Banner Image</label>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            {edit.image_url ? (
              <div className="relative w-full aspect-video overflow-hidden bg-zinc-100 border border-zinc-200">
                <img src={edit.image_url} alt="Category thumbnail" className="w-full h-full object-cover" />
                <button
                  onClick={() => setEdit((p) => ({ ...p, image_url: null }))}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-white border border-zinc-200 flex items-center justify-center transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5 text-zinc-700" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-video border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100 transition-colors flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 disabled:opacity-60"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                <span className="text-xs font-medium">{uploading ? 'Uploading…' : 'Click to upload image'}</span>
                <span className="text-[10px] text-zinc-300">JPG, PNG, WebP — max 10MB</span>
              </button>
            )}
          </div>

          <div>
            <label className="admin-label">Category Name *</label>
            <input className="admin-input" value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Road" />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-input min-h-[72px] resize-none" value={edit.description} onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))} placeholder="Short description…" />
          </div>
          <div>
            <label className="admin-label">Status</label>
            <select className="admin-input" value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModal(false)} className="px-4 py-2 text-sm border border-zinc-200 hover:border-zinc-400 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || uploading} className="px-4 py-2 text-sm bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Assign Products modal */}
      <AdminModal
        open={!!assignCategory}
        onClose={() => setAssignCategory(null)}
        title={`Assign Products — ${assignCategory?.name ?? ''}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or SKU…"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400"
            />
          </div>

          {assignLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
            </div>
          ) : allProducts.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">No products found. Add products first.</p>
          ) : (
            <>
              <div className="border border-zinc-200 divide-y divide-zinc-100 max-h-80 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="text-sm text-zinc-400 text-center py-6">No products match your search.</p>
                ) : filteredProducts.map((p) => (
                  <label key={p.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="w-3.5 h-3.5 accent-[#D61C1C] flex-shrink-0"
                      checked={assignedIds.has(p.id)}
                      onChange={() => toggleProduct(p.id)}
                    />
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover bg-zinc-100 flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-zinc-100 flex-shrink-0 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-zinc-300" strokeWidth={1.5} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{p.name}</p>
                      <p className="text-xs text-zinc-400 font-mono">{p.sku}</p>
                    </div>
                    <AdminBadge variant={p.status === 'published' ? 'green' : 'zinc'}>{p.status}</AdminBadge>
                  </label>
                ))}
              </div>
              <p className="text-xs text-zinc-400">{assignedIds.size} product{assignedIds.size !== 1 ? 's' : ''} selected</p>
            </>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button onClick={() => setAssignCategory(null)} className="px-4 py-2 text-sm border border-zinc-200 hover:border-zinc-400 transition-colors">Cancel</button>
            <button onClick={handleAssignSave} disabled={assignSaving || assignLoading} className="px-4 py-2 text-sm bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60 flex items-center gap-2">
              {assignSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save Assignments
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteId} title="Delete Category" message="This will remove the category. Products in this category will remain but become uncategorized." loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
