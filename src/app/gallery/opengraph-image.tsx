import {
  brandOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-template";

export const alt = "Khady's Kitchen gallery - photos from our Kumasi bakery";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function GalleryOpengraphImage() {
  return brandOgImage({
    eyebrow: "Inside the kitchen",
    title: "Fresh from the ovens.",
    subtitle: "The bakes, the bakers & the busy mornings - in photos.",
    cta: "See the gallery at khadyskitchen.com →",
  });
}
