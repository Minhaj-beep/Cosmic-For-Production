import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type Vacancy = Database['public']['Tables']['vacancies']['Row'];
export type VacancyInsert = Database['public']['Tables']['vacancies']['Insert'];

export async function getVacancies() {
  const { data, error } = await supabase
    .from('vacancies')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function upsertVacancy(vacancy: VacancyInsert, id?: string) {
  if (id) {
    const { data, error } = await supabase
      .from('vacancies')
      .update({ ...vacancy, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }
  const { data, error } = await supabase.from('vacancies').insert(vacancy).select().single();
  return { data, error };
}

export async function deleteVacancy(id: string) {
  const { error } = await supabase.from('vacancies').delete().eq('id', id);
  return { error };
}
