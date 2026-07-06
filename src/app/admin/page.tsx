"use client";

import Link from "next/link";
import { Card } from "@/components/admin/ui";
import {
  BestSellersMeters,
  WeekRevenueChart,
} from "@/components/admin/dashboard-viz";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatMoney } from "@/lib/format-money";
import { formatDateTime } from "@/lib/format-date";
import { useGetDashboardStatsQuery } from "@/redux/stats/stats-api";

const humanize = (action: string) =>
  action.replace(/\./g, " · ").replace(/_/g, " ");

function TileLink({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-[18px] border border-ink/10 bg-card px-[22px] py-5 no-underline transition-colors hover:border-accent/50"
    >
      <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ink/50">
        {label}
      </div>
      <div className="mt-2 font-serif text-[clamp(24px,2.6vw,30px)]">{value}</div>
      {note ? (
        <div className="mt-1 text-[12.5px] font-semibold text-accent">{note}</div>
      ) : null}
    </Link>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } =
    useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="grid gap-5" style={{ animation: "kk-rise .5s both" }}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[118px] animate-pulse rounded-[18px] bg-ink/[0.06]" />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
          <div className="h-[260px] animate-pulse rounded-[18px] bg-ink/[0.06]" />
          <div className="h-[260px] animate-pulse rounded-[18px] bg-ink/[0.06]" />
        </div>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <ErrorState error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  const { shop, bakeSchool, recentActivity } = data.data;

  return (
    <div className="grid gap-5" style={{ animation: "kk-rise .5s both" }}>
      {/* Shop stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
        <TileLink
          label="Orders today"
          value={String(shop.ordersToday)}
          note={`${String(shop.pendingOrders)} pending`}
          href="/admin/orders"
        />
        <TileLink
          label="Ready for pickup"
          value={String(shop.readyOrders)}
          note="awaiting collection"
          href="/admin/orders?status=READY"
        />
        <TileLink
          label="Outstanding balance"
          value={formatMoney(shop.outstandingBalance)}
          note="on open orders"
          href="/admin/orders?payment=UNPAID"
        />
        <TileLink
          label="Received this week"
          value={formatMoney(shop.weekRevenue)}
          note="shop + bake school"
          href="/admin/payments"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
        <WeekRevenueChart data={shop.weekRevenueByDay} />
        <BestSellersMeters data={shop.bestSellers} />
      </div>

      {/* Bake school + activity */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[18px]">
        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[19px] font-normal">Bake School</h3>
            <Link
              href="/admin/applications"
              className="whitespace-nowrap text-[13px] font-semibold text-accent no-underline hover:underline"
            >
              Applications →
            </Link>
          </div>
          <div className="grid gap-2.5 text-[14.5px]">
            <div className="flex justify-between gap-4">
              <span className="text-ink/55">Pending applications</span>
              <span className="font-semibold">{bakeSchool.pendingApplications}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink/55">Active students</span>
              <span className="font-semibold">{bakeSchool.activeStudents}</span>
            </div>
          </div>
          {bakeSchool.openCohort ? (
            <Link
              href={`/admin/classes/${bakeSchool.openCohort.id}`}
              className="mt-4 block rounded-[14px] border border-ink/10 bg-oat/40 px-4 py-3.5 no-underline transition-colors hover:border-accent/50"
            >
              <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-accent">
                Enrolling now
              </div>
              <div className="mt-1 text-[15px] font-semibold text-ink">
                {bakeSchool.openCohort.name}
              </div>
              <div className="mt-0.5 text-[13px] text-ink/60">
                {bakeSchool.openCohort.students}
                {bakeSchool.openCohort.capacity
                  ? ` of ${String(bakeSchool.openCohort.capacity)}`
                  : ""}{" "}
                admitted · {bakeSchool.openCohort.applications} application
                {bakeSchool.openCohort.applications === 1 ? "" : "s"}
              </div>
            </Link>
          ) : (
            <p className="mt-4 text-[13.5px] text-ink/50">
              No cohort is currently open for applications.
            </p>
          )}
        </Card>

        <Card className="p-[clamp(18px,2.8vw,24px)]">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[19px] font-normal">Recent activity</h3>
            <Link
              href="/admin/audit"
              className="whitespace-nowrap text-[13px] font-semibold text-accent no-underline hover:underline"
            >
              Audit log →
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-[14px] text-ink/50">Nothing yet.</p>
          ) : (
            <div className="grid">
              {recentActivity.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 border-b border-ink/[0.07] py-[11px] last:border-0"
                >
                  <span className="mt-1.5 h-[9px] w-[9px] flex-none rounded-full bg-accent" />
                  <span className="flex-1 text-[14px] leading-[1.5] text-ink/[0.82]">
                    <span className="capitalize">{humanize(ev.action)}</span>
                    {ev.actor ? (
                      <span className="text-ink/50"> — {ev.actor}</span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 whitespace-nowrap text-[12px] text-ink/45">
                    {formatDateTime(ev.at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
