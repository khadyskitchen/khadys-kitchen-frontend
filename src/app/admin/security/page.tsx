"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/admin/ui";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  useChangePasswordMutation,
  useConfirmTwoFactorSetupMutation,
  useDisableTwoFactorMutation,
  useRequestTwoFactorSetupMutation,
} from "@/redux/auth/auth-api";

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "Your current password is required"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don’t match",
    path: ["confirmPassword"],
  });
type PwValues = z.infer<typeof pwSchema>;

function PasswordCard() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PwValues>({ resolver: zodResolver(pwSchema) });

  const onSubmit = async (v: PwValues) => {
    try {
      await changePassword({
        currentPassword: v.currentPassword,
        newPassword: v.newPassword,
      }).unwrap();
      notify.success("Password changed");
      reset();
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors) {
        for (const [field, msg] of Object.entries(fieldErrors)) {
          setError(field as keyof PwValues, { message: msg });
        }
      }
      notify.error("Couldn't change your password", { description: message });
    }
  };

  return (
    <Card className="p-[clamp(20px,3vw,28px)]">
      <h2 className="font-serif text-[20px]">Change password</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 grid gap-[18px]">
        <TextField
          label="Current password"
          type="password"
          revealable
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-[18px]">
          <TextField
            label="New password"
            type="password"
            revealable
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <TextField
            label="Confirm new password"
            type="password"
            revealable
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading} loadingText="Saving…">
            Change password
          </Button>
        </div>
      </form>
    </Card>
  );
}

function TwoFactorCard() {
  const user = useCurrentUser();
  const enabled = user?.twoFactorEnabled ?? false;
  const [requestSetup, { isLoading: requesting }] =
    useRequestTwoFactorSetupMutation();
  const [confirmSetup, { isLoading: confirming }] =
    useConfirmTwoFactorSetupMutation();
  const [disable, { isLoading: disabling }] = useDisableTwoFactorMutation();

  const [mode, setMode] = useState<"idle" | "enabling" | "disabling">("idle");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const startEnable = async () => {
    try {
      await requestSetup().unwrap();
      notify.success("We’ve emailed you a 6-digit code");
      setMode("enabling");
    } catch (err) {
      notify.error("Couldn't start setup", {
        description: extractApiError(err).message,
      });
    }
  };

  const confirmEnable = async () => {
    try {
      await confirmSetup({ code }).unwrap();
      notify.success("Two-factor authentication enabled");
      setMode("idle");
      setCode("");
    } catch (err) {
      notify.error("Couldn't verify the code", {
        description: extractApiError(err).message,
      });
    }
  };

  const doDisable = async () => {
    try {
      await disable({ password }).unwrap();
      notify.success("Two-factor disabled");
      setMode("idle");
      setPassword("");
    } catch (err) {
      notify.error("Couldn't disable", {
        description: extractApiError(err).message,
      });
    }
  };

  return (
    <Card className="p-[clamp(20px,3vw,28px)]">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-[20px]">Two-factor authentication</h2>
        <StatusBadge
          status={enabled ? "ACTIVE" : "DRAFT"}
          label={enabled ? "On" : "Off"}
        />
      </div>
      <p className="text-[14px] leading-[1.6] text-ink/55">
        Adds a 6-digit code sent to your email each time you sign in.
      </p>

      {enabled ? (
        mode === "disabling" ? (
          <div className="mt-4 grid max-w-[360px] gap-3">
            <TextField
              label="Confirm your password to disable"
              type="password"
              revealable
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-2.5">
              <Button
                variant="danger"
                isLoading={disabling}
                loadingText="Disabling…"
                onClick={doDisable}
              >
                Disable
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMode("idle");
                  setPassword("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setMode("disabling")}
          >
            Disable two-factor
          </Button>
        )
      ) : mode === "enabling" ? (
        <div className="mt-4 grid max-w-[360px] gap-3">
          <TextField
            label="Enter the 6-digit code from your email"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex flex-wrap gap-2.5">
            <Button
              isLoading={confirming}
              loadingText="Verifying…"
              onClick={confirmEnable}
            >
              Confirm
            </Button>
            <Button variant="outline" isLoading={requesting} onClick={startEnable}>
              Resend code
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setMode("idle");
                setCode("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="mt-4"
          isLoading={requesting}
          loadingText="Sending…"
          onClick={startEnable}
        >
          Enable two-factor
        </Button>
      )}
    </Card>
  );
}

export default function SecurityPage() {
  return (
    <div
      style={{ animation: "kk-rise .5s both" }}
      className="grid max-w-[640px] gap-[18px]"
    >
      <PasswordCard />
      <TwoFactorCard />
    </div>
  );
}
