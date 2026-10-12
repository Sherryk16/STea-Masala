import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { BlogCard } from "@/components/blog/BlogCard";
import { BlogFilters } from "@/components/blog/BlogFilters";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  listPublishedPostsPaged,
  listPublishedFacets,
  resolveExcerpt,
} from "@/lib/blog/posts";
import { isSupabaseConfigured } from "@/lib/supabase";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, brewing guides and masala chai recipes from Stea Masala. Learn how to brew the perfect cup with premium Pakistani masala tea.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Stea Masala",
    description:
      "Stories, brewing guides and masala chai recipes from Stea Masala.",
    url: "https://steamasala.com/blog",
    type: "website",
  },
};

// Regenerate the index periodically; the admin also revalidates it on save.
export const revalidate = 300;

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}) {
  const { category, tag, page } = await searchParams;

  const pageNumber = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);
  const offset = (pageNumber - 1) * PAGE_SIZE;

  const [{ posts, total }, facets] = await Promise.all([
    listPublishedPostsPaged({
      limit: PAGE_SIZE,
      offset,
      ...(category ? { category } : {}),
      ...(tag ? { tag } : {}),
    }),
    listPublishedFacets(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(category || tag);

  return (
    <>
      <Navbar />

      <main className="pt-24 sm:pt-32 pb-20 min-h-screen">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#9B6322] mb-4">
              The Stea Masala Journal
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-5">
              Stories from the
              <span className="text-[#9B6322]"> chai kitchen</span>
            </h1>
            <p className="text-[#1F140D]/60 leading-relaxed max-w-xl mx-auto">
              Brewing guides, masala chai recipes and the small rituals that make a
              cup of chai worth slowing down for.
            </p>
          </div>
        </section>

        {/* Filters */}
        {facets.categories.length > 1 || facets.tags.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
            {/* useSearchParams inside the filters needs a boundary. */}
            <Suspense
              fallback={<div className="h-8" aria-hidden />}
            >
              <BlogFilters
                categories={facets.categories}
                tags={facets.tags}
                activeCategory={category}
                activeTag={tag}
              />
            </Suspense>
          </div>
        ) : null}

        {/* Posts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          {posts.length > 0 ? (
            <>
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    post={{ ...post, excerpt: resolveExcerpt(post) }}
                    priority={index < 3}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Blog pagination"
                  className="flex items-center justify-center gap-2 mt-14"
                >
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (number) => {
                      const params = new URLSearchParams();
                      if (category) params.set("category", category);
                      if (tag) params.set("tag", tag);
                      if (number > 1) params.set("page", String(number));

                      const query = params.toString();
                      const isCurrent = number === pageNumber;

                      return (
                        <Link
                          key={number}
                          href={query ? `/blog?${query}` : "/blog"}
                          aria-current={isCurrent ? "page" : undefined}
                          className={`w-10 h-10 flex items-center justify-center text-sm tracking-widest border transition-colors ${
                            isCurrent
                              ? "border-[#9B6322] text-[#9B6322]"
                              : "border-[#D4A017]/25 text-[#1F140D]/50 hover:border-[#9B6322] hover:text-[#9B6322]"
                          }`}
                        >
                          {number}
                        </Link>
                      );
                    },
                  )}
                </nav>
              )}
            </>
          ) : (
            <EmptyState hasFilters={hasFilters} isConfigured={isSupabaseConfigured} />
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

function EmptyState({
  hasFilters,
  isConfigured,
}: {
  hasFilters: boolean;
  isConfigured: boolean;
}) {
  return (
    <div className="text-center py-24 border border-dashed border-[#D4A017]/25 rounded-sm">
      <p className="font-playfair text-2xl mb-3">
        {hasFilters ? "Nothing here yet" : isConfigured ? "The kettle is on" : "Coming soon"}
      </p>
      <p className="text-[#1F140D]/50 text-sm max-w-md mx-auto px-6">
        {hasFilters
          ? "No posts match that filter. Try another category or tag."
          : isConfigured
            ? "We are brewing up our first stories. Check back soon."
            : "Our first stories are on their way."}
      </p>
      {hasFilters && (
        <Link
          href="/blog"
          className="inline-block mt-6 text-xs tracking-widest uppercase text-[#9B6322] hover:text-[#1F140D] transition-colors"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}