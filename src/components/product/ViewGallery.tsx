import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../../lib/motion";

export type View = { src: string; label: string };

/**
 * The main picture with a rail of views beside it.
 *
 * The rail is vertical on the left at desktop, as the design has it, and drops
 * under the picture as a horizontal strip on a phone, where a column of
 * thumbnails would eat the width the picture needs.
 *
 * The main picture keeps the product card's own ratio rather than being fitted
 * to a box of another shape. These are composed cards - the model is measured,
 * scaled to a fixed share of the height and sat on the bottom edge - so putting
 * one in a squarer box and covering it crops the legs away and makes the model
 * look zoomed in next to the card the shopper just clicked.
 */
export function ViewGallery({ views, alt }: { views: View[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = views[active] ?? views[0];

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
      {views.length > 1 && (
        <div
          role="tablist"
          aria-label="Product views"
          aria-orientation="vertical"
          className="order-2 flex shrink-0 flex-row gap-2 sm:order-1 sm:w-[92px] sm:flex-col"
        >
          {views.map((view, i) => {
            const selected = i === active;
            return (
              <button
                key={view.src}
                role="tab"
                aria-selected={selected}
                aria-label={view.label}
                onClick={() => setActive(i)}
                // The frame is drawn as a ring inside the thumbnail so choosing
                // one cannot nudge the rail's width by a pixel.
                className="relative aspect-[302/400] w-[72px] shrink-0 overflow-hidden bg-[#eee] sm:w-full"
              >
                <img
                  src={view.src}
                  alt=""
                  className={`h-full w-full object-cover object-top transition-opacity duration-300 ${
                    selected ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute inset-0 border transition-colors duration-300 ${
                    selected ? "border-ink" : "border-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="relative order-1 aspect-[302/400] w-full overflow-hidden bg-[#eee] sm:order-2 sm:min-w-0 sm:flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={current.src}
            src={current.src}
            alt={`${alt} - ${current.label}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
