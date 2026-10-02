import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Currency = {
  code: "USD" | "GBP" | "EUR" | "AUD";
  symbol: string;
  country: string;
  /** Price of one unit of this currency in USD terms, i.e. multiply a USD
   *  price by this. Fixed rather than fetched: a storefront this size has no
   *  rates feed, and a price that silently moved between the card and the
   *  product page would be worse than one that is merely out of date. */
  rate: number;
};

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", country: "United States", rate: 1 },
  { code: "GBP", symbol: "£", country: "United Kingdom", rate: 0.79 },
  { code: "EUR", symbol: "€", country: "European Union", rate: 0.92 },
  { code: "AUD", symbol: "$", country: "Australia", rate: 1.52 },
];

const STORAGE_KEY = "soleil:currency";

type CurrencyValue = {
  currency: Currency;
  setCurrency: (code: Currency["code"]) => void;
  /** A USD amount rendered in the chosen currency, symbol included. */
  format: (usd: number) => string;
};

const CurrencyContext = createContext<CurrencyValue | null>(null);

// Reads can throw in private mode or with site data blocked, so the access is
// guarded and the shop simply opens in dollars when storage is unavailable.
function readStored(): Currency {
  try {
    const code = window.localStorage.getItem(STORAGE_KEY);
    return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
  } catch {
    return CURRENCIES[0];
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setSelected] = useState<Currency>(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, currency.code);
    } catch {
      // Not being able to remember the choice is not worth breaking the page.
    }
  }, [currency]);

  const setCurrency = useCallback((code: Currency["code"]) => {
    const next = CURRENCIES.find((c) => c.code === code);
    if (next) setSelected(next);
  }, []);

  const format = useCallback(
    (usd: number) => {
      const converted = usd * currency.rate;
      // AUD and USD share the $ sign, so the Australian price is qualified.
      const prefix = currency.code === "AUD" ? "A$" : currency.symbol;
      return `${prefix}${converted.toFixed(2)}`;
    },
    [currency],
  );

  const value = useMemo<CurrencyValue>(
    () => ({ currency, setCurrency, format }),
    [currency, setCurrency, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
  return context;
}

/** Prices are quoted in dollars in the catalogue, so a bare figure is a Price. */
export function Price({ usd, className = "" }: { usd: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(usd)}</span>;
}
