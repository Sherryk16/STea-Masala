"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { readAdminSession } from "@/lib/dal";
import { isSupabaseConfigured, getStorageBucket, getSupabaseAdmin } from "@/lib/supabase";
import {
  createPost,
  deletePost,
  getAdminPostById,
  isUuid,
  updatePost,
} from "@/lib/blog/posts";
import { isAllowedImageUrl } from "@/lib/blog/sanitize";
import { isValidSlug, SLUG_PATTERN } from "@/lib/blog/slug";
import type { BlogPost, BlogPostStatus } from "@/lib/blog/types";

export type PostFormState = {
  status: "idle" | "saved" | "error";
  message?: string;
  /** Field-level messages keyed by form field name. */
  errors?: Record<string, string>;
  /** Echoed back so the client can show the generated slug after a save. */
  slug?: string;
};

const LIMITS = {
  title: 200,
  excerpt: 400,
  content: 400_000,
  category: 60,
  author: 80,
  slug: 80,
  coverAlt: 200,
  metaTitle: 70,
  metaDescription: 180,
  tags: 12,
} as const;

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Unauthorised callers get a thrown error, never a redirect to the login page. */
async function requireSession(): Promise<void> {
  const session = await readAdminSession();
  if (!session) throw new Error("Unauthorized: your session has expired.");
}

function text(formData: FormData, key: string, limit: number): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, limit);
}

function parseTags(raw: string): string[] {
  return [...new Set(raw.split(",").map((tag) => tag.trim()).filter(Boolean))];
}

/**
 * Reads and validates the whole post form. Returns either the normalised input
 * or a map of field errors.
 */
function readPostForm(formData: FormData) {
  const errors: Record<string, string> = {};

  const title = text(formData, "title", LIMITS.title);
  if (!title) {
    errors.title = "A title is required.";
  } else if (title.length < 3) {
    errors.title = "Use at least 3 characters.";
  }

  const slugInput = text(formData, "slug", LIMITS.slug + 20);
  if (slugInput && !isValidSlug(slugInput)) {
    errors.slug =
      "Use lowercase letters, numbers and single hyphens only (for example: masala-chai-recipe).";
  }

  const content = text(formData, "content", LIMITS.content);
  const excerpt = text(formData, "excerpt", LIMITS.excerpt);
  const category = text(formData, "category", LIMITS.category);
  const author = text(formData, "author", LIMITS.author);
  const metaTitle = text(formData, "metaTitle", LIMITS.metaTitle);
  const metaDescription = text(formData, "metaDescription", LIMITS.metaDescription);
  const coverAlt = text(formData, "coverAlt", LIMITS.coverAlt);

  const rawStatus = text(formData, "status", 20);
  const status: BlogPostStatus = rawStatus === "published" ? "published" : "draft";

  const tags = parseTags(text(formData, "tags", 500));
  if (tags.length > LIMITS.tags) {
    errors.tags = `Use at most ${LIMITS.tags} tags.`;
  }

  // Empty string means "no cover image".
  const coverImageInput = text(formData, "coverImage", 2000);
  if (coverImageInput && !isAllowedImageUrl(coverImageInput)) {
    errors.coverImage = "The cover image must be an uploaded file or an image on this site.";
  }

  if (Object.keys(errors).length > 0) return { errors, input: null };

  return {
    errors,
    input: {
      title,
      slug: slugInput || undefined,
      excerpt,
      content,
      category,
      author,
      status,
      tags,
      featured: formData.get("featured") === "on" || formData.get("featured") === "true",
      coverImage: coverImageInput || null,
      coverAlt: coverAlt || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
    },
  };
}

function revalidateBlog(slug?: string): void {
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

/**
 * Creates or updates a post. `id` in the form data decides which.
 */
export async function savePostAction(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireSession();

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "Supabase is not configured yet, so posts cannot be saved.",
    };
  }

  const id = text(formData, "id", 40);
  const { errors, input } = readPostForm(formData);

  if (!input) return { status: "error", message: "Please fix the highlighted fields.", errors };

  try {
    let post: BlogPost;

    if (id) {
      if (!isUuid(id)) return { status: "error", message: "Invalid post id." };
      post = await updatePost(id, input);
    } else {
      post = await createPost(input);
    }

    revalidateBlog(post.slug);
    return { status: "saved", slug: post.slug };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save the post.";

    // Surface unique-slug conflicts as a field error instead of a dead end.
    if (/slug|duplicate key/i.test(message)) {
      return { status: "error", errors: { slug: "That URL slug is already taken." } };
    }

    return { status: "error", message };
  }
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = text(formData, "id", 40);
  if (!isUuid(id)) throw new Error("Invalid post id.");

  // Capture the slug first so its cached page can be invalidated.
  const existing = await getAdminPostById(id);

  await deletePost(id);
  revalidateBlog(existing?.slug);

  redirect("/admin");
}

/**
 * Flips a post between draft and published without opening the editor.
 */
export async function togglePostStatusAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = text(formData, "id", 40);
  if (!isUuid(id)) throw new Error("Invalid post id.");

  const post = await getAdminPostById(id);
  if (!post) throw new Error("Post not found.");

  const nextStatus: BlogPostStatus = post.status === "published" ? "draft" : "published";

  await updatePost(id, {
    title: post.title,
    status: nextStatus,
    slug: post.slug,
  });

  revalidateBlog(post.slug);
}

// ---------------------------------------------------------------------------
// Image upload
// ---------------------------------------------------------------------------

export type UploadState = {
  status: "idle" | "uploading" | "done" | "error";
  url?: string;
  message?: string;
};

function safeFileName(originalName: string): string {
  const withoutExtension = originalName.replace(/\.[^./\\]+$/, "");
  const base = withoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const extension = (originalName.match(/\.([a-z0-9]+)$/i)?.[1] ?? "jpg").toLowerCase();
  return `${base || "image"}.${extension.replace(/[^a-z0-9]/g, "") || "jpg"}`;
}

/**
 * Stores an image in the Supabase `blog` bucket and returns its public URL.
 * Invoked directly from the editor, so it returns a result instead of
 * redirecting.
 */
export async function uploadImageAction(formData: FormData): Promise<UploadState> {
  await requireSession();

  if (!isSupabaseConfigured) {
    return { status: "error", message: "Supabase is not configured yet." };
  }

  const file = formData.get("file");
  const folder = text(formData, "folder", 24) || "content";

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose an image to upload." };
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return {
      status: "error",
      message: "Use a JPEG, PNG, WebP, GIF or AVIF image.",
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { status: "error", message: "Images must be 8MB or smaller." };
  }

  // Only allow a fixed set of folder names, and always nest under a folder so
  // it can never overwrite an existing object at the bucket root.
  const safeFolder = /^[a-z0-9-]{1,24}$/.test(folder) ? folder : "content";
  const objectPath = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileName(file.name)}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await getSupabaseAdmin()
    .storage.from(getStorageBucket())
    .upload(objectPath, buffer, {
      contentType: file.type,
      cacheControl: "31536000", // one year, uploads are content-addressed by name
      upsert: false,
    });

  if (error) {
    return { status: "error", message: `Upload failed: ${error.message}` };
  }

  const { data } = getSupabaseAdmin().storage.from(getStorageBucket()).getPublicUrl(objectPath);

  return { status: "done", url: data.publicUrl };
}

/**
 * Server helper the editor uses to turn a pasted YouTube/Vimeo URL into a
 * privacy-friendly embed URL. Runs server-side so the allow-list logic stays
 * in one place with the sanitizer.
 */
export async function toEmbedUrlAction(rawUrl: string): Promise<string | null> {
  await requireSession();

  if (typeof rawUrl !== "string" || !rawUrl.trim()) return null;

  const { toEmbedUrl } = await import("@/lib/blog/video");
  return toEmbedUrl(rawUrl.trim());
}

/** Re-exported so the editor can validate slugs client-side too. */
export async function checkSlugAction(slug: string): Promise<boolean> {
  await requireSession();
  return SLUG_PATTERN.test(slug) && isValidSlug(slug);
}