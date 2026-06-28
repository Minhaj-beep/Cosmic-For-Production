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

// ── Public-facing queries ──────────────────────────────────────────────────

export async function getPublicVacancies() {
  const { data, error } = await supabase
    .from('vacancies')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  return { data: (data ?? []) as Vacancy[], error };
}

export async function uploadResumeFile(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop() ?? 'pdf';
  const path = `resumes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file);
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function submitApplication(application: {
  vacancy_id: string | null;
  name: string;
  email: string;
  phone: string;
  experience: string;
  cover_letter: string;
  resume_url: string;
}) {
  // Save the application
  const { error } = await supabase
    .from("applications")
    .insert({
      ...application,
      notes: "",
    });

  if (error) {
    return { error };
  }

  // Get vacancy title (public read)
  let vacancyTitle = "General Application";

  if (application.vacancy_id) {
    const { data: vacancy } = await supabase
      .from("vacancies")
      .select("title")
      .eq("id", application.vacancy_id)
      .single();

    if (vacancy) {
      vacancyTitle = vacancy.title;
    }
  }

  // Send notification email
  const { error: functionError } = await supabase.functions.invoke(
    "send-notification",
    {
      body: {
        type: "job_application",
        data: {
          ...application,
          notes: "",
          vacancy_title: vacancyTitle,
        },
      },
    }
  );

  if (functionError) {
    console.error("Failed to send notification:", functionError);
  }

  return { error: null };
}