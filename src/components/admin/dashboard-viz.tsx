import { cn } from "@/lib/utils";
import { Card } from "@/components/admin/ui";
import { formatMoney } from "@/lib/format-money";

/** Short weekday label ("Mon") from an ISO yyyy-mm-dd day key. */
const dayLabel = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GH", {
    weekday: "short",
    timeZone: "UTC",
  });

/** Vertical CSS bar chart of the week's receipts (pesewas), peak day in accent. */
export function WeekRevenueChart({
  data,
}: {
  data: { day: string; total: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.total, 0);
  const max = Math.max(...data.map((d) => d.total), 1);
  const peak = data.reduce((hi, d) => (d.total > hi.total ? d : hi), data[0]);
  const summary = `Money received this week, total ${formatMoney(total)}. Best day ${dayLabel(peak.day)} at ${formatMoney(peak.total)}.`;

  return (
    <Card className="p-[clamp(18px,2.8vw,24px)]">
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-[19px] font-normal">Received · this week</h3>
        <span className="whitespace-nowrap font-serif text-[18px]">
          {formatMoney(total)}
        </span>
      </div>
      <div
        role="img"
        aria-label={summary}
        className="flex h-[168px] items-end gap-2.5"
      >
        {data.map((d) => (
          <div
            key={d.day}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          >
            <span aria-hidden className="text-[11.5px] font-semibold text-ink/55">
              {d.total >= 100_000
                ? `${(d.total / 100_000).toFixed(1)}k`
                : Math.round(d.total / 100)}
            </span>
            <div
              className={cn(
                "w-full max-w-[38px] rounded-t-lg rounded-b-[3px]",
                d === peak && d.total > 0 ? "bg-accent" : "bg-ink/[0.18]",
              )}
              style={{
                height: `${Math.max(8, Math.round((d.total / max) * 128))}px`,
              }}
            />
            <span
              aria-hidden
              className="text-[11.5px] uppercase tracking-[0.06em] text-ink/50"
            >
              {dayLabel(d.day)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Horizontal meters ranking the last 30 days' best-selling items by quantity. */
export function BestSellersMeters({
  data,
}: {
  data: { name: string; quantity: number }[];
}) {
  const max = Math.max(...data.map((d) => d.quantity), 1);

  return (
    <Card className="p-[clamp(18px,2.8vw,24px)]">
      <h3 className="mb-5 font-serif text-[19px] font-normal">
        Best sellers · last 30 days
      </h3>
      {data.length === 0 ? (
        <p className="text-[14px] text-ink/50">No shop sales yet.</p>
      ) : (
        <div className="grid gap-4">
          {data.map((b) => (
            <div key={b.name} className="grid gap-[7px]">
              <div className="flex justify-between gap-3 text-[13.5px]">
                <span className="font-semibold">{b.name}</span>
                <span className="whitespace-nowrap text-ink/55">
                  {b.quantity} sold
                </span>
              </div>
              <div
                role="meter"
                aria-label={`${b.name} sales`}
                aria-valuemin={0}
                aria-valuemax={max}
                aria-valuenow={b.quantity}
                aria-valuetext={`${String(b.quantity)} sold`}
                className="h-2 overflow-hidden rounded-full bg-ink/[0.08]"
              >
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${String(Math.round((b.quantity / max) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
