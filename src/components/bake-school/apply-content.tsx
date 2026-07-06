"use client";

import { useGetCurrentTrainingQuery } from "@/redux/trainings/trainings-api";
import { EmptyState } from "@/components/ui/EmptyState";
import { RippleLoader } from "@/components/ui/Loader";
import { routes } from "@/lib/routes";
import { Hero } from "./hero";
import { Costs } from "./costs";
import { WhatToBring } from "./what-to-bring";
import { ApplicationForm } from "./application-form";

/**
 * Hydrates the apply page from the current published cohort. There's no static
 * content to fall back on, so when no cohort is open the whole page becomes a
 * shared empty state rather than showing placeholder pricing/copy.
 */
export function ApplyContent() {
  const { data: training, isLoading, isError } = useGetCurrentTrainingQuery();

  if (isLoading) {
    return (
      <div className="grid min-h-[80vh] place-items-center px-[clamp(20px,5vw,48px)] py-[clamp(72px,12vw,160px)]">
        <RippleLoader />
      </div>
    );
  }

  if (isError || !training) {
    return (
      <div className="mx-auto grid min-h-[80vh] max-w-[600px] place-items-center px-[clamp(20px,5vw,48px)] py-[clamp(72px,12vw,160px)]">
        <EmptyState
          eyebrow="Khady’s Bake School · Kumasi"
          title="No cohort is open just yet"
          description="The next Bake School intake hasn’t been announced. Message us and we’ll tell you the moment applications open — places fill fast."
          action={{ label: "Ask about the next cohort", href: routes.contact }}
        />
      </div>
    );
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
