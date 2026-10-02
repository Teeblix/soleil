import { swatchFill } from "../../lib/pdp";

/**
 * Colour swatches. A ring grows out of the selected one rather than the border
 * thickening in place, so the dot does not shift by a pixel as it is chosen.
 */
export function ColorSwatches({
  colors,
  value,
  onChange,
}: {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-baseline gap-3 text-[18px] text-ink">
        Color
        <span className="text-muted/50">|</span>
        <span className="font-display text-[15px] italic text-muted">{value}</span>
      </p>
      <div role="radiogroup" aria-label="Color" className="flex items-center gap-2">
        {colors.map((color) => {
          const selected = color === value;
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={color}
              onClick={() => onChange(color)}
              className="group relative flex size-6 items-center justify-center rounded-full"
            >
              <span
                className="size-[18px] rounded-full ring-[0.5px] ring-ink/15 transition-transform duration-300 ease-out group-hover:scale-110"
                style={{ backgroundColor: swatchFill(color) }}
              />
              <span
                className={`absolute inset-0 rounded-full border border-ink transition-all duration-300 ease-out ${
                  selected ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Size chips: outlined, filling with ink as they are chosen. */
export function SizePicker({
  sizes,
  value,
  onChange,
}: {
  sizes: string[];
  value: string;
  onChange: (size: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[18px] text-ink">Size</p>
      <div role="radiogroup" aria-label="Size" className="flex flex-wrap items-center gap-2">
        {sizes.map((size) => {
          const selected = size === value;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(size)}
              className={`flex h-[34px] w-11 items-center justify-center border text-[15px] transition-colors duration-200 ${
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-line text-ink hover:border-ink hover:bg-ink/5"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
