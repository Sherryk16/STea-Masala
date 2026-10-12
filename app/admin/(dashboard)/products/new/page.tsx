import { ProductEditor } from "@/components/admin/ProductEditor";

export const metadata = { title: "New Product" };
export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return <ProductEditor product={null} />;
}
