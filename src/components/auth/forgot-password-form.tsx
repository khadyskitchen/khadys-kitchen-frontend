"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useForgotPasswordMutation } from "@/redux/auth/auth-api";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/validations/auth-schema";

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgotPassword(values).unwrap();
      // The backend responds identically whether or not the account exists (no
      // enumeration), so success just means the request was processed.
      setSentTo(values.email);
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors?.email) {
        setError("email", { message: fieldErrors.email });
      }
      notify.error("Couldn't send the reset link", { description: message });
    }
  };

  if (sentTo) {
    return (
      <div className="grid gap-5">
        <p className="text-[14.5px] leading-[1.6] text-ink/70">
          If an account exists for{" "}
          <span className="font-semibold text-ink">{sentTo}</span>, a
          password-reset link is on its way. Check your inbox (and spam) - the
          link expires in 30 minutes.
        </p>
        <Link
          href="/login"
          className="text-[14px] font-semibold text-accent no-underline transition-colors hover:text-ink"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@khadyskitchen.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        isLoading={isLoading}
        loadingText="Sending…"
      >
        Send reset link
      </Button>
    </form>
  );
}
