"use client";

import { cn } from "@/lib/utils";
import { formatDate, formatTime } from "@/lib/format-date";

/**
 * Pulsing placeholder rows for a loading table, designed to sit INSIDE the
 * real `<tbody>` — the toolbar and the actual column headers stay visible and
 * only the data area shimmers. `widths` are Tailwind width classes, one per
 * column (their count defines the column count).
 */
export function SkeletonCells({
  rows = 6,
  widths,
}: {
  rows?: number;
  widths: string[];
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-ink/[0.08] last:border-0">
          {widths.map((w, c) => (
            <td key={c} className="px-4 py-3 first:px-6 last:px-6">
              <div
                className={cn(
                  "animate-pulse rounded bg-ink/[0.06]",
                  c === 0 ? "h-6" : "h-4",
                  w,
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * A timestamp in a data table: the date on one line with the time as small
 * muted text beneath — keeps rows narrow instead of one long date-time string.
 */
export function DateTimeCell({ iso }: { iso: string | null | undefined }) {
  if (!iso) return <>—</>;
  return (
    <div className="whitespace-nowrap leading-tight">
      <div>{formatDate(iso)}</div>
      <div className="mt-0.5 text-[11.5px] text-ink/45">{formatTime(iso)}</div>
    </div>
  );
}
