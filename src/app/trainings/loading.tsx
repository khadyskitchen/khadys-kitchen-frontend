import { Skeleton } from "@/components/ui/Skeleton";
import { TrainingGridSkeleton } from "@/components/trainings/training-card-skeleton";

/**
 * Shown while `/trainings` fetches the catalogue server-side. Wrapped in the
 * page's cream background since the trainings routes render their own header
 * (there's no shared layout) — so the load state stays branded.
 */
export default function TrainingsLoading() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-cream text-ink">
      <section
        aria-busy="true"
        className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] pb-[clamp(28px,4vw,48px)] pt-[clamp(40px,6vw,72px)]"
      >
        <div className="grid gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-[clamp(38px,5vw,62px)] w-3/4 max-w-[620px]" />
          <Skeleton className="h-4 w-full max-w-[520px]" />
        </div>
      </section>
      <section className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] pb-[clamp(56px,8vw,100px)]">
        <TrainingGridSkeleton />
      </section>
    </div>
  );
}
