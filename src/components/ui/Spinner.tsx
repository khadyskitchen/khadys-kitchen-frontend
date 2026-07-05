import { cn } from "@/lib/utils";

/** Spinning ring loader. `onAccent` inverts colors for use on accent/dark fills. */
export function Spinner({
  className,
  onAccent = false,
}: {
  className?: string;
  onAccent?: boolean;
}) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block h-4 w-4 rounded-full border-2",
        onAccent
          ? "border-[#FDFAF3]/40 border-t-[#FDFAF3]"
          : "border-ink/25 border-t-ink",
        className,
      )}
      style={{ animation: "kk-spin .8s linear infinite" }}
    />
  );
}
