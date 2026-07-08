import {
  brandOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-template";
import { lookupPublicTraining } from "@/lib/public-api";

export const alt = "Khady's Kitchen Trainings - hands-on baking classes in Kumasi";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Application receipt-code slugs (KK-A…) share this route with class slugs; they
// get the generic branded card rather than a lookup.
const APPLICATION_CODE = /^KK-A[0-9A-Z]{4,}$/i;

/**
 * Per-class OG card. Renders the class name on the brand template; falls back to
 * a generic branded card for receipt-code slugs, unknown classes, or an
 * unreachable backend, so the card never fails a share.
 */
export default async function TrainingOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const training = APPLICATION_CODE.test(slug)
    ? null
    : await lookupPublicTraining(slug).then((l) =>
        l.kind === "found" ? l.data : null,
      );

  return brandOgImage({
    eyebrow: "Khady's Kitchen Trainings",
    title: training?.name ?? "Learn to bake.",
    subtitle: training
      ? "A hands-on baking class in Kumasi."
      : "Hands-on baking, pastry & wedding-cake classes in Kumasi.",
  });
}
