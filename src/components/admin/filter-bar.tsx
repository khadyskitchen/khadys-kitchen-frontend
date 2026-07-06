"use client";

import { useState, type ReactNode } from "react";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

/**
 * Labelled dropdown — mirrors the storefront shop filters. A dropdown keeps the
 * toolbar compact and scales to any number of options without a wall of chips.
 */
export function LabeledSelect({
  label,
  value,
  active,
  onChange,
  className,
  children,
}: {
  label: string;
  value: string;
  active: boolean;
  onChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "grid gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55",
        className,
      )}
    >
      {label}
      <Select
        value={value}
        active={active}
        onChange={(e) => onChange(e.target.value)}
        className="py-[9px] text-[14px] normal-case tracking-normal"
      >
        {children}
      </Select>
    </label>
  );
}

/**
 * Admin filter toolbar, styled like the storefront shop: a rounded search field
 * plus labelled dropdowns. On mobile/tablet it collapses behind a "Search &
 * filters" toggle; from lg up it's an inline toolbar.
 */
export function FilterBar({
  search,
  onSearch,
  searchPlaceholder = "Search…",
  activeCount = 0,
  resultLabel,
  action,
  children,
}: {
  search: string;
  onSearch: (value: string) => void;
  searchPlaceholder?: string;
  activeCount?: number;
  resultLabel?: string;
  /** Persistent action (e.g. a "New" button) — stays visible when collapsed. */
  action?: ReactNode;
  /** The LabeledSelect filters. */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-[18px]">
      {/* Mobile / tablet: collapse the toolbar behind a toggle. */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="admin-filters"
          className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/25 px-4 py-2.5 font-sans text-[13px] font-semibold text-ink transition-colors hover:border-accent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-4 w-4"
          >
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Search &amp; filters
          {activeCount > 0 ? (
            <span className="grid h-5 min-w-[20px] place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-[#FDFAF3]">
              {activeCount}
            </span>
          ) : null}
          <span
            aria-hidden="true"
            className={cn("text-[11px] transition-transform", open && "rotate-180")}
          >
            ▾
          </span>
        </button>
        {action ??
          (resultLabel ? (
            <span className="whitespace-nowrap text-[13px] text-ink/55">
              {resultLabel}
            </span>
          ) : null)}
      </div>

      {/* Controls: stacked column on mobile (revealed by the toggle), inline
          toolbar from lg up. */}
      <div
        id="admin-filters"
        className={cn(
          "mt-3 gap-3 lg:mt-0",
          open ? "grid grid-cols-2" : "hidden",
          "lg:flex lg:flex-wrap lg:items-end lg:gap-2.5",
        )}
      >
        <div className="relative col-span-2 lg:col-span-1 lg:min-w-[180px] lg:max-w-[320px] lg:flex-[1_1_200px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-ink/45"
          >
            ⌕
          </span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full rounded-full border-[1.5px] border-ink/20 bg-transparent py-[10px] pl-10 pr-10 font-sans text-[14.5px] text-ink outline-none transition-colors focus:border-accent"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full bg-ink/10 text-[11px] font-bold text-ink/55 transition-colors hover:bg-ink/20 hover:text-ink"
            >
              ✕
            </button>
          ) : null}
        </div>

        {children}

        <div className="col-span-2 hidden items-center justify-end gap-3 lg:ml-auto lg:flex">
          {resultLabel ? (
            <span className="whitespace-nowrap text-[13px] text-ink/55">
              {resultLabel}
            </span>
          ) : null}
          {action}
        </div>
      </div>
    </div>
  );
}
