import { useState } from "react";

const ROWS = ["AVAILABILITY", "COLOR", "PRICE", "SIZE"] as const;

function PlusMinus({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 9h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M9 3v12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className={`origin-center transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`}
      />
    </svg>
  );
}

/**
 * Sticks 120px below the top of the viewport while the grid scrolls, which
 * clears the header rather than sliding underneath it.
 */
export function FilterRail({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <aside className={`w-full lg:sticky lg:top-[120px] lg:w-[302px] lg:shrink-0 ${className}`}>
      <div className="flex w-full flex-col">
        {ROWS.map((row, i) => (
          <div key={row} className={i > 0 ? "border-t border-line" : ""}>
            <button
              onClick={() => setOpen((current) => (current === row ? null : row))}
              aria-expanded={open === row}
              className="flex w-full items-center justify-between py-6 text-left text-[18px] text-ink"
            >
              {row}
              <PlusMinus open={open === row} />
            </button>
            {/* The expanded panel design is still to come; the row toggles so the
                interaction is in place for it to drop into. */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open === row ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 text-[15px] font-light text-muted">
                  Filter options coming soon.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
