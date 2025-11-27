// lib/blog/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail fast in build se manca configurazione
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL o ANON KEY non configurati (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
  );
}

// Nessun generic → tipi "larghi" ma niente errori TS/insert
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
