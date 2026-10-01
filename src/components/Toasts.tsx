import { AnimatePresence, motion } from "motion/react";
import { useFavourites } from "../lib/favourites";
import { EASE } from "../lib/motion";

/** Bottom-centre toast stack. Polite, so it never interrupts a screen reader. */
export function Toasts() {
  const { toasts } = useFavourites();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex flex-col items-center gap-2 px-5"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
            className="pointer-events-auto bg-ink px-5 py-3 text-[15px] text-white shadow-lg"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
