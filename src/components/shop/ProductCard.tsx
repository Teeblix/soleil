import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Stars } from "./Stars";
import { Price } from "../../lib/currency";
import { useFavourites } from "../../lib/favourites";
import type { Product } from "../../lib/shopData";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 15.5s-5.8-3.6-5.8-7.4A3.3 3.3 0 0 1 9 6.1a3.3 3.3 0 0 1 5.8 2A9.6 9.6 0 0 1 9 15.5z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const favourite = isFavourite(product.slug);

  // The back view only exists once that product's photography is generated.
  const showBack = hovered && Boolean(product.back);

  function onHeart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(product.slug, product.name);
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="relative aspect-[302/400] w-full overflow-hidden bg-[#eee]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          {product.front && (
            <img
              src={product.front}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
                showBack ? "opacity-0" : "opacity-100"
              }`}
            />
          )}
          {product.back && (
            <img
              src={product.back}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${
                showBack ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </Link>

        {!product.inStock && (
          <span className="absolute left-3 top-3 bg-white/90 px-2.5 py-1 text-[12px] tracking-[0.5px] text-ink">
            SOLD OUT
          </span>
        )}

        <button
          onClick={onHeart}
          aria-pressed={favourite}
          aria-label={
            favourite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`
          }
          // No plate behind it: the icon sits straight on the card. Drawn in
          // ink rather than white because the card is a flat light grey and the
          // model is centred, so this corner is background on every product.
          className={`absolute right-3 top-3 flex size-8 items-center justify-center transition-colors ${
            favourite ? "text-ink" : "text-ink/55 hover:text-ink"
          }`}
        >
          <Heart filled={favourite} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Link to={`/product/${product.slug}`} className="group w-max">
          <span className="relative inline-block text-[20px] leading-tight text-ink sm:text-[24px]">
            {product.name}
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-in-out group-hover:scale-x-100" />
          </span>
        </Link>
        <Price usd={product.price} className="text-[18px] text-ink" />
        <div className="flex items-center gap-3">
          <Stars rating={product.rating} className="text-ink" />
          <span className="text-[13px] tracking-[0.4px] text-muted">
            {product.reviews} REVIEWS
          </span>
        </div>
      </div>
    </div>
  );
}
