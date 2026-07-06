"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TitlePriceRowProps {
  name: string;
  price: string;
  /** Font classes for the title (must match the card's title styling). */
  nameClassName: string;
  /** Font classes for the price. */
  priceClassName: string;
}

const GAP = 12; // px — matches gap-x-3 between title and price

/**
 * Lays a product title and its price on one row, but drops the price onto its
 * own line beneath a full-width title the moment the title can no longer fit on
 * a single line beside it (which would otherwise force the title to wrap into a
 * cramped column). An off-screen single-line clone measures the title's natural
 * width, so the decision is stable and never feeds back into itself.
 */
export function TitlePriceRow({
  name,
  price,
  nameClassName,
  priceClassName,
}: TitlePriceRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [stacked, setStacked] = useState(false);

  useEffect(() => {
    const row = rowRef.current;
    const priceEl = priceRef.current;
    const measure = measureRef.current;
    if (!row || !priceEl || !measure) return;

    const check = () => {
      const available = row.clientWidth - priceEl.offsetWidth - GAP;
      setStacked(measure.scrollWidth > available);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(row);
    return () => observer.disconnect();
  }, [name, price]);

  return (
    <div
      ref={rowRef}
      className={cn(
        "flex items-baseline gap-x-3",
        stacked ? "flex-col items-start gap-y-1" : "justify-between",
      )}
    >
      <h3 className={cn(nameClassName, stacked ? "w-full" : "min-w-0")}>
        {name}
      </h3>
      <span ref={priceRef} className={cn("whitespace-nowrap", priceClassName)}>
        {price}
      </span>

      {/* Off-screen single-line clone used only to measure the title's natural
          width; zero-height and clipped so it never affects layout. */}
      <span aria-hidden className="pointer-events-none block h-0 overflow-hidden">
        <span
          ref={measureRef}
          className={cn("inline-block whitespace-nowrap", nameClassName)}
        >
          {name}
        </span>
      </span>
    </div>
  );
}
