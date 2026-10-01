// The single source of truth for the shop. Collection counts are derived from
// the products themselves rather than typed in, so the number on a collection
// card can never drift from the number of products that page actually shows.

export type CollectionSlug =
  | "best-sellers"
  | "bandeau"
  | "bottoms"
  | "cover-ups"
  | "high-waisted"
  | "new-arrivals"
  | "one-piece"
  | "sale"
  | "sets"
  | "three-piece"
  | "tops"
  | "triangle";

export type Product = {
  slug: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  /** Every product belongs to exactly one collection, so the collection
   *  counts sum to the catalogue total. */
  collection: CollectionSlug;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  front: string;
  back: string;
};

export type CollectionMeta = {
  slug: CollectionSlug;
  name: string;
  /** Copy for the promo card shown inside that collection's grid. */
  promo: { heading: string; body: string; cta: string };
};

export const COLLECTION_META: CollectionMeta[] = [
  {
    slug: "best-sellers",
    name: "Best Sellers",
    promo: {
      heading: "LOVED BY THOUSANDS",
      body: "The pieces our customers keep coming back for.",
      cta: "SHOP BEST SELLERS",
    },
  },
  {
    slug: "bandeau",
    name: "Bandeau",
    promo: {
      heading: "NO STRAPS, NO TAN LINES",
      body: "Strapless shapes made to stay put.",
      cta: "SHOP BANDEAU",
    },
  },
  {
    slug: "bottoms",
    name: "Bottoms",
    promo: {
      heading: "FIND YOUR FIT",
      body: "Mix and match bottoms in every cut.",
      cta: "SHOP BOTTOMS",
    },
  },
  {
    slug: "cover-ups",
    name: "Cover-Ups",
    promo: {
      heading: "BEACH TO BAR",
      body: "Throw-on layers that finish the look.",
      cta: "SHOP COVER-UPS",
    },
  },
  {
    slug: "high-waisted",
    name: "High-Waisted",
    promo: {
      heading: "RETRO, REWORKED",
      body: "High rises that flatter and hold.",
      cta: "SHOP HIGH-WAISTED",
    },
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    promo: {
      heading: "JUST LANDED",
      body: "The newest pieces, fresh off the line.",
      cta: "SHOP NEW IN",
    },
  },
  {
    slug: "one-piece",
    name: "One-Piece",
    promo: {
      heading: "SCULPT YOUR SILHOUETTE",
      body: "Sleek one-pieces for every body.",
      cta: "SHOP ONE-PIECE",
    },
  },
  {
    slug: "sale",
    name: "Sale",
    promo: {
      heading: "SUMMER SALE: 30% OFF",
      body: "Use code SUN30 at checkout. Limited time only.",
      cta: "SHOP THE SALE",
    },
  },
  {
    slug: "sets",
    name: "Sets",
    promo: {
      heading: "MATCHED, NOT MATCHY",
      body: "Coordinated sets, styled two ways.",
      cta: "SHOP SETS",
    },
  },
  {
    slug: "three-piece",
    name: "Three-Piece",
    promo: {
      heading: "TRIO. YOUR WAY.",
      body: "Three pieces, endless possibilities.",
      cta: "SHOP THREE-PIECE",
    },
  },
  { slug: "tops", name: "Tops", promo: { heading: "START ON TOP", body: "Tops to build your set around.", cta: "SHOP TOPS" } },
  {
    slug: "triangle",
    name: "Triangle",
    promo: {
      heading: "CLASSIC NEVER FADES",
      body: "Adjustable, versatile, effortlessly cool.",
      cta: "SHOP TRIANGLE",
    },
  },
];

/** Promo shown on the All Products grid. */
export const ALL_PRODUCTS_PROMO = {
  heading: "SUMMER SALE: 30% OFF",
  body: "Sitewide, for a limited time. Use code SUN30.",
  cta: "SHOP THE SALE",
};

export const PRODUCTS_PER_PAGE = 11;

export function collectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTION_META.find((c) => c.slug === slug);
}
