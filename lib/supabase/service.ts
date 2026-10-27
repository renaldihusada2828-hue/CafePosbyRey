import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client menggunakan service role key.
 * HANYA untuk digunakan di server-side (API routes, Server Components).
 * JANGAN import ini dari client components.
 * Bypass RLS — gunakan hanya untuk operasi yang memang butuh elevated access.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset.");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
