import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { SplitLines } from "../../components/SplitLines";
import { Reveal, RevealItem, RevealWords } from "../../components/Reveal";
import { rise } from "../../lib/motion";
import bandeauImg from "../../assets/home/explore/bandeau.jpg";
import onePieceImg from "../../assets/home/explore/onePiece.jpg";
import triangleImg from "../../assets/home/explore/triangle.jpg";
import threePieceImg from "../../assets/home/explore/threePiece.jpg";

const CATEGORIES = [
  {
    number: "01.",
    label: "BANDEAU",
    to: "/products?category=bandeau",
    image: bandeauImg,
    title: "Bare Your Confidence",
    body: "No straps, no tan lines, no compromises. Made for those who want maximum sun and minimal coverage. Our bandeaus stay in place while you move, swim, and live freely. Effortlessly sexy.",
  },
  {
    number: "02.",
    label: "ONE-PIECE",
    to: "/products?category=one-piece",
    image: onePieceImg,
    title: "Sculpt your Silhouette",
    body: "Sleek silhouettes designed to flatter every curve. Effortless elegance for those who prefer one piece. Perfect for poolside lounging or active days by the water.",
  },
  {
    number: "03.",
    label: "TRIANGLE",
    to: "/products?category=triangle",
    image: triangleImg,
    title: "Classic Never Fades",
    body: "Adjustable, versatile, and effortlessly cool. Whether you're swimming laps or soaking up the sun, this is the perfect fit that works for everyone. Simple, flattering, and built to fit your body, your way.",
  },
  {
    number: "04.",
    label: "THREE-PIECE",
    to: "/products?category=three-piece",
    image: threePieceImg,
    title: "Trio. Your Way.",
    body: "Mix, match, layer. Three pieces, endless possibilities. Built for those who want versatility and freedom to style their own look. One set, multiple vibes. Wear them together or style each piece separately.",
  },
];

const DEFAULT_INDEX = 1;

const canHover = () => window.matchMedia("(hover: hover)").matches;

function Content({ category }: { category: (typeof CATEGORIES)[number] }) {
  const words = category.title.split(" ");
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      variants={{
        show: { transition: { staggerChildren: 0.15 } },
        exit: { transition: { staggerChildren: 0.02 } },
      }}
      className="flex w-full flex-col items-start gap-6"
    >
      <motion.p
        variants={{
          show: { transition: { staggerChildren: 0.08 } },
          exit: { transition: { staggerChildren: 0.02 } },
        }}
        className="font-display text-[24px]"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-0.5 align-bottom">
            <motion.span variants={rise} className="inline-block">
              {word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </motion.p>
      <SplitLines text={category.body} className="text-[16px] font-light" />
      <motion.div variants={rise}>
        <Link to={category.to} className="text-[16px] tracking-[0.8px] underline underline-offset-4">
          SHOP ALL ITEMS
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function ExploreEverything() {
  const [active, setActive] = useState(DEFAULT_INDEX);
  const category = CATEGORIES[active];

  return (
    <section className="flex w-full flex-col items-center bg-cream/60 px-5 py-16 md:p-20">
      <Reveal className="flex w-full max-w-[1280px] flex-col items-center gap-10 lg:flex-row lg:gap-12" stagger={0.1}>
        <div className="flex w-full flex-col items-start gap-10 lg:max-w-[395px]">
          <div className="flex flex-col items-start gap-4">
            <RevealWords text="EXPLORE EVERYTHING" className="text-[22px] sm:text-[24px]" />
            <RevealItem>
              <p className="max-w-[550px] text-[16px] sm:text-[18px]">
                Can&apos;t decide? Browse our full collection. From classic cuts to modern fits, find
                the piece that feels like you.
              </p>
            </RevealItem>
          </div>
          <div className="flex flex-col items-start gap-[18px]">
            {CATEGORIES.map((cat, i) => (
              <RevealItem key={cat.label}>
                <Link
                  to={cat.to}
                  onMouseEnter={() => canHover() && setActive(i)}
                  onFocus={() => canHover() && setActive(i)}
                  onClick={(e) => {
                    if (!canHover() && i !== active) {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-[16px]">{cat.number}</span>
                  <span className="flex flex-col">
                    <span className="font-display text-[32px] font-medium italic leading-none">
                      {cat.label}
                    </span>
                    <span
                      className={`mt-1 h-px w-full origin-left bg-ink transition-transform duration-500 ease-in-out ${
                        i === active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </div>
        </div>

        {/* Tablet sits the image beside its copy; `lg:contents` dissolves this wrapper so desktop keeps one three-column row. */}
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-end md:gap-10 lg:contents">
          <RevealItem className="group relative h-[420px] w-full overflow-hidden md:h-[500px] md:flex-[1.15] lg:h-[600px] lg:max-w-[395px] lg:flex-none">
            {CATEGORIES.map((cat, i) => (
              <img
                key={cat.label}
                src={cat.image}
                alt={cat.label}
                aria-hidden={i !== active}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-[opacity,scale] duration-1000 ease-out group-hover:scale-[1.04] ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </RevealItem>

          <RevealItem className="w-full md:flex-1 lg:max-w-[395px] lg:flex-none">
            <AnimatePresence mode="wait">
              <Content key={category.label} category={category} />
            </AnimatePresence>
          </RevealItem>
        </div>
      </Reveal>
    </section>
  );
}
