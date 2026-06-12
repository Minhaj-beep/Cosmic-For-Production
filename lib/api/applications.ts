import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type Application = Database['public']['Tables']['applications']['Row'] & {
  vacancies?: { title: string } | null;
};
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

export async function getApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*, vacancies(title)')
    .order('applied_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function updateApplication(id: string, updates: Partial<Application>) {
  const { data, error } = await supabase
    .from('applications')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteApplication(id: string) {
  const { error } = await supabase.from('applications').delete().eq('id', id);
  return { error };
}

export async function submitApplication(app: ApplicationInsert) {
  const { data, error } = await supabase.from('applications').insert(app).select().single();
  return { data, error };
}
