import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "../lib/motion";
import { useCart } from "../lib/cart";
import { Price, useCurrency } from "../lib/currency";

/**
 * The cart, as a panel over the page.
 *
 * It opens by itself when something is added, which is the confirmation that
 * the thing went in: a toast would say so, but this also shows what is now in
 * the bag and what it costs, without leaving the page being shopped.
 */
export function CartDrawer() {
  const { lines, count, subtotal, open, setOpen, setQuantity, remove, keyOf } = useCart();
  const { format } = useCurrency();

  // While the panel is up the page behind it should not scroll, and Escape
  // should close it, as with any modal surface.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="absolute inset-0 cursor-default bg-ink/35"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative flex h-full w-full max-w-[420px] flex-col bg-paper"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-5">
              <p className="text-[18px] text-ink">
                Your Cart{count > 0 && <span className="text-muted"> ({count})</span>}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="relative size-6 text-ink"
              >
                <span className="absolute left-0 top-1/2 block h-px w-6 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 block h-px w-6 -rotate-45 bg-current" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="text-[18px] text-ink">Your cart is empty</p>
                <p className="text-[15px] font-light text-muted">
                  Nothing in the bag yet. Have a look at what's new.
                </p>
                <Link
                  to="/products"
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center justify-center border border-ink px-7 text-[15px] tracking-[0.8px] text-ink transition-colors duration-300 hover:bg-ink hover:text-white"
                >
                  SHOP ALL
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
                  {lines.map((line) => {
                    const key = keyOf(line);
                    return (
                      <li key={key} className="flex gap-4">
                        <Link
                          to={`/product/${line.slug}`}
                          onClick={() => setOpen(false)}
                          className="aspect-[302/400] w-[84px] shrink-0 overflow-hidden bg-[#eee]"
                        >
                          {line.image && (
                            <img
                              src={line.image}
                              alt=""
                              className="h-full w-full object-cover object-top"
                            />
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <Link
                            to={`/product/${line.slug}`}
                            onClick={() => setOpen(false)}
                            className="text-[16px] leading-tight text-ink"
                          >
                            {line.name}
                          </Link>
                          <p className="text-[14px] text-muted">
                            {line.color} · Size {line.size}
                          </p>
                          <Price usd={line.price} className="text-[15px] text-ink" />

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center border border-line">
                              <Stepper
                                label={`Decrease quantity of ${line.name}`}
                                onClick={() => setQuantity(key, line.quantity - 1)}
                              >
                                −
                              </Stepper>
                              <span className="w-8 text-center text-[14px] text-ink">
                                {line.quantity}
                              </span>
                              <Stepper
                                label={`Increase quantity of ${line.name}`}
                                onClick={() => setQuantity(key, line.quantity + 1)}
                              >
                                +
                              </Stepper>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(key)}
                              className="group relative text-[14px] font-light text-muted transition-colors hover:text-ink"
                            >
                              Remove
                              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <footer className="flex flex-col gap-4 border-t border-line px-5 py-5">
                  <div className="flex items-center justify-between text-[16px] text-ink">
                    <span>Subtotal</span>
                    <span>{format(subtotal)}</span>
                  </div>
                  <p className="text-[13px] font-light text-muted">
                    Shipping and taxes are worked out at checkout.
                  </p>
                  <Link
                    to="/cart"
                    onClick={() => setOpen(false)}
                    className="flex h-[50px] items-center justify-center bg-ink text-[15px] tracking-[0.8px] text-white transition-opacity hover:opacity-90"
                  >
                    CHECKOUT
                  </Link>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Stepper({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-8 items-center justify-center text-[16px] text-ink transition-colors hover:bg-ink/5"
    >
      {children}
    </button>
  );
}
