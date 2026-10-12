/**
 * Slug formatting. Pure and dependency-free so it can run in both the browser
 * (live slug preview in the editor) and on the server (canonical slug on save).
 *
 * Keep this file free of server-only imports and environment access.
 */

const MAX_SLUG_LENGTH = 80;

/**
 * Letters that NFD cannot decompose, so they need an explicit replacement.
 * Everything else (é, ñ, ü, ...) is handled by stripping combining diacritics.
 */
const TRANSLITERATIONS: Record<string, string> = {
  æ: "ae", œ: "oe", ß: "ss", đ: "d", ð: "d", ø: "o", ł: "l", þ: "th", ħ: "h", ı: "i",
  "&": "and", "@": "at", "+": "plus",
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export { MAX_SLUG_LENGTH };

export function isValidSlug(value: string): boolean {
  return value.length > 0 && value.length <= MAX_SLUG_LENGTH && SLUG_PATTERN.test(value);
}

/**
 * Converts arbitrary text into a URL-safe slug, matching the SQL CHECK
 * constraint on `blog_posts.slug` so the result is always storable.
 *
 * "Ginger & Cardamom Chai" -> "ginger-and-cardamom-chai"
 */
export function slugify(input: string): string {
  const folded = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  let transliterated = "";
  for (const character of folded) {
    transliterated += TRANSLITERATIONS[character] ?? character;
  }

  const slug = transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "");

  return slug || "post";
}