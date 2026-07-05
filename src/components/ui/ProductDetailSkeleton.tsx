import { Skeleton } from "@/components/ui/Skeleton";

/** Placeholder for a product / item detail while it loads. */
export function ProductDetailSkeleton() {
  return (
    <div
      className="flex flex-wrap gap-[18px] rounded-[18px] border border-ink/10 bg-card p-5"
      aria-busy="true"
    >
      <Skeleton className="min-h-[170px] flex-[1_1_140px] rounded-b-[12px] rounded-t-[80px]" />
      <div className="grid flex-[1.4_1_170px] content-start gap-[11px]">
        <Skeleton className="h-2.5 w-[38%]" />
        <Skeleton className="h-[22px] w-[75%]" />
        <Skeleton className="h-3 w-[95%]" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="mt-2 h-11 w-[70%] rounded-full" />
      </div>
    </div>
  );
}
