/** Shape of a row in `public.products`, after normalising snake_case. */
export type Product = {
  id: string;
  name: string;
  category: string;
  size: string;
  description: string;
  /** Whole rupees, e.g. 340. Formatted for display elsewhere. */
  price: number;
  originalPrice: number | null;
  image: string | null;
  imageAlt: string | null;
  badge: string | null;
  discountLabel: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** Payload accepted by the create/update endpoints. */
export type ProductInput = {
  name: string;
  category?: string;
  size?: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  image?: string | null;
  imageAlt?: string | null;
  badge?: string | null;
  discountLabel?: string | null;
  active?: boolean;
  sortOrder?: number;
};

/**
 * One purchasable weight of a blend. `price` is `null` when the price still
 * needs to be confirmed with the ST Lounge team.
 */
export type ProductVariant = {
  weight: string;
  price: number | null;
};

/**
 * Display shape consumed by the public product cards. Prices are stored as
 * numbers so the client can format the selected weight and build an accurate
 * WhatsApp message without re-parsing display strings.
 */
export type ProductCard = {
  name: string;
  category: string;
  image: string;
  description: string;
  variants: ProductVariant[];
  tag?: string;
  /** Legacy single-price fields, still populated for admin-managed products. */
  price?: string;
  originalPrice?: string;
  size?: string;
  discount?: string;
};
