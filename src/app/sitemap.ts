import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchPublicProducts, type PublicProduct } from "@/lib/public-api";
import { shopProduct } from "@/lib/routes";

const lastModified = (record: PublicProduct): Date =>
  record.updatedAt
    ? new Date(record.updatedAt)
    : new Date(record.createdAt ?? Date.now());

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchPublicProducts();
  const now = new Date();

  // Cart/checkout/verify/order-tracking are transactional (no SEO value).
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
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

  return [...staticPages, ...productPages];
}
