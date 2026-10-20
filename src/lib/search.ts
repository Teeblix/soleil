import { PRODUCTS, type Product } from "./shopData";
import { COLLECTION_META } from "./catalogue";

const COLLECTION_NAME = new Map(COLLECTION_META.map((c) => [c.slug, c.name]));

/** Everything about a product a shopper might reasonably type, flattened once. */
const HAYSTACK = PRODUCTS.map((product) => ({
  product,
  text: [
    product.name,
    product.collection,
    COLLECTION_NAME.get(product.collection) ?? "",
    product.colors.join(" "),
    product.garment,
  ]
    .join(" ")
    .toLowerCase(),
  name: product.name.toLowerCase(),
}));

export type Suggestion = { label: string; to: string };

/** Collections are offered alongside products, since "bandeau" is as likely to
 *  mean the collection as any one piece in it. */
const COLLECTION_SUGGESTIONS: Suggestion[] = COLLECTION_META.map((c) => ({
  label: c.name,
  to: `/collections/${c.slug}`,
}));

export type SearchResults = {
  products: Product[];
  collections: Suggestion[];
};

/**
 * Every word typed has to appear somewhere in the product, so "green bikini"
 * narrows rather than widening the way matching any single word would.
 *
 * Ranking puts a match on the name above one that only appears in the garment
 * description, and a name that starts with the query above one that merely
 * contains it, so typing "mira" offers the Mira Swimsuit before a piece whose
 * description happens to mention it.
 */
export function search(query: string, limit = 6): SearchResults {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return { products: [], collections: [] };

  const scored: { product: Product; score: number }[] = [];
  for (const entry of HAYSTACK) {
    if (!terms.every((t) => entry.text.includes(t))) continue;
    const joined = terms.join(" ");
    const score = entry.name.startsWith(joined) ? 0 : entry.name.includes(joined) ? 1 : 2;
    scored.push({ product: entry.product, score });
  }
  scored.sort((a, b) => a.score - b.score || a.product.order - b.product.order);

  const collections = COLLECTION_SUGGESTIONS.filter((c) =>
    terms.every((t) => c.label.toLowerCase().includes(t)),
  ).slice(0, 3);

  return { products: scored.slice(0, limit).map((s) => s.product), collections };
}
