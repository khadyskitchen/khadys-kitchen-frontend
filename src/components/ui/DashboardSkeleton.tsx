import { Skeleton } from "@/components/ui/Skeleton";

const BAR_HEIGHTS = ["40%", "62%", "48%", "80%", "58%", "100%", "36%"];

/** Placeholder for the admin dashboard stat cards + a bar chart. */
export function DashboardSkeleton() {
  return (
    <div className="grid gap-3" aria-busy="true">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="grid gap-2.5 rounded-[16px] border border-ink/10 bg-card p-[18px]">
            <Skeleton className="h-2.5 w-[56%]" />
            <Skeleton className="h-[26px] w-1/2" />
          </div>
        ))}
      </div>
      <div className="rounded-[16px] border border-ink/10 bg-card p-[18px]">
        <Skeleton className="mb-4 h-3 w-[36%]" />
        <div className="flex h-[92px] items-end gap-2">
          {BAR_HEIGHTS.map((h, i) => (
            <Skeleton key={i} className="flex-1 rounded-t-md rounded-b-sm" style={{ height: h }} />
          ))}
        </div>
      </div>
    </div>
  );
}
