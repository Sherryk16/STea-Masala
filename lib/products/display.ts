import type { Product, ProductCard } from "@/lib/products/types";

/** Fallback used until products are added from the admin panel. */
const PLACEHOLDER_IMAGE = "/logo.png";

export function formatRupees(amount: number): string {
  return `Rs. ${amount}`;
}

/** Maps a stored product to the shape rendered by the home page cards. */
export function toProductCard(product: Product): ProductCard {
  return {
    name: product.name,
    category: product.category,
    image: product.image || PLACEHOLDER_IMAGE,
    price: formatRupees(product.price),
    originalPrice:
      product.originalPrice !== null ? formatRupees(product.originalPrice) : undefined,
    size: product.size,
    description: product.description,
    tag: product.badge ?? undefined,
    discount: product.discountLabel ?? undefined,
  };
}

/**
 * The catalogue that shipped before product management existed. Used as a
 * fallback so the storefront keeps working before the `products` table is
 * populated.
 */
export const DEFAULT_PRODUCTS: ProductCard[] = [
  {
    name: "Gold Patti",
    category: "Gold Patti",
    image: "/Products/GoldPatti/1.png",
    price: "Rs. 340",
    originalPrice: "Rs. 360",
    size: "200g Pack",
    description:
      "Rare golden-tipped leaves for a strong, full-bodied brew with a naturally sweet finish.",
    tag: "Bestseller",
    discount: "5% OFF",
  },
  {
    name: "Gold Patti",
    category: "Gold Patti",
    image: "/Products/GoldPatti/100gram.png",
    price: "Rs. 190",
    originalPrice: "Rs. 200",
    size: "100g Pack",
    description:
      "The same golden-tipped luxury in a handy 100g pack. Perfect for first-time tasters.",
    discount: "5% OFF",
  },
  {
    name: "Caramel Tea",
    category: "Flavoured Tea",
    image: "/Products/Flavoured%20Tea/caramel.png",
    price: "Rs. 299",
    originalPrice: "Rs. 315",
    size: "100g Pack",
    description:
      "Rich, buttery caramel notes steeped into premium tea leaves for a warm, indulgent cup.",
    discount: "5% OFF",
  },
  {
    name: "Elaichi Tea",
    category: "Flavoured Tea",
    image: "/Products/Flavoured%20Tea/elaichi.png",
    price: "Rs. 299",
    originalPrice: "Rs. 315",
    size: "100g Pack",
    description:
      "Fragrant green cardamom kissed into black tea for that classic desi chai aroma.",
    discount: "5% OFF",
  },
  {
    name: "Blueberry Green Tea",
    category: "Green Tea",
    image: "/Products/green%20tea/blueberry.png",
    price: "Rs. 299",
    originalPrice: "Rs. 315",
    size: "100g Pack",
    description:
      "Antioxidant-rich green tea with juicy blueberry flavour and a gently sweet finish.",
    tag: "New",
    discount: "5% OFF",
  },
  {
    name: "Pina Colada Green Tea",
    category: "Green Tea",
    image: "/Products/green%20tea/pinacolada.png",
    price: "Rs. 299",
    originalPrice: "Rs. 315",
    size: "100g Pack",
    description:
      "Tropical pineapple and coconut blended with green tea for a breezy island sip.",
    tag: "New",
    discount: "5% OFF",
  },
  {
    name: "Strawberry Green Tea",
    category: "Green Tea",
    image: "/Products/green%20tea/strawberry.png",
    price: "Rs. 299",
    originalPrice: "Rs. 315",
    size: "100g Pack",
    description:
      "Sun-ripened strawberry notes over smooth green tea for a refreshingly fruity brew.",
    tag: "New",
    discount: "5% OFF",
  },
];
