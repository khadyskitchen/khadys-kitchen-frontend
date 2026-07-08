import {
  brandOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-template";
import { lookupPublicProduct } from "@/lib/public-api";

export const alt = "Khady's Kitchen - order custom bakes in Kumasi";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Per-product OG card. Renders the product name on the brand template; falls
 * back to a generic branded card when the product is unknown or the backend is
 * unreachable, so the card never fails a share.
 */
export default async function ProductOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lookup = await lookupPublicProduct(slug);
  const product = lookup.kind === "found" ? lookup.data : null;

  return brandOgImage({
    eyebrow: "The Shop · Order custom bakes",
    title: product?.name ?? "Baked to order.",
    subtitle: product
      ? "Baked to order for pickup in Kumasi."
      : "Croissants, sourdough, celebration cakes & more.",
  });
}
