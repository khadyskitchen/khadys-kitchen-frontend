import { Skeleton } from "@/components/ui/Skeleton";

/** Placeholder mirroring a TrainingCard: cover image, schedule eyebrow,
 * title, summary lines, and the hairline price row. */
export function TrainingCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-[18px] border border-ink/10 bg-card"
      aria-busy="true"
    >
      <Skeleton className="h-[240px] rounded-none" />
      <div className="grid gap-3 px-6 pb-[26px] pt-[22px]">
        <Skeleton className="h-3 w-[45%]" />
        <Skeleton className="h-[22px] w-[75%]" />
        <Skeleton className="h-3 w-[95%]" />
        <Skeleton className="h-3 w-[62%]" />
        <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-ink/10 pt-3.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/** The catalogue/featured grid of training-card skeletons. */
export function TrainingGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 gap-[clamp(20px,3vw,32px)] sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, i) => (
        <TrainingCardSkeleton key={i} />
      ))}
    </div>
  );
}
