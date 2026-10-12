"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, PenLine, Trash2, LoaderCircle } from "lucide-react";

import {
  deleteProductAction,
  toggleProductActiveAction,
} from "@/app/admin/product-actions";
import type { Product } from "@/lib/products/types";

export function ProductRowActions({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        await deleteProductAction(formDataFrom(product));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not delete the product.");
        setIsConfirming(false);
      }
    });
  }

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      try {
        await toggleProductActiveAction(formDataFrom(product));
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not update the product.");
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
        title={product.active ? "Hide from storefront" : "Show on storefront"}
        className="p-2 text-white/40 hover:text-white transition-colors"
        aria-label={product.active ? "Hide from storefront" : "Show on storefront"}
      >
        {product.active ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>

      <Link
        href={`/admin/products/${product.id}`}
        title="Edit product"
        className="p-2 text-white/40 hover:text-white transition-colors"
        aria-label="Edit product"
      >
        <PenLine size={16} />
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        onBlur={() => setIsConfirming(false)}
        title={isConfirming ? "Click again to confirm" : "Delete product"}
        className={`p-2 transition-colors ${
          isConfirming ? "text-red-400" : "text-white/40 hover:text-red-400"
        }`}
        aria-label="Delete product"
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

function formDataFrom(product: Product): FormData {
  const formData = new FormData();
  formData.set("id", product.id);
  return formData;
}
