"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, flags } from "../env";

export function getBrowserClient() {
  if (!flags.hasSupabase) return null;
  return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}
