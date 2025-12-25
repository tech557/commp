import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iwiiesuzzgjvdhcpowdi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pTGj0t_VUHQpuiQZ4nFlaQ_PG_vfjvU';

// Environment variables fallback for robustness
const finalUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || SUPABASE_URL;
const finalKey = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || SUPABASE_ANON_KEY;

export const isSupabaseConfigured = 
  !!finalUrl && 
  !!finalKey && 
  finalKey !== 'PASTE_YOUR_ANON_KEY_HERE';

export const supabase = createClient(
  finalUrl,
  finalKey
);