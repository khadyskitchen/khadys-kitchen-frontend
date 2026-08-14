import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading skeletons for the admin detail and edit pages - each mirrors the
 * real page's layout (same cards, grids and responsive behaviour) so the
 * swap to content is seamless. The generic RippleLoader is reserved for
 * system-level waits (auth gate); anything that loads *content* shows the
 * content's shape instead.
 */

/** Key/value info rows - stacked on phones, side-by-side from 480px. */
function InfoRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between"
        >
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className={cn("h-3.5", i % 2 ? "w-44" : "w-32")} />
        </div>
      ))}
    </div>
  );
}

/** Standard raised card shell with a heading row (and optional status pill). */
function CardShell({
  badge = false,
  children,
}: {
  badge?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-[18px] border border-ink/10 bg-card p-[clamp(20px,3vw,28px)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-28" />
        {badge ? <Skeleton className="h-6 w-24 rounded-full" /> : null}
      </div>
      {children}
    </div>
  );
}

/** Page header: title line(s), sub-line, and the action button cluster. */
function HeaderSkeleton({ actions = 0 }: { actions?: number }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <Skeleton className="h-8 w-[min(70%,320px)]" />
        <Skeleton className="mt-2.5 h-3.5 w-[min(50%,220px)]" />
      </div>
      {actions > 0 ? (
        <div className="flex flex-wrap items-center gap-2.5">
          {Array.from({ length: actions }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** A payments-ledger entry (amount + badge, meta line). */
function LedgerEntry() {
  return (
    <div className="rounded-[12px] border border-ink/10 px-3.5 py-3">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-2 h-3 w-40" />
    </div>
  );
}

/** Order detail: info card left; Bill + Payments stacked right (lg 2-col). */
export function OrderDetailSkeleton() {
  return (
    <div aria-busy="true">
      <HeaderSkeleton />
      <div className="grid items-start gap-[18px] lg:grid-cols-2">
        <CardShell badge>
          <InfoRows rows={5} />
          <div className="mt-5 border-t border-ink/10 pt-4">
            <InfoRows rows={2} />
          </div>
        </CardShell>
        <div className="grid content-start gap-[18px]">
          <CardShell badge>
            <InfoRows rows={3} />
            <div className="mt-5 border-t border-ink/10 pt-4">
              <InfoRows rows={3} />
            </div>
          </CardShell>
          <CardShell>
            <Skeleton className="mb-4 h-9 w-36 rounded-full" />
            <div className="grid gap-2">
              <LedgerEntry />
              <LedgerEntry />
            </div>
          </CardShell>
        </div>
      </div>
    </div>
  );
}

/** Application detail: applicant + bill cards, payments beneath. */
export function ApplicationDetailSkeleton() {
  return (
    <div aria-busy="true">
      <HeaderSkeleton actions={1} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[18px]">
        <CardShell badge>
          <InfoRows rows={5} />
        </CardShell>
        <CardShell badge>
          <InfoRows rows={3} />
        </CardShell>
      </div>
      <div className="mt-[18px]">
        <CardShell>
          <div className="mb-4 flex flex-wrap gap-2">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>
          <div className="grid gap-2">
            <LedgerEntry />
            <LedgerEntry />
          </div>
        </CardShell>
      </div>
    </div>
  );
}

/** Customer detail: stat tiles (2-up on phones), then the orders list card. */
export function CustomerDetailSkeleton() {
  return (
    <div aria-busy="true">
      <HeaderSkeleton actions={1} />
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-[18px] xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[18px] border border-ink/10 bg-card px-[clamp(14px,2.5vw,22px)] py-[clamp(14px,2vw,20px)]"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-24" />
          </div>
        ))}
      </div>
      <div className="mt-[18px] overflow-hidden rounded-[18px] border border-ink/10 bg-card">
        <div className="border-b border-ink/10 px-6 py-4">
          <Skeleton className="h-5 w-20" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-b border-ink/[0.08] px-4 py-3 last:border-0">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Class detail: overview card (badges, cover, summary, facts), fees card. */
export function ClassDetailSkeleton() {
  return (
    <div aria-busy="true">
      <HeaderSkeleton actions={3} />
      <div className="grid gap-[18px]">
        <div className="min-w-0 rounded-[18px] border border-ink/10 bg-card p-[clamp(20px,3vw,28px)]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
          </div>
          <div className="flex flex-wrap items-start gap-6">
            <Skeleton className="h-[170px] w-full flex-none rounded-[14px] sm:h-[165px] sm:w-[220px]" />
            <div className="min-w-[min(100%,280px)] flex-1 space-y-2.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-[90%]" />
              <Skeleton className="h-3.5 w-[75%]" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/10 pt-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="mt-2 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <CardShell>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Skeleton className="h-12 rounded-[12px]" />
            <Skeleton className="h-12 rounded-[12px]" />
          </div>
        </CardShell>
      </div>
    </div>
  );
}

/** Student detail: details + payments cards side by side (auto-fit). */
export function StudentDetailSkeleton() {
  return (
    <div aria-busy="true">
      <HeaderSkeleton actions={1} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[18px]">
        <CardShell badge>
          <InfoRows rows={5} />
        </CardShell>
        <CardShell>
          <InfoRows rows={3} />
          <div className="mt-4 grid gap-2 border-t border-ink/10 pt-4">
            <LedgerEntry />
          </div>
        </CardShell>
      </div>
    </div>
  );
}

/** Team member / profile card: stacked avatar header, then info rows. */
export function ProfileCardSkeleton() {
  return (
    <div aria-busy="true" className="max-w-[640px]">
      <div className="rounded-[18px] border border-ink/10 bg-card p-[clamp(20px,3vw,28px)]">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-9 w-16 rounded-full" />
        </div>
        <Skeleton className="mb-6 mt-2 h-3.5 w-[70%]" />
        <div className="mb-6 flex flex-col items-center gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:gap-5">
          <Skeleton className="h-[92px] w-[92px] flex-none rounded-full" />
          <div className="flex w-full flex-col items-center gap-2.5 sm:items-start">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <InfoRows rows={5} />
      </div>
    </div>
  );
}

/** Payment detail: big amount heading, reference, one facts card. */
export function PaymentDetailSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mb-5 min-w-0">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="mt-3 h-3.5 w-64 max-w-full" />
      </div>
      <CardShell badge>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-ink/[0.08] pb-4 last:border-0 last:pb-0">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-4 w-48 max-w-full" />
            </div>
          ))}
        </div>
      </CardShell>
    </div>
  );
}

/** Item detail: image card beside the facts card (lg 320px | 1fr). */
export function ItemDetailSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2.5">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>
      <div className="grid items-start gap-[18px] lg:grid-cols-[320px_1fr]">
        <div className="overflow-hidden rounded-[18px] border border-ink/10 bg-card">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
        </div>
        <div className="min-w-0 rounded-[18px] border border-ink/10 bg-card p-[clamp(20px,3vw,28px)]">
          <Skeleton className="h-7 w-[min(60%,260px)]" />
          <Skeleton className="mt-3 h-6 w-20 rounded-full" />
          <div className="mt-5">
            <InfoRows rows={5} />
          </div>
          <div className="mt-5 space-y-2.5 border-t border-ink/10 pt-5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-[85%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Edit-form pages: labelled fields grouped in cards, footer buttons. */
export function DetailFormSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <div aria-busy="true" className="grid gap-[18px]">
      {Array.from({ length: cards }).map((_, c) => (
        <div
          key={c}
          className="rounded-[18px] border border-ink/10 bg-card p-[clamp(20px,3vw,28px)]"
        >
          <Skeleton className="mb-5 h-5 w-32" />
          <div className="grid gap-[18px]">
            {Array.from({ length: c === 0 ? 3 : 2 }).map((_, i) => (
              <div key={i} className="grid gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-11 w-full rounded-[12px]" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex flex-wrap justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}
