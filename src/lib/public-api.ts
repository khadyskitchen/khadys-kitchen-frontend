// Server-side fetchers for the public API — used by the file-convention SEO
// surfaces (sitemap, generateMetadata) where the RTK Query client isn't
// available. Mirrors dms-frontend's sitemap fetcher: responses are cached with
// a revalidate window and failures are swallowed so a backend hiccup never
// breaks a sitemap or a page render.
const serverUri = process.env.NEXT_PUBLIC_SERVER_URI;

const REVALIDATE_SECONDS = 3600;

/** The public product DTO fields the SEO surfaces care about. */
export interface PublicProduct {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  updatedAt?: string;
  createdAt?: string;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!serverUri) return null;
  try {
    const response = await fetch(`${serverUri}/api/v1${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      console.error(`Public API: ${path} responded ${String(response.status)}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Public API: error fetching ${path}:`, error);
    return null;
  }
}

/** The whole public catalogue (one generous page — a small bakery's worth).
 * The backend caps `limit` at 100 (paginationQuery in common-validation.ts);
 * asking for more is a 400 that `fetchJson` would swallow into an empty
 * sitemap, so we request exactly the cap. */
export async function fetchPublicProducts(): Promise<PublicProduct[]> {
  const json = await fetchJson<{ data?: PublicProduct[] }>(
    "/products?limit=100",
  );
  return Array.isArray(json?.data) ? json.data : [];
}

/** A single product by slug, or null when unknown/unreachable. */
export async function fetchPublicProduct(
  slug: string,
): Promise<PublicProduct | null> {
  const json = await fetchJson<{ data?: PublicProduct }>(
    `/products/${encodeURIComponent(slug)}`,
  );
  return json?.data ?? null;
}
