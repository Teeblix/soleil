import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { ComingSoon } from "./pages/ComingSoon";

const STUB_PAGES: { path: string; title: string }[] = [
  { path: "/collections", title: "Collections" },
  { path: "/products", title: "All Products" },
  { path: "/product/:slug", title: "Product" },
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {STUB_PAGES.map((page) => (
          <Route key={page.path} path={page.path} element={<ComingSoon title={page.title} />} />
        ))}
        <Route path="*" element={<ComingSoon title="Page not found" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
