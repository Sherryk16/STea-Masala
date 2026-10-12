import "server-only";

import { getSupabaseAdmin, getSupabasePublic, isSupabaseConfigured } from "@/lib/supabase";
import { htmlToPlainText, readingTimeMinutes, sanitizeHtml } from "@/lib/blog/sanitize";
import { slugify, uniqueSlug } from "@/lib/blog/slug";
import type { BlogPost, BlogPostInput, BlogPostStatus, BlogPostSummary } from "@/lib/blog/types";

/** Raw row as returned by PostgREST. */
type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  status: BlogPostStatus | null;
  featured: boolean | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const SUMMARY_COLUMNS =
  "id, title, slug, excerpt, cover_image, cover_alt, category, tags, featured, published_at";

function toPost(row: PostRow): BlogPost {
  const excerpt = row.excerpt ?? "";

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt,
    content: row.content ?? "",
    coverImage: row.cover_image,
    coverAlt: row.cover_alt ?? row.title,
    author: row.author?.trim() || "Stea Masala",
    category: row.category?.trim() || "Masala Chai",
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status === "published" ? "published" : "draft",
    featured: row.featured === true,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSummary(row: PostRow): BlogPostSummary {
  const post = toPost(row);
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    coverAlt: post.coverAlt,
    category: post.category,
    tags: post.tags,
    featured: post.featured,
    publishedAt: post.publishedAt,
  };
}

/**
 * Display-ready excerpt: falls back to the body when none was written.
 * Accepts a summary (index pages) or a full post (detail page).
 */
export function resolveExcerpt(post: {
  excerpt: string;
  content?: string | null;
}): string {
  if (post.excerpt.trim()) return post.excerpt.trim();
  return htmlToPlainText(post.content ?? "", 180);
}

export function postReadingTime(post: Pick<BlogPost, "content" | "excerpt">): number {
  return readingTimeMinutes(htmlToPlainText(post.content || post.excerpt));
}

// ---------------------------------------------------------------------------
// Public reads (anon key + Row Level Security)
// ---------------------------------------------------------------------------

export type PublishedPostsQuery = {
  limit?: number;
  offset?: number;
  category?: string;
  tag?: string;
};

/**
 * Published posts, newest first. Returns an empty list when Supabase has not
 * been configured yet so that `next build` still succeeds.
 */
export async function listPublishedPostsPaged({
  limit = 12,
  offset = 0,
  category,
  tag,
}: PublishedPostsQuery = {}): Promise<{ posts: BlogPostSummary[]; total: number }> {
  if (!isSupabaseConfigured) return { posts: [], total: 0 };

  // `count: "exact"` returns the total alongside the page in a single request.
  let query = getSupabasePublic()
    .from("blog_posts")
    .select(SUMMARY_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq("category", category);
  if (tag) query = query.contains("tags", [tag]);

  const { data, count, error } = await query;
  if (error) throw new Error(`Could not load blog posts: ${error.message}`);

  return { posts: (data as PostRow[]).map(toSummary), total: count ?? 0 };
}

export async function listPublishedPosts(
  options: PublishedPostsQuery = {},
): Promise<BlogPostSummary[]> {
  const { posts } = await listPublishedPostsPaged(options);
  return posts;
}

/** Single published post, or null. RLS hides drafts and unpublished posts. */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await getSupabasePublic()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) throw new Error(`Could not load "${slug}": ${error.message}`);
  return data ? toPost(data as PostRow) : null;
}

/** Posts highlighted on the blog index and the home page. */
export async function listFeaturedPosts(limit = 3): Promise<BlogPostSummary[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabasePublic()
    .from("blog_posts")
    .select(SUMMARY_COLUMNS)
    .eq("status", "published")
    .eq("featured", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Could not load featured posts: ${error.message}`);
  return (data as PostRow[]).map(toSummary);
}

/** Same category first, then shared tags, excluding the post itself. */
export async function listRelatedPosts(
  post: Pick<BlogPost, "id" | "category" | "tags">,
  limit = 3,
): Promise<BlogPostSummary[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabasePublic()
    .from("blog_posts")
    .select(SUMMARY_COLUMNS)
    .eq("status", "published")
    .neq("id", post.id)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit * 3);

  if (error) throw new Error(`Could not load related posts: ${error.message}`);

  const candidates = (data as PostRow[]).map(toSummary);

  const scored = candidates
    .map((candidate) => {
      let score = 0;
      if (candidate.category === post.category) score += 2;
      score += candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ candidate }) => candidate);
}

/** Distinct categories and tags across published posts, for filter chips. */
export async function listPublishedFacets(): Promise<{ categories: string[]; tags: string[] }> {
  if (!isSupabaseConfigured) return { categories: [], tags: [] };

  const { data, error } = await getSupabasePublic()
    .from("blog_posts")
    .select("category, tags")
    .eq("status", "published")
    .not("published_at", "is", null)
    .limit(1000);

  if (error) throw new Error(`Could not load blog facets: ${error.message}`);

  const categories = new Set<string>();
  const tags = new Set<string>();

  for (const row of data as Pick<PostRow, "category" | "tags">[]) {
    if (row.category) categories.add(row.category);
    for (const tag of row.tags ?? []) if (tag) tags.add(tag);
  }

  const byName = (values: Set<string>) => [...values].sort((a, b) => a.localeCompare(b));
  return { categories: byName(categories), tags: byName(tags) };
}

/** Slugs for sitemap.xml. */
export async function listPublishedSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabasePublic()
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) throw new Error(`Could not load blog slugs: ${error.message}`);

  return (data as Array<{ slug: string; updated_at: string }>).map((row) => ({
    slug: row.slug,
    updatedAt: row.updated_at,
  }));
}

// ---------------------------------------------------------------------------
// Admin reads (service role key)
// ---------------------------------------------------------------------------

export async function listAdminPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Could not load posts: ${error.message}`);
  return (data as PostRow[]).map(toPost);
}

export async function getAdminPostById(id: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null;
  if (!isUuid(id)) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load post: ${error.message}`);
  return data ? toPost(data as PostRow) : null;
}

export async function getAdminPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Could not load post: ${error.message}`);
  return data ? toPost(data as PostRow) : null;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---------------------------------------------------------------------------
// Admin writes (service role key)
// ---------------------------------------------------------------------------

function buildRow(input: BlogPostInput, existing?: BlogPost | null) {
  const content = sanitizeHtml(input.content ?? "");
  const status: BlogPostStatus = input.status === "published" ? "published" : "draft";

  const tags = Array.isArray(input.tags)
    ? [...new Set(input.tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 12)
    : existing?.tags ?? [];

  // published_at is set the first time a post goes live and preserved after,
  // so re-saving a published post never bumps it back to the top of the feed.
  const publishedAt =
    status === "published" ? (existing?.publishedAt ?? new Date().toISOString()) : null;

  return {
    title: input.title.trim(),
    excerpt: (input.excerpt ?? existing?.excerpt ?? "").trim(),
    content,
    cover_image: input.coverImage ?? existing?.coverImage ?? null,
    cover_alt: (input.coverAlt ?? existing?.coverAlt ?? "").trim() || null,
    author: input.author?.trim() || existing?.author || "Stea Masala",
    category: input.category?.trim() || existing?.category || "Masala Chai",
    tags,
    status,
    featured: input.featured ?? existing?.featured ?? false,
    meta_title: (input.metaTitle ?? existing?.metaTitle ?? "").trim() || null,
    meta_description: (input.metaDescription ?? existing?.metaDescription ?? "").trim() || null,
    published_at: publishedAt,
  };
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const row = buildRow(input);
  const slug = await uniqueSlug(input.slug || row.title);

  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .insert({ ...row, slug })
    .select("*")
    .single();

  if (error) throw new Error(`Could not create post: ${error.message}`);
  return toPost(data as PostRow);
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost> {
  const existing = await getAdminPostById(id);
  if (!existing) throw new Error("Post not found.");

  const row = buildRow(input, existing);
  // Keeps the current slug unless the author supplied a different one.
  const slug =
    input.slug && slugify(input.slug) !== existing.slug
      ? await uniqueSlug(input.slug, id)
      : existing.slug;

  const { data, error } = await getSupabaseAdmin()
    .from("blog_posts")
    .update({ ...row, slug })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`Could not save post: ${error.message}`);
  return toPost(data as PostRow);
}

export async function deletePost(id: string): Promise<void> {
  if (!isUuid(id)) throw new Error("Invalid post id.");

  const { error } = await getSupabaseAdmin().from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(`Could not delete post: ${error.message}`);
}