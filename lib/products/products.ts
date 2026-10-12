import "server-only";

import { getSupabaseAdmin, getSupabasePublic, isSupabaseConfigured } from "@/lib/supabase";
import type { Product, ProductInput } from "@/lib/products/types";

/** Raw row as returned by PostgREST. */
type ProductRow = {
  id: string;
  name: string;
  category: string | null;
  size: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  image_alt: string | null;
  badge: string | null;
  discount_label: string | null;
  active: boolean | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category?.trim() || "Tea",
    size: row.size ?? "",
    description: row.description ?? "",
    price: row.price,
    originalPrice: row.original_price,
    image: row.image,
    imageAlt: row.image_alt ?? row.name,
    badge: row.badge,
    discountLabel: row.discount_label,
    active: row.active !== false,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Public reads (anon key + Row Level Security)
// ---------------------------------------------------------------------------

/**
 * Active products, honouring the manual sort order. Returns an empty list when
 * Supabase has not been configured yet so that `next build` still succeeds.
 */
export async function listActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabasePublic()
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load products: ${error.message}`);
  return (data as ProductRow[]).map(toProduct);
}

// ---------------------------------------------------------------------------
// Admin reads (service role key)
// ---------------------------------------------------------------------------

export async function listAdminProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load products: ${error.message}`);
  return (data as ProductRow[]).map(toProduct);
}

export async function getAdminProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return null;
  if (!isUuid(id)) return null;

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load product: ${error.message}`);
  return data ? toProduct(data as ProductRow) : null;
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ---------------------------------------------------------------------------
// Admin writes (service role key)
// ---------------------------------------------------------------------------

function buildRow(input: ProductInput, existing?: Product | null) {
  return {
    name: input.name.trim(),
    category: (input.category ?? existing?.category ?? "Tea").trim() || "Tea",
    size: (input.size ?? existing?.size ?? "").trim(),
    description: (input.description ?? existing?.description ?? "").trim(),
    price: Math.max(0, Math.round(input.price)),
    original_price:
      input.originalPrice === undefined
        ? (existing?.originalPrice ?? null)
        : input.originalPrice === null
          ? null
          : Math.max(0, Math.round(input.originalPrice)),
    image: input.image ?? existing?.image ?? null,
    image_alt: (input.imageAlt ?? existing?.imageAlt ?? "").trim() || null,
    badge: (input.badge ?? existing?.badge ?? "").trim() || null,
    discount_label: (input.discountLabel ?? existing?.discountLabel ?? "").trim() || null,
    active: input.active ?? existing?.active ?? true,
    sort_order: Math.round(input.sortOrder ?? existing?.sortOrder ?? 0),
  };
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .insert(buildRow(input))
    .select("*")
    .single();

  if (error) throw new Error(`Could not create product: ${error.message}`);
  return toProduct(data as ProductRow);
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const existing = await getAdminProductById(id);
  if (!existing) throw new Error("Product not found.");

  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .update(buildRow(input, existing))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(`Could not save product: ${error.message}`);
  return toProduct(data as ProductRow);
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isUuid(id)) throw new Error("Invalid product id.");

  const { error } = await getSupabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw new Error(`Could not delete product: ${error.message}`);
}
