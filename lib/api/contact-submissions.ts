import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export async function getContactSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function updateContactSubmission(id: string, updates: Partial<ContactSubmission>) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteContactSubmission(id: string) {
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  return { error };
}
