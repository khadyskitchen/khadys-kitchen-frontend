import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { RequireAuth } from "@/components/auth/require-auth";

// Mock the data layer + router so the guard's decisions are tested in isolation.
const { getMe, logoutTrigger, replace, current, refetch } = vi.hoisted(() => ({
  getMe: vi.fn(),
  logoutTrigger: vi.fn(),
  replace: vi.fn(),
  current: { user: null as unknown },
  refetch: vi.fn(),
}));

vi.mock("@/redux/auth/auth-api", () => ({
  useGetMeQuery: () => getMe(),
  useLogoutMutation: () => [logoutTrigger, { isLoading: false }],
}));
vi.mock("@/hooks/use-current-user", () => ({ useCurrentUser: () => current.user }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/admin",
}));

/** Build a useGetMeQuery result with the fields the guard reads. */
function meResult(overrides: Record<string, unknown> = {}) {
  return {
    data: undefined,
    error: undefined,
    isError: false,
    isFetching: false,
    refetch,
    ...overrides,
  };
}

beforeEach(() => {
  getMe.mockReset();
  logoutTrigger.mockReset();
  replace.mockReset();
  refetch.mockReset();
  current.user = null;
  logoutTrigger.mockReturnValue({ unwrap: () => Promise.resolve({}) });
});
afterEach(() => cleanup());

describe("RequireAuth", () => {
  it("renders the console when /me confirms the session", () => {
    getMe.mockReturnValue(meResult({ data: { data: { user: { id: "u1" } } } }));
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.getByText("console")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("clears the session and redirects to /login when /me is rejected (401)", async () => {
    getMe.mockReturnValue(
      meResult({ isError: true, error: { status: 401 } }),
    );
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("console")).not.toBeInTheDocument();
    await waitFor(() => expect(logoutTrigger).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/login?from=%2Fadmin"),
    );
  });

  it("ignores a cached rejection while /me is revalidating (isFetching)", () => {
    // The RTK cached-error remount gotcha: a stale rejected result is served
    // while a fresh request is in flight. The guard must not act on it.
    getMe.mockReturnValue(
      meResult({ isError: true, isFetching: true, error: { status: 401 } }),
    );
    current.user = { id: "u1" };
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.getByText("console")).toBeInTheDocument();
    expect(logoutTrigger).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("shows a retry card (not a logout) on a network error with no persisted user", () => {
    getMe.mockReturnValue(
      meResult({ isError: true, error: { status: "FETCH_ERROR", error: "failed" } }),
    );
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("console")).not.toBeInTheDocument();
    expect(screen.getByText("Couldn't reach the server")).toBeInTheDocument();
    expect(logoutTrigger).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("keeps rendering the console on a network error when a persisted user exists", () => {
    getMe.mockReturnValue(
      meResult({ isError: true, error: { status: "FETCH_ERROR", error: "failed" } }),
    );
    current.user = { id: "u1" };
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.getByText("console")).toBeInTheDocument();
    expect(logoutTrigger).not.toHaveBeenCalled();
  });

  it("renders optimistically from a persisted user while /me is in flight", () => {
    getMe.mockReturnValue(meResult());
    current.user = { id: "u1" };
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.getByText("console")).toBeInTheDocument();
  });
});
