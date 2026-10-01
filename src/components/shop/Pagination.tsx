type Props = { page: number; pages: number; onChange: (p: number) => void };

/** Shows a window of five pages plus a next arrow, as the design does. */
function windowed(page: number, pages: number): number[] {
  const span = Math.min(5, pages);
  let start = Math.max(1, page - Math.floor(span / 2));
  if (start + span - 1 > pages) start = pages - span + 1;
  return Array.from({ length: span }, (_, i) => start + i);
}

export function Pagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center gap-[21px]">
      {windowed(page, pages).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={`flex size-5 items-center justify-center text-[16px] transition-colors ${
            n === page ? "text-ink underline underline-offset-4" : "text-muted hover:text-ink"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page >= pages}
        aria-label="Next page"
        className="flex items-center gap-1 text-[16px] text-ink disabled:opacity-30"
      >
        NEXT
        <svg width="5" height="8" viewBox="0 0 5 8" fill="none" aria-hidden="true">
          <path d="M.8.8L3.9 4 .8 7.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
