"use client";

import type { ReactNode } from "react";
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
 * The mobile half of a list page. Data tables hide their columns behind a
 * horizontal scroll on phones, so below `md` every list renders as a stack of
 * row cards instead — same data, thumb-sized targets, nothing cut off. Pair
 * with `hidden md:block` on the table's scroll wrapper.
 */
export function RowCardList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul role="list" className={cn("md:hidden", className)}>
      {children}
    </ul>
  );
}

/**
 * One row of a RowCardList — a dense, messaging-app-style list row (two short
 * lines, tight padding), not a card. `onOpen` makes the whole row tappable
 * (mirroring the table row's click-to-open); `action` sits inline on the
 * right, vertically centred, and never triggers the row's navigation.
 */
export function RowCard({
  onOpen,
  action,
  className,
  children,
}: {
  onOpen?: () => void;
  /** Control on the right edge (typically an ActionMenu). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <li
      onClick={onOpen}
      className={cn(
        "flex items-center gap-1.5 border-b border-ink/[0.08] py-2.5 pl-4 transition-colors last:border-0",
        onOpen && "cursor-pointer active:bg-accent/[0.06]",
        action ? "pr-2" : "pr-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {action ? <div className="flex-none">{action}</div> : null}
    </li>
  );
}

/** Compact StatusBadge sizing for dense list rows (pass as its className). */
export const ROW_BADGE =
  "px-2 py-[3px] text-[10px] tracking-[0.04em]";

/** Pulsing placeholder rows — the RowCardList counterpart of SkeletonCells. */
export function SkeletonRowCards({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <li key={r} className="border-b border-ink/[0.08] px-4 py-3 last:border-0">
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/5 rounded bg-ink/[0.06]" />
            <div className="h-3 w-2/5 rounded bg-ink/[0.06]" />
          </div>
        </li>
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
