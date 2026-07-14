import { cn } from "@/lib/utils";

interface TitlePriceRowProps {
  name: string;
  price: string;
  /** Font classes for the title (must match the card's title styling). */
  nameClassName: string;
  /** Font classes for the price. */
  priceClassName: string;
  /**
   * Extra classes for the row itself. Height reservations (`min-h-*`) belong
   * HERE, not on the title: reserving lines on the title leaves a phantom
   * empty line between a one-line title and a price that wrapped below it,
   * while reserving on the row keeps the price snug under the title's real
   * last line and still gives every card in a grid the same height.
   */
  className?: string;
}

/**
 * Title + price on one row when they fit, with the price dropping onto its own
 * line beneath the title when they don't — without ever forcing a title that
 * would otherwise fit on one line to wrap just to keep the price beside it.
 *
 * Pure CSS (no measuring, so it's immune to web-font load timing):
 * - `flex-wrap` lets the price fall to the next line when it can't fit.
 * - The title `shrink-0`, so flex wraps the price to a new line instead of
 *   squeezing (and wrapping) the title to make room for it.
 * - The title `max-w-full`, so a title that is genuinely wider than the row
 *   still wraps on its own (with the price beneath it) rather than overflowing.
 */
export function TitlePriceRow({
  name,
  price,
  nameClassName,
  priceClassName,
  className,
}: TitlePriceRowProps) {
  return (
    // `content-start` packs the flex lines at the top when the row carries a
    // min-height — without it, `align-content: stretch` spreads a wrapped
    // price line away from the title to fill the reserved space.
    <div
      className={cn(
        "flex flex-wrap content-start items-baseline justify-between gap-x-3 gap-y-1",
        className,
      )}
    >
      <h3 title={name} className={cn(nameClassName, "max-w-full shrink-0 break-words")}>
        {name}
      </h3>
      <span className={cn("whitespace-nowrap", priceClassName)}>{price}</span>
    </div>
  );
}
