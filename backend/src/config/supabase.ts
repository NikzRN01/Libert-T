import { createClient } from '@supabase/supabase-js';
import { config } from './env';

// Client for user operations (uses anon key)
export const supabase = createClient(
    config.supabase.url,
    config.supabase.anonKey
);

// Admin client for privileged operations (uses service key)
export const supabaseAdmin = createClient(
    config.supabase.url,
    config.supabase.serviceKey
);

export default supabase;
