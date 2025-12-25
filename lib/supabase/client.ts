import { createClient } from '@supabase/supabase-js';

// Fallback values for local development if env vars are missing
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iwiiesuzzgjvdhcpowdi.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_pTGj0t_VUHQpuiQZ4nFlaQ_PG_vfjvU';

export const isSupabaseConfigured = 
  !!SUPABASE_URL && 
  !!SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY !== 'PASTE_YOUR_ANON_KEY_HERE';

// Create a singleton instance
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);