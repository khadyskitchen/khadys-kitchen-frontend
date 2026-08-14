// @vitest-environment node
//
// The data layer runs in the node environment: jsdom ships an AbortSignal that
// isn't an undici AbortSignal, so fetchBaseQuery's Request construction throws
// under jsdom. Node's real fetch/Request/AbortSignal are internally consistent.
import { afterEach, describe, it, expect, vi } from "vitest";
import { makeTestStore } from "../helpers/store";
import { authApi } from "@/redux/auth/auth-api";
import { userLoggedIn } from "@/redux/auth/auth-slice";
import { UserRole, type IUser } from "@/types/user.types";

const USER: IUser = {
  id: "u1",
  firstName: "Khady",
  lastName: "Asante",
  email: "khady@khadyskitchen.com",
  phone: null,
  profilePicture: null,
  role: UserRole.ADMIN,
  twoFactorEnabled: false,
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Stub global fetch with a (url) -> Response resolver, recording every URL. */
function stubFetch(resolver: (url: string) => Response) {
  const calls: string[] = [];
  const mock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : (input as Request).url ?? String(input);
    calls.push(url);
    return resolver(url);
  });
  vi.stubGlobal("fetch", mock);
  return { calls };
}

afterEach(() => vi.unstubAllGlobals());

describe("auth session wiring", () => {
  it("login stores the user unwrapped from data.data.user", async () => {
    stubFetch(() => json({ message: "Login successful", data: { user: USER } }));
    const store = makeTestStore();

    await store.dispatch(
      authApi.endpoints.login.initiate({ email: USER.email, password: "x" }),
    );

    // If the nesting were wrong this would be `{ user: USER }`, not `USER`.
    expect(store.getState().auth.user).toEqual(USER);
  });

  it("a 2FA challenge does not create a session", async () => {
    stubFetch(() =>
      json({ message: "Enter the code", data: { requiresTwoFactor: true, email: "kh***@x.com" } }),
    );
    const store = makeTestStore();

    const res = await store.dispatch(
      authApi.endpoints.login.initiate({ email: USER.email, password: "x" }),
    );

    expect(store.getState().auth.user).toBeNull();
    expect(res.data?.data).toMatchObject({ requiresTwoFactor: true });
  });

  it("getMe validates the session and stores the user", async () => {
    stubFetch(() => json({ message: "Current user", data: { user: USER } }));
    const store = makeTestStore();

    await store.dispatch(authApi.endpoints.getMe.initiate());

    expect(store.getState().auth.user).toEqual(USER);
  });

  it("getMe on an invalid session clears the user (fail-closed)", async () => {
    // Both /me and the refresh it triggers return 401.
    stubFetch(() => json({ status: "error", message: "Unauthorized" }, 401));
    const store = makeTestStore();
    store.dispatch(userLoggedIn({ user: USER })); // seed a stale user

    await store.dispatch(authApi.endpoints.getMe.initiate());

    expect(store.getState().auth.user).toBeNull();
  });

  it("login seeds the getMe cache so the guard starts from a resolved session", async () => {
    stubFetch(() => json({ message: "Login successful", data: { user: USER } }));
    const store = makeTestStore();

    await store.dispatch(
      authApi.endpoints.login.initiate({ email: USER.email, password: "x" }),
    );
    // The seed happens in onQueryStarted's continuation - flush microtasks.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const me = authApi.endpoints.getMe.select()(store.getState());
    expect(me.isSuccess).toBe(true);
    expect(me.data?.data.user).toEqual(USER);
  });

  it("a failed refresh records the getMe rejection (no mid-flight state reset)", async () => {
    // Regression for the reauth loop: resetting the api state while getMe is
    // still in flight wiped its substate, so the rejection was never recorded
    // and a mounted useGetMeQuery re-initiated forever. The guard needs the
    // 401 to land in the query state exactly once.
    const { calls } = stubFetch(() =>
      json({ status: "error", message: "Unauthorized" }, 401),
    );
    const store = makeTestStore();
    store.dispatch(userLoggedIn({ user: USER })); // seed a stale user

    await store.dispatch(authApi.endpoints.getMe.initiate());

    const me = authApi.endpoints.getMe.select()(store.getState());
    expect(me.isError).toBe(true);
    expect((me.error as { status?: number } | undefined)?.status).toBe(401);
    expect(store.getState().auth.user).toBeNull();
    // Exactly one refresh attempt - no loop.
    expect(calls.filter((u) => u.includes("/auth/refresh-token"))).toHaveLength(1);
  });

  it("a network failure on getMe keeps the persisted user (only 401/403 fail closed)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("fetch failed");
      }),
    );
    const store = makeTestStore();
    store.dispatch(userLoggedIn({ user: USER }));

    await store.dispatch(authApi.endpoints.getMe.initiate());

    // A wifi blip must not destroy the session client-side.
    expect(store.getState().auth.user).toEqual(USER);
  });

  it("a 401 triggers a single silent refresh, then retries the request", async () => {
    let meCount = 0;
    const { calls } = stubFetch((url) => {
      if (url.includes("/auth/refresh-token")) {
        return json({ message: "Session refreshed", data: { user: USER } });
      }
      if (url.includes("/auth/me")) {
        meCount += 1;
        return meCount === 1 ? json({ message: "no" }, 401) : json({ message: "Current user", data: { user: USER } });
      }
      return json({ message: "unexpected" }, 404);
    });
    const store = makeTestStore();

    await store.dispatch(authApi.endpoints.getMe.initiate());

    expect(store.getState().auth.user).toEqual(USER);
    expect(calls.filter((u) => u.includes("/auth/refresh-token"))).toHaveLength(1);
    expect(calls.filter((u) => u.includes("/auth/me"))).toHaveLength(2); // original + retry
  });
});
