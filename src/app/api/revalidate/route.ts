// src/app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand ISR revalidation, triggered from the admin console after a
 * successful update so changes to long-cached public pages (featured bakes,
 * classes, Our Story, the gallery) go live on the next reload instead of
 * waiting for their scheduled revalidation window.
 *
 * Only an allowlist of public, non-sensitive paths can be revalidated, and
 * this never makes a page dynamic — it just rebuilds the page once on the
 * next request, after which it is served from cache again.
 */
const ALLOWED_PATHS = new Set<string>([
  "/", // featured bakes + featured trainings + Our Story
  "/shop", // shop catalogue
  "/trainings", // class catalogue
  "/gallery", // kitchen photo gallery
]);

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    path?: string;
  } | null;
  const path = body?.path;

  if (typeof path !== "string" || !ALLOWED_PATHS.has(path)) {
    return NextResponse.json(
      { error: "Invalid or disallowed path", revalidated: false },
      { status: 400 },
    );
  }

  revalidatePath(path);
  return NextResponse.json({ path, revalidated: true });
}
