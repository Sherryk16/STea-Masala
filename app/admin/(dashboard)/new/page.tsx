import { listAdminPosts } from "@/lib/blog/posts";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata = { title: "New Post" };
export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  // Reuse the categories and tags already in use, to populate the datalists.
  const posts = await listAdminPosts();
  const categories = [...new Set(posts.map((post) => post.category))].sort();
  const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();

  return <PostEditor post={null} categories={categories} knownTags={tags} />;
}