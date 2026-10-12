import { notFound } from "next/navigation";

import { getAdminPostById, listAdminPosts } from "@/lib/blog/posts";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminPostById(id);

  return { title: post ? `Edit: ${post.title}` : "Edit Post" };
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminPostById(id);

  // Also rejects ids that are not UUIDs, so a junk URL 404s instead of hitting
  // the database.
  if (!post) notFound();

  const posts = await listAdminPosts();
  const categories = [...new Set(posts.map((item) => item.category))].sort();
  const tags = [...new Set(posts.flatMap((item) => item.tags))].sort();

  return <PostEditor post={post} categories={categories} knownTags={tags} />;
}