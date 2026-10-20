import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../lib/motion";
import { search } from "../lib/search";
import { Price } from "../lib/currency";

/**
 * Search, as a sheet that comes down from the bar.
 *
 * Results appear as you type rather than behind a submit, because the
 * catalogue is small enough to match in front of the user and a results page
 * would be a navigation to undo when the guess was wrong. Enter still works,
 * and takes the first result.
 */
export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => search(query), [query]);
  const empty = query.trim().length > 0 && results.products.length === 0 && results.collections.length === 0;

  useEffect(() => {
    if (!open) return;
    // Focus after the sheet has started moving, so the caret does not appear
    // at the top of the screen before the panel it belongs to.
    const id = window.setTimeout(() => input.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // The query is cleared on the way out rather than on the way in, so the
  // panel never flashes the previous search as it closes.
  useEffect(() => {
    if (open) return;
    const id = window.setTimeout(() => setQuery(""), 350);
    return () => window.clearTimeout(id);
  }, [open]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const first = results.products[0];
    if (first) {
      navigate(`/product/${first.slug}`);
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <motion.button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute inset-0 cursor-default bg-ink/35"
          />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative max-h-[85svh] w-full overflow-y-auto bg-paper"
          >
            <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-5 py-6 md:px-20 md:py-8">
              <form onSubmit={onSubmit} className="flex items-center gap-4 border-b border-line pb-4">
                <SearchIcon />
                <input
                  ref={input}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  // Short enough to survive a 375px screen, where the icon and
                  // the close button take their share of the row. What can be
                  // searched is spelled out in the line below instead.
                  placeholder="What are you looking for?"
                  aria-label="Search products"
                  className="min-w-0 flex-1 bg-transparent text-[18px] text-ink outline-none placeholder:text-muted/70 sm:text-[22px]"
                />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="relative size-6 shrink-0 text-ink"
                >
                  <span className="absolute left-0 top-1/2 block h-px w-6 rotate-45 bg-current" />
                  <span className="absolute left-0 top-1/2 block h-px w-6 -rotate-45 bg-current" />
                </button>
              </form>

              {query.trim().length === 0 && (
                <p className="text-[15px] font-light text-muted">
                  Try a name, a colour, or a collection — "bandeau", "navy", "cover-up".
                </p>
              )}

              {empty && (
                <p className="text-[15px] font-light text-muted">
                  Nothing matches "{query.trim()}". Try a colour or a shape instead.
                </p>
              )}

              {results.collections.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {results.collections.map((c) => (
                    <Link
                      key={c.to}
                      to={c.to}
                      onClick={onClose}
                      className="border border-line px-4 py-2 text-[14px] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}

              {results.products.length > 0 && (
                <ul className="grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                  {results.products.map((product) => (
                    <li key={product.slug}>
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={onClose}
                        className="group flex flex-col gap-2"
                      >
                        <span className="aspect-[302/400] w-full overflow-hidden bg-[#eee]">
                          {product.front && (
                            <img
                              src={product.front}
                              alt=""
                              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          )}
                        </span>
                        <span className="text-[15px] leading-tight text-ink">{product.name}</span>
                        <Price usd={product.price} className="text-[14px] text-muted" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0 text-muted">
      <circle cx="8.8" cy="8.8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13.4 13.4L17.5 17.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
