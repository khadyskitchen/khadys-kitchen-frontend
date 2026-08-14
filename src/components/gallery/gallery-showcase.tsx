"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { useGetPublicGalleryImagesQuery } from "@/redux/gallery/gallery-api";
import type { IGalleryImage } from "@/types/gallery.types";

const PAGE_SIZE = 12;

const altFor = (photo: IGalleryImage) =>
  photo.caption ?? "Inside Khady's Kitchen";

/** Varying print proportions give the board its scrapbook rhythm - cycled by
 * position so the layout is organic but stable across renders. */
const PRINT_ASPECTS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[5/4]",
] as const;

const arrowButton =
  "grid h-[44px] w-[44px] flex-none cursor-pointer place-items-center rounded-full border-[1.5px] border-ink/25 bg-transparent text-[16px] text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-35 disabled:hover:border-ink/25 disabled:hover:text-ink";

/**
 * The public gallery - a photo-diary board. Every photo is a framed print on
 * the counter: masonry columns with varying print proportions, a serif-italic
 * caption written beneath each like a bakery label, and the date in small
 * caps. Tapping a print opens it at full size with prev/next browsing. One
 * layout at every width (1-col on narrow phones, up to 3 columns on desktop);
 * `/gallery` server-fetches `initialImages` so the first HTML is real content.
 */
export function GalleryShowcase({
  initialImages = [],
}: {
  initialImages?: IGalleryImage[];
}) {
  const { data, isLoading, isError, error, refetch } =
    useGetPublicGalleryImagesQuery({ limit: 100 });
  const photos = data?.data ?? initialImages;
  const count = photos.length;

  // Paging keeps long diaries browsable instead of one endless scroll.
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = photos.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const goToPage = (n: number) => {
    setPage(Math.min(Math.max(1, n), pageCount));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // The enlarged print - tracked by index so ‹ › can walk the whole diary.
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const viewing = viewingIndex === null ? null : photos[viewingIndex];
  const stepViewing = (delta: number) => {
    setViewingIndex((i) => (i === null ? i : (i + delta + count) % count));
  };

  // Browse the enlarged view with the keyboard's arrow keys.
  useEffect(() => {
    if (viewingIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      const delta = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
      if (delta !== 0) {
        setViewingIndex((i) => (i === null ? i : (i + delta + count) % count));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewingIndex, count]);

  // Only surface error/loading when there's no server-rendered list to show.
  if (isError && count === 0) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  if (isLoading && count === 0) {
    return (
      <div
        aria-busy="true"
        className="columns-1 gap-4 min-[420px]:columns-2 md:columns-3 md:gap-5"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="mb-4 break-inside-avoid overflow-hidden rounded-[18px] border border-ink/10 bg-card md:mb-5"
          >
            <Skeleton
              className={cn("w-full rounded-none", PRINT_ASPECTS[i % 4])}
            />
            <div className="space-y-2 px-3.5 py-3">
              <Skeleton className="h-3.5 w-4/5" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
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

  return (
    <>
      {/* ── The diary board ───────────────────────────────────── */}
      <div className="columns-1 gap-4 min-[420px]:columns-2 md:columns-3 md:gap-5">
        {paged.map((p, i) => {
          const absoluteIndex = (currentPage - 1) * PAGE_SIZE + i;
          return (
            <figure
              key={p.id}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-[18px] border border-ink/10 bg-card md:mb-5"
              style={{ animation: `kk-rise .5s ${String(Math.min(i * 0.05, 0.4))}s both` }}
            >
              <button
                type="button"
                onClick={() => setViewingIndex(absoluteIndex)}
                aria-label={`View photo${p.caption ? `: ${p.caption}` : ""}`}
                className={cn(
                  "relative block w-full cursor-zoom-in overflow-hidden",
                  PRINT_ASPECTS[absoluteIndex % 4],
                )}
              >
                <Image
                  src={p.image}
                  alt={altFor(p)}
                  fill
                  sizes="(max-width: 420px) 92vw, (max-width: 768px) 46vw, 30vw"
                  className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(.16,.84,.28,1)] motion-reduce:transition-none group-hover:scale-[1.045]"
                />
              </button>
              {/* The label under the print - serif italic, like it was
                  written on by hand; the date in quiet small caps. */}
              <figcaption className="px-3.5 pb-3 pt-2.5 min-[420px]:px-4">
                <p
                  className={cn(
                    "m-0 line-clamp-2 font-serif text-[14.5px] italic leading-snug",
                    p.caption ? "text-ink/80" : "text-ink/40",
                  )}
                >
                  {p.caption ?? "Inside Khady’s Kitchen"}
                </p>
                <p className="m-0 mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent/80">
                  {formatDate(p.createdAt)}
                </p>
              </figcaption>
            </figure>
          );
        })}
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

      {/* ── The enlarged print, with ‹ › browsing ─────────────── */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewingIndex(null)}
        labelledBy="gallery-lightbox-caption"
        className="max-w-[640px] p-3 sm:p-3"
      >
        {viewing ? (
          <figure className="m-0">
            <div className="relative">
              <Image
                key={viewing.id}
                src={viewing.image}
                alt={altFor(viewing)}
                width={1200}
                height={900}
                sizes="92vw"
                className="h-auto max-h-[70dvh] w-full rounded-[14px] object-contain"
                style={{ animation: "kk-fadein .3s both" }}
              />
              <span className="absolute right-2.5 top-2.5 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.06em] text-card">
                {(viewingIndex ?? 0) + 1} / {count}
              </span>
            </div>
            <figcaption
              id="gallery-lightbox-caption"
              className="flex items-center justify-between gap-3 px-1 pb-1 pt-3"
            >
              <span className="min-w-0">
                <span className="block font-serif text-[14.5px] italic leading-snug text-ink/85">
                  {viewing.caption ?? "Inside Khady’s Kitchen"}
                </span>
                <span className="mt-1 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent/80">
                  {formatDate(viewing.createdAt)}
                </span>
              </span>
              {count > 1 ? (
                <span className="flex flex-none gap-2">
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => stepViewing(-1)}
                    className={cn(arrowButton, "h-[38px] w-[38px] text-[14px]")}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => stepViewing(1)}
                    className={cn(arrowButton, "h-[38px] w-[38px] text-[14px]")}
                  >
                    →
                  </button>
                </span>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </Modal>
    </>
  );
}
