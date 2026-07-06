"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVerifyPaymentMutation } from "@/redux/applications/applications-api";
import { extractApiError } from "@/lib/extract-api-error";
import { routes } from "@/lib/routes";
import { APPLY_CODE_KEY } from "./application-form";

type State = "verifying" | "success" | "failed";

export function VerifyClient() {
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
      : (sessionStorage.getItem(APPLY_CODE_KEY) ?? ""),
  );
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !reference) return;
    ran.current = true;

    verify({ reference })
      .unwrap()
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          setState("success");
          sessionStorage.removeItem(APPLY_CODE_KEY);
        } else {
          setState("failed");
          setMessage("This payment hasn’t been confirmed yet.");
        }
      })
      .catch((err) => {
        setState("failed");
        setMessage(extractApiError(err).message);
      });
  }, [reference, verify]);

  return (
    <div className="w-full max-w-[520px] rounded-[22px] border border-ink/10 bg-card p-[clamp(32px,5vw,52px)] text-center">
      {state === "verifying" ? (
        <>
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-[3px] border-ink/15 border-t-accent" />
          <h1 className="font-serif text-[26px] font-normal">
            Confirming your payment…
          </h1>
          <p className="mt-2 text-[15px] text-ink/60">This only takes a moment.</p>
        </>
      ) : state === "success" ? (
        <>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent text-[28px] text-[#FDFAF3]">
            ✓
          </div>
          <h1 className="mb-3 font-serif text-[28px] font-normal">
            Payment confirmed
          </h1>
          <p className="mb-4 text-[16px] leading-[1.65] text-ink/70">
            Thank you! Your application{code ? " " : ""}
            {code ? <strong>{code}</strong> : ""} is paid. Khady&rsquo;s team will
            be in touch on WhatsApp.
          </p>
          <Link
            href={routes.home}
            className="inline-block rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
          >
            Back to the bakery
          </Link>
        </>
      ) : (
        <>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-danger/30 bg-danger/[0.08] text-[26px] text-danger">
            !
          </div>
          <h1 className="mb-3 font-serif text-[28px] font-normal">
            We couldn&rsquo;t confirm this payment
          </h1>
          <p className="mb-5 text-[16px] leading-[1.65] text-ink/70">
            {message || "Please try again, or contact us and we’ll sort it out."}
            {code ? (
              <>
                {" "}
                Your application code is <strong>{code}</strong>.
              </>
            ) : null}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={routes.apply}
              className="inline-block rounded-full bg-accent px-8 py-3.5 text-[15px] font-semibold text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
            >
              Back to apply
            </Link>
            <Link
              href={routes.contact}
              className="inline-block rounded-full border-[1.5px] border-ink/25 px-8 py-3.5 text-[15px] font-semibold text-ink no-underline transition-colors hover:border-ink/50"
            >
              Contact us
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
