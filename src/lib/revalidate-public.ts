// src/lib/revalidate-public.ts

/**
 * Asks the app to revalidate long-cached public pages on-demand (see
 * /api/revalidate). Call after a successful admin update so the change
 * appears on the public site on the very next reload. Best-effort: failures
 * are swallowed because each page's scheduled ISR window is the backstop.
 */
export async function revalidatePublicPaths(
  ...paths: string[]
): Promise<void> {
  await Promise.all(
    paths.map(async (path) => {
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path }),
        });
      } catch {
        // Non-fatal — the page refreshes on its next scheduled revalidation.
      }
    }),
  );
}
