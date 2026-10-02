import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { COLLECTION_META, type CollectionMeta, type CollectionSlug } from "../lib/catalogue";

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
  { label: "Sale", to: "/collections/sale" },
  { label: "Lookbook", to: "/lookbook" },
  { label: "About", to: "/about" },
];

const BY_SLUG = Object.fromEntries(COLLECTION_META.map((c) => [c.slug, c])) as Record<
  CollectionSlug,
  CollectionMeta
>;

// Menu entries are built from the catalogue rather than written out, so a
// collection that does not exist cannot be linked: the slug has to be one of
// the twelve or this does not compile. The column this replaced listed five
// fabrics - Ribbed, Mesh, Luxury Lycra and so on - that were never collections,
// and an unknown slug falls through to All Products, so "Mesh" opened a page
// titled All Products.
function col(slug: CollectionSlug) {
  return { label: BY_SLUG[slug].name, to: `/collections/${slug}` };
}

// Between them the three columns name all twelve collections exactly once, so
// every one is reachable from the menu and none is listed twice. Every column
// ends at All Products: a shopper who has read a column and not found what they
// want wants the whole catalogue, not an index of the same column's headings.
// The Collections index is still reached from the footer and from EXPLORE ALL
// on the home page.
const MEGA_MENU = [
  {
    heading: "Featured",
    links: [col("new-arrivals"), col("sale"), col("best-sellers"), { label: "Shop all", to: "/products" }],
  },
  {
    // Silhouettes: the shape of the piece.
    heading: "Collections",
    links: [
      col("one-piece"),
      col("triangle"),
      col("bandeau"),
      col("high-waisted"),
      col("three-piece"),
      { label: "Shop all", to: "/products" },
    ],
  },
  {
    // What you are actually buying: a top, a bottom, or something covering both.
    heading: "Types",
    links: [
      col("tops"),
      col("bottoms"),
      col("sets"),
      col("cover-ups"),
      { label: "Shop all", to: "/products" },
    ],
  },
];

const MEGA_IMAGES = [
  { src: nav1, to: "/collections/new-arrivals" },
  { src: nav2, to: "/collections" },
];

type MenuLink = { label: string; to: string };

/** The mega menu and the top level links flattened for the phone menu, with
 *  each destination kept only the first time it appears. */
function mobileSections(
  columns: { heading: string; links: MenuLink[] }[],
  navLinks: MenuLink[],
): { heading: string; links: MenuLink[] }[] {
  const seen = new Set<string>();
  const take = (links: MenuLink[]) =>
    links.filter((link) => (seen.has(link.to) ? false : seen.add(link.to)));
  return [...columns.map((c) => ({ heading: c.heading, links: take(c.links) })),
          { heading: "", links: take(navLinks) }]
    .filter((section) => section.links.length > 0);
}

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
                        className="h-full w-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
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
        <div className="flex flex-col gap-7 border-t border-line bg-paper px-5 py-6 text-ink lg:hidden">
          {/* Every column, not just the first. The collections sit in the second
              and third, so showing only Featured left all twelve of them
              unreachable on a phone. Destinations are shown once: "Shop all"
              repeats across columns, and Sale is both a collection and a top
              level link. */}
          {mobileSections(MEGA_MENU, NAV_LINKS).map((section) => (
            <div key={section.heading} className="flex flex-col gap-3">
              {section.heading && (
                <p className="font-display text-[14px] font-medium uppercase tracking-[1.5px] text-muted">
                  {section.heading}
                </p>
              )}
              {section.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-[18px]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
