"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { RippleLoader } from "@/components/ui/Loader";
import { useVerifyPaymentMutation } from "@/redux/applications/applications-api";
import { extractApiError } from "@/lib/extract-api-error";

type State = "verifying" | "success" | "failed";

interface VerifyOutcome {
  description: string;
  action: { label: string; href: string };
}

/**
 * Shared Paystack return-page logic for both checkouts — the shop and the bake
 * school stash a receipt code in sessionStorage before redirecting out, and
 * `POST /payments/verify` serves both ledgers. Wrappers supply the copy and any
 * success side effect (e.g. clearing the cart).
 */
export function PaymentVerifyClient({
  codeKey,
  success,
  failure,
  onConfirmed,
}: {
  /** sessionStorage key holding the receipt code stashed before the redirect. */
  codeKey: string;
  success: (code: string) => VerifyOutcome;
  failure: (code: string, message: string) => VerifyOutcome;
  /** Side effect on a confirmed payment (before the code is cleared). */
  onConfirmed?: () => void;
}) {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  const [verify] = useVerifyPaymentMutation();
  // Seed from the reference so the "no reference" case needs no effect-setState.
  const [state, setState] = useState<State>(reference ? "verifying" : "failed");
  const [message, setMessage] = useState(
    reference ? "" : "No payment reference was found in the link.",
  );
  // Read the stashed code once at mount (client-only; guarded for SSR).
  const [code] = useState(() =>
    typeof window === "undefined"
      ? ""
      : (sessionStorage.getItem(codeKey) ?? ""),
  );
  const ran = useRef(false);

  // Fires the verify. Reusable so the auto-attempt and the manual "Try again"
  // share one path — transient errors right after a mobile redirect shouldn't
  // dead-end on a link.
  const runVerify = useCallback(() => {
    if (!reference) return;
    setState("verifying");
    setMessage("");
    verify({ reference })
      .unwrap()
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setState("success");
          onConfirmed?.();
          sessionStorage.removeItem(codeKey);
        } else {
          setState("failed");
          setMessage("This payment hasn’t been confirmed yet.");
        }
      })
      .catch((err) => {
        setState("failed");
        setMessage(extractApiError(err).message);
      });
  }, [reference, verify, codeKey, onConfirmed]);

  // One-shot auto-attempt on mount: `ran` guards re-runs even if a dep identity
  // changes. Manual retries below bypass this guard.
  useEffect(() => {
    if (ran.current || !reference) return;
    ran.current = true;
    runVerify();
  }, [reference, runVerify]);

  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <RippleLoader />
        <p className="text-[15px] text-ink/55">Confirming your payment…</p>
      </div>
    );
  }

  if (state === "success") {
    const outcome = success(code);
    return (
      <EmptyState
        title="Payment confirmed"
        description={outcome.description}
        action={outcome.action}
        className="w-full max-w-[520px]"
      />
    );
  }

  const outcome = failure(
    code,
    message || "Please try again, or contact us and we’ll sort it out.",
  );
  return (
    <div className="flex w-full max-w-[520px] flex-col items-center">
      <EmptyState
        title="We couldn’t confirm this payment"
        description={outcome.description}
        action={outcome.action}
        className="w-full"
      />
      {reference ? (
        <Button
          variant="outline"
          onClick={runVerify}
          className="-mt-2 rounded-full"
        >
          Try again
        </Button>
      ) : null}
    </div>
  );
}
