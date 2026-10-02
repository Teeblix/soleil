import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components/Header";
import { SaleBar } from "../../components/SaleBar";
import { Footer } from "../../components/Footer";
import { TrustBadges } from "../../components/TrustBadges";
import { Testimonials } from "../../components/Testimonials";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Stars } from "../../components/shop/Stars";
import { ComingSoon } from "../ComingSoon";
import { SpinGallery } from "../../components/product/SpinGallery";
import { ColorSwatches, SizePicker } from "../../components/product/Selectors";
import { Panel, SizeGuide } from "../../components/product/Panels";
import { FeaturedReview } from "../../components/product/FeaturedReview";
import { WhyYouWillLoveIt } from "../../components/product/WhyYouWillLoveIt";
import { YouMayAlsoLike } from "../../components/product/YouMayAlsoLike";
import { useFavourites } from "../../lib/favourites";
import { PRODUCTS } from "../../lib/shopData";
import { CARE_INSTRUCTION, SHIPPING_RETURNS, productCopy } from "../../lib/pdp";
import { collectionBySlug } from "../../lib/catalogue";

export function Product() {
  const { slug } = useParams();
  const product = useMemo(() => PRODUCTS.find((p) => p.slug === slug), [slug]);

  if (!product) return <ComingSoon title="Product not found" />;
  return <ProductDetail key={product.slug} product={product} />;
}

function ProductDetail({ product }: { product: NonNullable<ReturnType<typeof PRODUCTS.find>> }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [open, setOpen] = useState<string | null>(null);
  const { isFavourite, toggleFavourite } = useFavourites();

  const copy = productCopy(product);
  const collection = collectionBySlug(product.collection);
  const saved = isFavourite(product.slug);

  // The ring the gallery turns through. Front, back, and back to front: with a
  // real turntable this becomes the full sequence of angles.
  const frames = [product.front, product.back].filter(Boolean) as string[];

  function toggle(panel: string) {
    setOpen((current) => (current === panel ? null : panel));
  }

  return (
    <div className="flex w-full flex-col items-center">
      <SaleBar />
      <Header variant="solid" />

      <section className="flex w-full flex-col items-center px-5 pt-10 md:px-20 md:pt-[91px]">
        <div className="flex w-full max-w-[1280px] flex-col gap-[54px]">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Collections", to: "/collections" },
              { label: collection?.name ?? "All Products", to: `/collections/${product.collection}` },
              { label: product.name },
            ]}
          />

          <div className="flex w-full flex-col gap-10 lg:flex-row lg:gap-[60px]">
            {/* Gallery and the review that sits under it */}
            <div className="flex w-full flex-col gap-8 lg:w-[610px] lg:shrink-0">
              {frames.length > 0 ? (
                <SpinGallery frames={frames} alt={`${product.name} in ${color}`} />
              ) : (
                <div className="aspect-[302/400] w-full bg-[#eee]" />
              )}
              <FeaturedReview />
            </div>

            {/* Everything you choose and press */}
            <div className="flex w-full min-w-0 flex-col gap-[30px]">
              <div className="flex flex-col gap-[29px]">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-[15px] text-muted">
                    <Stars rating={product.rating} className="text-[#e8a33d]" />
                    <span>
                      Rated <strong className="font-medium text-ink">{product.rating}/5</strong> (
                      {product.reviews}+ products sold)
                    </span>
                  </div>
                  <h1 className="font-display text-[28px] font-medium uppercase text-ink sm:text-[34px]">
                    {product.name}
                  </h1>
                  <p className="text-[26px] text-ink">${product.price.toFixed(2)}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <p className="text-[18px] text-ink">{copy.tagline}</p>
                  {copy.paragraphs.map((p) => (
                    <p key={p} className="max-w-[610px] text-[15px] font-light leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  <ColorSwatches colors={product.colors} value={color} onChange={setColor} />
                  <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
                </div>
              </div>

              <div className="flex flex-col gap-9">
                <div className="flex flex-col items-center gap-[35px]">
                  <p className="flex items-center gap-3 text-[15px] text-ink">
                    <span
                      className={`size-2 rounded-full ${product.inStock ? "bg-[#3a9d5d]" : "bg-muted"}`}
                      aria-hidden="true"
                    />
                    {product.inStock ? "In stock, Ready to Ship" : "Currently out of stock"}
                  </p>

                  <div className="flex w-full flex-col gap-3">
                    <div className="flex w-full items-stretch gap-4">
                      <button
                        type="button"
                        onClick={() => toggleFavourite(product.slug, product.name)}
                        aria-pressed={saved}
                        aria-label={saved ? "Remove from favourites" : "Add to favourites"}
                        className="flex size-11 shrink-0 items-center justify-center border border-line transition-colors duration-200 hover:border-ink"
                      >
                        <Heart saved={saved} />
                      </button>
                      <button
                        type="button"
                        disabled={!product.inStock}
                        className="group flex h-11 flex-1 items-center justify-center gap-2.5 border border-ink text-[15px] tracking-[0.8px] text-ink transition-colors duration-300 hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
                      >
                        <Bag />
                        ADD TO CART
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={!product.inStock}
                      className="relative h-[53px] w-full overflow-hidden bg-ink text-[15px] tracking-[0.8px] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span className="relative z-10">BUY NOW - ${product.price.toFixed(2)}</span>
                      <span className="absolute inset-0 origin-left scale-x-0 bg-white/15 transition-transform duration-500 ease-out hover:scale-x-100" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] text-muted">
                    <span className="flex items-center gap-2">
                      <Tick /> 60 day money back guarantee
                    </span>
                    <span className="flex items-center gap-2">
                      <Truck /> Hassle-Free Delivery
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col border-t border-line">
                  <Panel title="Care Instruction" open={open === "care"} onToggle={() => toggle("care")}>
                    <p className="text-[15px] font-light leading-relaxed text-muted">{CARE_INSTRUCTION}</p>
                  </Panel>
                  <Panel
                    title="Shipping & Returns"
                    open={open === "shipping"}
                    onToggle={() => toggle("shipping")}
                  >
                    <div className="flex flex-col gap-4">
                      {SHIPPING_RETURNS.map((block) => (
                        <div key={block.heading} className="flex flex-col gap-1">
                          <p className="text-[15px] text-ink">{block.heading}</p>
                          <p className="text-[15px] font-light leading-relaxed text-muted">{block.body}</p>
                        </div>
                      ))}
                    </div>
                  </Panel>
                  <Panel title="Size Guide" open={open === "size"} onToggle={() => toggle("size")}>
                    <SizeGuide />
                  </Panel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyYouWillLoveIt product={product} />
      {/* The design heads the same rail differently here and drops the intro. */}
      <Testimonials heading="WORN & LOVED" intro={null} />
      <YouMayAlsoLike product={product} />
      <TrustBadges />
      <Footer />
    </div>
  );
}

function Heart({ saved }: { saved: boolean }) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden="true">
      <path
        d="M10 16.5S1.5 11.6 1.5 6.2A4.2 4.2 0 0 1 10 4.3a4.2 4.2 0 0 1 8.5 1.9c0 5.4-8.5 10.3-8.5 10.3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        className={`transition-all duration-300 ${saved ? "fill-ink text-ink" : "fill-none text-ink"}`}
      />
    </svg>
  );
}

function Bag() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 5h11l-1 9.5h-9L2.5 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M5.5 7V4a2.5 2.5 0 0 1 5 0v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Tick() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.3 7.2l1.9 1.9 3.5-3.9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Truck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 3.5h7v6H1v-6zM8 5.5h2.6L13 7.8v1.7H8v-4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="4" cy="11" r="1.3" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10.5" cy="11" r="1.3" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
