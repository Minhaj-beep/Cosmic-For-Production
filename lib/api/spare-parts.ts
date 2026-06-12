import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type SparePart = Database['public']['Tables']['spare_parts']['Row'];
export type SparePartInsert = Database['public']['Tables']['spare_parts']['Insert'];

export async function getSpareParts() {
  const { data, error } = await supabase
    .from('spare_parts')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function upsertSparePart(item: SparePartInsert, id?: string) {
  if (id) {
    const { data, error } = await supabase
      .from('spare_parts')
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase.from('spare_parts').insert(item).select().single();
  return { data, error };
}

export async function deleteSparePart(id: string) {
  const { error } = await supabase.from('spare_parts').delete().eq('id', id);
  return { error };
}

export async function uploadSparePartImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop();
  const path = `spare-parts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file);
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
