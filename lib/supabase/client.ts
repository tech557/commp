import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iwiiesuzzgjvdhcpowdi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pTGj0t_VUHQpuiQZ4nFlaQ_PG_vfjvU';

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || '';
  }
  return '';
};

const finalUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || SUPABASE_URL;
const finalKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY;

export const isSupabaseConfigured = 
  !!finalUrl && 
  !!finalKey && 
  finalKey !== 'PASTE_YOUR_ANON_KEY_HERE';

export const supabase = createClient(
  finalUrl || 'https://placeholder.supabase.co',
  finalKey || 'placeholder'
);