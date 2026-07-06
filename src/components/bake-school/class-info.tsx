import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import type { ITraining } from "@/types/training.types";

/**
 * The specific cohort's details, rendered below the static hero on its own
 * tinted band so it reads as distinct from the brand hero: number + name, live
 * application status, description, key facts, and at-a-glance stats.
 */
export function ClassInfo({ training }: { training: ITraining }) {
  const open = training.applicationsOpen;

  const dateRange = training.startDate
    ? `${formatDate(training.startDate)}${training.endDate ? ` – ${formatDate(training.endDate)}` : ""}`
    : null;
  const facts: string[] = [];
  if (dateRange) facts.push(dateRange);
  if (training.capacity != null) facts.push(`${String(training.capacity)} places`);
  if (training.hostelCapacity != null)
    facts.push(`${String(training.hostelCapacity)} hostel beds`);

  return (
    <section id="cohort" className="border-y border-ink/10 bg-oat/40">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] py-[clamp(36px,5vw,64px)]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {training.numeral ? (
            <span className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-accent">
              Cohort {training.numeral}
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
              open
                ? "bg-[#2E6B3F]/10 text-[#2E6B3F]"
                : "bg-ink/[0.07] text-ink/55",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                open ? "bg-[#2E6B3F]" : "bg-ink/40",
              )}
            />
            {open ? "Applications open" : "Applications closed"}
          </span>
        </div>

        <h2 className="mt-3 max-w-[34ch] font-serif text-[clamp(26px,3.4vw,40px)] font-normal leading-[1.12] text-balance lg:max-w-[80%]">
          {training.name}
        </h2>

        <p className="mt-4 max-w-[62ch] text-[clamp(15px,1.45vw,17px)] leading-[1.7] text-ink/70 lg:max-w-[70%]">
          {training.description}
        </p>

        {facts.length > 0 ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px] text-ink/60">
            {facts.map((f, i) => (
              <span key={f} className="flex items-center gap-x-2.5">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-ink/25">
                    ·
                  </span>
                ) : null}
                {f}
              </span>
            ))}
          </div>
        ) : null}

        {training.stats.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6 border-t border-ink/12 pt-7">
            {training.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-[26px]">{stat.value}</div>
                <div className="mt-1 text-[12.5px] uppercase tracking-[0.08em] text-ink/55">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
