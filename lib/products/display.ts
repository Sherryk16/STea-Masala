import type { Product, ProductCard, ProductVariant } from "@/lib/products/types";

/** Fallback used for a database product that has no image yet. */
const PLACEHOLDER_IMAGE = "/logo.png";

/** Every priced ST Lounge blend is available in these four pack sizes. */
export const PRODUCT_WEIGHTS = ["100g", "200g", "500g", "1kg"] as const;

export const PRICE_ON_REQUEST_LABEL = "Price on request";

export function formatRupees(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-US")}`;
}

export function formatVariantPrice(price: number | null): string {
  return price === null ? PRICE_ON_REQUEST_LABEL : formatRupees(price);
}

function variants(
  prices: [number | null, number | null, number | null, number | null],
): ProductVariant[] {
  return PRODUCT_WEIGHTS.map((weight, index) => ({
    weight,
    price: prices[index],
  }));
}

/** Maps a stored product to the shape rendered by the home page cards. */
export function toProductCard(product: Product): ProductCard {
  const weight = product.size || "Standard";
  return {
    name: product.name,
    category: product.category,
    image: product.image || PLACEHOLDER_IMAGE,
    description: product.description,
    variants: [{ weight, price: product.price }],
    tag: product.badge ?? undefined,
    price: formatRupees(product.price),
    originalPrice:
      product.originalPrice !== null ? formatRupees(product.originalPrice) : undefined,
    size: product.size,
    discount: product.discountLabel ?? undefined,
  };
}

/**
 * The curated ST Lounge collection. This is the storefront source of truth for
 * product names, pack sizes and prices (taken from the supplied price list).
 * Products managed in the admin panel are merged in by `mergeStorefrontProducts`.
 */
export const DEFAULT_PRODUCTS: ProductCard[] = [
  {
    name: "Golden Patti",
    category: "Traditional Tea",
    image: "/Products/GoldPatti/newgoldpatti.png",
    description:
      "Our signature strong tea with golden tips — a bold, full-bodied cup that stands up beautifully to milk.",
    variants: variants([199, 399, 975, 1775]),
    tag: "Signature",
  },
  {
    name: "Caramel Tea",
    category: "Traditional Tea",
    image: "/Products/Flavoured%20Tea/caramel.png",
    description:
      "Silky black tea wrapped in buttery caramel notes for a warm, indulgent cup.",
    variants: variants([299, 549, 1325, 2475]),
  },
  {
    name: "Elaichi Tea",
    category: "Traditional Tea",
    image: "/Products/Flavoured%20Tea/newelaichi.png",
    description:
      "Fragrant green cardamom blended with premium black tea for a classic, comforting chai.",
    variants: variants([299, 549, 1325, 2475]),
  },
  {
    name: "Shahi Mixture Tea",
    category: "Traditional Tea",
    image: "/Products/Flavoured%20Tea/shahi-mixture.png",
    description:
      "A royal mixture of premium tea leaves and warming spices, balanced for a rich, aromatic cup.",
    variants: variants([null, null, null, null]),
  },
  {
    name: "Kashmiri Shahi Tea",
    category: "Traditional Tea",
    image: "/Products/Flavoured%20Tea/kashmiri.png",
    description:
      "A fragrant Kashmiri-style blend with delicate spice and a smooth, lingering finish.",
    variants: variants([null, null, null, null]),
  },
  {
    name: "Asli Masala",
    category: "Traditional Tea",
    image: "/hero.png",
    description:
      "The authentic masala chai blend — robust tea leaves layered with traditional whole spices.",
    variants: variants([null, null, null, null]),
  },
  {
    name: "Blueberry Green Tea",
    category: "Green Tea Collection",
    image: "/Products/green%20tea/newblueberry.png",
    description:
      "Antioxidant-rich green tea with juicy blueberry notes and a gently sweet finish.",
    variants: variants([299, 549, 1325, 2475]),
  },
  {
    name: "Strawberry Green Tea",
    category: "Green Tea Collection",
    image: "/Products/green%20tea/newstrawberry.png",
    description:
      "Sun-ripened strawberry over smooth green tea for a refreshingly fruity brew.",
    variants: variants([299, 549, 1325, 2475]),
  },
  {
    name: "Pina Colada Green Tea",
    category: "Green Tea Collection",
    image: "/Products/green%20tea/newpinacolada.png",
    description:
      "Tropical pineapple and coconut folded into light green tea for a breezy island sip.",
    variants: variants([299, 549, 1325, 2475]),
  },
];

/** Normalises product names so old admin rows still match the new catalogue. */
export function catalogueKey(name: string): string {
  let key = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  // The old catalogue used "Gold Patti"; the current name is "Golden Patti".
  if (key === "gold patti" || key.startsWith("gold patti ")) {
    key = key.replace(/^gold patti/, "golden patti");
  }

  return key;
}

function findCanonicalKey(name: string, canonicalKeys: Set<string>): string | null {
  const key = catalogueKey(name);
  if (canonicalKeys.has(key)) return key;

  // Match old size-suffixed rows such as "Caramel Tea 100g".
  return (
    [...canonicalKeys]
      .sort((a, b) => b.length - a.length)
      .find((candidate) => key.startsWith(`${candidate} `)) ?? null
  );
}

/**
 * Keeps the curated nine-product catalogue visible at all times, while still
 * allowing products added in the admin panel to appear as additional cards.
 * Admin updates to a curated product's image, description or badge are applied;
 * pricing and pack sizes stay tied to the verified price list.
 */
export function mergeStorefrontProducts(dbProducts: ProductCard[]): ProductCard[] {
  const canonicalKeys = new Set(DEFAULT_PRODUCTS.map((product) => catalogueKey(product.name)));

  const dbByKey = new Map<string, ProductCard>();
  for (const product of dbProducts) {
    const key = findCanonicalKey(product.name, canonicalKeys);
    if (key && !dbByKey.has(key)) dbByKey.set(key, product);
  }

  const curated = DEFAULT_PRODUCTS.map((product) => {
    const dbProduct = dbByKey.get(catalogueKey(product.name));
    if (!dbProduct) return product;

    return {
      ...product,
      image: dbProduct.image || product.image,
      description: dbProduct.description || product.description,
      tag: dbProduct.tag ?? product.tag,
    };
  });

  const extras = dbProducts.filter(
    (product) => findCanonicalKey(product.name, canonicalKeys) === null,
  );

  return [...curated, ...extras];
}

/** Used by the price list to keep group headings in a deliberate order. */
export const PRODUCT_GROUPS = [
  {
    title: "Traditional Tea",
    eyebrow: "Bold, aromatic & time-honoured",
    description:
      "Strong black tea leaves and traditional spice blends for a proper, comforting cup of chai.",
  },
  {
    title: "Green Tea Collection",
    eyebrow: "Light, refreshing & fruit-forward",
    description:
      "Delicate green tea leaves layered with bright fruit flavours for an easy everyday sip.",
  },
] as const;
