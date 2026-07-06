import { Reveal } from "@/components/reveal";
import { formatMoney } from "@/lib/format-money";
import type { ITraining } from "@/types/training.types";

const DEFAULT_INTRO =
  "Everything is transparent - here is exactly what the programme costs and what is covered for you.";

export function Costs({ training }: { training: ITraining }) {
  const feeItems = training.feeItems ?? [];
  // Costs are class data — nothing to show without a fee table.
  if (feeItems.length === 0) return null;

  const intro = training.costsIntro || DEFAULT_INTRO;
  const note = training.costsNote;

  return (
    <section id="costs" className="border-t border-ink/10 bg-oat">
      <div className="mx-auto max-w-[1080px] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]">
        <p className="mb-4 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
          Cost details &amp; prospectus
        </p>
        <Reveal variant="mask" className="text-center">
          <h2 className="mb-3.5 font-serif text-[clamp(32px,4vw,52px)] font-normal">
            Price details
          </h2>
        </Reveal>
        <p className="mx-auto mb-[clamp(36px,5vw,56px)] max-w-[52ch] text-center text-[16px] leading-[1.65] text-ink/65">
          {intro}
        </p>

        <Reveal className="overflow-hidden rounded-[22px] border border-ink/10 bg-card">
          {feeItems.map((item, i) => (
            <div
              key={item.id}
              className="flex flex-col gap-2.5 border-b border-ink/[0.09] px-[clamp(20px,3.5vw,36px)] py-[clamp(20px,3vw,28px)] sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6"
            >
              <div className="flex items-baseline gap-[18px] sm:flex-[1_1_320px]">
                <span className="min-w-[22px] font-serif text-[15px] text-accent">
                  {i + 1}
                </span>
                <div>
                  <div className="text-[17px] font-semibold">{item.name}</div>
                  {item.note ? (
                    <div className="mt-[5px] max-w-[56ch] text-[14.5px] leading-[1.55] text-ink/60">
                      {item.note}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="pl-10 sm:pl-0 sm:text-right">
                <div className="whitespace-nowrap font-serif text-[clamp(18px,2vw,22px)] leading-tight">
                  {item.priceLabel ?? formatMoney(item.amount, training.currency)}
                </div>
                {item.suffix ? (
                  <div className="mt-[5px] font-sans text-[13px] text-ink/55">
                    {item.suffix}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          {note ? (
            <div className="bg-sand px-[clamp(20px,3.5vw,36px)] py-[18px] text-[14px] leading-[1.6] text-ink/70">
              {note}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
