import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../../lib/motion";

export type View = { src: string; label: string };

/**
 * The main picture with a rail of views beside it, and whatever sits beneath it.
 *
 * Laid out as a grid rather than nested flex rows so the footer can be placed in
 * the picture's column: it then starts and ends exactly where the picture does,
 * by construction, instead of by matching a width to a number that would have to
 * be kept in step by hand.
 *
 *   desktop          phone
 *   rail  picture    picture
 *         footer     rail
 *                    footer
 *
 * The picture keeps the product card's own ratio rather than being fitted to a
 * box of another shape. These are composed cards - the model is measured, scaled
 * to a fixed share of the height and sat on the bottom edge - so putting one in
 * a squarer box and covering it crops the legs away and makes the model look
 * zoomed in next to the card the shopper just clicked.
 */
export function ViewGallery({
  views,
  alt,
  footer,
}: {
  views: View[];
  alt: string;
  footer?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const current = views[active] ?? views[0];
  const hasRail = views.length > 1;

  return (
    <div
      className={`grid w-full grid-cols-1 gap-3 sm:gap-x-4 sm:gap-y-8 ${
        hasRail ? "sm:grid-cols-[92px_1fr]" : "sm:grid-cols-1"
      }`}
    >
      {/* Picture: second column on desktop, first thing on a phone. */}
      <div
        className={`relative aspect-[302/400] w-full overflow-hidden bg-[#eee] sm:row-start-1 ${
          hasRail ? "sm:col-start-2" : "sm:col-start-1"
        }`}
      >
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

      {hasRail && (
        <div
          role="tablist"
          aria-label="Product views"
          aria-orientation="vertical"
          // A phone gets a strip under the picture: a 92px column of thumbnails
          // there would eat the width the picture needs.
          className="flex flex-row gap-2 sm:col-start-1 sm:row-start-1 sm:flex-col"
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
                className="relative aspect-[302/400] w-[72px] shrink-0 overflow-hidden bg-[#eee] sm:w-full"
              >
                <img
                  src={view.src}
                  alt=""
                  className={`h-full w-full object-cover object-top transition-opacity duration-300 ${
                    selected ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                />
                {/* Drawn inside the thumbnail, so choosing a view cannot nudge
                    the rail's width by a pixel. */}
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

      {footer && (
        <div className={`sm:row-start-2 ${hasRail ? "sm:col-start-2" : "sm:col-start-1"}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
