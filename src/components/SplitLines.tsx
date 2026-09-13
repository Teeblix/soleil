import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { rise } from "../lib/motion";

type SplitLinesProps = {
  text: string;
  className?: string;
  stagger?: number;
};

// Renders `text` one rendered line at a time so each line can animate independently.
// Line breaks are measured from an invisible copy laid out at the same width.
export function SplitLines({ text, className = "", stagger = 0.08 }: SplitLinesProps) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const measure = () => {
      const groups: string[][] = [];
      let lastTop: number | null = null;
      el.querySelectorAll<HTMLSpanElement>("[data-word]").forEach((span) => {
        if (span.offsetTop !== lastTop) {
          groups.push([]);
          lastTop = span.offsetTop;
        }
        groups[groups.length - 1].push(span.textContent ?? "");
      });
      setLines(groups.map((g) => g.join(" ")));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className={`relative w-full ${className}`}>
      <p ref={measureRef} aria-hidden="true" className="invisible absolute inset-x-0 top-0">
        {words.map((word, i) => (
          <span key={i} data-word className="inline">
            {word}
            {i < words.length - 1 && " "}
          </span>
        ))}
      </p>
      {lines.length > 0 && (
        <motion.p
          initial="hidden"
          animate="show"
          exit="exit"
          variants={{
            show: { transition: { staggerChildren: stagger } },
            exit: { transition: { staggerChildren: 0.02 } },
          }}
        >
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span variants={rise} className="block">
                {line}
              </motion.span>
            </span>
          ))}
        </motion.p>
      )}
    </div>
  );
}
