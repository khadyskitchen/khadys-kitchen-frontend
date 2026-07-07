"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import { SystemMessage } from "@/components/ui/SystemMessage";
import { routes } from "@/lib/routes";

/**
 * Route-segment error boundary. Wraps every page below the root layout, so a
 * thrown render/data error shows this branded fallback instead of a blank
 * screen. `unstable_retry` re-fetches and re-renders the failed segment.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Surface the error for local debugging / an error reporter.
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5 py-16">
      <div className="w-full max-w-[460px]">
        <SystemMessage
          glyph="!"
          title="Something didn't rise."
          description="We hit an unexpected error loading this page. Give it another try — if it keeps happening, head back to the counter."
          actions={[
            { label: "↻ Try again", onClick: () => unstable_retry(), variant: "dark" },
            { label: "Back to the bakery", href: routes.home, variant: "outline" },
          ]}
        />
      </div>
    </div>
  );
}
