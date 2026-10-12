import { notFound } from "next/navigation";

import { getAdminProductById } from "@/lib/products/products";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  return { title: product ? `Edit: ${product.name}` : "Edit Product" };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  // Also rejects ids that are not UUIDs, so a junk URL 404s instead of hitting
  // the database.
  if (!product) notFound();

  return <ProductEditor product={product} />;
}
