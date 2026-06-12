import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type SeoEntry = Database['public']['Tables']['seo_metadata']['Row'];

export async function getSeoEntries() {
  const { data, error } = await supabase
    .from('seo_metadata')
    .select('*')
    .order('page', { ascending: true });
  return { data: data ?? [], error };
}

export async function updateSeoEntry(id: string, updates: Partial<SeoEntry>) {
  const { data, error } = await supabase
    .from('seo_metadata')
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function upsertSeoByRoute(route: string, updates: Partial<SeoEntry>) {
  const { data: existing } = await supabase
    .from('seo_metadata')
    .select('id')
    .eq('route', route)
    .maybeSingle();

  if (existing?.id) {
    return updateSeoEntry(existing.id, updates);
  }
  const { data, error } = await supabase
    .from('seo_metadata')
    .insert({ route, page: updates.page ?? route, ...updates, last_updated: new Date().toISOString() } as Database['public']['Tables']['seo_metadata']['Insert'])
    .select()
    .single();
  return { data, error };
}
