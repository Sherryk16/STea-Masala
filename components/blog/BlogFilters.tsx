"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type Props = {
  categories: string[];
  tags: string[];
  activeCategory?: string;
  activeTag?: string;
};

export function BlogFilters({ categories, tags, activeCategory, activeTag }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function navigate(next: URLSearchParams) {
    // Filters reset pagination.
    next.delete("page");
    const query = next.toString();

    startTransition(() => {
      router.push(query ? `/blog?${query}` : "/blog");
    });
  }

  const current = new URLSearchParams(searchParams.toString());

  function selectCategory(value: string) {
    const next = new URLSearchParams(current.toString());
    next.delete("tag");
    if (value && value !== activeCategory) next.set("category", value);
    else next.delete("category");
    navigate(next);
  }

  function selectTag(value: string) {
    const next = new URLSearchParams(current.toString());
    next.delete("category");
    if (value && value !== activeTag) next.set("tag", value);
    else next.delete("tag");
    navigate(next);
  }

  const chipClass = (isActive: boolean) =>
    `text-[11px] tracking-widest uppercase px-3 py-1.5 rounded-full border transition-colors ${
      isActive
        ? "border-[#9B6322] bg-[#9B6322] text-white"
        : "border-[#D4A017]/30 text-[#1F140D]/55 hover:border-[#9B6322] hover:text-[#9B6322]"
    }`;

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-opacity ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#1F140D]/35 mr-1">
            Topic
          </span>
          <button
            type="button"
            onClick={() => selectCategory("")}
            className={chipClass(!activeCategory)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              className={chipClass(activeCategory === category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#1F140D]/35 mr-1">
            Tag
          </span>
          {tags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => selectTag(tag)}
              className={chipClass(activeTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}