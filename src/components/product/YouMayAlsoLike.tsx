import { useMemo } from "react";
import { motion } from "motion/react";
import { ProductCard } from "../shop/ProductCard";
import { EASE } from "../../lib/motion";
import { PRODUCTS, type Product } from "../../lib/shopData";

/**
 * Four more pieces, drawn from the product's own collection first and topped up
 * from the rest of the catalogue when that collection is too small to fill the
 * row. The pick is seeded off the slug rather than Math.random, so a given
 * product always suggests the same four and the row does not reshuffle on
 * every render.
 */
function suggestions(product: Product, count = 4): Product[] {
  const seed = [...product.slug].reduce((n, c) => n + c.charCodeAt(0), 0);
  const rank = (p: Product) => (p.slug.length * 31 + seed) % 97;
  const pool = PRODUCTS.filter((p) => p.slug !== product.slug);
  const sameCollection = pool
    .filter((p) => p.collection === product.collection)
    .sort((a, b) => rank(a) - rank(b));
  const rest = pool
    .filter((p) => p.collection !== product.collection)
    .sort((a, b) => rank(a) - rank(b));
  return [...sameCollection, ...rest].slice(0, count);
}

export function YouMayAlsoLike({ product }: { product: Product }) {
  const picks = useMemo(() => suggestions(product), [product]);

  return (
    <section className="flex w-full flex-col items-center px-5 pb-16 md:px-20 md:pb-20">
      <div className="flex w-full max-w-[1280px] flex-col gap-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-display text-[28px] font-medium uppercase text-ink sm:text-[34px]"
        >
          You may also like
        </motion.h2>

        <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {picks.map((pick, i) => (
            <motion.div
              key={pick.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.07 }}
            >
              <ProductCard product={pick} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
