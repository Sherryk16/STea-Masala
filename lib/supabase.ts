import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const MISSING_ENV_VARS = [
  !PROJECT_URL && "NEXT_PUBLIC_SUPABASE_URL",
  !ANON_KEY && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  !SERVICE_ROLE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
].filter(Boolean) as string[];

export const isSupabaseConfigured = MISSING_ENV_VARS.length === 0;

export function getStorageBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET?.trim() || "blog";
}

function missingEnvError(): Error {
  return new Error(
    `Supabase is not configured. Missing environment variable(s): ${MISSING_ENV_VARS.join(
      ", ",
    )}. Copy .env.example to .env.local and fill in your project values.`,
  );
}

/**
 * Read-only client for public pages. Relies on Row Level Security, so it can
 * only ever see published posts.
 */
export function getSupabasePublic(): SupabaseClient {
  if (!PROJECT_URL || !ANON_KEY) throw missingEnvError();

  return createClient(PROJECT_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Privileged client used by the admin panel only. Bypasses RLS, so it must
 * never be reachable from a Client Component or a public route.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!PROJECT_URL || !SERVICE_ROLE_KEY) throw missingEnvError();

  return createClient(PROJECT_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}