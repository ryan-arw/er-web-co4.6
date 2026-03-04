import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

// NOTE: This key should only be used in Server Components or API Routes
// NEVER expose this to the client (it bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing from environment variables. Backend updates may fail due to RLS.');
}

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    }
);
