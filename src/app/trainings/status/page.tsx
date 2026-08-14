import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ApplicationLookup } from "@/components/trainings/application-lookup";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

/**
 * Registration self-service: enter the receipt code + the email or phone the
 * registration was made with to see its status and pay any balance online.
 * Static route, so it always wins over the `[slug]` catch-all beside it.
 */
export const metadata: Metadata = pageMetadata({
  title: "Check your registration",
  description:
    "Enter your Khady's Kitchen receipt code to see your bake-school registration status and pay any outstanding balance online.",
  path: routes.trainingStatus,
});

export default function TrainingStatusPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-cream text-ink">
      <SiteHeader
        cta={{ label: "Browse trainings", href: routes.trainings }}
        mobileMenu
      />
      <main>
        <ApplicationLookup />
      </main>
      <SiteFooter
        cta={{ label: "Explore our trainings", href: routes.trainings }}
      />
    </div>
  );
}
