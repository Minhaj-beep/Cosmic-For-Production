import { db as supabase } from '../supabase';
import type { Database } from '../database.types';

export type MediaItem = Database['public']['Tables']['media_library']['Row'];

export async function getMediaItems() {
  const { data, error } = await supabase
    .from('media_library')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data ?? [], error };
}

export async function uploadMedia(file: File, uploadedBy: string): Promise<{ item: MediaItem | null; error: string | null }> {
  const ext = file.name.split('.').pop();
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
  if (uploadError) return { item: null, error: uploadError.message };

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);

  const { data, error } = await supabase
    .from('media_library')
    .insert({
      name: file.name,
      url: urlData.publicUrl,
      storage_path: path,
      type: file.type.startsWith('video') ? 'video' : 'image',
      size_bytes: file.size,
      used_in: [],
      uploaded_by: uploadedBy,
    })
    .select()
    .single();

  return { item: data, error: error?.message ?? null };
}

export async function deleteMedia(id: string, storagePath: string) {
  await supabase.storage.from('media').remove([storagePath]);
  const { error } = await supabase.from('media_library').delete().eq('id', id);
  return { error };
}
