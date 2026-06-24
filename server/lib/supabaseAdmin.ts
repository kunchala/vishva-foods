// =============================================================
// VISHVA FOODS — Supabase admin client (server only)
// Uses the SERVICE ROLE key, which bypasses RLS. This must NEVER
// be imported into client code. Guest checkout works because the
// server writes orders with this client.
// Returns null if not configured so the app degrades gracefully.
// =============================================================
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (client) return client;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
