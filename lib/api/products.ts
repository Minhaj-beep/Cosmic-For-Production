import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type Product = Database['public']['Tables']['products']['Row'] & {
  categories?: { name: string } | null;
  product_variants?: Database['public']['Tables']['product_variants']['Row'][];
};

export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];
export type Variant = Database['public']['Tables']['product_variants']['Row'];

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!products_category_id_fkey(name), product_variants(*)')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function upsertProduct(product: ProductInsert | ProductUpdate, id?: string): Promise<{ data: Database['public']['Tables']['products']['Row'] | null; error: { message: string } | null }> {
  if (id) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...product, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase
    .from('products')
    .insert(product as ProductInsert)
    .select()
    .single();
  return { data, error };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error };
}

export async function upsertVariants(productId: string, variants: Omit<Variant, 'id' | 'created_at' | 'product_id'>[]) {
  await supabase.from('product_variants').delete().eq('product_id', productId);
  if (variants.length === 0) return { error: null };
  const { error } = await supabase.from('product_variants').insert(
    variants.map((v) => ({ ...v, product_id: productId }))
  );
  return { error };
}

export async function uploadProductImage(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop();
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file);
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

/** Returns category IDs assigned to a product via the junction table. */
export async function getProductCategoryIds(productId: string): Promise<string[]> {
  const { data } = await supabase
    .from('product_categories')
    .select('category_id')
    .eq('product_id', productId);
  return (data ?? []).map((r: { category_id: string }) => r.category_id);
}

/** Replace all category assignments for a product. */
export async function syncProductCategories(productId: string, categoryIds: string[]) {
  await supabase.from('product_categories').delete().eq('product_id', productId);
  if (categoryIds.length === 0) return { error: null };
  const { error } = await supabase.from('product_categories').insert(
    categoryIds.map((cid) => ({ product_id: productId, category_id: cid }))
  );
  return { error };
}

// ── Public-facing queries ──────────────────────────────────────────────────

export type PublicProduct = Database['public']['Tables']['products']['Row'] & {
  categories?: { name: string; slug: string } | null;
};

export async function getPublicProducts(opts: {
  search?: string;
  categorySlug?: string;
  filter?: string;
  sort?: string;
} = {}) {
  let query = supabase
    .from('products')
    .select('*, categories!products_category_id_fkey(name, slug)')
    .eq('status', 'published');

  if (opts.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', opts.categorySlug)
      .maybeSingle();
    if (cat?.id) {
      const { data: junctions } = await supabase
        .from('product_categories')
        .select('product_id')
        .eq('category_id', cat.id);
      const ids = (junctions ?? []).map((j: { product_id: string }) => j.product_id);
      if (ids.length === 0) return { data: [], error: null };
      query = query.in('id', ids);
    }
  }

  if (opts.filter === 'new') query = query.eq('new_arrival', true);
  else if (opts.filter === 'bestseller') query = query.eq('bestseller', true);
  else if (opts.filter === 'sale') query = query.not('offer_price', 'is', null);

  if (opts.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (opts.sort === 'price_desc') query = query.order('price', { ascending: false });
  else if (opts.sort === 'newest') query = query.order('created_at', { ascending: false });
  else query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) return { data: [], error };

  let result = data as PublicProduct[];
  if (opts.search?.trim()) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }
  return { data: result, error: null };
}

export async function getPublicProductBySku(sku: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!products_category_id_fkey(name, slug), product_variants(*)')
    .eq('status', 'published')
    .ilike('sku', sku)
    .maybeSingle();
  return { data: data as (PublicProduct & { product_variants: Database['public']['Tables']['product_variants']['Row'][] }) | null, error };
}

export async function getNewArrivals(limit = 3) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!products_category_id_fkey(name, slug)')
    .eq('status', 'published')
    .eq('new_arrival', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: (data ?? []) as PublicProduct[], error };
}

export async function getFeaturedProducts(limit = 4) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!products_category_id_fkey(name, slug)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: (data ?? []) as PublicProduct[], error };
}

export async function getRelatedProducts(categoryId: string | null, excludeId: string, limit = 3) {
  if (!categoryId) return { data: [], error: null };
  const { data: junctions } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', categoryId);
  const ids = (junctions ?? [])
    .map((j: { product_id: string }) => j.product_id)
    .filter((id: string) => id !== excludeId);
  if (ids.length === 0) return { data: [], error: null };
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!products_category_id_fkey(name, slug)')
    .eq('status', 'published')
    .in('id', ids)
    .limit(limit);
  return { data: (data ?? []) as PublicProduct[], error };
}
