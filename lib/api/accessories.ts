import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type Accessory = Database['public']['Tables']['accessories']['Row'];
export type AccessoryInsert = Database['public']['Tables']['accessories']['Insert'];

export async function getAccessories() {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function upsertAccessory(item: AccessoryInsert, id?: string) {
  if (id) {
    const { data, error } = await supabase
      .from('accessories')
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase.from('accessories').insert(item).select().single();
  return { data, error };
}

export async function deleteAccessory(id: string) {
  const { error } = await supabase.from('accessories').delete().eq('id', id);
  return { error };
}

export async function uploadAccessoryImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop();
  const path = `accessories/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file);
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

// ── Public-facing queries ──────────────────────────────────────────────────

export async function getPublicAccessories(opts: { search?: string; category?: string; sort?: string } = {}) {
  let query = supabase
    .from('accessories')
    .select('*')
    .eq('status', 'published');

  if (opts.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (opts.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) return { data: [], error };

  let result = (data ?? []) as Accessory[];
  if (opts.category && opts.category !== 'All') {
    result = result.filter((a) => a.category === opts.category);
  }
  if (opts.search?.trim()) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }
  return { data: result, error: null };
}

export async function getPublicAccessoryBySku(sku: string) {
  const { data, error } = await supabase
    .from('accessories')
    .select('*')
    .eq('status', 'published')
    .ilike('sku', sku)
    .maybeSingle();
  return { data: data as Accessory | null, error };
}

export async function getAccessoryCategories() {
  const { data } = await supabase
    .from('accessories')
    .select('category')
    .eq('status', 'published');
  const cats = Array.from(new Set((data ?? []).map((a: { category: string }) => a.category))).filter(Boolean);
  return ['All', ...cats] as string[];
}
