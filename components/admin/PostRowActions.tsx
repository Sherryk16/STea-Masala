"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, PenLine, Trash2, LoaderCircle, ExternalLink } from "lucide-react";

import { deletePostAction, togglePostStatusAction } from "@/app/admin/post-actions";
import type { BlogPost } from "@/lib/blog/types";

export function PostRowActions({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublished = post.status === "published";

  function handleDelete() {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deletePostAction(formDataFrom(post));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not delete the post.");
        setIsConfirming(false);
      }
    });
  }

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      try {
        await togglePostStatusAction(formDataFrom(post));
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not update the post.");
      }
    });
  }

  if (isPending) {
    return (
      <span className="flex items-center gap-2 text-white/40 text-xs px-2">
        <LoaderCircle size={14} className="animate-spin" />
          Working
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleToggle}
        title={isPublished ? "Move to drafts" : "Publish now"}
        className="p-2 text-white/40 hover:text-white transition-colors"
        aria-label={isPublished ? "Move to drafts" : "Publish now"}
      >
        {isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      {isPublished && (
        <Link
          href={`/blog/${post.slug}`}
          target="_blank"
          title="View on site"
          className="p-2 text-white/40 hover:text-white transition-colors"
          aria-label="View on site"
        >
          <ExternalLink size={16} />
        </Link>
      )}

      <Link
        href={`/admin/${post.id}`}
        title="Edit post"
        className="p-2 text-white/40 hover:text-white transition-colors"
        aria-label="Edit post"
      >
        <PenLine size={16} />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        onBlur={() => setIsConfirming(false)}
        title={isConfirming ? "Click again to confirm" : "Delete post"}
        className={`p-2 transition-colors ${
          isConfirming ? "text-red-400" : "text-white/40 hover:text-red-400"
        }`}
        aria-label="Delete post"
      >
        <Trash2 size={16} />
      </button>

      {error && (
        <span role="alert" className="text-xs text-red-300 max-w-40">
          {error}
        </span>
      )}
    </div>
  );
}

function formDataFrom(post: BlogPost): FormData {
  const formData = new FormData();
  formData.set("id", post.id);
  return formData;
}