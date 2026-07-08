import {
  brandOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-template";

export const alt = "Khady's Kitchen Shop - order custom bakes in Kumasi";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ShopOpengraphImage() {
  return brandOgImage({
    eyebrow: "The Shop · Order custom bakes",
    title: "Baked to order.",
    subtitle: "Croissants, sourdough, celebration cakes & more - fresh for pickup.",
  });
}
