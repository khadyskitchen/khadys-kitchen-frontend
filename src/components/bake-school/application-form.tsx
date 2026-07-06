"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  applicationSchema,
  type ApplicationValues,
} from "@/validations/application-schema";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useCreateApplicationMutation } from "@/redux/applications/applications-api";
import type { ITraining } from "@/types/training.types";

const inputClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-3.5 font-sans text-[16px] text-ink outline-none transition-colors focus:border-accent";

const labelClass =
  "grid gap-2 text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70";

/** Where the code is stashed before a Paystack redirect, read back on /apply/verify. */
export const APPLY_CODE_KEY = "kk_apply_code";

export function ApplicationForm({ training }: { training: ITraining }) {
  const [submitted, setSubmitted] = useState(false);
  const [applicantName, setApplicantName] = useState("friend");
  const [receiptCode, setReceiptCode] = useState("");
  const [createApplication, { isLoading: submitting }] =
    useCreateApplicationMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      hostel: null,
      message: "",
      payNow: false,
    },
  });

  const hostel = useWatch({ control, name: "hostel" });
  const payNow = useWatch({ control, name: "payNow" });
  const errorMessage =
    errors.name?.message ?? errors.phone?.message ?? errors.email?.message;

  const onSubmit = async (data: ApplicationValues) => {
    try {
      const res = await createApplication({
        trainingId: training.id,
        fullName: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email || undefined,
        location: data.location || undefined,
        needsHostel: data.hostel ?? false,
        message: data.message || undefined,
        payNow: data.payNow,
      }).unwrap();

      // Paying now: hand off to Paystack, remembering the code for the return trip.
      if (data.payNow && res.data.authorizationUrl) {
        sessionStorage.setItem(APPLY_CODE_KEY, res.data.code);
        window.location.assign(res.data.authorizationUrl);
        return;
      }

      setReceiptCode(res.data.code);
      setApplicantName(data.name.trim().split(" ")[0] || "friend");
      setSubmitted(true);
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          const target =
            field === "fullName" ? "name" : field === "needsHostel" ? "hostel" : field;
          if (
            target === "name" ||
            target === "phone" ||
            target === "email" ||
            target === "location" ||
            target === "message"
          ) {
            setError(target, { message: msg });
          }
        }
      }
      notify.error("Couldn't submit your application", { description: message });
    }
  };

  return (
    <section
      id="apply"
      className="mx-auto max-w-[760px] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]"
    >
      <p className="mb-4 text-center text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
        Applications open
      </p>
      <h2 className="mb-3.5 text-center font-serif text-[clamp(32px,4vw,52px)] font-normal">
        Apply to the next cohort
      </h2>
      <p className="mx-auto mb-[clamp(32px,4vw,44px)] max-w-[48ch] text-center text-[16px] leading-[1.65] text-ink/65">
        Fill this in and Khady&rsquo;s team will reach you on WhatsApp within two
        working days.
      </p>

      {submitted ? (
        <div className="rounded-[22px] border border-ink/10 bg-card p-[clamp(36px,5vw,56px)] text-center">
          <div className="mx-auto mb-[22px] grid h-16 w-16 place-items-center rounded-full bg-accent text-[28px] text-[#FDFAF3]">
            ✓
          </div>
          <h3 className="mb-3 font-serif text-[28px] font-normal">
            Application received
          </h3>
          <p className="mb-4 text-[16px] leading-[1.65] text-ink/70">
            Thank you, {applicantName}. We&rsquo;ll contact you on WhatsApp within
            two working days.
          </p>
          <div className="mx-auto mb-4 inline-block rounded-[12px] border border-ink/10 bg-oat px-6 py-3">
            <div className="text-[12px] uppercase tracking-[0.12em] text-ink/50">
              Your receipt code
            </div>
            <div className="font-serif text-[24px] tracking-[0.1em] text-accent">
              {receiptCode}
            </div>
          </div>
          <p className="text-[14.5px] leading-[1.6] text-ink/55">
            Keep this code safe — quote it to pay in person, or to check your
            status. Asked for hostel? We&rsquo;ll confirm availability first, only
            12 places.
          </p>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-[22px] rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,44px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[22px]">
            <label className={labelClass}>
              Full name
              <input
                {...register("name")}
                placeholder="e.g. Ama Mensah"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Phone / WhatsApp
              <input
                {...register("phone")}
                placeholder="e.g. 024 000 0000"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[22px]">
            <label className={labelClass}>
              Email {payNow ? "(required to pay online)" : "(optional)"}
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Where are you based?
              <input
                {...register("location")}
                placeholder="e.g. Kumasi, Asokwa"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-2.5">
            <span className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70">
              Do you need a hostel place?{" "}
              <span className="font-normal normal-case tracking-normal">
                (only 12 available - GHS 700 for 2 months)
              </span>
            </span>
            <div className="flex flex-wrap gap-2.5">
              <ChoiceButton
                selected={hostel === true}
                onClick={() => setValue("hostel", true)}
              >
                Yes, reserve me a bed
              </ChoiceButton>
              <ChoiceButton
                selected={hostel === false}
                onClick={() => setValue("hostel", false)}
              >
                No, I&rsquo;ll commute
              </ChoiceButton>
            </div>
          </div>

          <div className="grid gap-2.5">
            <span className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70">
              How would you like to pay?
            </span>
            <div className="flex flex-wrap gap-2.5">
              <ChoiceButton
                selected={payNow === false}
                onClick={() => setValue("payNow", false)}
              >
                Pay later
              </ChoiceButton>
              <ChoiceButton
                selected={payNow === true}
                onClick={() => setValue("payNow", true)}
              >
                Pay now (card / MoMo)
              </ChoiceButton>
            </div>
          </div>

          <label className={labelClass}>
            Anything we should know? (optional)
            <textarea
              {...register("message")}
              rows={4}
              placeholder="Your baking experience, questions about fees, preferred start date…"
              className={cn(inputClass, "resize-y")}
            />
          </label>

          {errorMessage ? (
            <div className="rounded-[12px] border border-danger/25 bg-danger/[0.08] px-4 py-3 text-[14.5px] text-danger">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full border-none bg-accent px-[34px] py-[18px] font-sans text-[16px] font-semibold tracking-[0.06em] text-[#FDFAF3] transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Submitting…"
              : payNow
                ? "Continue to payment"
                : "Submit application"}
          </button>
          <p className="text-center text-[13px] text-ink/50">
            By applying you agree to be contacted by Khady&rsquo;s Kitchen about
            enrolment. {payNow ? "You'll pay securely via Paystack." : "You can pay now or later."}
          </p>
        </form>
      )}
    </section>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "cursor-pointer rounded-full border-[1.5px] px-[22px] py-[11px] font-sans text-[14.5px] font-semibold transition-colors",
        selected
          ? "border-accent bg-accent text-[#FDFAF3]"
          : "border-ink/25 bg-transparent text-ink hover:border-ink/50",
      )}
    >
      {children}
    </button>
  );
}
