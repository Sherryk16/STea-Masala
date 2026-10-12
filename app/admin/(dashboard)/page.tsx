import Link from "next/link";
import { Plus, Star } from "lucide-react";

import { listAdminPosts } from "@/lib/blog/posts";
import { SupabaseSetupNotice } from "@/components/admin/SupabaseSetupNotice";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { formatDate } from "@/lib/blog/format";

export const metadata = { title: "Posts" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const posts = await listAdminPosts();

  const published = posts.filter((post) => post.status === "published").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-3xl sm:text-4xl mb-2">Posts</h1>
          <p className="text-white/50 text-sm">
            {posts.length === 0
              ? "No posts yet."
              : `${posts.length} post${posts.length === 1 ? "" : "s"}, ${published} published.`}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="flex items-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] text-white px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(198,40,40,0.3)]"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      <SupabaseSetupNotice />

      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/15 rounded-sm">
          <p className="font-playfair text-xl mb-2">Your blog is a blank page</p>
          <p className="text-white/40 text-sm mb-6">
            Write your first post and share the story behind Stea Masala.
          </p>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 text-[#E5A122] hover:text-[#f0c060] text-sm tracking-widest uppercase"
          >
            <Plus size={16} />
            Start writing
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white/[0.03] border border-white/10 rounded-sm p-4 hover:border-white/20 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm ${
                      post.status === "published"
                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/5 text-white/50 border border-white/15"
                    }`}
                  >
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-white/35">
                    {post.category}
                  </span>
                  {post.featured && (
                    <span className="flex items-center gap-1 text-[10px] tracking-widest uppercase text-amber-300">
                      <Star size={11} />
                      Featured
                    </span>
                  )}
                </div>

                <Link
                  href={`/admin/${post.id}`}
                  className="font-playfair text-lg hover:text-[#E5A122] transition-colors"
                >
                  {post.title}
                </Link>

                <p className="text-white/35 text-xs font-mono truncate mt-0.5">
                  /blog/{post.slug}
                </p>
              </div>

              <div className="text-xs text-white/35 shrink-0 sm:w-32">
                <p>
                  {post.status === "published" && post.publishedAt
                    ? formatDate(post.publishedAt)
                    : `Edited ${formatDate(post.updatedAt)}`}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <PostRowActions post={post} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}