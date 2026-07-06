"use client";

import Link from "next/link";
import { useGetCurrentTrainingQuery } from "@/redux/trainings/trainings-api";
import { routes } from "@/lib/routes";
import { Hero } from "./hero";
import { Costs } from "./costs";
import { WhatToBring } from "./what-to-bring";
import { ApplicationForm } from "./application-form";

/**
 * Hydrates the apply page from the current published cohort. There's no static
 * content to fall back on, so when no cohort is open the whole page becomes a
 * clear empty state rather than showing placeholder pricing/copy.
 */
export function ApplyContent() {
  const { data: training, isLoading, isError } = useGetCurrentTrainingQuery();

  if (isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center px-6 text-[15px] text-ink/50">
        Loading the current cohort…
      </div>
    );
  }

  if (isError || !training) {
    return <ApplyEmpty />;
  }

  return (
    <>
      <Hero training={training} />
      <Costs training={training} />
      <WhatToBring training={training} />
      <ApplicationForm training={training} />
    </>
  );
}

function ApplyEmpty() {
  return (
    <section className="mx-auto grid min-h-[62vh] max-w-[640px] place-items-center px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)] text-center">
      <div>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
          Khady&rsquo;s Bake School · Kumasi
        </p>
        <h1 className="mb-4 font-serif text-[clamp(32px,4.4vw,56px)] font-normal leading-[1.08]">
          No cohort is open just yet
        </h1>
        <p className="mx-auto mb-9 max-w-[46ch] text-[clamp(16px,1.5vw,18px)] leading-[1.65] text-ink/65">
          The next Bake School intake hasn&rsquo;t been announced. Message us on
          WhatsApp and we&rsquo;ll tell you the moment applications open - places
          fill fast.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={routes.contact}
            className="rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
          >
            Ask about the next cohort
          </Link>
          <Link
            href={routes.home}
            className="rounded-full border-[1.5px] border-ink/25 px-8 py-3.5 text-[15px] font-semibold text-ink no-underline transition-colors hover:border-ink/50"
          >
            Back to the bakery
          </Link>
        </div>
      </div>
    </section>
  );
}
