import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "soleil:favourites";

type Toast = { id: number; message: string };

type FavouritesValue = {
  favourites: string[];
  isFavourite: (slug: string) => boolean;
  toggleFavourite: (slug: string, name: string) => void;
  toasts: Toast[];
};

const FavouritesContext = createContext<FavouritesValue | null>(null);

// Reads can throw in private mode or with site data blocked, so every access is
// guarded and the app works fine when storage is unavailable.
function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>(readStored);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Not being able to persist is not worth breaking the page over.
    }
  }, [favourites]);

  const pushToast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const toggleFavourite = useCallback(
    (slug: string, name: string) => {
      setFavourites((current) => {
        const has = current.includes(slug);
        pushToast(has ? `${name} removed from favourites` : `${name} added to favourites`);
        return has ? current.filter((s) => s !== slug) : [...current, slug];
      });
    },
    [pushToast],
  );

  const value = useMemo<FavouritesValue>(
    () => ({
      favourites,
      isFavourite: (slug) => favourites.includes(slug),
      toggleFavourite,
      toasts,
    }),
    [favourites, toggleFavourite, toasts],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error("useFavourites must be used inside FavouritesProvider");
  return context;
}
