import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, flags } from "../env";

// Service-role client used inside API routes & background jobs.
// NEVER import this into a client component.
let _admin: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  if (!flags.hasSupabase) return null;
  if (_admin) return _admin;
  _admin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  return _admin;
}

export function requireServiceClient(): SupabaseClient {
  const c = getServiceClient();
  if (!c) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return c;
}
