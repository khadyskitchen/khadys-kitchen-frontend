import { Reveal } from "@/components/reveal";
import type { ITraining } from "@/types/training.types";

const DEFAULT_INTRO =
  "The school provides 95% of tools and ingredients. These few items are yours to bring - and yours to keep.";

export function WhatToBring({ training }: { training: ITraining }) {
  const tools = training.requirements ?? [];
  const prospectus = training.highlights ?? [];
  // All class data — nothing to show without it.
  if (tools.length === 0 && prospectus.length === 0) return null;

  const intro = training.bringIntro || DEFAULT_INTRO;

  return (
    <section id="bring" className="border-b border-ink/10">
      <div className="mx-auto max-w-[1080px] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]">
        <Reveal variant="mask" className="text-center">
          <h2 className="mb-3 font-serif text-[clamp(30px,3.6vw,46px)] font-normal">
            Your 5% - tools to bring
          </h2>
        </Reveal>
        <p className="mx-auto mb-[clamp(32px,4vw,48px)] max-w-[56ch] text-center text-[16px] leading-[1.65] text-ink/65">
          {intro}
        </p>

        {tools.length > 0 ? (
          <Reveal className="mb-[clamp(40px,6vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-3.5">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col gap-1.5 rounded-2xl border border-ink/10 bg-card px-[18px] py-[22px] text-center"
              >
                <div className="text-[15.5px] font-semibold leading-[1.35]">
                  {tool.name}
                </div>
                {tool.note ? (
                  <div className="text-[13.5px] font-semibold text-accent">
                    {tool.note}
                  </div>
                ) : null}
              </div>
            ))}
          </Reveal>
        ) : null}

        {prospectus.length > 0 ? (
          <Reveal className="rounded-[18px] border border-ink/10 bg-card p-[clamp(22px,3vw,32px)]">
            <h3 className="mb-3 font-serif text-[21px] font-normal">
              Other prospectus
            </h3>
            <div className="flex flex-wrap gap-2">
              {prospectus.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-ink/15 px-3.5 py-[7px] text-[13.5px] text-ink/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
