import type { Product } from "./shopData";

/** The three panels under the buy buttons, transcribed from the Figma components. */
export const CARE_INSTRUCTION =
  "For best results, dry clean or hand wash with natural detergent. Machine wash on delicate. Lay flat to dry.";

export const SHIPPING_RETURNS = [
  {
    heading: "Shipping:",
    body: "Orders are processed within 2-3 business days. Once shipped, you'll receive a confirmation email with tracking details.",
  },
  {
    heading: "Returns:",
    body: "We accept returns for store credit within 7 days of delivery. Items must be unworn and in original condition.",
  },
];

/** Both unit tables from the size guide component, including the extra
 *  EU/UK and AUS columns the centimetre table carries. */
export const SIZE_GUIDE = {
  in: {
    columns: ["Size", "Bust", "Waist", "Hips", "Cup size"],
    rows: [
      ["S", "34-35", "26-27", "37-38", "32B-34B"],
      ["M", "36-37", "28-29", "39-40", "34B-36B"],
      ["L", "38½-40", "30½-32", "41½-43", "36C-38C"],
      ["XL", "41½", "33½", "44½", "38D-40D"],
    ],
  },
  cm: {
    columns: ["Size", "Bust", "Waist", "Hips", "EU/UK", "AUS"],
    rows: [
      ["S", "86-89", "66-69", "94-97", "70D-75C", "10C-12B"],
      ["M", "91-94", "71-74", "99-102", "75D-80C", "12C-14B"],
      ["L", "98-102", "71-81", "105-109", "80D-85D", "14C-16C"],
      ["XL", "105", "85", "113", "85DD-90DD", "16D-18D"],
    ],
  },
} as const;

export type Unit = keyof typeof SIZE_GUIDE;

/** Swatch fills, so a colour name renders as the colour a shopper expects. */
const SWATCH: Record<string, string> = {
  Black: "#111111",
  Blue: "#6f8fd0",
  Caramel: "#b07d4e",
  Chocolate: "#5a3c2e",
  Coral: "#e8705c",
  Cream: "#f0e6d6",
  Gold: "#c9a227",
  Green: "#5c7a52",
  Ivory: "#f4efe6",
  Lilac: "#b9a4d4",
  Navy: "#2b3a5c",
  Pink: "#d9a0a8",
  Red: "#c0392b",
  Rust: "#a8502f",
  Sage: "#9aa98c",
  Sand: "#d9c7a8",
  Silver: "#c4c6c8",
  Teal: "#1f7d8c",
  Terracotta: "#b5654a",
  White: "#fdfdfd",
  Yellow: "#e3c558",
};

export function swatchFill(color: string): string {
  return SWATCH[color] ?? "#cccccc";
}

/**
 * The strapline and body copy. The catalogue holds one written garment
 * description per product and nothing else prose-like, so the page builds its
 * copy from that rather than carrying 55 hand-written blurbs that would drift
 * out of step with the data the cards and the filters read.
 */
export function productCopy(product: Product) {
  // Kept with its leading article, because it is dropped into a sentence:
  // "Cut from a sky-blue one-piece swimsuit", not "Cut from sky-blue".
  const garment = product.garment;
  const kind = /swimsuit|one-piece|monokini/i.test(garment)
    ? "swimsuit"
    : /cover-up|kaftan/i.test(garment)
      ? "cover-up"
      : /three-piece/i.test(garment)
        ? "set"
        : /set|bikini/i.test(garment)
          ? "set"
          : "piece";

  return {
    tagline: `The only ${kind} you will ever need to pack.`,
    paragraphs: [
      `Cut from ${garment}. Designed to move with you and to hold its shape wear after wear, in the water and out of it.`,
      `Wear it on the sand, then pull on linen and sandals for dinner. However you style it, you'll always look intentional.`,
    ],
  };
}

export type Feature = { icon: "infinity" | "layers" | "check" | "pin"; title: string; body: string };

/** The four reasons under WHY YOU WILL LOVE IT, as written in the design. */
export const FEATURES: Feature[] = [
  {
    icon: "infinity",
    title: "Infinite Styling Options",
    body: "Not just a swimsuit, you can wear it as a bodysuit, a top, a beach coverup. One piece, endless looks.",
  },
  {
    icon: "layers",
    title: "Double-Lined for Full Coverage",
    body: "Thick, double-lined fabric that moves with you and keeps everything in place in and out of the water.",
  },
  {
    icon: "check",
    title: "Built to Last",
    body: "85% Polyester, 15% Elastane. Fabric that holds its shape, resists fading and stays comfortable wear after wear.",
  },
  {
    icon: "pin",
    title: "Your Perfect Travel Companion",
    body: "Lightweight, packable and versatile enough to take you from the pool to dinner without missing a beat.",
  },
];

/** The single review shown beneath the gallery in the design. */
export const FEATURED_REVIEW = {
  name: "Megan B.",
  verified: true,
  rating: 5,
  body: "I bought this for a trip to Mykonos and I ended up wearing it every single day, styled it differently each time. The fabric is thick and doesn't go see-through in water, and the fit is incredibly flattering. I've already ordered two more colors.",
};
