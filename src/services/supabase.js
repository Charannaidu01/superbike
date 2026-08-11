import { createClient } from '@supabase/supabase-js';

// Safe browser-side Supabase credentials. For GitHub Pages, these are injected
// during the GitHub Actions build from repository secrets.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const isLiveSupabase = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isLiveSupabase
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project build environment.'
    );
  }
  return supabase;
}
