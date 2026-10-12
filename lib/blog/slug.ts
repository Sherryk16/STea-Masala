import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase";
import { MAX_SLUG_LENGTH, slugify } from "@/lib/blog/slug-format";

export { isValidSlug, slugify, SLUG_PATTERN, MAX_SLUG_LENGTH } from "@/lib/blog/slug-format";

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();

  let query = supabase.from("blog_posts").select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);

  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(`Could not verify slug availability: ${error.message}`);

  return data !== null;
}

/**
 * Returns `desired` if it is free, otherwise appends -2, -3, ... until free.
 */
export async function uniqueSlug(desired: string, excludeId?: string): Promise<string> {
  const base = slugify(desired);
  if (!(await slugExists(base, excludeId))) return base;

  for (let suffix = 2; suffix <= 100; suffix++) {
    const tail = `-${suffix}`;
    const candidate = `${base.slice(0, MAX_SLUG_LENGTH - tail.length)}${tail}`;
    if (!(await slugExists(candidate, excludeId))) return candidate;
  }

  return `${base.slice(0, MAX_SLUG_LENGTH - 13)}-${Date.now() % 1000000}`;
}