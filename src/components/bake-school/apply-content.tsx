"use client";

import { useGetCurrentTrainingQuery } from "@/redux/trainings/trainings-api";
import { EmptyState } from "@/components/ui/EmptyState";
import { RippleLoader } from "@/components/ui/Loader";
import { routes } from "@/lib/routes";
import { Hero } from "./hero";
import { ClassInfo } from "./class-info";
import { Costs } from "./costs";
import { WhatToBring } from "./what-to-bring";
import { ApplicationForm } from "./application-form";

/**
 * The hero is static; the current published cohort drives everything below it.
 * When no cohort is open we still show the hero, with a short empty state under.
 */
export function ApplyContent() {
  const { data: training, isLoading, isError } = useGetCurrentTrainingQuery();

  return (
    <>
      <Hero />
      {isLoading ? (
        <div className="grid min-h-[40vh] place-items-center px-6">
          <RippleLoader />
        </div>
      ) : isError || !training ? (
        <div className="mx-auto grid min-h-[40vh] max-w-[600px] place-items-center px-[clamp(20px,5vw,48px)] pb-[clamp(48px,8vw,96px)]">
          <EmptyState
            eyebrow="Khady’s Bake School · Kumasi"
            title="No cohort is open just yet"
            description="The next Bake School intake hasn’t been announced. Message us and we’ll tell you the moment applications open — places fill fast."
            action={{ label: "Ask about the next cohort", href: routes.contact }}
          />
        </div>
      ) : (
        <>
          <ClassInfo training={training} />
          <Costs training={training} />
          <WhatToBring training={training} />
          <ApplicationForm training={training} />
        </>
      )}
    </>
  );
}
