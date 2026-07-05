import { Reveal } from "@/components/reveal";
import { fees } from "@/lib/bake-school-data";

export function Costs() {
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
        Everything is transparent — here is exactly what the programme costs and
        what is covered for you.
      </p>

      <Reveal className="overflow-hidden rounded-[22px] border border-ink/10 bg-card">
        {fees.map((fee) => (
          <div
            key={fee.num}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2.5 border-b border-ink/[0.09] px-[clamp(20px,3.5vw,36px)] py-[clamp(20px,3vw,28px)]"
          >
            <div className="flex flex-[1_1_320px] items-baseline gap-[18px]">
              <span className="min-w-[22px] font-serif text-[15px] text-accent">
                {fee.num}
              </span>
              <div>
                <div className="text-[17px] font-semibold">{fee.name}</div>
                {fee.note ? (
                  <div className="mt-[5px] max-w-[56ch] text-[14.5px] leading-[1.55] text-ink/60">
                    {fee.note}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="whitespace-nowrap font-serif text-[clamp(18px,2vw,22px)]">
              {fee.price}
              {fee.suffix ? (
                <span className="font-sans text-[13px] text-ink/55"> {fee.suffix}</span>
              ) : null}
            </div>
          </div>
        ))}
        <div className="bg-sand px-[clamp(20px,3.5vw,36px)] py-[18px] text-[14px] leading-[1.6] text-ink/70">
          Want a hostel place? Indicate early in your application — the hostel
          takes only 12 students.
        </div>
      </Reveal>
      </div>
    </section>
  );
}
