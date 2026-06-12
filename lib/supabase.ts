import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Same instance — ensures API functions always share the auth session set by the auth context.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as ReturnType<typeof createClient<any>>;
