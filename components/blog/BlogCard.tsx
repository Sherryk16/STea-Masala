import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";

import { formatShortDate } from "@/lib/blog/format";
import type { BlogPostSummary } from "@/lib/blog/types";

type Props = {
  post: BlogPostSummary;
  priority?: boolean;
};

export function BlogCard({ post, priority = false }: Props) {
  return (
    <article className="group relative flex flex-col bg-white/60 border border-[#D4A017]/15 rounded-sm overflow-hidden hover:border-[#D4A017]/40 transition-colors">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f0e8dd]">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#D4A017]/15 to-[#9B6322]/15">
            <span className="font-playfair text-4xl text-[#9B6322]/40">SM</span>
          </div>
        )}

        {post.featured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-[#1a0a00]/85 text-[#E5A122] text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm">
            <Star size={10} />
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-3 text-[11px] tracking-widest uppercase text-[#9B6322] mb-3">
          <span>{post.category}</span>
          {post.publishedAt && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#D4A017]/60" aria-hidden />
              <time dateTime={post.publishedAt} className="text-[#1F140D]/40">
                {formatShortDate(post.publishedAt)}
              </time>
            </>
          )}
        </div>

        <h3 className="font-playfair text-xl sm:text-2xl leading-snug mb-3 group-hover:text-[#9B6322] transition-colors">
          {/* Stretched link makes the whole card clickable while keeping one
              focusable link for screen readers and keyboards. */}
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        <p className="text-sm text-[#1F140D]/60 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-[#1F140D]/40">
          {post.tags.length > 0 ? (
            <span className="truncate pr-2">{post.tags.slice(0, 3).join(" · ")}</span>
          ) : (
            <span />
          )}
          <ArrowUpRight
            size={16}
            className="shrink-0 text-[#9B6322] opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </article>
  );
}

/** Placeholder card used while Supabase is unconfigured or empty. */
export function BlogCardSkeleton() {
  return (
    <div className="flex flex-col bg-white/40 border border-[#D4A017]/10 rounded-sm overflow-hidden">
      <div className="aspect-[16/10] bg-[#f0e8dd]/60 animate-pulse" />
      <div className="p-5 sm:p-6 space-y-3">
        <div className="h-3 w-24 bg-[#1F140D]/5 rounded-sm animate-pulse" />
        <div className="h-6 w-full bg-[#1F140D]/5 rounded-sm animate-pulse" />
        <div className="h-4 w-5/6 bg-[#1F140D]/5 rounded-sm animate-pulse" />
      </div>
    </div>
  );
}