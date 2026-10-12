"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import {
  LoaderCircle,
  Save,
  TriangleAlert,
  CircleCheck,
  Image as ImageIcon,
  PackagePlus,
} from "lucide-react";

import { saveProductAction, type ProductFormState } from "@/app/admin/product-actions";
import { IDLE_PRODUCT_STATE } from "@/app/admin/action-states";
import { uploadImageAction } from "@/app/admin/post-actions";
import type { Product } from "@/lib/products/types";

type Fields = {
  name: string;
  category: string;
  size: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  imageAlt: string;
  badge: string;
  discountLabel: string;
  active: boolean;
  sortOrder: string;
};

function fieldsFromProduct(product: Product | null): Fields {
  return {
    name: product?.name ?? "",
    category: product?.category ?? "Tea",
    size: product?.size ?? "",
    description: product?.description ?? "",
    price: product ? String(product.price) : "",
    originalPrice: product?.originalPrice != null ? String(product.originalPrice) : "",
    image: product?.image ?? "",
    imageAlt: product?.imageAlt ?? "",
    badge: product?.badge ?? "",
    discountLabel: product?.discountLabel ?? "5% OFF",
    active: product?.active ?? true,
    sortOrder: product ? String(product.sortOrder) : "0",
  };
}

export function ProductEditor({ product }: { product: Product | null }) {
  const isNew = product === null;

  const [state, formAction, isSaving] = useActionState<ProductFormState, FormData>(
    saveProductAction,
    IDLE_PRODUCT_STATE,
  );

  const [fields, setFields] = useState<Fields>(() => fieldsFromProduct(product));
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  const errorFor = (key: string) => state.errors?.[key];

  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);
    setImageError(null);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", "products");

      const result = await uploadImageAction(formData);

      if (result.status === "done" && result.url) {
        update("image", result.url);
        if (!fields.imageAlt) update("imageAlt", fields.name || file.name);
      } else {
        setImageError(result.message ?? "The image could not be uploaded.");
      }
    } catch (caught) {
      setImageError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <Link
            href="/admin/products"
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
          >
            ← All products
          </Link>
          <h1 className="font-playfair text-3xl sm:text-4xl mt-2">
            {isNew ? "New Product" : "Edit Product"}
          </h1>
        </div>

        {isSaving ? (
          <span className="flex items-center gap-2 text-xs text-white/50">
            <LoaderCircle size={14} className="animate-spin" />
            Saving
          </span>
        ) : state.status === "saved" ? (
          <span className="flex items-center gap-2 text-xs text-emerald-300">
            <CircleCheck size={14} />
            Saved
          </span>
        ) : state.status === "error" ? (
          <span className="flex items-center gap-2 text-xs text-red-300">
            <TriangleAlert size={14} />
            Not saved
          </span>
        ) : null}
      </div>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="id" value={product?.id ?? ""} />

        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3"
          >
            <TriangleAlert size={16} className="shrink-0 mt-0.5" />
            {state.message}
          </p>
        )}

        {/* Name ----------------------------------------------------------- */}
        <div>
          <label htmlFor="name" className={labelClass}>
            Product name
          </label>
          <input
            id="name"
            name="name"
            value={fields.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Gold Patti"
            className={errorFor("name") ? inputErrorClass : inputClass}
            maxLength={120}
          />
          {errorFor("name") && <FieldError message={errorFor("name")!} />}
        </div>

        {/* Image ---------------------------------------------------------- */}
        <div>
          <span className={labelClass}>Product image</span>

          {fields.image ? (
            <div className="flex flex-col sm:flex-row gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fields.image}
                alt={fields.imageAlt || "Product preview"}
                className="w-full sm:w-48 h-48 object-contain bg-white/5 rounded-sm border border-white/15 p-2"
              />
              <div className="flex-1 space-y-3">
                <input type="hidden" name="image" value={fields.image} readOnly />
                <div>
                  <label htmlFor="imageAlt" className="text-xs text-white/50 block mb-1.5">
                    Alt text
                  </label>
                  <input
                    id="imageAlt"
                    name="imageAlt"
                    value={fields.imageAlt}
                    onChange={(event) => update("imageAlt", event.target.value)}
                    placeholder="Describe the image for screen readers"
                    className={inputClass}
                    maxLength={200}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => update("image", "")}
                  className="text-xs tracking-widest uppercase text-red-300/80 hover:text-red-300 transition-colors"
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-white/20 rounded-sm p-6 text-center">
              <ImageIcon size={22} className="mx-auto text-white/25 mb-3" />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploadingImage}
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <LoaderCircle size={14} className="animate-spin" />
                    Uploading
                  </>
                ) : (
                  "Upload product image"
                )}
              </button>
              <p className="text-xs text-white/25 mt-3">
                JPEG, PNG, WebP, GIF or AVIF · up to 8MB
              </p>
            </div>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleImageUpload(file);
              event.target.value = "";
            }}
          />

          {imageError && (
            <p role="alert" className="text-xs text-red-300 mt-2">
              {imageError}
            </p>
          )}
          {errorFor("image") && <FieldError message={errorFor("image")!} />}
        </div>

        {/* Price row ------------------------------------------------------ */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="price" className={labelClass}>
              Price (Rs.)
            </label>
            <input
              id="price"
              name="price"
              value={fields.price}
              onChange={(event) => update("price", event.target.value)}
              inputMode="numeric"
              placeholder="340"
              className={errorFor("price") ? inputErrorClass : inputClass}
            />
            {errorFor("price") && <FieldError message={errorFor("price")!} />}
          </div>

          <div>
            <label htmlFor="originalPrice" className={labelClass}>
              Original price (Rs.)
            </label>
            <input
              id="originalPrice"
              name="originalPrice"
              value={fields.originalPrice}
              onChange={(event) => update("originalPrice", event.target.value)}
              inputMode="numeric"
              placeholder="360"
              className={errorFor("originalPrice") ? inputErrorClass : inputClass}
            />
            {errorFor("originalPrice") ? (
              <FieldError message={errorFor("originalPrice")!} />
            ) : (
              <p className="text-xs text-white/30 mt-1.5">Optional. Shown struck-through.</p>
            )}
          </div>

          <div>
            <label htmlFor="discountLabel" className={labelClass}>
              Discount label
            </label>
            <input
              id="discountLabel"
              name="discountLabel"
              value={fields.discountLabel}
              onChange={(event) => update("discountLabel", event.target.value)}
              placeholder="5% OFF"
              className={inputClass}
              maxLength={24}
            />
          </div>
        </div>

        {/* Category / size / badge --------------------------------------- */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input
              id="category"
              name="category"
              value={fields.category}
              onChange={(event) => update("category", event.target.value)}
              placeholder="Green Tea"
              className={inputClass}
              maxLength={60}
            />
          </div>

          <div>
            <label htmlFor="size" className={labelClass}>
              Pack size
            </label>
            <input
              id="size"
              name="size"
              value={fields.size}
              onChange={(event) => update("size", event.target.value)}
              placeholder="100g Pack"
              className={inputClass}
              maxLength={40}
            />
          </div>

          <div>
            <label htmlFor="badge" className={labelClass}>
              Badge
            </label>
            <input
              id="badge"
              name="badge"
              value={fields.badge}
              onChange={(event) => update("badge", event.target.value)}
              placeholder="Bestseller / New"
              className={inputClass}
              maxLength={24}
            />
          </div>
        </div>

        {/* Description ---------------------------------------------------- */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={fields.description}
            onChange={(event) => update("description", event.target.value)}
            rows={3}
            placeholder="A short description shown on the product card."
            className={`${errorFor("description") ? inputErrorClass : inputClass} resize-y`}
            maxLength={600}
          />
        </div>

        {/* Active / order ------------------------------------------------- */}
        <div className="grid gap-6 sm:grid-cols-2 items-start">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="active"
              checked={fields.active}
              onChange={(event) => update("active", event.target.checked)}
              className="w-4 h-4 accent-[#E5A122]"
            />
            <span className="text-sm text-white/70">
              Show this product on the storefront
            </span>
          </label>

          <div>
            <label htmlFor="sortOrder" className={labelClass}>
              Sort order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              value={fields.sortOrder}
              onChange={(event) => update("sortOrder", event.target.value)}
              inputMode="numeric"
              placeholder="0"
              className={inputClass}
            />
            <p className="text-xs text-white/30 mt-1.5">Lower numbers appear first.</p>
          </div>
        </div>

        {/* Submit bar ----------------------------------------------------- */}
        <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#1a0a00]/95 backdrop-blur-md border-t border-white/10 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#B71C1C] hover:to-[#A01515] text-white px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(198,40,40,0.3)]"
          >
            {isSaving ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : isNew ? (
              <PackagePlus size={15} />
            ) : (
              <Save size={15} />
            )}
            {isNew ? "Add product" : "Save changes"}
          </button>

          <Link
            href="/admin/products"
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

const labelClass = "block text-xs tracking-widest uppercase text-white/60 mb-2";

const inputClass =
  "w-full bg-black/30 border border-white/15 rounded-sm px-4 py-2.5 text-white placeholder:text-white/25 focus:outline-none focus:border-[#E5A122] focus:ring-1 focus:ring-[#E5A122] transition-colors";

const inputErrorClass = `${inputClass} border-red-500/50 focus:border-red-400 focus:ring-red-400`;

function FieldError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-xs text-red-300 mt-1.5 flex items-center gap-1.5">
      <TriangleAlert size={12} />
      {message}
    </p>
  );
}
