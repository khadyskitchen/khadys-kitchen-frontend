import { Suspense } from "react";
import { VerifyClient } from "@/components/bake-school/verify-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Confirming your payment",
  description: "Confirming your Bake School application payment.",
  path: "/apply/verify",
});

export default function ApplyVerifyPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6 py-16 text-ink">
      <Suspense
        fallback={<div className="text-[15px] text-ink/60">Loading…</div>}
      >
        <VerifyClient />
      </Suspense>
    </main>
  );
}
