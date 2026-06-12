import { db as supabase } from '../supabase';

export async function getSetting(key: string): Promise<string | null> {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  return data?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const { data } = await supabase.from('site_settings').select('key, value');
  if (!data) return {};
  return Object.fromEntries(data.map((row) => [row.key, row.value]));
}

export async function setSetting(key: string, value: string) {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return { error };
}

export async function setSettings(updates: Record<string, string>) {
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' });
  return { error };
}
