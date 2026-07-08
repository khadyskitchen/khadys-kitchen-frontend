"use client";

import { useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { ChoiceButton } from "@/components/ui/ChoiceButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { FieldError } from "@/components/ui/FieldError";
import {
  TurnstileWidget,
  TURNSTILE_ENABLED,
} from "@/components/ui/TurnstileWidget";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { formatMoney } from "@/lib/format-money";
import { routes, shopOrder } from "@/lib/routes";
import { useCart } from "@/lib/cart-store";
import { FALLBACK_PRODUCT_IMG, isoDaysFromNow } from "@/lib/shop-data";
import { usePlaceOrderMutation } from "@/redux/orders/orders-api";
import {
  checkoutSchema,
  type CheckoutValues,
} from "@/validations/checkout-schema";

const inputClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-3.5 font-sans text-[16px] text-ink outline-none transition-colors focus:border-accent";

const labelClass =
  "grid gap-2 text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70";

/** Where the code is stashed before a Paystack redirect, read back on /shop/verify. */
export const ORDER_CODE_KEY = "kk_order_code";

export function CheckoutForm() {
  const router = useRouter();
  const fieldId = useId();
  const { lines, hydrated, subtotal, maxLeadDays, clear } = useCart();
  const [placeOrder, { isLoading: submitting }] = usePlaceOrderMutation();

  // One idempotency key per checkout session: a double-click or a network
  // retry replays the same order instead of creating a duplicate.
  const idempotencyKey = useRef<string>(crypto.randomUUID());

  // Cloudflare Turnstile: the token gates submit only when a site key is set.
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState(false);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const minDate = useMemo(() => isoDaysFromNow(maxLeadDays), [maxLeadDays]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      pickupDate: "",
      note: "",
      payNow: false,
      website: "",
    },
  });

  const payNow = useWatch({ control, name: "payNow" });

  const onSubmit = async (data: CheckoutValues) => {
    if (data.pickupDate && data.pickupDate < minDate) {
      setError("pickupDate", {
        message: `That date is too soon - the longest bake in your order needs ${maxLeadDays} day${maxLeadDays > 1 ? "s" : ""}. Earliest is ${minDate}.`,
      });
      return;
    }
    if (TURNSTILE_ENABLED && !turnstileToken) {
      setTurnstileError(true);
      return;
    }
    try {
      const res = await placeOrder({
        body: {
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          email: data.email || undefined,
          items: lines.map((l) => ({ productId: l.id, quantity: l.qty })),
          pickupDate: data.pickupDate || undefined,
          note: data.note?.trim() || undefined,
          payNow: data.payNow,
          website: data.website ?? "",
          turnstileToken: turnstileToken || undefined,
        },
        idempotencyKey: idempotencyKey.current,
      }).unwrap();

      // Paying now: hand off to Paystack, remembering the code for the return trip.
      if (data.payNow && res.data.authorizationUrl) {
        sessionStorage.setItem(ORDER_CODE_KEY, res.data.code);
        clear();
        window.location.assign(res.data.authorizationUrl);
        return;
      }

      clear();
      router.replace(`${shopOrder(res.data.code)}?placed=1`);
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          if (
            field === "fullName" ||
            field === "phone" ||
            field === "email" ||
            field === "note" ||
            field === "pickupDate"
          ) {
            setError(field, { message: msg });
          }
        }
      }
      notify.error("Couldn't place your order", { description: message });
      // A Turnstile token is single-use — reset so a retry gets a fresh one.
      setTurnstileReset((n) => n + 1);
    }
  };

  if (!hydrated) {
    return (
      <div className="py-16 text-center text-[15.5px] text-ink/50">
        Loading your order…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your order is empty."
        description="Pick something from the counter first - we'll bake it fresh for you."
        action={{ label: "Browse the bakes", href: routes.shop }}
      />
    );
  }

  return (
    <div className="grid items-start gap-[clamp(24px,4vw,44px)] lg:grid-cols-[1fr_380px]">
      <form
        noValidate
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="grid gap-[22px] rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,44px)]"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[22px]">
          <label className={labelClass}>
            Full name
            <input
              {...register("fullName")}
              placeholder="e.g. Ama Mensah"
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={
                errors.fullName ? `${fieldId}-fullName` : undefined
              }
              className={inputClass}
            />
            <FieldError id={`${fieldId}-fullName`} message={errors.fullName?.message} />
          </label>
          <label className={labelClass}>
            Phone / WhatsApp
            <input
              {...register("phone")}
              placeholder="e.g. 024 000 0000"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? `${fieldId}-phone` : undefined}
              className={inputClass}
            />
            <FieldError id={`${fieldId}-phone`} message={errors.phone?.message} />
          </label>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[22px]">
          <label className={labelClass}>
            Email {payNow ? "(required to pay online)" : "(optional)"}
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${fieldId}-email` : undefined}
              className={inputClass}
            />
            <FieldError id={`${fieldId}-email`} message={errors.email?.message} />
          </label>
          <label className={labelClass}>
            Pickup date (optional)
            <input
              {...register("pickupDate")}
              type="date"
              min={minDate}
              aria-invalid={errors.pickupDate ? true : undefined}
              aria-describedby={
                errors.pickupDate ? `${fieldId}-pickupDate` : undefined
              }
              className={inputClass}
            />
            <FieldError
              id={`${fieldId}-pickupDate`}
              message={errors.pickupDate?.message}
            />
          </label>
        </div>
        <p className="-mt-3 text-[13px] text-ink/55">
          Earliest pickup is {minDate} - the longest bake in your order needs{" "}
          {maxLeadDays <= 0 ? "no notice" : `${maxLeadDays} day${maxLeadDays > 1 ? "s" : ""}`}.
        </p>

        {/* Honeypot: invisible to people, irresistible to bots. */}
        <input
          {...register("website")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-2.5">
          <span className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70">
            How would you like to pay?
          </span>
          <div className="flex flex-wrap gap-2.5">
            <ChoiceButton
              selected={payNow === false}
              onClick={() => setValue("payNow", false)}
            >
              Pay offline
            </ChoiceButton>
            <ChoiceButton
              selected={payNow === true}
              onClick={() => setValue("payNow", true)}
            >
              Pay online now (card / MoMo)
            </ChoiceButton>
          </div>
        </div>

        <label className={labelClass}>
          Anything we should know? (optional)
          <textarea
            {...register("note")}
            rows={3}
            placeholder="Cake message, colours, allergies, pickup time…"
            aria-invalid={errors.note ? true : undefined}
            aria-describedby={errors.note ? `${fieldId}-note` : undefined}
            className={cn(inputClass, "resize-y")}
          />
          <FieldError id={`${fieldId}-note`} message={errors.note?.message} />
        </label>

        <TurnstileWidget
          onVerify={(token) => {
            setTurnstileToken(token);
            if (token) setTurnstileError(false);
          }}
          resetSignal={turnstileReset}
        />
        {turnstileError ? (
          <FieldError
            id={`${fieldId}-turnstile`}
            message="Please complete the verification to place your order."
          />
        ) : null}

        <Button
          type="submit"
          size="lg"
          isLoading={submitting}
          loadingText="Placing order…"
          className="w-full rounded-full"
        >
          {payNow
            ? `Pay ${formatMoney(subtotal)} & place order`
            : "Place order · pay offline"}
        </Button>
        <p className="text-center text-[13px] text-ink/50">
          We&rsquo;ll text your order code to this number.{" "}
          {payNow
            ? "You'll pay securely via Paystack."
            : "Paying offline? Call us or stop by to pay after ordering - baking starts once payment is received, and unpaid orders may not be processed."}
        </p>
      </form>

      {/* Order summary */}
      <aside className="overflow-hidden rounded-[20px] border border-ink/10 bg-card lg:sticky lg:top-6">
        <div className="border-b border-ink/[0.09] px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink/55">
          Your order
        </div>
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-center gap-3.5 border-b border-ink/[0.09] px-6 py-3.5"
          >
            <Image
              src={line.image ?? FALLBACK_PRODUCT_IMG}
              alt={line.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-[10px] object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold">
                {line.name}
              </div>
              <div className="text-[12.5px] text-ink/55">× {line.qty}</div>
            </div>
            <div className="text-[14.5px] font-semibold">
              {formatMoney(line.price * line.qty)}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-[13px] uppercase tracking-[0.1em] text-ink/55">
            Total
          </span>
          <span className="font-serif text-[24px]">{formatMoney(subtotal)}</span>
        </div>
        <div className="px-6 pb-5">
          <Link
            href={routes.shopCart}
            className="text-[13.5px] font-semibold text-accent underline"
          >
            Edit order
          </Link>
        </div>
      </aside>
    </div>
  );
}
