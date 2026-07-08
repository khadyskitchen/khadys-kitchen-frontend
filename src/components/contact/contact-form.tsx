"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reveal } from "@/components/reveal";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import {
  TurnstileWidget,
  TURNSTILE_ENABLED,
} from "@/components/ui/TurnstileWidget";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useSendContactMessageMutation } from "@/redux/contact/contact-api";
import {
  CONTACT_TOPICS,
  contactSchema,
  type ContactValues,
} from "@/validations/contact-schema";

const inputClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-3.5 font-sans text-[16px] text-ink outline-none transition-colors focus:border-accent";

const labelClass =
  "grid gap-2 text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70";

const NEXT_STEPS = [
  "Your message lands with a person - usually Khady herself, between bakes.",
  "We reply on WhatsApp or email within the hour on baking days, 7 am - 7 pm.",
  "Custom cakes get a quote - flavours, sizing and a pickup date - before you commit.",
];

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [senderName, setSenderName] = useState("friend");
  // Cloudflare Turnstile: the token gates submit only when a site key is set.
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [sendContactMessage, { isLoading: sending }] =
    useSendContactMessageMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      contact: "",
      message: "",
      topic: "An order",
      website: "",
    },
  });

  const topic = useWatch({ control, name: "topic" });
  const errorMessage =
    errors.name?.message ??
    errors.contact?.message ??
    errors.message?.message ??
    (turnstileError
      ? "Please complete the verification to send your message."
      : undefined);

  const onSubmit = async (data: ContactValues) => {
    if (TURNSTILE_ENABLED && !turnstileToken) {
      setTurnstileError(true);
      return;
    }
    try {
      await sendContactMessage({
        name: data.name.trim(),
        contact: data.contact.trim(),
        message: data.message.trim(),
        topic: data.topic,
        website: data.website ?? "",
        turnstileToken: turnstileToken || undefined,
      }).unwrap();
      setSenderName(data.name.trim().split(" ")[0] || "friend");
      setSent(true);
    } catch (err) {
      notify.error("Couldn't send your message", {
        description: extractApiError(err).message,
      });
      // A Turnstile token is single-use — reset so a retry gets a fresh one.
      setTurnstileReset((n) => n + 1);
    }
  };

  return (
    <section className="border-t border-ink/10 bg-oat">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,88px)]">
        <Reveal variant="mask" className="mb-[clamp(26px,3.5vw,40px)]">
          <h2 className="mb-2.5 font-serif text-[clamp(28px,3.4vw,42px)] font-normal">
            Send us a message
          </h2>
          <p className="max-w-[46ch] text-[15px] leading-[1.6] text-ink/65">
            Tell us what you need - we&rsquo;ll come back on WhatsApp or email.
          </p>
        </Reveal>

        <div className="grid gap-[clamp(28px,4vw,56px)] lg:grid-cols-[1fr_minmax(0,420px)] lg:items-start">
          {/* Form */}
          <div>
            {sent ? (
              <div
                className="rounded-[22px] border border-ink/10 bg-card p-[clamp(36px,5vw,52px)] text-center"
                style={{ animation: "kk-fadein .7s both" }}
              >
                <div className="mx-auto mb-5 grid h-[60px] w-[60px] place-items-center rounded-full bg-accent text-[26px] text-[#FDFAF3]">
                  ✓
                </div>
                <h3 className="mb-2.5 font-serif text-[26px] font-normal">
                  Message sent
                </h3>
                <p className="text-[15.5px] leading-[1.65] text-ink/70">
                  Thank you, {senderName} - we&rsquo;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <Reveal variant="blur">
                <form
                  noValidate
                  onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                  className="grid gap-5 rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,40px)]"
                >
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5">
                    <label className={labelClass}>
                      Your name
                      <input
                        {...register("name")}
                        placeholder="e.g. Kofi Owusu"
                        className={inputClass}
                      />
                    </label>
                    <label className={labelClass}>
                      Phone or email
                      <input
                        {...register("contact")}
                        placeholder="How do we reach you?"
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="grid gap-2.5">
                    <span className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70">
                      What&rsquo;s it about?
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {CONTACT_TOPICS.map((t) => (
                        <ChoiceButton
                          key={t}
                          selected={topic === t}
                          onClick={() =>
                            setValue("topic", t, { shouldValidate: true })
                          }
                        >
                          {t}
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>

                  <label className={labelClass}>
                    Message
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us about your order, event, or question…"
                      className={cn(inputClass, "resize-y")}
                    />
                  </label>

                  {/* Honeypot: invisible to people, irresistible to bots. */}
                  <input
                    {...register("website")}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />

                  <TurnstileWidget
                    onVerify={(token) => {
                      setTurnstileToken(token);
                      if (token) setTurnstileError(false);
                    }}
                    resetSignal={turnstileReset}
                  />

                  {errorMessage ? (
                    <div className="rounded-[12px] border border-danger/25 bg-danger/[0.08] px-4 py-3 text-[14.5px] text-danger">
                      {errorMessage}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={sending}
                    className="cursor-pointer justify-self-start rounded-full border-none bg-accent px-[34px] py-[17px] font-sans text-[15.5px] font-semibold tracking-[0.06em] text-[#FDFAF3] transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </form>
              </Reveal>
            )}
          </div>

          {/* What happens next */}
          <Reveal variant="right" className="lg:sticky lg:top-[104px]">
            <aside className="rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,3.5vw,34px)]">
              <h3 className="font-serif text-[23px] font-normal">
                What happens next
              </h3>
              <p className="mb-7 mt-1 text-[13.5px] text-ink/55">
                From first hello to your first bake.
              </p>

              <ol className="grid gap-[22px]">
                {NEXT_STEPS.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-full border-[1.5px] border-accent/40 font-serif text-[14px] text-accent">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-[14.5px] leading-[1.6] text-ink/[0.78]">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>

              <p className="mt-7 border-t border-ink/10 pt-5 text-[13.5px] italic leading-[1.6] text-ink/55">
                Messages sent Mon - Tue are answered Wednesday morning, while the
                first croissants proof.
              </p>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
