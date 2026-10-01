const STAR_PATH =
  "M7 1.2l1.76 3.57 3.94.57-2.85 2.78.67 3.92L7 10.2l-3.52 1.85.67-3.92L1.3 5.34l3.94-.57L7 1.2z";

/** 14px stars with a half-star step, matching the review row in the design. */
export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`flex items-center gap-px ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        const id = `star-${i}-${Math.round(fill * 100)}`;
        return (
          <svg key={i} width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
            {fill > 0 && fill < 1 && (
              <defs>
                <linearGradient id={id}>
                  <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                  <stop offset={`${fill * 100}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d={STAR_PATH}
              fill={fill >= 1 ? "currentColor" : fill > 0 ? `url(#${id})` : "none"}
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}
