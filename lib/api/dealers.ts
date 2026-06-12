import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type Dealer = Database['public']['Tables']['dealers']['Row'];
export type DealerInsert = Database['public']['Tables']['dealers']['Insert'];

export async function getDealers() {
  const { data, error } = await supabase
    .from('dealers')
    .select('*')
    .order('name', { ascending: true });
  return { data: data ?? [], error };
}

export async function upsertDealer(dealer: DealerInsert | Partial<Dealer>, id?: string) {
  if (id) {
    const { data, error } = await supabase
      .from('dealers')
      .update({ ...dealer, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase.from('dealers').insert(dealer as DealerInsert).select().single();
  return { data, error };
}

export async function deleteDealer(id: string) {
  const { error } = await supabase.from('dealers').delete().eq('id', id);
  return { error };
}
