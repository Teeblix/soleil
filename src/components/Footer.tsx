import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/Button";

import emailIcon from "../assets/common/imgEmailIcon.svg";
import doubleLine from "../assets/common/imgDoubleLine.svg";
import chevronUp from "../assets/common/imgChevronUp.svg";
import paymentVisa from "../assets/common/imgPaymentVisa.svg";
import paymentMastercard from "../assets/common/imgPaymentMastercard.svg";
import paymentGooglePay from "../assets/common/imgPaymentGooglePay.svg";
import paymentApplePay from "../assets/common/imgPaymentApplePay.svg";
import socialInstagram from "../assets/common/imgSocialInstagram.svg";
import socialFacebook from "../assets/common/imgSocialFacebook.svg";
import socialX from "../assets/common/imgSocialX.svg";
import socialTiktok from "../assets/common/imgSocialTiktok.svg";
import flagUS from "../assets/common/flag_us.png";
import flagGB from "../assets/common/flag_gb.png";
import flagEU from "../assets/common/flag_eu.png";
import flagAU from "../assets/common/flag_au.png";

const SHOP_LINKS = [
  { label: "Shop All", to: "/products" },
  { label: "Sale", to: "/products?filter=sale" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "Collections", to: "/collections" },
  { label: "Size Chart", to: "/size-chart" },
];

const BRAND_LINKS = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "FAQs", to: "/faqs" },
  { label: "Track Order", to: "/track-order" },
];

const SOCIALS = [
  { icon: socialInstagram, label: "Instagram" },
  { icon: socialFacebook, label: "Facebook" },
  { icon: socialX, label: "X" },
  { icon: socialTiktok, label: "TikTok" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", country: "United States", flag: flagUS },
  { code: "GBP", symbol: "£", country: "United Kingdom", flag: flagGB },
  { code: "EUR", symbol: "€", country: "European Union", flag: flagEU },
  { code: "AUD", symbol: "$", country: "Australia", flag: flagAU },
];

function UnderlineLink({ to, children, className = "" }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`group relative inline-block w-max ${className}`}>
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-in-out group-hover:scale-x-100" />
    </Link>
  );
}

function FooterLinkList({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="flex w-[84px] flex-col items-start gap-3">
      <p className="text-[18px] text-ink">{title}</p>
      <div className="flex flex-col items-start gap-2">
        {links.map((link) => (
          <UnderlineLink key={link.label} to={link.to} className="text-[16px] font-light text-ink">
            {link.label}
          </UnderlineLink>
        ))}
      </div>
    </div>
  );
}

function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(CURRENCIES[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-[16px] font-light text-ink"
      >
        <img src={selected.flag} alt="" className="size-6 rounded-full object-cover" />
        <span>
          {selected.country} ({selected.code} {selected.symbol})
        </span>
        <img
          src={chevronUp}
          alt=""
          className={`h-1 w-2.5 transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 z-10 mb-2 w-max min-w-full border border-line bg-white py-1 shadow-lg"
          >
            {CURRENCIES.map((currency) => (
              <li key={currency.code}>
                <button
                  role="option"
                  aria-selected={currency.code === selected.code}
                  onClick={() => {
                    setSelected(currency);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[15px] transition-colors hover:bg-cream-2 ${
                    currency.code === selected.code ? "bg-cream" : ""
                  }`}
                >
                  <img src={currency.flag} alt="" className="size-5 rounded-full object-cover" />
                  <span className="text-ink">{currency.country}</span>
                  <span className="ml-auto pl-4 text-muted">
                    {currency.code} {currency.symbol}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <footer className="flex w-full flex-col items-center justify-end bg-cream px-5 py-16 md:p-20">
      <div className="flex w-full max-w-[1280px] flex-col gap-16 md:gap-[88px]">
        <div className="flex w-full flex-col items-start justify-between gap-12 md:flex-row">
          <div className="flex w-full max-w-[487px] flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-3 text-ink">
              <p className="font-display text-[24px] font-medium">EXCLUSIVE ACCESS, JUST FOR YOU</p>
              <p className="text-[16px] font-light">
                Early launches. Special offers. Styling tips. All the good stuff, delivered straight to
                your inbox.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-4">
              <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
                <div className="flex h-[53px] w-full items-center gap-2 border-[0.65px] border-muted/30 bg-white px-4 sm:w-[322px]">
                  <img src={emailIcon} alt="" className="size-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full text-[15px] text-ink placeholder:text-muted focus:outline-none"
                  />
                </div>
                <Button type="submit" className="h-[53px] w-full sm:w-[153px]">
                  GET ACCESS
                </Button>
              </div>
              {submitted && (
                <p className="text-[14px] text-ink" role="status">
                  Thanks — check your inbox to confirm.
                </p>
              )}
              <p className="text-[14px] text-muted">
                By granting access, you agree to the{" "}
                <span className="underline">Terms of Service</span> &amp;{" "}
                <span className="underline">Privacy Policy</span>
              </p>
            </form>
          </div>
          <div className="flex items-start gap-16 sm:gap-[200px]">
            <FooterLinkList title="SHOP" links={SHOP_LINKS} />
            <FooterLinkList title="BRAND" links={BRAND_LINKS} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-9">
          <div className="flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <CurrencySelector />
            <div className="flex h-6 items-center gap-3">
              <img src={paymentVisa} alt="Visa" className="h-6 w-11" />
              <div className="flex h-6 w-11 items-center justify-center border-[0.27px] border-muted/30 bg-white">
                <img src={paymentMastercard} alt="Mastercard" className="h-4 w-7" />
              </div>
              <div className="flex h-6 w-11 items-center justify-center border-[0.27px] border-muted/30 bg-white">
                <img src={paymentGooglePay} alt="Google Pay" className="h-4 w-7" />
              </div>
              <div className="flex h-6 w-11 items-center justify-center border-[0.27px] border-muted/30 bg-white">
                <img src={paymentApplePay} alt="Apple Pay" className="h-4 w-7" />
              </div>
            </div>
          </div>

          <img src={doubleLine} alt="" className="h-2 w-full" />

          <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[16px] text-ink">©2026 Soleil. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex size-6 items-center justify-center"
                >
                  <img src={s.icon} alt="" className="size-full" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <UnderlineLink to="/return-policy" className="text-[16px] font-light text-ink">
                Return Policy
              </UnderlineLink>
              <UnderlineLink to="/shipping-policy" className="text-[16px] font-light text-ink">
                Shipping Policy
              </UnderlineLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
