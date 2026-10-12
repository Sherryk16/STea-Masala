"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { readAdminSession } from "@/lib/dal";
import { isSupabaseConfigured } from "@/lib/supabase";
import { isAllowedImageUrl } from "@/lib/blog/sanitize";
import {
  createProduct,
  deleteProduct,
  getAdminProductById,
  isUuid,
  updateProduct,
} from "@/lib/products/products";
import type { Product, ProductInput } from "@/lib/products/types";

export type ProductFormState = {
  status: "idle" | "saved" | "error";
  message?: string;
  /** Field-level messages keyed by form field name. */
  errors?: Record<string, string>;
};

const LIMITS = {
  name: 120,
  category: 60,
  size: 40,
  description: 600,
  badge: 24,
  discountLabel: 24,
  imageAlt: 200,
} as const;

/** Unauthorised callers get a thrown error, never a redirect to the login page. */
async function requireSession(): Promise<void> {
  const session = await readAdminSession();
  if (!session) throw new Error("Unauthorized: your session has expired.");
}

function text(formData: FormData, key: string, limit: number): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  return value.trim().slice(0, limit);
}

/** Parses a non-negative whole number, or null when blank/invalid. */
function wholeNumber(formData: FormData, key: string): number | null {
  const raw = text(formData, key, 12).replace(/[^0-9]/g, "");
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) ? value : null;
}

/** A stored image is either an uploaded/pasted absolute URL or a public path. */
function isAllowedProductImage(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return isAllowedImageUrl(value);
}

function readProductForm(formData: FormData) {
  const errors: Record<string, string> = {};

  const name = text(formData, "name", LIMITS.name);
  if (!name) {
    errors.name = "A product name is required.";
  } else if (name.length < 2) {
    errors.name = "Use at least 2 characters.";
  }

  const price = wholeNumber(formData, "price");
  if (price === null) {
    errors.price = "Enter a price in rupees (numbers only).";
  }

  const originalPrice = wholeNumber(formData, "originalPrice");
  if (
    originalPrice !== null &&
    price !== null &&
    originalPrice > 0 &&
    originalPrice < price
  ) {
    errors.originalPrice = "The original price should be higher than the sale price.";
  }

  const imageInput = text(formData, "image", 2000);
  if (imageInput && !isAllowedProductImage(imageInput)) {
    errors.image = "Upload an image or use a valid image URL / site path.";
  }

  if (Object.keys(errors).length > 0) return { errors, input: null };

  const input: ProductInput = {
    name,
    category: text(formData, "category", LIMITS.category) || "Tea",
    size: text(formData, "size", LIMITS.size),
    description: text(formData, "description", LIMITS.description),
    price: price ?? 0,
    originalPrice: originalPrice ?? null,
    image: imageInput || null,
    imageAlt: text(formData, "imageAlt", LIMITS.imageAlt) || null,
    badge: text(formData, "badge", LIMITS.badge) || null,
    discountLabel: text(formData, "discountLabel", LIMITS.discountLabel) || null,
    active:
      formData.get("active") === "on" || formData.get("active") === "true",
    sortOrder: wholeNumber(formData, "sortOrder") ?? 0,
  };

  return { errors, input };
}

function revalidateProducts(): void {
  revalidatePath("/");
  revalidatePath("/admin/products");
}

/** Creates or updates a product. `id` in the form data decides which. */
export async function saveProductAction(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireSession();

  if (!isSupabaseConfigured) {
    return {
      status: "error",
      message: "Supabase is not configured yet, so products cannot be saved.",
    };
  }

  const id = text(formData, "id", 40);
  const { errors, input } = readProductForm(formData);

  if (!input) return { status: "error", message: "Please fix the highlighted fields.", errors };

  try {
    let product: Product;

    if (id) {
      if (!isUuid(id)) return { status: "error", message: "Invalid product id." };
      product = await updateProduct(id, input);
    } else {
      product = await createProduct(input);
    }

    revalidateProducts();
    return { status: "saved", message: product.name };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save the product.";
    return { status: "error", message };
  }
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = text(formData, "id", 40);
  if (!isUuid(id)) throw new Error("Invalid product id.");

  await deleteProduct(id);
  revalidateProducts();

  redirect("/admin/products");
}

/** Flips a product between hidden and shown on the storefront. */
export async function toggleProductActiveAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = text(formData, "id", 40);
  if (!isUuid(id)) throw new Error("Invalid product id.");

  const product = await getAdminProductById(id);
  if (!product) throw new Error("Product not found.");

  await updateProduct(id, {
    name: product.name,
    price: product.price,
    active: !product.active,
  });

  revalidateProducts();
}
