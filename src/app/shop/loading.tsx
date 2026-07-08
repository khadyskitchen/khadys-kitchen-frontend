import { Skeleton } from "@/components/ui/Skeleton";
import { ShopGridSkeleton } from "@/components/ui/ShopCardSkeleton";

/**
 * Shown while `/shop` fetches the catalogue server-side, and (prefetched) the
 * instant a card is clicked so navigation isn't stuck on the previous page.
 * Mirrors the shop hero + product grid.
 */
export default function ShopLoading() {
  return (
    <section
      aria-busy="true"
      className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,80px)]"
    >
      <div className="mb-[clamp(28px,4vw,48px)] grid gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-[clamp(36px,5vw,60px)] w-2/3 max-w-[520px]" />
        <Skeleton className="h-4 w-full max-w-[560px]" />
      </div>
      <ShopGridSkeleton count={6} />
    </section>
  );
}
