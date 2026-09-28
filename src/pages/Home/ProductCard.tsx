import { useState } from "react";
import { Link } from "react-router-dom";
import { MarqueeBadge } from "../../components/MarqueeBadge";

const SIZES = ["S", "M", "L", "XL"];

export type ColorVariant = {
  name: string;
  swatch: string;
  defaultImage: string;
  hoverImage: string;
};

type ProductCardProps = {
  name: string;
  price: string;
  to: string;
  colors: ColorVariant[];
};

export function ProductCard({ name, price, to, colors }: ProductCardProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const color = colors[colorIndex];
  const hasMultipleColors = colors.length > 1;

  return (
    <div className="flex flex-col items-start gap-3">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#eee] backdrop-blur-[2px] sm:aspect-auto sm:h-[400px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <MarqueeBadge className="right-4 top-3" />

        <Link to={to} className="block h-full w-full">
          <img
            src={hovered ? color.hoverImage : color.defaultImage}
            alt={name}
            className={`absolute inset-0 h-full w-full ${
              hovered ? "object-cover object-top" : "object-contain object-bottom"
            }`}
          />
        </Link>

        {hasMultipleColors && hovered && (
          <div className="absolute left-3 top-3 flex items-center gap-1">
            {colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIndex(i)}
                aria-label={`Select color ${c.name}`}
                className={`flex size-4 items-center justify-center rounded-full border transition-colors ${
                  i === colorIndex ? "border-ink" : "border-muted/40"
                }`}
              >
                <span className="size-3 rounded-full" style={{ backgroundColor: c.swatch }} />
              </button>
            ))}
          </div>
        )}

        {hovered && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 bg-white p-1.5 sm:bottom-6 sm:gap-3 sm:p-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex h-[28px] w-[30px] items-center justify-center text-[12px] tracking-[0.32px] transition-colors sm:h-[34px] sm:w-[44px] sm:text-[16px] ${
                  selectedSize === size ? "bg-cream-2" : "hover:bg-cream-2"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <p className="text-[16px] sm:text-[18px]">{name}</p>
        <p className="text-[18px] sm:text-[24px]">{price}</p>
      </div>
    </div>
  );
}
