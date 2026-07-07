"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "./use-debounce";

/**
 * URL-synced table state: page + a debounced search + string filters.
 *
 * Local state is the source of truth; it seeds once from the URL, then mirrors
 * changes back into the query string. The mirror effect reads the *live* URL
 * (window.location) rather than the reactive `searchParams`, so writing the URL
 * can't feed back and cause a render loop, and it only navigates when the URL
 * actually differs (`router.replace(..., { scroll: false })` — no page jump).
 *
 * `search` is the immediate input value; `queryParams.search` is the debounced
 * value that feeds the RTK query, so typing isn't chatty. Changing the search
 * or a filter resets to page 1. Pass a stable `defaults` (module const) and an
 * optional `prefix` to namespace params when two tables share a page.
 */
export function useTableQuery<F extends Record<string, string>>({
  defaults,
  prefix = "",
  pageSize,
}: {
  defaults: F;
  prefix?: string;
  pageSize?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const key = useCallback(
    (name: string) => (prefix ? `${prefix}_${name}` : name),
    [prefix],
  );

  const [page, setPageState] = useState(() => {
    const parsed = Number(searchParams.get(key("page")) ?? "1");
    return parsed > 0 ? parsed : 1;
  });
  const [searchInput, setSearchInput] = useState(
    () => searchParams.get(key("search")) ?? "",
  );
  const [filters, setFiltersState] = useState<F>(() => {
    const out = { ...defaults };
    for (const name of Object.keys(defaults)) {
      const value = searchParams.get(key(name));
      if (value) (out as Record<string, string>)[name] = value;
    }
    return out;
  });

  const debouncedSearch = useDebounce(searchInput, 350);

  // State → URL. Depends only on state (never on searchParams), reads the live
  // URL to preserve unrelated params, and navigates only when it changed.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const set = (name: string, value: null | string) => {
      if (value) params.set(key(name), value);
      else params.delete(key(name));
    };
    set("page", page > 1 ? String(page) : null);
    set("search", debouncedSearch.trim() || null);
    for (const [name, value] of Object.entries(filters)) {
      set(name, value && value !== defaults[name] ? value : null);
    }
    const qs = params.toString();
    const target = qs ? `${pathname}?${qs}` : pathname;
    if (target !== `${window.location.pathname}${window.location.search}`) {
      router.replace(target, { scroll: false });
    }
  }, [page, debouncedSearch, filters, pathname, key, router, defaults]);

  // URL → state, for browser back/forward only. The mirror above uses
  // `router.replace` (history.replaceState), which does NOT emit `popstate`, so
  // this listener can't fire from our own writes — no feedback loop. A real
  // back/forward changes the URL without touching our state, so we adopt the
  // popped URL's values here; the mirror then sees the URL already matches state
  // and skips navigating (no extra history entry).
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const parsedPage = Number(params.get(key("page")) ?? "1");
      setPageState(parsedPage > 0 ? parsedPage : 1);
      setSearchInput(params.get(key("search")) ?? "");
      const next = { ...defaults };
      for (const name of Object.keys(defaults)) {
        const value = params.get(key(name));
        if (value) (next as Record<string, string>)[name] = value;
      }
      setFiltersState(next);
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [key, defaults]);

  const setSearch = useCallback((value: string) => {
    setSearchInput(value);
    setPageState(1);
  }, []);

  const setFilter = useCallback((name: string, value: string) => {
    setFiltersState((prev) => ({ ...prev, [name]: value }) as F);
    setPageState(1);
  }, []);

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(1, next));
  }, []);

  const queryParams = useMemo(() => {
    const clean: Record<string, unknown> = { page };
    if (pageSize) clean.limit = pageSize;
    if (debouncedSearch.trim()) clean.search = debouncedSearch.trim();
    for (const [name, value] of Object.entries(filters)) {
      if (value && value !== defaults[name]) clean[name] = value;
    }
    return clean;
  }, [page, pageSize, debouncedSearch, filters, defaults]);

  return {
    page,
    search: searchInput,
    filters,
    setSearch,
    setFilter,
    setPage,
    queryParams,
  };
}
