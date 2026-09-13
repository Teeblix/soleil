import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Header } from "../../components/Header";
import { SaleBar } from "../../components/SaleBar";
import { Button } from "../../components/ui/Button";
import { rise } from "../../lib/motion";
import hero1 from "../../assets/home/hero/hero1.jpg";
import hero2 from "../../assets/home/hero/hero2.jpg";
import hero3 from "../../assets/home/hero/hero3.jpg";

const SLIDES = [
  { image: hero1, eyebrow: "RESORT '26", title: "SOLEIL × CÔTE D'AZUR", cta: "EXPLORE", to: "/products" },
  { image: hero2, eyebrow: "BEACHSIDE LUXE", title: "MADE FOR THE SHORE", cta: "EXPLORE", to: "/products" },
  { image: hero3, eyebrow: "SUMMER EDITION", title: "SUSTAINABLE SWIMWEAR", cta: "VIEW ALL", to: "/products" },
];

const INTERVAL_MS = 6000;

function SlideCopy({ slide }: { slide: (typeof SLIDES)[number] }) {
  const words = slide.title.split(" ");
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      transition={{ staggerChildren: 0.12 }}
      className="flex flex-col items-center gap-10 text-center"
    >
      <div className="flex flex-col items-center gap-4 text-white">
        <motion.p variants={rise} className="text-[16px] tracking-[0.8px]">
          {slide.eyebrow}
        </motion.p>
        <motion.p
          variants={{ show: { transition: { staggerChildren: 0.09 } }, exit: {} }}
          className="font-display text-[36px] font-medium sm:text-[54px]"
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span variants={rise} className="inline-block">
                {word}
              </motion.span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </motion.p>
      </div>
      <motion.div variants={rise}>
        <Button to={slide.to} variant="outline-light" className="w-[153px]">
          {slide.cta}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="flex h-svh w-full flex-col">
      <SaleBar />
      <div className="relative w-full flex-1 overflow-hidden">
        {SLIDES.map((slide, i) => (
          <img
            key={slide.title}
            src={slide.image}
            alt=""
            aria-hidden={i !== active}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/25" />
        <Header variant="transparent" />

        <div className="absolute bottom-[120px] left-1/2 w-full max-w-[720px] -translate-x-1/2 px-5 md:bottom-[140px]">
          <AnimatePresence mode="wait">
            <SlideCopy key={active} slide={SLIDES[active]} />
          </AnimatePresence>
        </div>

        <div className="absolute bottom-6 right-5 flex items-center gap-2 md:right-20">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full bg-white transition-all duration-300 ${
                i === active ? "w-6" : "w-1.5 opacity-50"
              }`}
            />
          ))}
        </div>

        <div
          className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white"
          aria-hidden="true"
        >
          <span className="text-[11px] tracking-[2px]">SCROLL</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/30">
            <span className="animate-scroll-cue absolute left-0 top-0 h-4 w-px bg-white" />
          </span>
        </div>
      </div>
    </div>
  );
}
