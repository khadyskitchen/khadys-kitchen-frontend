// The on-demand ISR seam: the /api/revalidate route only rebuilds allowlisted
// public paths, and the admin-side helper fires one best-effort request per
// path without ever throwing into the mutation flow that called it.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath }));

import { POST } from "@/app/api/revalidate/route";
import { revalidatePublicPaths } from "@/lib/revalidate-public";

const post = (body: unknown) =>
  POST(
    new Request("http://localhost/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

describe("POST /api/revalidate", () => {
  beforeEach(() => revalidatePath.mockClear());

  it("revalidates an allowlisted public path", async () => {
    const res = await post({ path: "/gallery" });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      path: "/gallery",
      revalidated: true,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/gallery");
  });

  it("refuses a path outside the allowlist", async () => {
    const res = await post({ path: "/admin" });
    expect(res.status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("refuses malformed bodies without touching the cache", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ path: 42 })).status).toBe(400);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("revalidatePublicPaths", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("posts one revalidation request per path", async () => {
    await revalidatePublicPaths("/", "/shop");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const bodies = fetchMock.mock.calls.map(
      (c) => JSON.parse((c[1] as RequestInit).body as string) as unknown,
    );
    expect(bodies).toEqual([{ path: "/" }, { path: "/shop" }]);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/revalidate");
  });

  it("swallows network failures — the ISR window is the backstop", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    await expect(revalidatePublicPaths("/gallery")).resolves.toBeUndefined();
  });
});
