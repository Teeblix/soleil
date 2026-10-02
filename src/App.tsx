import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLayoutEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Home } from "./pages/Home";
import { Collections } from "./pages/Collections";
import { Products } from "./pages/Products";
import { Product } from "./pages/Product";
import { ComingSoon } from "./pages/ComingSoon";
import { EASE } from "./lib/motion";
import { FavouritesProvider } from "./lib/favourites";
import { CurrencyProvider } from "./lib/currency";
import { Toasts } from "./components/Toasts";

const STUB_PAGES: { path: string; title: string }[] = [
  { path: "/lookbook", title: "Lookbook" },
  { path: "/about", title: "About" },
  { path: "/blog", title: "Blog" },
  { path: "/contact", title: "Contact" },
  { path: "/faqs", title: "FAQs" },
  { path: "/track-order", title: "Track Order" },
  { path: "/size-chart", title: "Size Chart" },
  { path: "/return-policy", title: "Return Policy" },
  { path: "/shipping-policy", title: "Shipping Policy" },
  { path: "/cart", title: "Cart" },
];

// Resets scroll as the incoming page mounts, which is after the outgoing one
// has finished leaving - so the page being left never visibly jumps mid-fade.
function ScrollToTop({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    // `wait` lets the outgoing page finish before the next one arrives, so the
    // two never overlap and the handover reads as one deliberate movement.
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } }}
        exit={{
          opacity: 0,
          y: reduceMotion ? 0 : -10,
          transition: { duration: reduceMotion ? 0 : 0.3, ease: "easeIn" },
        }}
      >
        <ScrollToTop>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<Products />} />
        <Route path="/products" element={<Products />} />
            <Route path="/product/:slug" element={<Product />} />
            {STUB_PAGES.map((page) => (
              <Route key={page.path} path={page.path} element={<ComingSoon title={page.title} />} />
            ))}
            <Route path="*" element={<ComingSoon title="Page not found" />} />
          </Routes>
        </ScrollToTop>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <CurrencyProvider>
      <FavouritesProvider>
        <BrowserRouter>
        <AnimatedRoutes />
        <Toasts />
        </BrowserRouter>
      </FavouritesProvider>
    </CurrencyProvider>
  );
}

export default App;
