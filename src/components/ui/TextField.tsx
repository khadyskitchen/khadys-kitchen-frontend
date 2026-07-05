import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Error message — turns the field red and is announced to screen readers. */
  error?: string;
  /** Marks the field valid (green border + check). */
  valid?: boolean;
  /** Helper text shown when there is no error. */
  hint?: string;
}

/**
 * Labelled text input with the design's inline validation states (error / valid).
 * Ref-forwarding so it drops into react-hook-form via `{...register("field")}`.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, valid, hint, className, id, ...props }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const msgId = `${fieldId}-msg`;

    return (
      <div className="grid gap-[7px]">
        <label
          htmlFor={fieldId}
          className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink/60"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? msgId : undefined}
            className={cn(
              "w-full rounded-[12px] border-[1.5px] bg-cream px-[15px] py-3 font-sans text-[15px] text-ink outline-none transition-colors",
              error
                ? "border-danger bg-danger/[0.04]"
                : valid
                  ? "border-[#2E6B3F] bg-[#2E6B3F]/[0.04] pr-9"
                  : "border-ink/20 focus:border-accent",
              className,
            )}
            {...props}
          />
          {valid && !error ? (
            <span
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#2E6B3F]"
              aria-hidden="true"
            >
              ✓
            </span>
          ) : null}
        </div>
        {error ? (
          <span id={msgId} className="text-[12.5px] font-semibold text-danger">
            {error}
          </span>
        ) : hint ? (
          <span id={msgId} className="text-[12.5px] text-ink/55">
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
