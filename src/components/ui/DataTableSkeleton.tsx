import { Skeleton } from "@/components/ui/Skeleton";

interface DataTableSkeletonProps {
  /** Number of placeholder rows. */
  rowCount?: number;
  /** Show a leading avatar circle per row. */
  showAvatar?: boolean;
  /** Show a trailing status pill per row. */
  showStatus?: boolean;
}

const ROW_WIDTHS = [
  { w1: "45%", w2: "30%" },
  { w1: "60%", w2: "38%" },
  { w1: "38%", w2: "26%" },
  { w1: "52%", w2: "34%" },
];

/** Placeholder for an admin data table (header + rows) while data loads. */
export function DataTableSkeleton({
  rowCount = 4,
  showAvatar = true,
  showStatus = true,
}: DataTableSkeletonProps) {
  return (
    <div
      className="overflow-hidden rounded-[18px] border border-ink/10 bg-card"
      aria-busy="true"
    >
      <div className="flex gap-3.5 border-b border-ink/10 px-5 py-3.5">
        <Skeleton className="h-2.5 w-[26%]" />
        <Skeleton className="h-2.5 w-[16%]" />
        <Skeleton className="ml-auto h-2.5 w-[14%]" />
      </div>
      {Array.from({ length: rowCount }, (_, i) => {
        const w = ROW_WIDTHS[i % ROW_WIDTHS.length];
        return (
          <div
            key={i}
            className="flex items-center gap-3.5 border-b border-ink/[0.07] px-5 py-[15px]"
          >
            {showAvatar ? <Skeleton className="h-[38px] w-[38px] flex-none rounded-full" /> : null}
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3" style={{ width: w.w1 }} />
              <Skeleton className="h-2.5" style={{ width: w.w2 }} />
            </div>
            {showStatus ? <Skeleton className="h-6 w-[76px] rounded-full" /> : null}
          </div>
        );
      })}
    </div>
  );
}
