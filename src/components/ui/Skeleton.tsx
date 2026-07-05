import { cn } from "@/lib/utils";

/**
 * Base loading placeholder — a shimmering block. Compose it (or use the
 * composed skeletons in this folder) to mirror the shape of the real content.
 *
 * Decorative by default: `aria-hidden` so screen readers skip it. Announce
 * loading on the surrounding region instead (e.g. `aria-busy`).
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("kk-shimmer rounded-md", className)}
      {...props}
    />
  );
}
