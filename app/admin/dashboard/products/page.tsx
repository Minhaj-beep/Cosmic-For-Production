'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Search, CreditCard as Edit2, Trash2, Eye, EyeOff, Loader as Loader2, Upload, X } from 'lucide-react';
import { getProducts, upsertProduct, deleteProduct, upsertVariants, uploadProductImage, getProductCategoryIds, syncProductCategories, type Product } from '@/lib/api/products';
import { getCategories, type Category } from '@/lib/api/categories';
import AdminBadge from '@/components/admin/AdminBadge';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';

type Variant = { size: string; color: string; stock_qty: number };

type EditState = {
  id?: string;
  name: string;
  sku: string;
  category_id: string;
  category_ids: string[];
  subcategory: string;
  price: number;
  offer_price: number | null;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
  status: 'published' | 'draft';
  featured: boolean;
  new_arrival: boolean;
  bestseller: boolean;
  description: string;
  specs: { key: string; value: string }[];
  images: string[];
  variants: Variant[];
};

const emptyEdit: EditState = {
  name: '', sku: '', category_id: '', category_ids: [], subcategory: '', price: 0, offer_price: null,
  stock: 'in_stock', status: 'draft', featured: false, new_arrival: false, bestseller: false,
  description: '', specs: [], images: [], variants: [],
};

const emptyVariant: Variant = { size: '', color: '', stock_qty: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [edit, setEdit] = useState<EditState>(emptyEdit);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const [newVariant, setNewVariant] = useState<Variant>(emptyVariant);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const [{ data: prods, error: prodsErr }, { data: cats }] = await Promise.all([getProducts(), getCategories()]);
    if (prodsErr) setToast({ msg: `Failed to load products: ${prodsErr.message}`, type: 'error' });
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCat = filterCategory === 'all' || p.category_id === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  function openAdd() {
    setEdit({ ...emptyEdit });
    setNewVariant(emptyVariant);
    setModalOpen(true);
  }

  async function openEdit(p: Product) {
    const specs = Array.isArray(p.specs) ? p.specs as { key: string; value: string }[] : [];
    const variants = (p.product_variants ?? []).map((v) => ({ size: v.size, color: v.color, stock_qty: v.stock_qty }));
    const categoryIds = await getProductCategoryIds(p.id);
    setEdit({
      id: p.id, name: p.name, sku: p.sku, category_id: p.category_id ?? '',
      category_ids: categoryIds.length > 0 ? categoryIds : (p.category_id ? [p.category_id] : []),
      subcategory: p.subcategory, price: p.price, offer_price: p.offer_price,
      stock: p.stock, status: p.status, featured: p.featured,
      new_arrival: p.new_arrival, bestseller: p.bestseller,
      description: p.description, specs, images: p.images ?? [], variants,
    });
    setNewVariant(emptyVariant);
    setModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadProductImage(file);
    setUploading(false);
    if (error || !url) { setToast({ msg: 'Image upload failed.', type: 'error' }); return; }
    setEdit((p) => ({ ...p, images: [...p.images, url] }));
  }

  async function handleSave() {
    if (!edit.name || !edit.sku) { setToast({ msg: 'Name and SKU are required.', type: 'error' }); return; }
    setSaving(true);
    const primaryCategoryId = edit.category_ids[0] ?? null;
    const payload = {
      name: edit.name, sku: edit.sku, category_id: primaryCategoryId,
      subcategory: edit.subcategory, price: edit.price, offer_price: edit.offer_price,
      stock: edit.stock, status: edit.status, featured: edit.featured,
      new_arrival: edit.new_arrival, bestseller: edit.bestseller,
      description: edit.description, specs: edit.specs, images: edit.images,
    };
    const { data, error } = await upsertProduct(payload, edit.id);
    if (error || !data) { setSaving(false); setToast({ msg: error?.message ?? 'Save failed.', type: 'error' }); return; }
    await Promise.all([
      upsertVariants(data.id, edit.variants),
      syncProductCategories(data.id, edit.category_ids),
    ]);
    setSaving(false);
    setToast({ msg: edit.id ? 'Product updated.' : 'Product created.', type: 'success' });
    setModalOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await deleteProduct(deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setToast({ msg: 'Product deleted.', type: 'success' });
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
  }

  async function togglePublish(p: Product) {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    await upsertProduct({ status: newStatus }, p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, status: newStatus } : x));
  }

  const addSpec = () => {
    if (!specKey || !specVal) return;
    setEdit((p) => ({ ...p, specs: [...p.specs, { key: specKey, value: specVal }] }));
    setSpecKey(''); setSpecVal('');
  };

  const addVariant = () => {
    if (!newVariant.size && !newVariant.color) return;
    setEdit((p) => ({ ...p, variants: [...p.variants, { ...newVariant }] }));
    setNewVariant(emptyVariant);
  };

  const removeVariant = (idx: number) => setEdit((p) => ({ ...p, variants: p.variants.filter((_, i) => i !== idx) }));

  const updateVariantField = (idx: number, field: keyof Variant, value: string | number) => {
    setEdit((p) => ({ ...p, variants: p.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v) }));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Products</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input type="text" placeholder="Search by name or SKU…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 w-64" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-zinc-200 bg-white text-sm px-3 py-2 outline-none focus:border-zinc-400">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Variants', 'Flags', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold tracking-widest uppercase text-zinc-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-16 text-sm text-zinc-400">No products found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover bg-zinc-100 flex-shrink-0" />}
                      <p className="text-sm font-medium text-zinc-900 max-w-[180px] truncate">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400 font-mono">{p.sku}</td>
                  <td className="px-4 py-3.5 text-sm text-zinc-600">{p.categories?.name ?? '—'}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-zinc-900">₹{(p.offer_price ?? p.price).toLocaleString('en-IN')}</p>
                    {p.offer_price && <p className="text-xs text-zinc-400 line-through">₹{p.price.toLocaleString('en-IN')}</p>}
                  </td>
                  <td className="px-4 py-3.5">
                    <AdminBadge variant={p.stock === 'in_stock' ? 'green' : p.stock === 'low_stock' ? 'yellow' : 'red'}>
                      {p.stock === 'in_stock' ? 'In Stock' : p.stock === 'low_stock' ? 'Low' : 'Out'}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-zinc-500">
                    {(p.product_variants?.length ?? 0) > 0 ? (
                      <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 border border-zinc-200">{p.product_variants!.length} variant{p.product_variants!.length !== 1 ? 's' : ''}</span>
                    ) : (
                      <span className="text-xs text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1 flex-wrap">
                      {p.featured && <AdminBadge variant="blue">Featured</AdminBadge>}
                      {p.new_arrival && <AdminBadge variant="green">New</AdminBadge>}
                      {p.bestseller && <AdminBadge variant="orange">Best</AdminBadge>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <AdminBadge variant={p.status === 'published' ? 'green' : 'zinc'}>
                      {p.status === 'published' ? 'Published' : 'Draft'}
                    </AdminBadge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => togglePublish(p)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors" title={p.status === 'published' ? 'Unpublish' : 'Publish'}>
                        {p.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={edit.id ? 'Edit Product' : 'Add Product'} size="xl">
        <div className="space-y-6">
          {/* Basic fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="admin-label">Product Name *</label><input className="admin-input" value={edit.name} onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Cosmic Apex Pro" /></div>
            <div><label className="admin-label">SKU *</label><input className="admin-input" value={edit.sku} onChange={(e) => setEdit((p) => ({ ...p, sku: e.target.value }))} placeholder="CSM-APX-001" /></div>
            <div>
              <label className="admin-label">Categories</label>
              {categories.length === 0 ? (
                <p className="text-xs text-zinc-400 py-2">No categories yet — add some first.</p>
              ) : (
                <div className="border border-zinc-200 max-h-36 overflow-y-auto bg-white">
                  {categories.map((c) => (
                    <label key={c.id} className="flex items-center gap-2.5 cursor-pointer px-3 py-1.5 hover:bg-zinc-50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 accent-[#D61C1C] flex-shrink-0"
                        checked={edit.category_ids.includes(c.id)}
                        onChange={(e) => {
                          setEdit((p) => ({
                            ...p,
                            category_ids: e.target.checked
                              ? [...p.category_ids, c.id]
                              : p.category_ids.filter((id) => id !== c.id),
                          }));
                        }}
                      />
                      <span className="text-sm text-zinc-700">{c.name}</span>
                    </label>
                  ))}
                </div>
              )}
              {edit.category_ids.length > 0 && (
                <p className="text-[10px] text-zinc-400 mt-1">{edit.category_ids.length} selected — first selection is the primary category</p>
              )}
            </div>
            <div><label className="admin-label">Subcategory</label><input className="admin-input" value={edit.subcategory} onChange={(e) => setEdit((p) => ({ ...p, subcategory: e.target.value }))} placeholder="e.g. Race, Trail" /></div>
            <div><label className="admin-label">Price (₹)</label><input type="number" className="admin-input" value={edit.price || ''} onChange={(e) => setEdit((p) => ({ ...p, price: Number(e.target.value) }))} /></div>
            <div><label className="admin-label">Offer Price (₹)</label><input type="number" className="admin-input" value={edit.offer_price ?? ''} onChange={(e) => setEdit((p) => ({ ...p, offer_price: Number(e.target.value) || null }))} placeholder="Leave blank if no offer" /></div>
            <div>
              <label className="admin-label">Stock Status</label>
              <select className="admin-input" value={edit.stock} onChange={(e) => setEdit((p) => ({ ...p, stock: e.target.value as EditState['stock'] }))}>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="admin-label">Publish Status</label>
              <select className="admin-input" value={edit.status} onChange={(e) => setEdit((p) => ({ ...p, status: e.target.value as EditState['status'] }))}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div><label className="admin-label">Description</label><textarea className="admin-input min-h-[80px] resize-y" value={edit.description} onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))} placeholder="Product description…" /></div>

          {/* Feature flags */}
          <div>
            <label className="admin-label mb-2 block">Feature Flags</label>
            <div className="flex gap-4">
              {([['featured', 'Featured'], ['new_arrival', 'New Arrival'], ['bestseller', 'Bestseller']] as [keyof EditState, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(edit[key])} onChange={(e) => setEdit((p) => ({ ...p, [key]: e.target.checked }))} className="w-3.5 h-3.5 accent-[#D61C1C]" />
                  <span className="text-sm text-zinc-600">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div>
            <label className="admin-label mb-2 block">Variants (Size / Color)</label>
            {edit.variants.length > 0 && (
              <div className="mb-3 border border-zinc-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="text-left px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-zinc-400">Size</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-zinc-400">Color</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-zinc-400">Stock Qty</th>
                      <th className="px-3 py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {edit.variants.map((v, i) => (
                      <tr key={i} className="group">
                        <td className="px-3 py-2">
                          <input className="admin-input py-1 text-xs" value={v.size} onChange={(e) => updateVariantField(i, 'size', e.target.value)} placeholder="S, M, L, XL…" />
                        </td>
                        <td className="px-3 py-2">
                          <input className="admin-input py-1 text-xs" value={v.color} onChange={(e) => updateVariantField(i, 'color', e.target.value)} placeholder="Red, Blue…" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" className="admin-input py-1 text-xs w-24" value={v.stock_qty || ''} onChange={(e) => updateVariantField(i, 'stock_qty', Number(e.target.value))} />
                        </td>
                        <td className="px-3 py-2">
                          <button onClick={() => removeVariant(i)} className="text-zinc-300 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <div className="flex-1"><input className="admin-input text-xs" placeholder="Size (e.g. M, 54cm)" value={newVariant.size} onChange={(e) => setNewVariant((v) => ({ ...v, size: e.target.value }))} /></div>
              <div className="flex-1"><input className="admin-input text-xs" placeholder="Color (e.g. Matte Black)" value={newVariant.color} onChange={(e) => setNewVariant((v) => ({ ...v, color: e.target.value }))} /></div>
              <div className="w-28"><input type="number" className="admin-input text-xs" placeholder="Qty" value={newVariant.stock_qty || ''} onChange={(e) => setNewVariant((v) => ({ ...v, stock_qty: Number(e.target.value) }))} /></div>
              <button onClick={addVariant} className="px-3 py-2 bg-zinc-900 text-white text-xs hover:bg-[#D61C1C] transition-colors flex items-center gap-1 whitespace-nowrap">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Specs */}
          <div>
            <label className="admin-label mb-2 block">Technical Specifications</label>
            <div className="space-y-2 mb-3">
              {edit.specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-3 py-2">
                  <span className="text-xs font-semibold text-zinc-600 w-28 flex-shrink-0">{s.key}</span>
                  <span className="text-xs text-zinc-500 flex-1">{s.value}</span>
                  <button onClick={() => setEdit((p) => ({ ...p, specs: p.specs.filter((_, idx) => idx !== i) }))} className="text-zinc-300 hover:text-red-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="admin-input flex-1" placeholder="Spec name" value={specKey} onChange={(e) => setSpecKey(e.target.value)} />
              <input className="admin-input flex-1" placeholder="Value" value={specVal} onChange={(e) => setSpecVal(e.target.value)} />
              <button onClick={addSpec} className="px-3 py-2 bg-zinc-900 text-white text-xs hover:bg-[#D61C1C] transition-colors flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="admin-label mb-2 block">Images</label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <div onClick={() => fileRef.current?.click()} className="flex items-center justify-center border-2 border-dashed border-zinc-200 py-8 hover:border-zinc-400 transition-colors cursor-pointer">
              <div className="text-center">
                {uploading ? <Loader2 className="w-6 h-6 text-zinc-400 mx-auto mb-2 animate-spin" /> : <Upload className="w-6 h-6 text-zinc-300 mx-auto mb-2" />}
                <p className="text-xs text-zinc-400">{uploading ? 'Uploading…' : 'Click to upload image'}</p>
                <p className="text-[10px] text-zinc-300 mt-1">JPG, PNG, WebP up to 10MB</p>
              </div>
            </div>
            {edit.images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {edit.images.map((img, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => setEdit((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white flex items-center justify-center">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm text-zinc-600 border border-zinc-200 hover:border-zinc-400 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {edit.id ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteId} title="Delete Product" message="This will permanently delete the product. This cannot be undone." loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
