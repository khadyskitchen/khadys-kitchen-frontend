"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useGetPublicGalleryImagesQuery } from "@/redux/gallery/gallery-api";
import type { IGalleryImage } from "@/types/gallery.types";

const SLIDE_MS = 5000;
const MOBILE_PAGE_SIZE = 12;

const altFor = (photo: IGalleryImage) =>
  photo.caption ?? "Inside Khady's Kitchen";

const arrowButton =
  "grid h-[46px] w-[46px] flex-none cursor-pointer place-items-center rounded-full border-[1.5px] border-ink/25 bg-transparent text-[17px] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-35 disabled:hover:border-ink/25 disabled:hover:text-ink";

/**
 * The public gallery. From `md` up (tablets included — the carousel needs the
 * width) it's a slideshow: the active photo large, a prev/next + filmstrip
 * row beneath it, auto-advancing until the visitor pauses it or asks for
 * reduced motion. Below `md` it's a 2-column grid of 12 per page with the
 * shop-style pager. The `/gallery` page server-fetches `initialImages` so the
 * first HTML is real content; RTK Query hydrates over it.
 */
export function GalleryShowcase({
  initialImages = [],
}: {
  initialImages?: IGalleryImage[];
}) {
  const { data, isLoading, isError, error, refetch } =
    useGetPublicGalleryImagesQuery({ limit: 100 });
  const photos = data?.data ?? initialImages;

  // ── Slideshow state (md and up) ─────────────────────────────
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const count = photos.length;
  // Clamp against the live list — a refetch can shrink it under the raw index.
  const shownIndex = Math.min(index, Math.max(0, count - 1));
  const active = photos[shownIndex];

  // Visitors who ask the OS for less motion get a still gallery by default —
  // the play button can still opt back in.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot init from a browser-only API
      setPaused(true);
    }
  }, []);

  // Auto-advance. Depending on `index` restarts the clock after a manual
  // move, so the next slide always gets its full stay.
  useEffect(() => {
    if (paused || hovering || count < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, hovering, count, index]);

  // Keep the active thumbnail in view as the strip slides along.
  useEffect(() => {
    thumbRefs.current[shownIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [shownIndex]);

  // ── Mobile grid state ───────────────────────────────────────
  const [page, setPage] = useState(1);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const pageCount = Math.max(1, Math.ceil(count / MOBILE_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = photos.slice(
    (currentPage - 1) * MOBILE_PAGE_SIZE,
    currentPage * MOBILE_PAGE_SIZE,
  );
  const goToPage = (n: number) => {
    setPage(Math.min(Math.max(1, n), pageCount));
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Only surface error/loading when there's no server-rendered list to show.
  if (isError && count === 0) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  if (isLoading && count === 0) {
    return (
      <div aria-busy="true">
        <div className="hidden md:block">
          <Skeleton className="aspect-[16/9] w-full rounded-[22px]" />
          <div className="mt-4 flex items-center gap-3">
            <Skeleton className="h-[46px] w-[46px] rounded-full" />
            <div className="flex flex-1 gap-2.5 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[64px] w-[88px] flex-none rounded-[10px]" />
              ))}
            </div>
            <Skeleton className="h-[46px] w-[46px] rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-[16px]" />
          ))}
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <EmptyState
        title="The gallery is warming up."
        description="We're picking out our favourite shots from the kitchen - check back soon."
        className="my-2"
      />
    );
  }

  const prev = () => setIndex((shownIndex - 1 + count) % count);
  const next = () => setIndex((shownIndex + 1) % count);

  return (
    <>
      {/* ── Slideshow: tablets and up ─────────────────────────── */}
      <section
        aria-roledescription="carousel"
        aria-label="Photos from the kitchen"
        className="hidden md:block"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          aria-live={paused ? "polite" : "off"}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-[22px] border border-ink/10 bg-oat"
        >
          {active ? (
            <Image
              key={active.id}
              src={active.image}
              alt={altFor(active)}
              fill
              priority
              sizes="(max-width: 1280px) 92vw, 1184px"
              className="object-cover"
              style={{ animation: "kk-fadein .6s both" }}
            />
          ) : null}
          {active?.caption ? (
            <p className="absolute inset-x-0 bottom-0 m-0 bg-gradient-to-t from-black/60 to-transparent px-[clamp(18px,3vw,30px)] pb-[18px] pt-12 text-[15.5px] font-medium text-[#FDFAF3]">
              {active.caption}
            </p>
          ) : null}
          <span className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[12.5px] font-semibold tracking-[0.06em] text-[#FDFAF3]">
            {shownIndex + 1} / {count}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={prev}
            className={arrowButton}
          >
            ←
          </button>

          <div className="flex flex-1 gap-2.5 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                aria-label={`Photo ${i + 1}${p.caption ? `: ${p.caption}` : ""}`}
                aria-current={i === shownIndex ? "true" : undefined}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-[64px] w-[88px] flex-none cursor-pointer overflow-hidden rounded-[10px] border-2 transition-all",
                  i === shownIndex
                    ? "border-accent"
                    : "border-transparent opacity-55 hover:opacity-90",
                )}
              >
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="88px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next photo"
            onClick={next}
            className={arrowButton}
          >
            →
          </button>
          <button
            type="button"
            aria-pressed={paused}
            aria-label={paused ? "Resume the slideshow" : "Pause the slideshow"}
            title={paused ? "Resume the slideshow" : "Pause the slideshow"}
            onClick={() => setPaused((p) => !p)}
            className={cn(arrowButton, "text-[14px]", paused && "border-accent text-accent")}
          >
            {paused ? "▶" : "❚❚"}
          </button>
        </div>
      </section>

      {/* ── Grid: phones ──────────────────────────────────────── */}
      <div ref={gridTopRef} className="scroll-mt-24 md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {paged.map((p) => (
            <figure
              key={p.id}
              className="relative m-0 aspect-square overflow-hidden rounded-[16px] border border-ink/10 bg-oat"
            >
              <Image
                src={p.image}
                alt={altFor(p)}
                fill
                sizes="50vw"
                className="object-cover"
              />
              {p.caption ? (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2.5 pt-8 text-[12px] font-medium leading-snug text-[#FDFAF3]">
                  <span className="line-clamp-2">{p.caption}</span>
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>

        {pageCount > 1 ? (
          <div className="mt-[clamp(24px,5vw,40px)] flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
              className={arrowButton}
            >
              ←
            </button>
            <span className="px-3.5 text-[14px] font-semibold tracking-[0.06em] text-ink/70">
              Page {currentPage} of {pageCount}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage >= pageCount}
              onClick={() => goToPage(currentPage + 1)}
              className={arrowButton}
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
