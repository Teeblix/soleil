import raw from "../data/products.json";
import { COLLECTION_META, type CollectionSlug } from "./catalogue";

export type Product = {
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  collection: CollectionSlug;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  /** The written description the imagery was shot from; the detail page builds
   *  its copy out of it rather than carrying a second, driftable blurb. */
  garment: string;
  /** Resolved asset URLs. Undefined until that product's photography exists. */
  front?: string;
  back?: string;
};

// Vite resolves every product image at build time. Products whose photography
// has not been generated yet simply come back without a front/back and the card
// falls through to the bare grey tile, so the page never breaks mid-shoot.
const FILES = import.meta.glob<string>("../assets/products/*.jpg", {
  eager: true,
  import: "default",
});

const byName = new Map<string, string>();
for (const [path, url] of Object.entries(FILES)) {
  const file = path.split("/").pop();
  if (file) byName.set(file.replace(/\.jpg$/, ""), url);
}

export const PRODUCTS: Product[] = (raw as Omit<Product, "front" | "back">[]).map((p) => ({
  ...p,
  front: byName.get(`${p.slug}-front`),
  back: byName.get(`${p.slug}-back`),
}));

export const PHOTOGRAPHED = PRODUCTS.filter((p) => p.front).length;

/** Derived, never hand-written, so a collection card cannot disagree with its page. */
export const COLLECTION_COUNTS: Record<string, number> = PRODUCTS.reduce<Record<string, number>>(
  (acc, p) => {
    acc[p.collection] = (acc[p.collection] ?? 0) + 1;
    return acc;
  },
  {},
);

export function productsIn(collection?: string): Product[] {
  if (!collection || collection === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.collection === collection);
}

export function countIn(collection?: string): number {
  return collection && collection !== "all"
    ? (COLLECTION_COUNTS[collection] ?? 0)
    : PRODUCTS.length;
}

export const COLLECTIONS = COLLECTION_META;
