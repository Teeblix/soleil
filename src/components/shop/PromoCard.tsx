import { Link } from "react-router-dom";

export type Promo = { heading: string; body: string; cta: string; to: string; image: string };

/**
 * Occupies one product slot in the grid, as in the design, with the image as a
 * background behind a dark scrim so the white type always holds.
 */
export function PromoCard({ promo }: { promo: Promo }) {
  return (
    <Link
      to={promo.to}
      className="group relative flex aspect-[302/400] w-full overflow-hidden"
    >
      <img
        src={promo.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
      <div className="relative mt-auto flex w-full flex-col items-start gap-3 p-6 text-white">
        <p className="font-display text-[26px] font-medium leading-tight sm:text-[30px]">
          {promo.heading}
        </p>
        <p className="text-[15px] font-light">{promo.body}</p>
        <span className="relative mt-1 inline-block text-[15px] tracking-[0.8px]">
          {promo.cta}
          <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-100 bg-white transition-transform duration-500 ease-in-out group-hover:scale-x-0" />
        </span>
      </div>
    </Link>
  );
}
