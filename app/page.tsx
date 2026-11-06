import HomeContent from "@/components/home/HomeContent";
import { listActiveProducts } from "@/lib/products/products";
import { mergeStorefrontProducts, toProductCard } from "@/lib/products/display";

// Products are managed in the admin panel, which revalidates this page on save.
// The timer is a safety net for anything changed straight in the database.
export const revalidate = 300;

export default async function Home() {
  const products = await listActiveProducts();
  const cards = mergeStorefrontProducts(products.map(toProductCard));

  return <HomeContent products={cards} />;
}
