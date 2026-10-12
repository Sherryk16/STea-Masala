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
 * Display shape consumed by the public product cards. Prices are pre-formatted
 * so the same helper can feed both the database rows and the bundled fallback
 * catalogue.
 */
export type ProductCard = {
  name: string;
  category: string;
  image: string;
  price: string;
  originalPrice?: string;
  size: string;
  description: string;
  tag?: string;
  discount?: string;
};
