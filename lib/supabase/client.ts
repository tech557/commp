import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURATION: 
 * Paste your Supabase credentials here if environment variables are not working.
 */
const SUPABASE_URL = 'https://iwiiesuzzgjvdhcpowdi.supabase.co';

// PASTE YOUR ANON KEY BELOW (from Supabase Project Settings > API)
const SUPABASE_ANON_KEY = 'sb_publishable_pTGj0t_VUHQpuiQZ4nFlaQ_PG_vfjvU';

/**
 * Robustly fetch environment variables with fallback to hardcoded values.
 */
const getEnv = (key: string): string => {
  // @ts-ignore
  return process.env[key] || (import.meta as any).env?.[key] || '';
};

const finalUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || SUPABASE_URL;
const finalKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY;

// Check if the key is still the default placeholder
export const isSupabaseConfigured = 
  !!finalUrl && 
  !!finalKey && 
  finalKey !== 'PASTE_YOUR_ANON_KEY_HERE' && 
  finalUrl !== 'https://placeholder.supabase.co';

// Always initialize to prevent "reading auth of null" errors
// We use a fallback key to ensure the client object is created
export const supabase = createClient(
  finalUrl || 'https://placeholder.supabase.co',
  finalKey || 'placeholder'
);

if (!isSupabaseConfigured) {
  console.warn('Supabase is using placeholder credentials. Please update lib/supabase/client.ts with your actual Anon Key.');
}
