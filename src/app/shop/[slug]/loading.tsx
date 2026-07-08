import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shown while `/shop/[slug]` fetches the product server-side. Mirrors the
 * detail layout (image + info column) so a click from the list lands on a
 * page-shaped placeholder instead of the list freezing.
 */
export default function ProductLoading() {
  return (
    <section
      aria-busy="true"
      className="mx-auto max-w-[1180px] px-[clamp(20px,5vw,48px)] py-[clamp(36px,5vw,64px)]"
    >
      <Skeleton className="mb-[clamp(24px,3vw,36px)] h-4 w-24" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(32px,5vw,64px)]">
        <Skeleton className="h-[clamp(360px,44vw,540px)] w-full rounded-b-[20px] rounded-t-[min(220px,34vw)]" />
        <div className="grid content-start gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-[clamp(34px,4.4vw,52px)] w-4/5" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-52 rounded-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="mt-4 h-12 w-full max-w-[320px] rounded-full" />
        </div>
      </div>
    </section>
  );
}
