"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationStatus } from "@/components/trainings/application-status";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { extractApiError } from "@/lib/extract-api-error";
import { cn } from "@/lib/utils";
import type { PublicApplication } from "@/lib/public-api";
import {
  applicationLookupSchema,
  type ApplicationLookupValues,
} from "@/validations/application-schema";
import { useLookupApplicationMutation } from "@/redux/applications/applications-api";

const inputClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-3.5 font-sans text-[16px] text-ink outline-none transition-colors focus:border-accent";

const labelClass =
  "grid gap-2 text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70";

/**
 * The registration self-service entry: receipt code + the email or phone the
 * registration was made with (`POST /applications/lookup`), then the same
 * status panel a receipt-code link renders - including the pay-balance
 * handoff, so a part-paid student can settle the rest online themselves.
 */
export function ApplicationLookup() {
  const [application, setApplication] = useState<PublicApplication | null>(
    null,
  );
  const [lookupApplication, { isLoading }] = useLookupApplicationMutation();
  const [lookupError, setLookupError] = useState<string | null>(null);
  const fieldId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationLookupValues>({
    resolver: zodResolver(applicationLookupSchema),
    defaultValues: { code: "", contact: "" },
  });

  const onSubmit = async (values: ApplicationLookupValues) => {
    setLookupError(null);
    try {
      const res = await lookupApplication({
        code: values.code.toUpperCase(),
        contact: values.contact,
      }).unwrap();
      setApplication(res.data);
    } catch (err) {
      setLookupError(extractApiError(err).message);
    }
  };

  if (application) {
    return (
      <div>
        <ApplicationStatus application={application} />
        <p className="-mt-8 pb-[clamp(40px,6vw,72px)] text-center">
          <button
            type="button"
            onClick={() => setApplication(null)}
            className="cursor-pointer border-none bg-transparent font-sans text-[14px] font-semibold text-accent underline decoration-accent/40 underline-offset-4"
          >
            Look up a different registration
          </button>
        </p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[560px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,96px)]">
      <p className="mb-4 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
        Registration status
      </p>
      <h1 className="mb-3 text-center font-serif text-[clamp(30px,4vw,46px)] font-normal leading-[1.1]">
        Check your registration
      </h1>
      <p className="mx-auto mb-[clamp(28px,4vw,40px)] max-w-[44ch] text-center text-[16px] leading-[1.65] text-ink/65">
        Enter the receipt code from your confirmation message and the email or
        phone number you registered with - you can also pay any outstanding
        balance from here.
      </p>

      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        noValidate
        className="grid gap-[22px] rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,36px)]"
      >
        <label className={labelClass}>
          Receipt code
          <input
            {...register("code")}
            type="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="KK-A7F3K9QW2M"
            aria-invalid={errors.code ? true : undefined}
            aria-describedby={errors.code ? `${fieldId}-code` : undefined}
            className={cn(inputClass, "uppercase tracking-[0.08em]")}
          />
          <FieldError id={`${fieldId}-code`} message={errors.code?.message} />
        </label>

        <label className={labelClass}>
          Email or phone you registered with
          <input
            {...register("contact")}
            type="text"
            autoComplete="email"
            placeholder="you@example.com or 024 000 0000"
            aria-invalid={errors.contact ? true : undefined}
            aria-describedby={errors.contact ? `${fieldId}-contact` : undefined}
            className={inputClass}
          />
          <FieldError
            id={`${fieldId}-contact`}
            message={errors.contact?.message}
          />
        </label>

        {lookupError ? (
          <p
            role="alert"
            className="rounded-[12px] bg-accent/[0.08] px-4 py-3 text-[14.5px] leading-[1.6] text-accent"
          >
            {lookupError}
          </p>
        ) : null}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Looking up…" : "Check status"}
        </Button>
      </form>
    </section>
  );
}
