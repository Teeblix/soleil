import { motion } from "motion/react";
import { EASE } from "../../lib/motion";
import { FEATURES, type Feature } from "../../lib/pdp";
import type { Product } from "../../lib/shopData";

const ICONS: Record<Feature["icon"], React.ReactNode> = {
  infinity: (
    <path
      d="M4.6 7A2.4 2.4 0 1 1 7 9.4L7 4.6A2.4 2.4 0 1 0 9.4 7"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
  ),
  layers: (
    <>
      <path d="M7 1.6L12.4 4.6 7 7.6 1.6 4.6 7 1.6z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M1.6 9.4L7 12.4l5.4-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  check: (
    <>
      <path d="M1.6 7.4l2.6 2.6 4.4-5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.4 9.6l1 .9 4.2-5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pin: (
    <>
      <path d="M7 12.6s4.2-3.6 4.2-6.6a4.2 4.2 0 1 0-8.4 0c0 3 4.2 6.6 4.2 6.6z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="7" cy="5.9" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </>
  ),
};

/** The reasons column, with the product's own photograph beside it. */
export function WhyYouWillLoveIt({ product }: { product: Product }) {
  return (
    <section className="flex w-full flex-col items-center px-5 py-16 md:px-20 md:py-20">
      <div className="flex w-full max-w-[1280px] flex-col-reverse items-center gap-10 lg:flex-row lg:gap-[60px]">
        <div className="flex w-full flex-col gap-9 lg:w-[610px]">
          <div className="flex flex-col gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-display text-[28px] font-medium uppercase text-ink sm:text-[34px]"
            >
              Why you will love it
            </motion.h2>
            <p className="text-[15px] font-light leading-relaxed text-muted">
              Every detail of this {/swimsuit|one-piece/i.test(product.garment) ? "swimsuit" : "piece"} was
              thoughtfully designed from the fabric to the fit. Here is everything that makes it worth
              every penny.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {FEATURES.map((feature, i) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="flex flex-col gap-2"
              >
                <p className="flex items-center gap-3 text-[16px] text-ink">
                  <span className="flex size-6 items-center justify-center text-ink">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      {ICONS[feature.icon]}
                    </svg>
                  </span>
                  {feature.title}
                </p>
                <p className="pl-9 text-[15px] font-light leading-relaxed text-muted">{feature.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="aspect-[610/705] w-full overflow-hidden bg-[#eee] lg:w-[610px]"
        >
          {product.back && (
            <img src={product.back} alt="" className="h-full w-full object-cover object-top" />
          )}
        </motion.div>
      </div>
    </section>
  );
}
