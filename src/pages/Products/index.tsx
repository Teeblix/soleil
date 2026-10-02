import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "../../components/Header";
import { SaleBar } from "../../components/SaleBar";
import { Footer } from "../../components/Footer";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ProductCard } from "../../components/shop/ProductCard";
import { PromoCard, type Promo } from "../../components/shop/PromoCard";
import { FilterRail } from "../../components/shop/FilterRail";
import { Pagination } from "../../components/shop/Pagination";
import { EASE } from "../../lib/motion";
import { ALL_PRODUCTS_PROMO, PRODUCTS_PER_PAGE, collectionBySlug } from "../../lib/catalogue";
import { countIn, productsIn } from "../../lib/shopData";

import heroAll from "../../assets/collections/allProducts.jpg";
import heroBestSellers from "../../assets/collections/bestSellers.jpg";
import heroNewArrivals from "../../assets/collections/newArrivals.jpg";
import heroSale from "../../assets/collections/sale.jpg";
import heroCoverUps from "../../assets/collections/coverUps.jpg";
import heroHighWaisted from "../../assets/collections/highWaisted.jpg";
import heroBandeau from "../../assets/home/explore/bandeau.jpg";
import heroOnePiece from "../../assets/home/explore/onePiece.jpg";
import heroTriangle from "../../assets/home/explore/triangle.jpg";
import heroThreePiece from "../../assets/home/explore/threePiece.jpg";
import heroTops from "../../assets/home/categories/tops.jpg";
import heroBottoms from "../../assets/home/categories/bottoms.jpg";
import heroSets from "../../assets/home/categories/sets.jpg";

// Each collection reuses the same image its card already shows, so arriving on
// the page feels continuous with the card you clicked.
const IMAGERY: Record<string, string> = {
  all: heroAll,
  "best-sellers": heroBestSellers,
  "new-arrivals": heroNewArrivals,
  sale: heroSale,
  "cover-ups": heroCoverUps,
  "high-waisted": heroHighWaisted,
  bandeau: heroBandeau,
  "one-piece": heroOnePiece,
  triangle: heroTriangle,
  "three-piece": heroThreePiece,
  tops: heroTops,
  bottoms: heroBottoms,
  sets: heroSets,
};

/** The promo lands in the grid's eighth slot, as it does in the design. */
const PROMO_SLOT = 7;

function Reveal({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: EASE, delay: (index % 3) * 0.07 }}
    >
      {children}
    </motion.div>
  );
}

export function Products() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(true);

  const collection = slug ? collectionBySlug(slug) : undefined;
  const key = collection?.slug ?? "all";
  const title = collection?.name ?? "All Products";
  const items = useMemo(() => productsIn(key), [key]);
  const total = countIn(key);

  const page = Math.max(1, Number(params.get("page") ?? 1));
  const pages = Math.max(1, Math.ceil(items.length / PRODUCTS_PER_PAGE));
  const current = Math.min(page, pages);
  const slice = items.slice((current - 1) * PRODUCTS_PER_PAGE, current * PRODUCTS_PER_PAGE);

  const promo: Promo = {
    ...(collection?.promo ?? ALL_PRODUCTS_PROMO),
    to: collection ? `/collections/${collection.slug}` : "/collections/sale",
    image: IMAGERY[key] ?? heroAll,
  };

  function goTo(next: number) {
    const p = new URLSearchParams(params);
    if (next <= 1) p.delete("page");
    else p.set("page", String(next));
    setParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex w-full flex-col items-center">
      <SaleBar />
      <Header variant="solid" />

      <section className="relative flex h-[320px] w-full items-end overflow-hidden md:h-[420px]">
        <img src={IMAGERY[key] ?? heroAll} alt="" className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(0,0,0,0.6) 100%)" }}
        />
        {/* Padding sits on the outer wrapper, not on the max-width box, so the
            breadcrumb and title line up with the header logo and the filter
            rail rather than being inset twice. */}
        <div className="relative flex w-full flex-col items-center px-5 pb-10 md:px-20 md:pb-20">
          <div className="flex w-full max-w-[1280px] flex-col gap-6 text-white md:gap-8">
            <Breadcrumb
              tone="light"
              items={[
                { label: "Home", to: "/" },
                { label: "Collections", to: "/collections" },
                { label: title },
              ]}
            />
            <h1 className="font-display text-[34px] font-medium uppercase sm:text-[44px] lg:text-[54px]">
              {title}
            </h1>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col items-center px-5 pb-16 pt-10 md:px-20 md:pb-20">
        <div className="flex w-full max-w-[1280px] flex-col gap-6">
          {/* The count row is inset to start at the grid column, as in the design,
              so the filter rail below it lines up with the first product card. */}
          <div className="flex w-full lg:gap-6">
            {filtersOpen && <div aria-hidden className="hidden w-[302px] shrink-0 lg:block" />}
            <div className="flex w-full min-w-0 items-center justify-between">
              <p className="text-[18px] text-ink">
                {total} {total === 1 ? "product" : "products"}
              </p>
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
                className="hidden h-11 items-center justify-center gap-2 border border-ink px-5 text-[16px] tracking-[0.8px] text-ink transition-colors hover:bg-ink hover:text-white lg:flex"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M1.5 3h13l-5 5.5V13l-3 1.5V8.5L1.5 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
                {filtersOpen ? "HIDE FILTER" : "SHOW FILTER"}
              </button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:gap-6">
            {filtersOpen && <FilterRail />}

            <div className="flex w-full min-w-0 flex-col items-center gap-12">
              <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {slice.map((product, i) => (
                  <div key={product.slug} className="contents">
                    {i === PROMO_SLOT && (
                      <Reveal index={i}>
                        <PromoCard promo={promo} />
                      </Reveal>
                    )}
                    <Reveal index={i}>
                      <ProductCard product={product} />
                    </Reveal>
                  </div>
                ))}
                {slice.length <= PROMO_SLOT && (
                  <Reveal index={slice.length}>
                    <PromoCard promo={promo} />
                  </Reveal>
                )}
              </div>

              <Pagination page={current} pages={pages} onChange={goTo} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
