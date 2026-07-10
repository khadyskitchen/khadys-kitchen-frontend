import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchPublicProducts, fetchPublicTrainings } from "@/lib/public-api";
import { shopProduct, trainingDetail } from "@/lib/routes";

const lastModified = (record: {
  updatedAt?: string;
  createdAt?: string;
}): Date =>
  record.updatedAt
    ? new Date(record.updatedAt)
    : new Date(record.createdAt ?? Date.now());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, trainings] = await Promise.all([
    fetchPublicProducts(),
    fetchPublicTrainings(),
  ]);
  const now = new Date();

  // Cart/checkout/verify/order-tracking are transactional (no SEO value).
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/trainings`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/gallery`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Product detail pages come from the live catalogue (admin-managed); a
  // backend hiccup just leaves the static pages (fetch failures return []).
  const productPages: MetadataRoute.Sitemap = products
    .filter((product) => Boolean(product.slug))
    .map((product) => ({
      url: `${siteUrl}${shopProduct(product.slug)}`,
      lastModified: lastModified(product),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Training class pages, same treatment.
  const trainingPages: MetadataRoute.Sitemap = trainings
    .filter((training) => Boolean(training.slug))
    .map((training) => ({
      url: `${siteUrl}${trainingDetail(training.slug)}`,
      lastModified: lastModified(training),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticPages, ...productPages, ...trainingPages];
}
