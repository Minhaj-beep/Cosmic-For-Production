import { db as supabase, supabase as supabaseTyped } from '../supabase';
import type { Database } from '../database.types';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  return { data: data ?? [], error };
}

export async function upsertCategory(cat: CategoryInsert, id?: string) {
  const slug = (cat.name ?? '').toLowerCase().replace(/\s+/g, '-');
  if (id) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...cat, slug, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase
    .from('categories')
    .insert({ ...cat, slug })
    .select()
    .single();
  return { data, error };
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  return { error };
}

export async function uploadCategoryImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  const ext = file.name.split('.').pop();
  const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabaseTyped.storage.from('media').upload(path, file, { upsert: false });
  if (error) return { url: null, error };
  const { data } = supabaseTyped.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/** Returns product IDs assigned to a category via the junction table. */
export async function getProductIdsForCategory(categoryId: string): Promise<string[]> {
  const { data } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', categoryId);
  return (data ?? []).map((r: { product_id: string }) => r.product_id);
}

/** Replace all product assignments for a category. */
export async function syncCategoryProducts(categoryId: string, productIds: string[]) {
  await supabase.from('product_categories').delete().eq('category_id', categoryId);
  if (productIds.length === 0) return { error: null };
  const { error } = await supabase.from('product_categories').insert(
    productIds.map((pid) => ({ product_id: pid, category_id: categoryId }))
  );
  return { error };
}
