import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchPublicTrainings } from "@/lib/public-api";
import { trainingDetail } from "@/lib/routes";

const lastModified = (record: {
  updatedAt?: string;
  createdAt?: string;
}): Date =>
  record.updatedAt
    ? new Date(record.updatedAt)
    : new Date(record.createdAt ?? Date.now());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trainings = await fetchPublicTrainings();
  const now = new Date();

  // Cart/checkout/verify/order-tracking are transactional (no SEO value).
  // The shop (/shop and its product pages) is deliberately absent: it is
  // hidden from the public nav, so submitting it would advertise a section
  // the site itself doesn't link to. Re-add it here when the shop goes live.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/trainings`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/trainings/status`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Training class pages come from the live catalogue (admin-managed); a
  // backend hiccup just leaves the static pages (fetch failures return []).
  const trainingPages: MetadataRoute.Sitemap = trainings
    .filter((training) => Boolean(training.slug))
    .map((training) => ({
      url: `${siteUrl}${trainingDetail(training.slug)}`,
      lastModified: lastModified(training),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...trainingPages];
}
