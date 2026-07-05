import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/status-colors";

export interface StatusBadgeProps {
  status: string;
  /** Display text; defaults to the status itself. */
  label?: string;
  className?: string;
}

/** Canonical status pill — colors come from the shared `getStatusColor` map. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { bg, color } = getStatusColor(status);
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-3 py-[5px] text-[11.5px] font-semibold uppercase tracking-[0.06em]",
        className,
      )}
      style={{ background: bg, color }}
    >
      {label ?? status}
    </span>
  );
}
