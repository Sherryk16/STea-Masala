import Link from "next/link";

export default function BlogNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-[#Faf7f2]">
      <div className="text-center max-w-md">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#9B6322] mb-4">Not found</p>
        <h1 className="font-playfair text-4xl mb-4">This post is still brewing</h1>
        <p className="text-[#1F140D]/60 mb-8 leading-relaxed">
          The link may be old, or the post may not be published yet.
        </p>
        <Link
          href="/blog"
          className="inline-block text-xs tracking-widest uppercase text-[#9B6322] hover:text-[#1F140D] transition-colors"
        >
          Browse all posts
        </Link>
      </div>
    </main>
  );
}