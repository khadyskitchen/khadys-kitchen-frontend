"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import {
  categoryFilters,
  isoDaysFromNow,
  matchesPriceBand,
  priceBands,
  products,
  readyBy,
  sortOptions,
  type Category,
  type PriceBand,
  type SortKey,
} from "@/lib/shop-data";

const PAGE_SIZE = 9;

/**
 * Compact labelled dropdown built on the shared `Select`. A dropdown keeps the
 * toolbar small and scales to any number of options (e.g. a long category list)
 * without a wall of chips.
 */
function LabeledSelect({
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

export function ShopBrowser() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [priceBand, setPriceBand] = useState<PriceBand>("any");
  const [byDate, setByDate] = useState("");
  const [page, setPage] = useState(1);

  // Computed on the client only, so the date <input min> never mismatches on hydration.
  const [tomorrow, setTomorrow] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only init to avoid a hydration mismatch
  useEffect(() => setTomorrow(isoDaysFromNow(1)), []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) =>
        (cat === "all" || p.cat === cat) &&
        matchesPriceBand(p, priceBand) &&
        readyBy(p, byDate) &&
        (!q ||
          `${p.name} ${p.shortDesc} ${p.desc} ${p.catLabel}`
            .toLowerCase()
            .includes(q)),
    );
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "fastest") return [...filtered].sort((a, b) => a.leadDays - b.leadDays);
    if (sort === "name") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [query, cat, sort, priceBand, byDate]);

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (n: number) => {
    setPage(Math.min(Math.max(1, n), pageCount));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Every filter change returns to the first page.
  const pickCategory = (id: string) => {
    setCat(id as "all" | Category);
    setPage(1);
  };
  const pickPriceBand = (id: string) => {
    setPriceBand(id as PriceBand);
    setPage(1);
  };
  const pickSort = (id: string) => {
    setSort(id as SortKey);
    setPage(1);
  };
  const changeQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const changeByDate = (value: string) => {
    setByDate(value);
    setPage(1);
  };

  const hasActiveFilters =
    cat !== "all" ||
    priceBand !== "any" ||
    byDate !== "" ||
    sort !== "featured" ||
    query.trim().length > 0;

  const clearFilters = () => {
    setQuery("");
    setCat("all");
    setSort("featured");
    setPriceBand("any");
    setByDate("");
    setPage(1);
  };

  const resultCount =
    list.length === products.length
      ? `${products.length} bakes`
      : `${list.length} of ${products.length} bakes`;

  const noResultsTitle = query.trim()
    ? `Nothing matches “${query}”.`
    : "Nothing fits those filters.";
  const noResultsHint = byDate
    ? "Your date may be too soon for some bakes - try a later date or clear the filters."
    : "Try another word, or clear the filters.";

  return (
    <>
      <div
        className="mb-[clamp(22px,3vw,32px)] grid gap-3 border-y border-ink/15 py-[18px]"
        style={{ animation: "kk-fadein .8s .6s both" }}
      >
        <div className="flex flex-wrap items-end gap-2.5">
          <div className="relative min-w-[180px] flex-[1_1_200px] sm:max-w-[340px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[16px] top-1/2 -translate-y-1/2 text-[15px] text-ink/45"
            >
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              placeholder="Search bakes, flavours…"
              aria-label="Search the bakes"
              className="w-full rounded-full border-[1.5px] border-ink/20 bg-transparent py-[11px] pl-[40px] pr-[16px] font-sans text-[15px] text-ink outline-none transition-colors focus:border-accent"
            />
          </div>

          <LabeledSelect
            label="Category"
            value={cat}
            active={cat !== "all"}
            onChange={pickCategory}
          >
            {categoryFilters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </LabeledSelect>

          <LabeledSelect
            label="Price"
            value={priceBand}
            active={priceBand !== "any"}
            onChange={pickPriceBand}
          >
            {priceBands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </LabeledSelect>

          <label className="grid gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/55">
            Need by
            <input
              type="date"
              value={byDate}
              min={tomorrow}
              onChange={(e) => changeByDate(e.target.value)}
              className={cn(
                "cursor-pointer rounded-[10px] border-[1.5px] bg-transparent px-3 py-[9px] font-sans text-[14px] font-medium normal-case tracking-normal text-ink outline-none transition-colors focus:border-accent",
                byDate ? "border-accent text-accent" : "border-ink/20",
              )}
            />
          </label>

          <LabeledSelect
            label="Sort"
            value={sort}
            active={sort !== "featured"}
            onChange={pickSort}
            className="sm:ml-auto"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </LabeledSelect>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="whitespace-nowrap text-[13.5px] text-ink/55">
            {resultCount}
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer border-none bg-transparent p-0 font-sans text-[13.5px] font-semibold text-accent underline"
            >
              Clear all ✕
            </button>
          ) : null}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          glyph="⌕"
          tone="neutral"
          title={noResultsTitle}
          description={noResultsHint}
          action={{
            label: "Clear search & filters",
            variant: "dark",
            onClick: clearFilters,
          }}
          className="my-2"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-[clamp(20px,3vw,32px)] sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pageCount > 1 ? (
            <div className="mt-[clamp(32px,5vw,52px)] flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="grid h-[46px] w-[46px] cursor-pointer place-items-center rounded-full border-[1.5px] border-ink/25 bg-transparent text-[17px] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-35 disabled:hover:border-ink/25 disabled:hover:text-ink"
              >
                ←
              </button>

              <div className="hidden gap-2 min-[560px]:flex">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`Page ${n}`}
                    aria-current={n === currentPage ? "page" : undefined}
                    onClick={() => goToPage(n)}
                    className={cn(
                      "grid h-[46px] w-[46px] cursor-pointer place-items-center rounded-full border-[1.5px] text-[15px] font-semibold transition-colors",
                      n === currentPage
                        ? "border-accent bg-accent text-[#FDFAF3]"
                        : "border-ink/20 text-ink hover:border-accent hover:text-accent",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <span className="px-3.5 text-[14px] font-semibold tracking-[0.06em] text-ink/70 min-[560px]:hidden">
                Page {currentPage} of {pageCount}
              </span>

              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage >= pageCount}
                onClick={() => goToPage(currentPage + 1)}
                className="grid h-[46px] w-[46px] cursor-pointer place-items-center rounded-full border-[1.5px] border-ink/25 bg-transparent text-[17px] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-35 disabled:hover:border-ink/25 disabled:hover:text-ink"
              >
                →
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
