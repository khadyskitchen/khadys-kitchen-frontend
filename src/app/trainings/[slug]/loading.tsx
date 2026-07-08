import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Shown while `/trainings/[slug]` fetches the class server-side. Mirrors the
 * detail layout (cover hero + heading and summary lines) so a click from the
 * catalogue lands on a page-shaped placeholder. Kept branded (cream bg) since
 * the trainings routes render their own header rather than a shared layout.
 */
export default function TrainingLoading() {
  return (
    <div aria-busy="true" className="min-h-screen bg-cream text-ink">
      <Skeleton className="h-[clamp(380px,50vw,520px)] w-full rounded-none" />
      <div className="mx-auto max-w-[1180px] px-[clamp(20px,5vw,48px)] py-[clamp(36px,5vw,64px)]">
        <Skeleton className="mb-5 h-8 w-2/3" />
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
