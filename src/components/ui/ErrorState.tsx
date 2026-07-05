import { cn } from "@/lib/utils";
import { extractApiError } from "@/lib/extract-api-error";

export interface ErrorStateProps {
  /** Any error — normalized into a message. Ignored if `description` is set. */
  error?: unknown;
  title?: string;
  description?: string;
  /** Primary retry handler; renders a "Try again" button. */
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Fetch-failed / retry card. Pass an RTK-Query error and it is normalized via
 * `extractApiError`, or pass an explicit `description`.
 */
export function ErrorState({
  error,
  title = "Couldn't load this",
  description,
  onRetry,
  retryLabel = "↻ Try again",
  className,
}: ErrorStateProps) {
  const message = description ?? (error !== undefined ? extractApiError(error).message : "Something went wrong on our side.");

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-1.5 rounded-[20px] border border-ink/10 bg-card p-[clamp(26px,4vw,36px)] text-center",
        className,
      )}
    >
      <span
        className="mb-2 grid h-14 w-14 place-items-center rounded-full bg-danger/[0.08] font-serif text-[22px] text-danger"
        aria-hidden="true"
      >
        !
      </span>
      <div className="font-serif text-[20px]">{title}</div>
      <p className="mb-3.5 max-w-[32ch] text-[14px] leading-[1.6] text-ink/60">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="cursor-pointer rounded-full border-[1.5px] border-ink/30 bg-transparent px-[26px] py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
