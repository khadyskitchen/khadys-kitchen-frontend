import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EmptyTone = "brand" | "neutral" | "success";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "dark";
}

export interface EmptyStateProps {
  /** Glyph shown in the circle — e.g. "✦", "⌕", "✓". */
  glyph?: ReactNode;
  tone?: EmptyTone;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  /** Dashed border treatment (e.g. an empty cart). */
  dashed?: boolean;
  className?: string;
}

const GLYPH_TONE: Record<EmptyTone, string> = {
  brand: "bg-accent/10 text-accent",
  neutral: "bg-ink/[0.07] text-ink",
  success: "bg-[#2E6B3F]/[0.12] text-[#2E6B3F]",
};

const ACTION_VARIANT = {
  primary: "bg-accent text-[#FDFAF3] hover:bg-ink",
  dark: "bg-ink text-cream hover:bg-accent",
};

/**
 * Glyph · title · hint · one action. Use whenever a list, search, or queue has
 * no rows to show. Works on the public site and the admin console.
 */
export function EmptyState({
  glyph = "✦",
  tone = "brand",
  title,
  description,
  action,
  dashed = false,
  className,
}: EmptyStateProps) {
  const actionClass = cn(
    "cursor-pointer rounded-full px-[26px] py-3 text-[13.5px] font-semibold no-underline transition-colors",
    ACTION_VARIANT[action?.variant ?? "primary"],
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-[20px] bg-card p-[clamp(28px,4vw,40px)] text-center",
        dashed ? "border-[1.5px] border-dashed border-ink/25" : "border border-ink/10",
        className,
      )}
    >
      <span
        className={cn(
          "mb-2.5 grid h-[62px] w-[62px] place-items-center rounded-full font-serif text-[24px]",
          GLYPH_TONE[tone],
        )}
        aria-hidden="true"
      >
        {glyph}
      </span>
      <div className="font-serif text-[21px]">{title}</div>
      {description ? (
        <p className="mb-4 max-w-[34ch] text-[14px] leading-[1.6] text-ink/60">{description}</p>
      ) : null}
      {action ? (
        action.href ? (
          <Link href={action.href} className={actionClass}>
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={actionClass}>
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}
