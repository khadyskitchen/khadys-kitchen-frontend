"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { useGetMeQuery, useLogoutMutation } from "@/redux/auth/auth-api";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Gates the admin console on a *validated* session - the real protection beyond
 * the proxy's cookie-presence check.
 *
 * The proxy blocks visitors with no `refreshToken` cookie, but it can't tell a
 * live session from a stale or tampered cookie. This guard calls `GET /auth/me`
 * (which flows through the api-slice's silent refresh on a 401): a valid session
 * resolves and renders the console; a *rejected* one (401/403) is cleared and
 * bounced to `/login?from=...`. A network or server error is NOT treated as a
 * dead session - the guard renders optimistically from the persisted user, or
 * shows a retry card, so a wifi blip never destroys a live session server-side.
 * A persisted user renders optimistically while `/me` revalidates in the
 * background - but only after hydration: the persisted user lives in
 * localStorage, which the server can't see, so the first client render must
 * match the server's loading screen or React reports a hydration mismatch.
 *
 * Error handling follows the RTK cached-error rule: act on
 * `isError && !isFetching` so a cached rejection served during a revalidating
 * remount can't kill a brand-new session (login/2FA also seed the `getMe`
 * cache for the same reason - see auth-api.ts).
 */

// Hydration-safe "are we on the client yet" - false on the server and on the
// first client render, true right after, with no setState-in-effect.
const emptySubscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

/** True only when the server itself rejected the session (not a network blip). */
const isSessionRejection = (error: unknown): boolean => {
  const status = (error as { status?: unknown } | undefined)?.status;
  return status === 401 || status === 403;
};

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const cachedUser = useCurrentUser();
  const hydrated = useHydrated();
  const { data, error, isError, isFetching, refetch } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const handled = useRef(false);

  const settledError = isError && !isFetching;
  const sessionDead = settledError && isSessionRejection(error);

  useEffect(() => {
    if (sessionDead && !handled.current) {
      handled.current = true;
      // The session is invalid (commonly a stale cookie from a reset DB). Clear
      // the httpOnly cookies server-side so the proxy's gate no longer treats
      // this as a session, then land on sign-in. Redirect regardless of the
      // logout result so a backend hiccup can't strand us on a spinner.
      logout()
        .unwrap()
        .catch(() => {})
        .finally(() => {
          router.replace(`/login?from=${encodeURIComponent(pathname)}`);
        });
    }
  }, [sessionDead, logout, pathname, router]);

  // Once the check has failed, hold the loading screen while the redirect fires.
  // (getMe's onQueryStarted also clears the persisted user on a 401/403, so
  // `cachedUser` is null here - we never leak the console to a dead session.)
  if (sessionDead) return <LoadingScreen />;

  // Verified by /me, or optimistic from a persisted user while the check runs
  // (post-hydration only - see the note above). A network/server error with a
  // persisted user also lands here: the session is probably still fine, and
  // the console's own queries surface their errors individually.
  if (data || (hydrated && cachedUser)) return <>{children}</>;

  // Network/server error with nothing to render optimistically: offer a retry
  // instead of tearing the session down.
  if (settledError) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-6">
        <ErrorState
          error={error}
          title="Couldn't reach the server"
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  // First load with no persisted user: wait for /me before revealing anything.
  return <LoadingScreen />;
}
