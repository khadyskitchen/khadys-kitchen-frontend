"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

/**
 * True when `href` is the page currently shown. On-page anchor links (e.g.
 * "#about") never count as active — they scroll within a page, they don't
 * navigate. The home route matches only exactly; every other route also
 * matches its sub-paths (so "/trainings" stays active on "/trainings/slug").
 */
export function isNavActive(pathname: string, href: string): boolean {
  if (!href || href.startsWith("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The desktop header's nav links, split out into a client component so it can
 * read the current route (`usePathname`) and mark the active page — SiteHeader
 * itself stays a server component.
 */
export function HeaderNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
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
