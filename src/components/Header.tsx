import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import soleilLight from "../assets/common/imgSoleilLight.svg";
import soleilDark from "../assets/common/imgSoleilDark.svg";
import searchLight from "../assets/common/imgSearchLight.svg";
import searchDark from "../assets/common/imgSearchDark.svg";
import userLight from "../assets/common/imgUserLight.svg";
import userDark from "../assets/common/imgUserDark.svg";
import bagLight from "../assets/common/imgBagLight.svg";
import bagDark from "../assets/common/imgBagDark.svg";
import chevronLight from "../assets/common/imgChevronDown.svg";
import chevronDark from "../assets/common/imgChevronUp.svg";
import nav1 from "../assets/nav/nav1.jpg";
import nav2 from "../assets/nav/nav2.jpg";

const NAV_LINKS = [
  { label: "Sale", to: "/products?filter=sale" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "About", to: "/about" },
];

const MEGA_MENU = [
  {
    heading: "Featured",
    links: [
      { label: "New Arrivals", to: "/products?filter=new" },
      { label: "Sale", to: "/products?filter=sale" },
      { label: "Best Sellers", to: "/products?filter=best-sellers" },
      { label: "Shop all", to: "/products" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { label: "Ribbed", to: "/collections/ribbed" },
      { label: "Textured", to: "/collections/textured" },
      { label: "Mesh", to: "/collections/mesh" },
      { label: "Recycled Fabric", to: "/collections/recycled-fabric" },
      { label: "Luxury Lycra", to: "/collections/luxury-lycra" },
      { label: "Shop all", to: "/collections" },
    ],
  },
  {
    heading: "Types",
    links: [
      { label: "Beach Ready", to: "/products?type=beach-ready" },
      { label: "Poolside Luxe", to: "/products?type=poolside-luxe" },
      { label: "Active Swim", to: "/products?type=active-swim" },
      { label: "Resort Wear", to: "/products?type=resort-wear" },
      { label: "Sets", to: "/products?category=sets" },
      { label: "Shop all", to: "/products" },
    ],
  },
];

const MEGA_IMAGES = [
  { src: nav1, to: "/products?filter=new" },
  { src: nav2, to: "/collections" },
];

function Underline({ active }: { active?: boolean }) {
  return (
    <span
      className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-in-out ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

function IconButton({ label, icon, to, onClick }: { label: string; icon: string; to?: string; onClick?: () => void }) {
  const content = (
    <>
      <img src={icon} alt="" className="size-6" />
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-[4px] bg-ink px-2.5 py-1 text-[13px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 before:absolute before:-top-1 before:left-1/2 before:size-2 before:-translate-x-1/2 before:rotate-45 before:bg-ink"
      >
        {label}
      </span>
    </>
  );
  const className = "group relative flex size-6 items-center justify-center";
  return to ? (
    <Link to={to} aria-label={label} className={className}>
      {content}
    </Link>
  ) : (
    <button aria-label={label} onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function MegaMenuLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="group relative inline-block w-max text-[16px] leading-tight">
      {children}
      <Underline />
    </Link>
  );
}

export function Header({ variant = "transparent" }: { variant?: "transparent" | "solid" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLight = variant === "transparent" && !menuOpen;
  const textColor = isLight ? "text-white" : "text-ink";
  const logo = isLight ? soleilLight : soleilDark;
  const chevron = isLight ? chevronLight : chevronDark;
  const icons = isLight
    ? { search: searchLight, user: userLight, bag: bagLight }
    : { search: searchDark, user: userDark, bag: bagDark };

  const headerBg = menuOpen ? "bg-[#f0f0ef]" : variant === "solid" ? "bg-paper" : "";

  return (
    <header
      className={`w-full transition-colors duration-300 ${headerBg} ${
        variant === "solid" ? "relative border-b-[0.35px] border-line" : "absolute top-0 left-0 z-20"
      }`}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div className={`relative z-10 flex items-center justify-between px-5 py-6 lg:px-20 lg:pt-6 lg:pb-4 ${textColor}`}>
        <Link to="/" className="block h-6 w-[127px] shrink-0" onMouseEnter={() => setMenuOpen(false)}>
          <img src={logo} alt="Soleil" className="h-full w-full object-contain" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          <button
            className="group relative flex items-center gap-1.5 text-[18px]"
            onMouseEnter={() => setMenuOpen(true)}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
          >
            <span className="relative">
              Shop
              <Underline active={menuOpen} />
            </span>
            <img
              src={chevron}
              alt=""
              className={`mt-0.5 h-1 w-2.5 transition-transform duration-300 ${menuOpen ? "rotate-0" : "rotate-180"}`}
            />
          </button>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onMouseEnter={() => setMenuOpen(false)}
              className="group relative text-[18px]"
            >
              {link.label}
              <Underline />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-10 lg:flex xl:gap-14" onMouseEnter={() => setMenuOpen(false)}>
          <IconButton label="Search" icon={icons.search} />
          <IconButton label="Account" icon={icons.user} to="/account" />
          <IconButton label="Cart" icon={icons.bag} to="/cart" />
        </div>

        <button
          className={`lg:hidden ${textColor}`}
          aria-label="Menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <div className="flex flex-col gap-1.5">
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mega"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full hidden bg-[#f0f0ef] text-ink lg:block"
          >
            <div className="mx-auto w-full max-w-[1280px] border-t border-line px-0 pb-12 pt-10">
              <div className="flex items-stretch">
                {MEGA_MENU.map((column, i) => (
                  <div
                    key={column.heading}
                    className={`flex w-[234px] flex-col pl-[26px] ${i < MEGA_MENU.length - 1 ? "border-r border-line" : ""}`}
                  >
                    <p className="font-display text-[16px] font-medium uppercase tracking-[1.5px]">
                      {column.heading}
                    </p>
                    <div className="mt-4 flex flex-col items-start gap-[10px]">
                      {column.links.map((link) => (
                        <MegaMenuLink key={link.label} to={link.to}>
                          {link.label}
                        </MegaMenuLink>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex gap-[22px]">
                  {MEGA_IMAGES.map((image, i) => (
                    <Link key={i} to={image.to} className="block h-[250px] w-[268px] overflow-hidden">
                      <img
                        src={image.src}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileOpen && (
        <div className="flex flex-col gap-4 border-t border-line bg-paper px-5 py-6 text-ink lg:hidden">
          {MEGA_MENU[0].links
            .filter((link) => !NAV_LINKS.some((nav) => nav.label === link.label))
            .map((link) => (
              <Link key={link.label} to={link.to} className="text-[18px]" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="text-[18px]" onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
