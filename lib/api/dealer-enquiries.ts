import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type DealerEnquiry = Database['public']['Tables']['dealer_enquiries']['Row'];

export async function getDealerEnquiries() {
  const { data, error } = await supabase
    .from('dealer_enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function updateDealerEnquiry(id: string, updates: Partial<DealerEnquiry>) {
  const { data, error } = await supabase
    .from('dealer_enquiries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteDealerEnquiry(id: string) {
  const { error } = await supabase.from('dealer_enquiries').delete().eq('id', id);
  return { error };
}

export async function submitDealerEnquiry(enquiry: Database['public']['Tables']['dealer_enquiries']['Insert']) {
  const { data, error } = await supabase.from('dealer_enquiries').insert(enquiry).select().single();
  return { data, error };
}
