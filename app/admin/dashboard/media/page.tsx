'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Search, Image as ImageIcon, X, Loader as Loader2 } from 'lucide-react';
import { getMediaItems, uploadMedia, deleteMedia, type MediaItem } from '@/lib/api/media';
import { useAdminAuth } from '@/lib/admin-auth-context';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import AdminToast from '@/components/admin/AdminToast';
import AdminModal from '@/components/admin/AdminModal';

export default function MediaPage() {
  const { user } = useAdminAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const { data } = await getMediaItems();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = items.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !user?.id) return;
    setUploading(true);
    let uploaded = 0;
    for (const file of files) {
      const { item, error } = await uploadMedia(file, user.id);
      if (item) { setItems((prev) => [item, ...prev]); uploaded++; }
      else if (error) setToast({ msg: `Failed: ${file.name}`, type: 'error' });
    }
    setUploading(false);
    if (uploaded > 0) setToast({ msg: `${uploaded} file${uploaded > 1 ? 's' : ''} uploaded.`, type: 'success' });
    e.target.value = '';
  }

  async function handleDelete() {
    const item = items.find((m) => m.id === deleteId);
    if (!item) return;
    setDeleting(true);
    const { error } = await deleteMedia(item.id, item.storage_path);
    setDeleting(false);
    setDeleteId(null);
    if (error) { setToast({ msg: 'Delete failed.', type: 'error' }); return; }
    setItems((prev) => prev.filter((m) => m.id !== item.id));
    setToast({ msg: 'File deleted.', type: 'success' });
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Media Library</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{items.length} files</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 text-sm font-semibold hover:bg-[#D61C1C] transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Upload Files'}
        </button>
        <input ref={fileRef} type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} />
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-zinc-200 flex items-center justify-center py-8 mb-6 hover:border-zinc-400 transition-colors cursor-pointer"
      >
        <div className="text-center">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-zinc-400 mx-auto mb-2 animate-spin" />
          ) : (
            <ImageIcon className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
          )}
          <p className="text-sm text-zinc-400">{uploading ? 'Uploading to Supabase Storage…' : 'Drag & drop files here or click to upload'}</p>
          <p className="text-xs text-zinc-300 mt-1">JPG, PNG, WEBP, SVG up to 10MB</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
        <input type="text" placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400 w-64" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 text-zinc-400 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-sm text-zinc-400">No media files found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className="group relative bg-white border border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer" onClick={() => setPreview(m)}>
              <div className="aspect-square overflow-hidden bg-zinc-100">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-2">
                <p className="text-[11px] text-zinc-700 font-medium truncate">{m.name}</p>
                <p className="text-[10px] text-zinc-400">{formatBytes(m.size_bytes)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setDeleteId(m.id); }} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={!!preview} onClose={() => setPreview(null)} title={preview?.name ?? ''} size="lg">
        {preview && (
          <div>
            <img src={preview.url} alt={preview.name} className="w-full max-h-80 object-contain bg-zinc-100 mb-5" />
            <div className="grid sm:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-100 p-4 mb-4">
              {[['Filename', preview.name], ['Size', formatBytes(preview.size_bytes)], ['Dimensions', preview.width && preview.height ? `${preview.width}×${preview.height}` : '—'], ['Uploaded', new Date(preview.created_at).toLocaleDateString('en-IN')]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-0.5">{l}</p>
                  <p className="text-sm text-zinc-700">{v}</p>
                </div>
              ))}
            </div>
            {preview.used_in?.length > 0 && (
              <div className="mb-5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 mb-2">Used in</p>
                <div className="flex flex-wrap gap-1.5">
                  {preview.used_in.map((u) => <span key={u} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 border border-zinc-200">{u}</span>)}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <a href={preview.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-zinc-900 text-white font-semibold hover:bg-[#D61C1C] transition-colors">Open Original</a>
              <button onClick={() => { setPreview(null); setDeleteId(preview.id); }} className="px-4 py-2 text-sm border border-zinc-200 text-zinc-600 hover:border-red-300 hover:text-red-600 transition-colors flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog open={!!deleteId} title="Delete File" message="This will permanently delete the file from storage. Any pages using it may break." loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <AdminToast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
