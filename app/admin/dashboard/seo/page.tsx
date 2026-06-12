'use client';

import { useState, useEffect } from 'react';
import { CreditCard as Edit2, Save, Loader as Loader2, Plus } from 'lucide-react';
import { getSeoEntries, updateSeoEntry, upsertSeoByRoute, type SeoEntry } from '@/lib/api/seo';
import { getProducts, type Product } from '@/lib/api/products';
import { getCategories, type Category } from '@/lib/api/categories';
import AdminToast from '@/components/admin/AdminToast';

type Tab = 'static' | 'products' | 'categories';

function SeoCard({
  entry,
  onSaved,
  onToast,
}: {
  entry: SeoEntry;
  onSaved: (updated: SeoEntry) => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<SeoEntry>>({});
  const [saving, setSaving] = useState(false);

  const start = () => { setDraft({ ...entry }); setEditing(true); };
  const cancel = () => { setEditing(false); setDraft({}); };

  async function save() {
    setSaving(true);
    const { error } = await updateSeoEntry(entry.id, { title: draft.title, description: draft.description, keywords: draft.keywords });
    setSaving(false);
    if (error) { onToast(error.message, 'error'); return; }
    onSaved({ ...entry, title: draft.title ?? entry.title, description: draft.description ?? entry.description, keywords: draft.keywords ?? entry.keywords, last_updated: new Date().toISOString() });
    setEditing(false);
    onToast('SEO metadata saved.', 'success');
  }

  const data = editing ? draft : entry;
  const titleLen = draft.title?.length ?? 0;
  const descLen = draft.description?.length ?? 0;

  return (
    <div className={`bg-white border transition-colors ${editing ? 'border-zinc-400 shadow-sm' : 'border-zinc-200'}`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{entry.page}</p>
          <p className="text-xs text-zinc-400 font-mono">{entry.route}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Updated {new Date(entry.last_updated).toLocaleDateString('en-IN')}</span>
          {!editing ? (
            <button onClick={start} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-3 py-1.5 transition-colors">
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={cancel} className="text-xs text-zinc-400 hover:text-zinc-700 border border-zinc-200 px-3 py-1.5 transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-1.5 text-xs bg-zinc-900 text-white px-3 py-1.5 hover:bg-[#D61C1C] transition-colors disabled:opacity-60">
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="admin-label">SEO Title</label>
            {editing && <span className={`text-[10px] ${titleLen > 60 ? 'text-red-500' : 'text-zinc-400'}`}>{titleLen}/60</span>}
          </div>
          {editing ? (
            <input className="admin-input" value={draft.title ?? ''} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
          ) : (
            <p className="text-sm text-zinc-800 bg-zinc-50 border border-zinc-100 px-3 py-2.5">{entry.title}</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="admin-label">Meta Description</label>
            {editing && <span className={`text-[10px] ${descLen > 160 ? 'text-red-500' : 'text-zinc-400'}`}>{descLen}/160</span>}
          </div>
          {editing ? (
            <textarea className="admin-input min-h-[68px] resize-none" value={draft.description ?? ''} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} />
          ) : (
            <p className="text-sm text-zinc-600 bg-zinc-50 border border-zinc-100 px-3 py-2.5 leading-relaxed">{entry.description}</p>
          )}
        </div>
        <div>
          <label className="admin-label mb-1.5 block">Keywords</label>
          {editing ? (
            <input className="admin-input" value={draft.keywords ?? ''} onChange={(e) => setDraft((p) => ({ ...p, keywords: e.target.value }))} placeholder="comma, separated, keywords" />
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {(entry.keywords || '').split(',').filter(Boolean).map((kw) => (
                <span key={kw} className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 border border-zinc-200">{kw.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateSeoRow({ route, page, onCreated, onToast }: { route: string; page: string; onCreated: (entry: SeoEntry) => void; onToast: (msg: string, type: 'success' | 'error') => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', description: '', keywords: '' });
  const [saving, setSaving] = useState(false);

  async function create() {
    setSaving(true);
    const { data, error } = await upsertSeoByRoute(route, { page, title: draft.title, description: draft.description, keywords: draft.keywords });
    setSaving(false);
    if (error || !data) { onToast(error?.message ?? 'Failed to create SEO entry.', 'error'); return; }
    onCreated(data);
    onToast('SEO entry created.', 'success');
  }

  if (!open) {
    return (
      <div className="bg-white border border-dashed border-zinc-300 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-700">{page}</p>
          <p className="text-xs text-zinc-400 font-mono">{route}</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 px-3 py-1.5 transition-colors">
          <Plus className="w-3 h-3" /> Create SEO
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-400 shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{page}</p>
          <p className="text-xs text-zinc-400 font-mono">{route}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOpen(false)} className="text-xs text-zinc-400 hover:text-zinc-700 border border-zinc-200 px-3 py-1.5 transition-colors">Cancel</button>
          <button onClick={create} disabled={saving} className="flex items-center gap-1.5 text-xs bg-zinc-900 text-white px-3 py-1.5 hover:bg-[#D61C1C] transition-colors disabled:opacity-60">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
          </button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div><label className="admin-label">SEO Title</label><input className="admin-input mt-1" value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} /></div>
        <div><label className="admin-label">Meta Description</label><textarea className="admin-input mt-1 min-h-[68px] resize-none" value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} /></div>
        <div><label className="admin-label">Keywords</label><input className="admin-input mt-1" value={draft.keywords} onChange={(e) => setDraft((p) => ({ ...p, keywords: e.target.value }))} placeholder="comma, separated, keywords" /></div>
      </div>
    </div>
  );
}

export default function SeoPage() {
  const [allEntries, setAllEntries] = useState<SeoEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('static');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const STATIC_ROUTES = ['/', '/about', '/products', '/accessories', '/spare-parts', '/careers', '/contact', '/store-locator'];

  async function load() {
    setLoading(true);
    const [{ data: entries }, { data: prods }, { data: cats }] = await Promise.all([
      getSeoEntries(),
      getProducts(),
      getCategories(),
    ]);
    setAllEntries(entries);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const entriesByRoute = Object.fromEntries(allEntries.map((e) => [e.route, e]));

  const staticEntries = allEntries.filter((e) => STATIC_ROUTES.includes(e.route));

  function updateEntry(updated: SeoEntry) {
    setAllEntries((prev) => prev.map((e) => e.id === updated.id ? updated : e));
  }

  function addEntry(entry: SeoEntry) {
    setAllEntries((prev) => [...prev, entry]);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'static', label: 'Static Pages' },
    { key: 'products', label: `Products (${products.length})` },
    { key: 'categories', label: `Categories (${categories.length})` },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900">SEO Management</h2>
        <p className="text-sm text-zinc-400 mt-0.5">Manage meta titles, descriptions and keywords for all pages.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {tab === 'static' && (
            <>
              {STATIC_ROUTES.map((route) => {
                const entry = entriesByRoute[route];
                if (entry) return <SeoCard key={route} entry={entry} onSaved={updateEntry} onToast={(msg, type) => setToast({ msg, type })} />;
                const label = route === '/' ? 'Home' : route.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                return <CreateSeoRow key={route} route={route} page={label} onCreated={addEntry} onToast={(msg, type) => setToast({ msg, type })} />;
              })}
            </>
          )}

          {tab === 'products' && (
            <>
              {products.length === 0 && <p className="text-sm text-zinc-400 py-10 text-center">No products yet.</p>}
              {products.map((p) => {
                const route = `/products/${p.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                const entry = entriesByRoute[route];
                if (entry) return <SeoCard key={route} entry={entry} onSaved={updateEntry} onToast={(msg, type) => setToast({ msg, type })} />;
                return <CreateSeoRow key={route} route={route} page={p.name} onCreated={addEntry} onToast={(msg, type) => setToast({ msg, type })} />;
              })}
            </>
          )}

          {tab === 'categories' && (
            <>
              {categories.length === 0 && <p className="text-sm text-zinc-400 py-10 text-center">No categories yet.</p>}
              {categories.map((c) => {
                const route = `/collections/${c.slug}`;
                const entry = entriesByRoute[route];
                if (entry) return <SeoCard key={route} entry={entry} onSaved={updateEntry} onToast={(msg, type) => setToast({ msg, type })} />;
                return <CreateSeoRow key={route} route={route} page={c.name} onCreated={addEntry} onToast={(msg, type) => setToast({ msg, type })} />;
              })}
            </>
          )}
        </div>
      )}

      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
