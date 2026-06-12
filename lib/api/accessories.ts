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
