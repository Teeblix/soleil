import { useState, type ReactNode } from "react";
import { SIZE_GUIDE, type Unit } from "../../lib/pdp";

/** One disclosure row. The body is held in a collapsing grid row rather than a
 *  measured max-height, so a panel of any length opens to exactly its content. */
export function Panel({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-6 text-left text-[16px] uppercase tracking-[0.6px] text-ink"
      >
        {title}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M3 9h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path
            d="M9 3v12"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className={`origin-center transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`}
          />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-400 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** The measurement table, with the inch and centimetre sets the design carries.
 *  They are not the same shape - centimetres add EU/UK and AUS - so the header
 *  row is read from whichever table is showing. */
export function SizeGuide() {
  const [unit, setUnit] = useState<Unit>("in");
  const table = SIZE_GUIDE[unit];

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-[15px] font-medium uppercase tracking-[0.5px] text-ink">
        Swimwear/Bikini Size Guide
      </p>

      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium text-ink">Measurements</p>
        <div className="flex border border-line">
          {(["in", "cm"] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              className={`h-7 w-12 text-[13px] transition-colors duration-200 ${
                unit === u ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {u === "in" ? "in." : "cm"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-[13px]">
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border border-line bg-cream/60 px-2 py-2 font-medium text-ink"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`border border-line px-2 py-2 text-center ${
                      i === 0 ? "font-medium text-ink" : "text-muted"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
