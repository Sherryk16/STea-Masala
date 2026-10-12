"use client";

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  LoaderCircle,
  Save,
  TriangleAlert,
  CircleCheck,
  Star,
  Image as ImageIcon,
  ChevronDown,
  RotateCcw,
  Send,
  FileText,
} from "lucide-react";

import {
  savePostAction,
  uploadImageAction,
  type PostFormState,
} from "@/app/admin/post-actions";
import { IDLE_POST_STATE } from "@/app/admin/action-states";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { slugify, isValidSlug } from "@/lib/blog/slug-format";
import type { BlogPost } from "@/lib/blog/types";

const AUTOSAVE_KEY_PREFIX = "stea-masala:post-draft:";

type Fields = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  coverImage: string;
  coverAlt: string;
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
};

type Props = {
  post: BlogPost | null;
  categories: string[];
  knownTags: string[];
};

function fieldsFromPost(post: BlogPost | null): Fields {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "Masala Chai",
    tags: post?.tags.join(", ") ?? "",
    coverImage: post?.coverImage ?? "",
    coverAlt: post?.coverAlt ?? "",
    metaTitle: post?.metaTitle ?? "",
    metaDescription: post?.metaDescription ?? "",
    featured: post?.featured ?? false,
  };
}

export function PostEditor({ post, categories, knownTags }: Props) {
  const isNew = post === null;
  const draftKey = `${AUTOSAVE_KEY_PREFIX}${post?.id ?? "new"}`;

  const [state, formAction, isSaving] = useActionState<PostFormState, FormData>(
    savePostAction,
    IDLE_POST_STATE,
  );

  const [fields, setFields] = useState<Fields>(() => fieldsFromPost(post));
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft");
  const [slugIsManual, setSlugIsManual] = useState(!isNew);
  const [showSeo, setShowSeo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [restoredDraft, setRestoredDraft] = useState<Fields | null>(null);
  const [lastAutosave, setLastAutosave] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  // Written imperatively in the submit handler's onClick: React state updates
  // are not guaranteed to be committed before the browser serializes the form,
  // so the published/draft intent has to be in the DOM synchronously.
  const statusInputRef = useRef<HTMLInputElement>(null);

  const update = useCallback(<K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
  }, []);

  // Offer to restore an unsaved local draft after a refresh or crash.
  useEffect(() => {
    const stored = window.localStorage.getItem(draftKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as Fields;
      // Only offer when it actually differs from what the server has.
      if (JSON.stringify(parsed) !== JSON.stringify(fieldsFromPost(post))) {
        setRestoredDraft(parsed);
      }
    } catch {
      window.localStorage.removeItem(draftKey);
    }
    // Runs once per post.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  // Mirror every change to localStorage so work is never lost.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(draftKey, JSON.stringify(fields));
        setLastAutosave(
          new Date().toLocaleTimeString("en-PK", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        );
      } catch {
        // Storage full or blocked (private browsing): not fatal.
      }
    }, 800);

    return () => window.clearTimeout(timer);
  }, [draftKey, fields]);

  const previewSlug = useMemo(
    () => fields.slug || slugify(fields.title) || "post",
    [fields.slug, fields.title],
  );

  const slugIsValid = isValidSlug(previewSlug);

  const errorFor = (key: string) => state.errors?.[key];

  async function handleCoverUpload(file: File) {
    setIsUploadingCover(true);
    setCoverError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "covers");

      const result = await uploadImageAction(formData);

      if (result.status === "done" && result.url) {
        update("coverImage", result.url);
        if (!fields.coverAlt) update("coverAlt", fields.title || file.name);
      } else {
        setCoverError(result.message ?? "The cover image could not be uploaded.");
      }
    } catch (caught) {
      setCoverError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  function submitWithStatus(nextStatus: "draft" | "published") {
    setStatus(nextStatus);
    if (statusInputRef.current) statusInputRef.current.value = nextStatus;
  }

  const showSaved = state.status === "saved";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <Link
            href="/admin"
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
          >
            ← All posts
          </Link>
          <h1 className="font-playfair text-3xl sm:text-4xl mt-2">
            {isNew ? "New Post" : "Edit Post"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <SaveState
            isSaving={isSaving}
            showSaved={showSaved}
            state={state}
            lastAutosave={lastAutosave}
          />
        </div>
      </div>

      {restoredDraft && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/30 rounded-sm px-4 py-3 mb-6">
          <p className="text-amber-100 text-sm flex items-center gap-2">
            <RotateCcw size={15} />
            An unsaved local draft was recovered.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFields(restoredDraft);
                setRestoredDraft(null);
              }}
              className="text-xs tracking-widest uppercase text-amber-200 hover:text-white transition-colors"
            >
              Restore
            </button>
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem(draftKey);
                setRestoredDraft(null);
              }}
              className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={post?.id ?? ""} />
        <input type="hidden" name="status" defaultValue={status} ref={statusInputRef} />

        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3"
          >
            <TriangleAlert size={16} className="shrink-0 mt-0.5" />
            {state.message}
          </p>
        )}

        {/* Title ---------------------------------------------------------- */}
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            name="title"
            value={fields.title}
            onChange={(event) => {
              update("title", event.target.value);
              if (!slugIsManual) update("slug", slugify(event.target.value));
            }}
            placeholder="10 Ways to Brew the Perfect Masala Chai"
            className={errorFor("title") ? inputErrorClass : inputClass}
            maxLength={200}
          />
          {errorFor("title") && <FieldError message={errorFor("title")!} />}
        </div>

        {/* Slug ----------------------------------------------------------- */}
        <div>
          <label htmlFor="slug" className={labelClass}>
            URL slug
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center bg-black/30 border border-white/15 rounded-sm focus-within:border-[#E5A122] transition-colors">
              <span className="text-white/30 text-sm pl-3 pr-1 font-mono shrink-0">
                /blog/
              </span>
              <input
                id="slug"
                name="slug"
                value={fields.slug}
                onChange={(event) => {
                  setSlugIsManual(true);
                  update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                }}
                placeholder={slugify(fields.title) || "post-slug"}
                className="flex-1 bg-transparent py-2.5 pr-3 text-white font-mono text-sm focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSlugIsManual(false);
                update("slug", slugify(fields.title));
              }}
              className="text-xs tracking-widest uppercase text-white/50 hover:text-white border border-white/15 hover:border-white/30 rounded-sm px-4 transition-colors shrink-0"
            >
              Regenerate
            </button>
          </div>
          {errorFor("slug") ? (
            <FieldError message={errorFor("slug")!} />
          ) : !slugIsValid ? (
            <p className="text-xs text-amber-300/80 mt-1.5">
              This URL will be adjusted to a valid format when you save.
            </p>
          ) : null}
        </div>

        {/* Excerpt -------------------------------------------------------- */}
        <div>
          <label htmlFor="excerpt" className={labelClass}>
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={fields.excerpt}
            onChange={(event) => update("excerpt", event.target.value)}
            rows={2}
            placeholder="One or two sentences for the blog index and search results."
            className={`${errorFor("excerpt") ? inputErrorClass : inputClass} resize-y`}
            maxLength={400}
          />
          <p className="text-xs text-white/30 mt-1.5">
            Leave empty to generate it from the first lines of your post.
          </p>
        </div>

        {/* Cover image ---------------------------------------------------- */}
        <div>
          <span className={labelClass}>Cover image</span>

          {fields.coverImage ? (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fields.coverImage}
                alt={fields.coverAlt || "Cover preview"}
                className="w-full sm:w-56 h-32 object-cover rounded-sm border border-white/15"
              />
              <div className="flex-1 space-y-3">
                <input
                  type="hidden"
                  name="coverImage"
                  value={fields.coverImage}
                  readOnly
                />
                <div>
                  <label htmlFor="coverAlt" className="text-xs text-white/50 block mb-1.5">
                    Alt text
                  </label>
                  <input
                    id="coverAlt"
                    name="coverAlt"
                    value={fields.coverAlt}
                    onChange={(event) => update("coverAlt", event.target.value)}
                    placeholder="Describe the image for screen readers"
                    className={inputClass}
                    maxLength={200}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update("coverImage", "")}
                  className="text-xs tracking-widest uppercase text-red-300/80 hover:text-red-300 transition-colors"
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-white/20 rounded-sm p-6 text-center">
              <ImageIcon size={22} className="mx-auto text-white/25 mb-3" />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors disabled:opacity-50"
              >
                {isUploadingCover ? (
                  <>
                    <LoaderCircle size={14} className="animate-spin" />
                    Uploading
                  </>
                ) : (
                  "Upload cover image"
                )}
              </button>
              <p className="text-xs text-white/25 mt-3">JPEG, PNG, WebP, GIF or AVIF · up to 8MB</p>
            </div>
          )}

          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleCoverUpload(file);
              event.target.value = "";
            }}
          />

          {coverError && (
            <p role="alert" className="text-xs text-red-300 mt-2">
              {coverError}
            </p>
          )}
        </div>

        {/* Body ----------------------------------------------------------- */}
        <div>
          <span className={labelClass}>Content</span>
          <RichTextEditor
            name="content"
            defaultValue={fields.content}
            onChange={(html) => update("content", html)}
            key={post?.id ?? "new"}
          />
        </div>

        {/* Taxonomy ------------------------------------------------------- */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input
              id="category"
              name="category"
              value={fields.category}
              onChange={(event) => update("category", event.target.value)}
              list="category-options"
              className={inputClass}
              maxLength={60}
            />
            <datalist id="category-options">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="tags" className={labelClass}>
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              value={fields.tags}
              onChange={(event) => update("tags", event.target.value)}
              list="tag-options"
              placeholder="chai, recipe, cardamom"
              className={errorFor("tags") ? inputErrorClass : inputClass}
            />
            <datalist id="tag-options">
              {knownTags.map((tag) => (
                <option key={tag} value={tag} />
              ))}
            </datalist>
            {errorFor("tags") ? (
              <FieldError message={errorFor("tags")!} />
            ) : (
              <p className="text-xs text-white/30 mt-1.5">Separate with commas. Up to 12.</p>
            )}
          </div>
        </div>

        {/* Featured ------------------------------------------------------- */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="featured"
            checked={fields.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="w-4 h-4 accent-[#E5A122]"
          />
          <Star
            size={15}
            className={fields.featured ? "text-[#E5A122]" : "text-white/30 group-hover:text-white/60"}
          />
          <span className="text-sm text-white/70">
            Feature this post at the top of the blog
          </span>
        </label>

        {/* SEO ------------------------------------------------------------ */}
        <div className="border border-white/10 rounded-sm">
          <button
            type="button"
            onClick={() => setShowSeo((open) => !open)}
            aria-expanded={showSeo}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs tracking-widest uppercase text-white/60">
              Search engine preview
            </span>
            <ChevronDown
              size={16}
              className={`text-white/40 transition-transform ${showSeo ? "rotate-180" : ""}`}
            />
          </button>

          {showSeo && (
            <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
              <div className="space-y-1">
                <p className="text-emerald-400/90 text-lg truncate">
                  {fields.metaTitle || fields.title || "Your post title"}
                </p>
                <p className="text-[#7BA7F0] text-sm truncate">
                  steamasala.com/blog/{previewSlug}
                </p>
                <p className="text-white/45 text-sm line-clamp-2">
                  {fields.metaDescription ||
                    fields.excerpt ||
                    "Your excerpt or the start of your post appears here."}
                </p>
              </div>

              <div>
                <label htmlFor="metaTitle" className={labelClass}>
                  Meta title
                </label>
                <input
                  id="metaTitle"
                  name="metaTitle"
                  value={fields.metaTitle}
                  onChange={(event) => update("metaTitle", event.target.value)}
                  placeholder={fields.title || "Defaults to the post title"}
                  className={inputClass}
                  maxLength={70}
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className={labelClass}>
                  Meta description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={fields.metaDescription}
                  onChange={(event) => update("metaDescription", event.target.value)}
                  rows={2}
                  placeholder={fields.excerpt || "Defaults to the excerpt"}
                  className={`${inputClass} resize-y`}
                  maxLength={180}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit bar ----------------------------------------------------- */}
        <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#1a0a00]/95 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            onClick={() => submitWithStatus("draft")}
            disabled={isSaving}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-colors disabled:opacity-50"
          >
            <FileText size={15} />
            Save as draft
          </button>

          <button
            type="submit"
            onClick={() => submitWithStatus("published")}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] text-white px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(198,40,40,0.3)]"
          >
            {isSaving ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : status === "published" ? (
              <Save size={15} />
            ) : (
              <Send size={15} />
            )}
            {status === "published" ? "Update post" : "Publish"}
          </button>

          {post && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors ml-auto"
            >
              Preview
            </Link>
          )}
        </div>
      </form>
    </>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

const labelClass = "block text-xs tracking-widest uppercase text-white/60 mb-2";

const inputClass =
  "w-full bg-black/30 border border-white/15 rounded-sm px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#E5A122] focus:ring-1 focus:ring-[#E5A122] transition-colors";

const inputErrorClass = `${inputClass} border-red-500/50 focus:border-red-400 focus:ring-red-400`;

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-xs text-red-300 mt-1.5 flex items-center gap-1.5">
      <TriangleAlert size={12} />
      {message}
    </p>
  );
}

function SaveState({
  isSaving,
  showSaved,
  state,
  lastAutosave,
}: {
  isSaving: boolean;
  showSaved: boolean;
  state: PostFormState;
  lastAutosave: string | null;
}) {
  if (isSaving) {
    return (
      <span className="flex items-center gap-2 text-xs text-white/50">
        <LoaderCircle size={14} className="animate-spin" />
        Saving
      </span>
    );
  }

  if (showSaved) {
    return (
      <span className="flex items-center gap-2 text-xs text-emerald-300">
        <CircleCheck size={14} />
        Saved
        {state.slug && <span className="text-white/40 font-mono">/blog/{state.slug}</span>}
      </span>
    );
  }

  if (state.status === "error") {
    return (
      <span className="flex items-center gap-2 text-xs text-red-300">
        <TriangleAlert size={14} />
        Not saved
      </span>
    );
  }

  if (lastAutosave) {
    return <span className="text-xs text-white/30">Draft backed up {lastAutosave}</span>;
  }

  return null;
}