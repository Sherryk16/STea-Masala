export type BlogPostStatus = "draft" | "published";

/** Shape of a row in `public.blog_posts`, after normalising snake_case. */
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverAlt: string | null;
  author: string;
  category: string;
  tags: string[];
  status: BlogPostStatus;
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Lightweight projection for list views and "related posts" rails. */
export type BlogPostSummary = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "coverImage"
  | "coverAlt"
  | "category"
  | "tags"
  | "featured"
  | "publishedAt"
>;

/** Payload accepted by the create/update endpoints. */
export type BlogPostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  author?: string;
  category?: string;
  tags?: string[];
  status?: BlogPostStatus;
  featured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type PostListResult = {
  posts: BlogPostSummary[];
  total: number;
};