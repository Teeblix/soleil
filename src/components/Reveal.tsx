import type { ReactNode } from "react";
import { motion } from "motion/react";
import { rise } from "../lib/motion";

const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

// Section-level container: children using RevealItem / RevealWords animate in sequence once scrolled into view.
export function Reveal({ children, className = "", stagger = 0.12, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={rise} className={className}>
      {children}
    </motion.div>
  );
}

// Heading whose words rise in one after another.
export function RevealWords({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <motion.p
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      className={className}
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
  );
}
