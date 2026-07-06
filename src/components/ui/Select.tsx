import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Accent (active) styling — e.g. a filter set to a non-default value. */
  active?: boolean;
  /** Class for the positioning wrapper (width, layout). */
  wrapperClassName?: string;
}

/**
 * Brand-styled dropdown. Strips the inconsistent native chrome
 * (`appearance: none`) and draws our own chevron, so a `<select>` looks the same
 * on every OS/browser. Keeps the real `<select>` underneath, so keyboard use and
 * the native option picker (great on mobile) still work. Padding/size/width are
 * overridable via `className` / `wrapperClassName`; everything else stays
 * consistent wherever it's used.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { active = false, className, wrapperClassName, children, ...props },
  ref,
) {
  return (
    <span className={cn("relative inline-flex items-center", wrapperClassName)}>
      <select
        ref={ref}
        className={cn(
          "w-full cursor-pointer appearance-none [-moz-appearance:none] [-webkit-appearance:none] rounded-[10px] border-[1.5px] bg-cream py-[11px] pl-3.5 pr-9 font-sans text-[14.5px] font-medium text-ink outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60",
          active ? "border-accent text-accent" : "border-ink/20 hover:border-ink/40",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "pointer-events-none absolute right-3 h-4 w-4 transition-colors",
          active ? "text-accent" : "text-ink/45",
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
});
