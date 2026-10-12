import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShareRow } from "@/components/blog/ShareRow";
import { BlogCard } from "@/components/blog/BlogCard";
import {
  getPublishedPostBySlug,
  listPublishedSlugs,
  listRelatedPosts,
  postReadingTime,
  resolveExcerpt,
} from "@/lib/blog/posts";
import { formatDate, toIsoDate } from "@/lib/blog/format";

const SITE_URL = "https://steamasala.com";

// ISR for published posts. The admin revalidates this path on every save.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  // Unknown or draft slugs must not leak through metadata.
  if (!post) {
    return { title: "Post not found", robots: { index: false, follow: false } };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || resolveExcerpt(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage
        ? [{ url: post.coverImage, alt: post.coverAlt ?? post.title }]
        : undefined,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) notFound();

  const related = await listRelatedPosts(post, 3);
  const readingTime = postReadingTime(post);

  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = post.metaDescription || resolveExcerpt(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: toIsoDate(post.publishedAt),
    dateModified: toIsoDate(post.updatedAt),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Stea Masala",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", ") || undefined,
    articleSection: post.category,
    timeRequired: `PT${readingTime}M`,
  };

  return (
    <>
      <Navbar />

      <main className="pt-24 sm:pt-32 pb-20 min-h-screen">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#1F140D]/45 hover:text-[#9B6322] transition-colors"
            >
              <ArrowLeft size={13} />
              All posts
            </Link>
          </nav>

          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-widest uppercase text-[#9B6322] mb-4">
              <Link
                href={`/blog?category=${encodeURIComponent(post.category)}`}
                className="hover:text-[#1F140D] transition-colors"
              >
                {post.category}
              </Link>
              {post.publishedAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#D4A017]/60" aria-hidden />
                  <time dateTime={post.publishedAt} className="text-[#1F140D]/40">
                    {formatDate(post.publishedAt)}
                  </time>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-[#D4A017]/60" aria-hidden />
              <span className="flex items-center gap-1.5 text-[#1F140D]/40">
                <Clock size={12} />
                {readingTime} min read
              </span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl leading-[1.15] mb-5">
              {post.title}
            </h1>

            {description && (
              <p className="text-lg text-[#1F140D]/60 leading-relaxed">{description}</p>
            )}

            <p className="mt-5 text-sm text-[#1F140D]/45">
              By <span className="text-[#1F140D]/70">{post.author}</span>
            </p>
          </header>

          {post.coverImage && (
            <div className="relative aspect-[16/9] mb-10 rounded-sm overflow-hidden bg-[#f0e8dd]">
              <Image
                src={post.coverImage}
                alt={post.coverAlt ?? post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          {/* Body. Sanitized on write by lib/blog/sanitize.ts, so this markup
              is limited to the allow-list and carries no scripts or styles. */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-[#D4A017]/20">
              <Tag size={14} className="text-[#9B6322]" />
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#D4A017]/30 text-[#1F140D]/55 hover:border-[#9B6322] hover:text-[#9B6322] transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <ShareRow title={post.title} url={url} />
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-playfair text-2xl sm:text-3xl whitespace-nowrap">Keep reading</h2>
              <span className="flex-1 h-px bg-[#D4A017]/20" aria-hidden />
            </div>

            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.id} post={{ ...item, excerpt: resolveExcerpt(item) }} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}