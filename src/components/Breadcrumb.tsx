import { Fragment } from "react";
import { Link } from "react-router-dom";

export type Crumb = {
  label: string;
  /** Omit on the final crumb, which renders as plain current-page text. */
  to?: string;
};

// Inline rather than an asset so it inherits the surrounding text colour.
// The shipped chevron SVGs are stroked a fixed white or black, and the white
// one disappears entirely on a light page.
function Separator({ tone }: { tone: string }) {
  return (
    <svg
      width="4"
      height="7"
      viewBox="0 0 4 7"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${tone}`}
    >
      <path
        d="M0.6 0.6L3.4 3.5L0.6 6.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Breadcrumb({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const linkTone = tone === "light" ? "text-white" : "text-ink";
  const currentTone = tone === "light" ? "text-white/80" : "text-muted/60";
  const sepTone = tone === "light" ? "text-white/70" : "text-muted";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-3">
        {items.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && (
              <li aria-hidden="true" className="flex items-center">
                <Separator tone={sepTone} />
              </li>
            )}
            <li className="flex items-center">
              {item.to ? (
                <Link to={item.to} className={`group relative inline-block text-[16px] ${linkTone}`}>
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-in-out group-hover:scale-x-100" />
                </Link>
              ) : (
                <span aria-current="page" className={`text-[16px] font-light ${currentTone}`}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
