import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "../../components/Header";
import { SaleBar } from "../../components/SaleBar";
import { TrustBadges } from "../../components/TrustBadges";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import { EASE } from "../../lib/motion";
import { Breadcrumb } from "../../components/Breadcrumb";
import { countIn } from "../../lib/shopData";

// Collections whose name also appears elsewhere on the site reuse that exact
// image, so a shopper meets the same piece wherever the name turns up.
import bandeauImg from "../../assets/home/explore/bandeau.jpg";
import onePieceImg from "../../assets/home/explore/onePiece.jpg";
import triangleImg from "../../assets/home/explore/triangle.jpg";
import threePieceImg from "../../assets/home/explore/threePiece.jpg";
import topsImg from "../../assets/home/categories/tops.jpg";
import bottomsImg from "../../assets/home/categories/bottoms.jpg";
import setsImg from "../../assets/home/categories/sets.jpg";

import bestSellersImg from "../../assets/collections/bestSellers.jpg";
import coverUpsImg from "../../assets/collections/coverUps.jpg";
import highWaistedImg from "../../assets/collections/highWaisted.jpg";
import newArrivalsImg from "../../assets/collections/newArrivals.jpg";
import saleImg from "../../assets/collections/sale.jpg";
import allProductsImg from "../../assets/collections/allProducts.jpg";

type Collection = {
  name: string;
  slug: string;
  image: string;
  to: string;
};

const COLLECTIONS: Collection[] = [
  { name: "Best Sellers", slug: "best-sellers", image: bestSellersImg, to: "/collections/best-sellers" },
  { name: "Bandeau", slug: "bandeau", image: bandeauImg, to: "/collections/bandeau" },
  { name: "Bottoms", slug: "bottoms", image: bottomsImg, to: "/collections/bottoms" },
  { name: "Cover-Ups", slug: "cover-ups", image: coverUpsImg, to: "/collections/cover-ups" },
  { name: "High-Waisted", slug: "high-waisted", image: highWaistedImg, to: "/collections/high-waisted" },
  { name: "New Arrivals", slug: "new-arrivals", image: newArrivalsImg, to: "/collections/new-arrivals" },
  { name: "One-Piece", slug: "one-piece", image: onePieceImg, to: "/collections/one-piece" },
  { name: "Sale", slug: "sale", image: saleImg, to: "/collections/sale" },
  { name: "Sets", slug: "sets", image: setsImg, to: "/collections/sets" },
  // Revealed by LOAD MORE
  { name: "Three-Piece", slug: "three-piece", image: threePieceImg, to: "/collections/three-piece" },
  { name: "Tops", slug: "tops", image: topsImg, to: "/collections/tops" },
  { name: "Triangle", slug: "triangle", image: triangleImg, to: "/collections/triangle" },
  { name: "All Products", slug: "all", image: allProductsImg, to: "/products" },
];

const INITIAL_COUNT = 9;

// Each card reveals itself rather than relying on a parent container. A shared
// parent using whileInView with `once` has already fired by the time LOAD MORE
// mounts the extra cards, which would leave them stuck at opacity 0 forever.
function CardReveal({ index, children }: { index: number; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      {children}
    </motion.div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link to={collection.to} className="group flex w-full flex-col gap-3">
      <div className="relative aspect-[410.67/500] w-full overflow-hidden">
        <img
          src={collection.image}
          alt={collection.name}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="relative inline-block w-max text-[24px] text-ink">
          {collection.name}
          <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-in-out group-hover:scale-x-100" />
        </span>
        <span className="text-[18px] text-muted">{countIn(collection.slug)} items</span>
      </div>
    </Link>
  );
}

export function Collections() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? COLLECTIONS : COLLECTIONS.slice(0, INITIAL_COUNT);

  return (
    <div className="flex w-full flex-col items-center">
      <SaleBar />
      <Header variant="solid" />

      <section className="flex w-full flex-col items-center px-5 pb-16 pt-12 md:px-20 md:pb-20 md:pt-[88px]">
        <div className="flex w-full max-w-[1280px] flex-col gap-10 md:gap-16">
          <Reveal className="flex w-full flex-col gap-6 md:gap-8">
            <RevealItem>
              <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Collections" }]} />
            </RevealItem>

            <div className="flex w-full flex-col items-center gap-4 text-center">
              <RevealWords
                text="ALL COLLECTIONS"
                className="font-display text-[34px] font-medium sm:text-[44px] lg:text-[54px]"
              />
              <RevealItem>
                <p className="max-w-[766px] text-[16px] font-light sm:text-[20px]">
                  Discover our full range of collections, carefully curated to bring you timeless
                  style and seasonal trends
                </p>
              </RevealItem>
            </div>
          </Reveal>

          <div className="flex w-full flex-col items-center gap-10">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
              {visible.map((collection, i) => (
                <CardReveal key={collection.name} index={i}>
                  <CollectionCard collection={collection} />
                </CardReveal>
              ))}
            </div>

            {!showAll && (
              <CardReveal index={0}>
                <Button onClick={() => setShowAll(true)} className="w-[153px]">
                  LOAD MORE
                </Button>
              </CardReveal>
            )}
          </div>
        </div>
      </section>

      <TrustBadges />
      <Footer />
    </div>
  );
}
