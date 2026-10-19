import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  slug: string;
  name: string;
  /** The catalogue price in dollars; converted for display, never stored converted. */
  price: number;
  color: string;
  size: string;
  image?: string;
  quantity: number;
};

const STORAGE_KEY = "soleil:cart";

/** The same piece in a different size is a different line, so the key carries
 *  the choices and not just the product. */
function lineKey(line: Pick<CartLine, "slug" | "color" | "size">) {
  return `${line.slug}|${line.color}|${line.size}`;
}

type CartValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  keyOf: typeof lineKey;
};

const CartContext = createContext<CartValue | null>(null);

// Reads can throw in private mode or with site data blocked, so every access is
// guarded and the shop works with an empty cart when storage is unavailable.
function readStored(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Not being able to persist is not worth breaking the page over.
    }
  }, [lines]);

  const add = useCallback<CartValue["add"]>((line, quantity = 1) => {
    setLines((current) => {
      const key = lineKey(line);
      const existing = current.find((l) => lineKey(l) === key);
      if (existing) {
        return current.map((l) =>
          lineKey(l) === key ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...current, { ...line, quantity }];
    });
    // Opened here rather than inside the updater: React runs updater functions
    // twice under StrictMode, and side effects placed there run twice with it.
    setOpen(true);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => lineKey(l) !== key)
        : current.map((l) => (lineKey(l) === key ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((l) => lineKey(l) !== key));
  }, []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines],
  );

  const value = useMemo<CartValue>(
    () => ({ lines, count, subtotal, open, setOpen, add, setQuantity, remove, keyOf: lineKey }),
    [lines, count, subtotal, open, add, setQuantity, remove],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
