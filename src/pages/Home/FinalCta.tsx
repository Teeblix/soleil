import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Button } from "../../components/ui/Button";
import { Reveal, RevealItem } from "../../components/Reveal";
import ctaImage from "../../assets/home/hero/readyForTheSun.jpg";

// The image stands taller than the section so it can drift without ever
// exposing an edge. It travels exactly its own overhang: 130% tall leaves
// 30% of the section height spare, which is 23.08% of the image itself.
const IMAGE_HEIGHT = "130%";
const DRIFT = 100 - 100 / 1.3;

export function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 -> 1 as the section travels from entering the bottom of the viewport
  // to leaving the top.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `-${DRIFT.toFixed(2)}%`]);

  return (
    <section ref={sectionRef} className="relative h-svh w-full overflow-hidden">
      <motion.img
        src={ctaImage}
        alt="A woman wading into the sea at sunset"
        style={reduceMotion ? { height: "100%" } : { y, height: IMAGE_HEIGHT }}
        className="absolute inset-x-0 top-0 w-full object-cover object-center"
      />

      {/* Keeps the white type legible wherever the photo happens to sit. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <Reveal className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-5 pb-16 text-center text-white md:pb-24">
        <RevealItem>
          <p className="font-display text-[28px] font-medium sm:text-[40px]">READY FOR THE SUN?</p>
        </RevealItem>
        <RevealItem>
          <p className="max-w-[720px] text-[16px] font-light sm:text-[18px]">
            Soleil is made for moments like this. Find your perfect fit and make this summer
            unforgettable.
          </p>
        </RevealItem>
        <RevealItem>
          <Button to="/collections" variant="outline-light" className="mt-2 w-[221px]">
            SHOP COLLECTIONS
          </Button>
        </RevealItem>
      </Reveal>
    </section>
  );
}
