"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

// Nothing to subscribe to: hydration happens exactly once.
const emptySubscribe = () => () => {};

/**
 * The pathname nav links mark themselves active against: null on the server
 * and on the first client render, the real pathname once mounted (and on
 * every client navigation after that).
 *
 * Why not `usePathname()` directly: statically prerendered pages (e.g. the
 * ISR'd home page on Vercel) can be baked with an unknown pathname, so their
 * served HTML has no link marked active - and React's production hydration
 * keeps mismatching server attributes, so a nav that never re-renders shows
 * the stale inactive state until the first client navigation. Rendering
 * neutral first and marking active after mount keeps server and first client
 * render identical on every page, then corrects immediately.
 */
export function useActivePathname(): string | null {
  const pathname = usePathname();
  // False during SSR and the hydration render, true immediately after.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  return hydrated ? pathname : null;
}

/**
 * True when `href` is the page currently shown. A null pathname (server /
 * first render, see useActivePathname) marks nothing active. On-page anchor
 * links (e.g. "#about") never count as active - they scroll within a page,
 * they don't navigate. The home route matches only exactly; every other
 * route also matches its sub-paths (so "/trainings" stays active on
 * "/trainings/slug").
 */
export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname || !href || href.startsWith("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The desktop header's nav links, split out into a client component so it can
 * read the current route (`usePathname`) and mark the active page - SiteHeader
 * itself stays a server component.
 */
export function HeaderNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = useActivePathname();
  return (
    <>
      {navLinks.map((link) => {
        const active = isNavActive(pathname, link.href);
        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "no-underline transition-colors hover:text-accent",
              active
                ? "text-accent underline decoration-2 underline-offset-[6px]"
                : "text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
