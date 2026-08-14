"use client";

import { useState } from "react";
import { APPLY_CODE_KEY } from "@/components/bake-school/application-form";
import { Button } from "@/components/ui/Button";
import { env } from "@/lib/env";
import { notify } from "@/lib/notify";

/**
 * "Pay balance online" on the application-status panel: initialises a Paystack
 * charge for the code (`POST /applications/:code/pay`) and hands the browser
 * off to the authorization URL, stashing the code so `/trainings/verify` can
 * greet the applicant on the return trip.
 *
 * This is a plain fetch by exception: the public applications slice is final
 * and has no pay-by-code hook, and this is a one-shot redirect handoff - the
 * response is never cached or shared, so RTK Query buys nothing here.
 */
export function PayBalanceButton({
  code,
  hasEmail,
}: {
  code: string;
  /** Paystack needs a receipt email; without one on file we ask for it. */
  hasEmail: boolean;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const payOnline = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `${env.SERVER_URI}/api/v1/applications/${encodeURIComponent(code)}/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(email.trim() ? { email: email.trim() } : {}),
        },
      );
      const json = (await response.json().catch(() => null)) as {
        message?: string;
        data?: { authorizationUrl?: string };
      } | null;
      if (!response.ok || !json?.data?.authorizationUrl) {
        throw new Error(
          json?.message ?? "We couldn't start the payment. Please try again.",
        );
      }
      sessionStorage.setItem(APPLY_CODE_KEY, code);
      window.location.assign(json.data.authorizationUrl);
    } catch (err) {
      setSubmitting(false);
      notify.error("Couldn't start the payment", {
        description:
          err instanceof Error
            ? err.message
            : "Please try again, or contact us and we'll sort it out.",
      });
    }
  };

  return (
    <div className="grid justify-items-center gap-3">
      {!hasEmail ? (
        <label className="grid w-full max-w-[340px] gap-2 text-left text-[13px] font-semibold uppercase tracking-[0.06em] text-ink/70">
          Email for your receipt
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none transition-colors focus:border-accent"
          />
        </label>
      ) : null}
      <Button
        size="lg"
        isLoading={submitting}
        loadingText="Starting payment…"
        onClick={() => void payOnline()}
        disabled={!hasEmail && !email.trim()}
        className="rounded-full"
      >
        Pay balance online
      </Button>
      <p className="text-[13px] text-ink/50">
        You&rsquo;ll pay securely via Paystack (card / MoMo).
      </p>
    </div>
  );
}
