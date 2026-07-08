import {
  brandOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/og-template";

export const alt = "Khady's Kitchen Trainings - hands-on baking classes in Kumasi";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TrainingsOpengraphImage() {
  return brandOgImage({
    eyebrow: "Khady's Kitchen Trainings",
    title: "Learn to bake.",
    subtitle: "Hands-on baking, pastry & wedding-cake classes in Kumasi.",
  });
}
