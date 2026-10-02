import { Stars } from "../shop/Stars";
import { FEATURED_REVIEW } from "../../lib/pdp";

/** The single verified review that sits directly under the gallery. */
export function FeaturedReview() {
  const review = FEATURED_REVIEW;
  return (
    <figure className="flex w-full flex-col gap-3 border border-line/60 bg-cream/50 px-4 py-[18px]">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-[10px]">
          <span className="text-[15px] font-medium text-ink">{review.name}</span>
          {review.verified && (
            <span className="flex items-center gap-1.5 text-[15px] text-muted">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="7.2" stroke="currentColor" strokeWidth="1.1" />
                <path
                  d="M5.8 9.3l2.2 2.2 4.2-4.6"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Verified Customer
            </span>
          )}
        </span>
        <Stars rating={review.rating} className="text-[#e8a33d]" />
      </figcaption>
      <blockquote className="text-[15px] font-light leading-relaxed text-ink/80">
        {review.body}
      </blockquote>
    </figure>
  );
}
